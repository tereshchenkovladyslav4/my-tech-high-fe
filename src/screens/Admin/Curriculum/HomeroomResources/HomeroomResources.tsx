import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { CartEventType, MthColor } from '@mth/enums'
import { getResourcesQuery } from '@mth/graphql/queries/resource'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { HomeroomResource } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ResourceDetails } from '@mth/screens/HomeroomStudentProfile/Resources/ResourceDetails'
import { defaultHomeroomFormData } from '../defaultValues'
import { createOrUpdateResourceMutation, deleteResourceMutation } from '../services'
import { ConfirmationDetails } from './ConfirmationDetails'
import { HomeroomResourceCard } from './HomeroomResourceCard'
import { HomeroomResourceEdit } from './HomeroomResourceEdit'
import { HomeroomResourceModal } from './HomeroomResourceModal'
import { HomeroomResourceCardProps, HomeroomResourcePage } from './types'

export const HomeroomResources: React.FC = () => {
  const { me } = useContext(UserContext)
  const history = useHistory()

  const {
    dropdownItems: schoolYearDropdownItems,
    schoolYears: schoolYears,
    selectedYear: selectedYearData,
    selectedYearId,
    setSelectedYearId,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)
  const [stateName, setStateName] = useState<string>('')
  const [resources, setResources] = useState<HomeroomResource[]>([])
  const [visibleResources, setVisibleResources] = useState<HomeroomResource[]>([])
  const [page, setPage] = useState<HomeroomResourcePage>(HomeroomResourcePage.ROOT)
  const [selectedHomeroomResource, setSelectedHomeroomResource] = useState<HomeroomResource>()
  const [showArchivedModal, setShowArchivedModal] = useState<boolean>(false)
  const [showUnarchivedModal, setShowUnarchivedModal] = useState<boolean>(false)
  const [showAllowModal, setShowAllowModal] = useState<boolean>(false)
  const [showDisallowModal, setShowDisallowModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showCloneModal, setShowCloneModal] = useState<boolean>(false)

  const backAction = () => {
    history.goBack()
  }

  const {
    loading,
    data: resourcesData,
    refetch,
  } = useQuery(getResourcesQuery, {
    variables: { schoolYearId: selectedYearId },
    skip: !selectedYearId,
    fetchPolicy: 'network-only',
  })
  const [updateResource, {}] = useMutation(createOrUpdateResourceMutation)
  const [deleteResource, {}] = useMutation(deleteResourceMutation)

  const hasPermission = () => {
    return me?.level && me.level <= 2
  }

  const isPast = (): boolean => {
    const selectedSchoolYear = schoolYears.find((item) => item.school_year_id === selectedYearId)
    return !!selectedSchoolYear && moment().isAfter(selectedSchoolYear.date_end)
  }

  const handleChangeResourceStatus = async (resource: HomeroomResource | undefined, eventType: CartEventType) => {
    if (resource) {
      switch (eventType) {
        case CartEventType.ARCHIVE:
        case CartEventType.RESTORE:
          await updateResource({
            variables: {
              createResourceInput: {
                resource_id: Number(resource.resource_id),
                is_active: !resource.is_active,
                allow_request: false,
              },
            },
          })
          break
        case CartEventType.ALLOW_REQUEST:
        case CartEventType.DISALLOW_REQUEST:
          await updateResource({
            variables: {
              createResourceInput: {
                resource_id: Number(resource.resource_id),
                allow_request: !resource.allow_request,
              },
            },
          })
          break
        case CartEventType.DELETE:
          await deleteResource({
            variables: {
              resourceId: Number(resource.resource_id),
            },
          })
          break
        case CartEventType.DUPLICATE:
          await updateResource({
            variables: {
              createResourceInput: {
                SchoolYearId: resource.SchoolYearId,
                title: resource.title,
                image: resource.image,
                subtitle: resource.subtitle,
                price: resource.price,
                website: resource.website,
                grades: resource.grades,
                std_user_name: resource.std_user_name,
                std_password: resource.std_password,
                detail: resource.detail,
                resource_limit: resource.resource_limit,
                add_resource_level: resource.add_resource_level,
                resourceLevelsStr: JSON.stringify(
                  resource.ResourceLevels.map((item) => {
                    return {
                      name: item.name,
                      limit: item.limit,
                    }
                  }),
                ),
                family_resource: resource.family_resource,
                priority: resource.priority,
                software_reimbursement: resource.software_reimbursement,
              },
            },
          })
      }
      await refetch()
    }
  }

  const arrangeItems = (items: HomeroomResource[]) => {
    items
      .filter((item) => !!item.resource_id)
      .map(async (item, index) => {
        const correctPriority = index + 1
        if (item.priority != correctPriority) {
          item.priority = correctPriority
          await updateResource({
            variables: {
              createResourceInput: {
                resource_id: Number(item.resource_id),
                priority: correctPriority,
              },
            },
          })
        }
      })
    setVisibleResources([
      ...items.filter((item) => !!item.resource_id && item.is_active),
      defaultHomeroomFormData,
      ...items.filter((item) => !!item.resource_id && !item.is_active),
    ])
  }

  const SortableCard = SortableElement(({ item, action, isPast, onAction }: HomeroomResourceCardProps) => (
    <Grid item xs={4}>
      <HomeroomResourceCard item={item} action={action} isPast={isPast} onAction={onAction} setPage={setPage} />
    </Grid>
  ))

  const SortableListContainer = SortableContainer(({ items }: { items: HomeroomResource[] }) => (
    <Grid container columnSpacing={8} rowSpacing={4} sx={{ textAlign: 'left' }}>
      {items.map((item, idx) => (
        <SortableCard
          index={idx}
          key={idx}
          item={item}
          action={!(!hasPermission() || item.resource_id == 0)}
          setPage={setPage}
          isPast={isPast()}
          onAction={(evtType: CartEventType) => {
            setSelectedHomeroomResource(item)
            switch (evtType) {
              case CartEventType.ADD: {
                setPage(HomeroomResourcePage.EDIT)
                break
              }
              case CartEventType.EDIT: {
                setPage(HomeroomResourcePage.EDIT)
                break
              }
              case CartEventType.CLICK: {
                setPage(HomeroomResourcePage.DETAIL)
                break
              }
              case CartEventType.ARCHIVE: {
                setShowArchivedModal(true)
                break
              }
              case CartEventType.RESTORE: {
                setShowUnarchivedModal(true)
                break
              }
              case CartEventType.ALLOW_REQUEST: {
                setShowAllowModal(true)
                break
              }
              case CartEventType.DISALLOW_REQUEST: {
                setShowDisallowModal(true)
                break
              }
              case CartEventType.DELETE: {
                setShowDeleteModal(true)
                break
              }
              case CartEventType.DUPLICATE: {
                setShowCloneModal(true)
              }
            }
          }}
        />
      ))}
    </Grid>
  ))

  useEffect(() => {
    const colors = ['blue', 'orange']
    const items: HomeroomResource[] = cloneDeep(resources)
    items?.filter((item) => !item.image).map((item, index) => (item.background = colors[index % 2]))
    if (!isPast())
      setVisibleResources([
        ...items?.filter((item) => item.is_active),
        defaultHomeroomFormData,
        ...items?.filter((item) => !item.is_active),
      ])
    else setVisibleResources([...items])
  }, [resources])

  useEffect(() => {
    if (!loading && resourcesData) {
      const { resources } = resourcesData
      setResources(resources || [])
    }
  }, [loading, resourcesData])

  useEffect(() => {
    const selectedRegion = me?.userRegion?.find((region) => region.region_id === me?.selectedRegionId)
    setStateName(selectedRegion?.regionDetail?.name || '')
  }, [me?.selectedRegionId])

  return (
    <Box sx={{ px: 4, pt: '48px' }}>
      {page === HomeroomResourcePage.ROOT && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              pl: 3,
              mb: 4,
            }}
          >
            <Grid container sx={{ background: 'inherit' }}>
              <ButtonBase onClick={backAction} sx={{ p: 1 }} disableRipple>
                <Grid container justifyContent='flex-start' alignItems='center'>
                  <ArrowBackIosOutlinedIcon />
                  <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 2 }}>Resources</Typography>
                </Grid>
              </ButtonBase>
            </Grid>
            <Box display='flex' flexDirection='row' justifyContent='flex-end' alignItems='center'>
              <DropDown
                dropDownItems={schoolYearDropdownItems}
                placeholder={'Select Year'}
                defaultValue={selectedYearId || 0}
                borderNone={true}
                setParentValue={(val) => {
                  setSelectedYearId(+val)
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 20, mr: 2 }}>Confirmation Details</Typography>
            <Stack
              onClick={() => {
                setPage(HomeroomResourcePage.CONFIRMATION_DETAILS)
              }}
              direction='row'
              spacing={1.5}
              sx={{ alignItems: 'center', cursor: 'pointer' }}
            >
              <EditIcon htmlColor={MthColor.MTHBLUE} />
            </Stack>
          </Box>
          <Box padding={3}>
            <SortableListContainer
              axis='xy'
              items={visibleResources}
              useDragHandle={true}
              onSortEnd={({ oldIndex, newIndex }) => {
                const newResources = arrayMove(visibleResources, oldIndex, newIndex)
                arrangeItems(newResources)
              }}
            />
          </Box>
        </>
      )}
      {page === HomeroomResourcePage.EDIT && (
        <HomeroomResourceEdit
          schoolYearId={selectedYearId || 0}
          schoolYearData={selectedYearData}
          item={selectedHomeroomResource}
          stateName={stateName}
          setPage={setPage}
          refetch={refetch}
        />
      )}
      {page === HomeroomResourcePage.DETAIL && selectedHomeroomResource && (
        <ResourceDetails
          item={selectedHomeroomResource}
          handleBack={() => setPage(HomeroomResourcePage.ROOT)}
          onCardAction={(evtType: CartEventType) => handleChangeResourceStatus(selectedHomeroomResource, evtType)}
        />
      )}
      {page === HomeroomResourcePage.CONFIRMATION_DETAILS && <ConfirmationDetails setPage={setPage} />}
      <HomeroomResourceModal
        showArchivedModal={showArchivedModal}
        showUnarchivedModal={showUnarchivedModal}
        showAllowModal={showAllowModal}
        showDisallowModal={showDisallowModal}
        showDeleteModal={showDeleteModal}
        showCloneModal={showCloneModal}
        setShowCloneModal={setShowCloneModal}
        setShowArchivedModal={setShowArchivedModal}
        setShowUnarchivedModal={setShowUnarchivedModal}
        setShowAllowModal={setShowAllowModal}
        setShowDisallowModal={setShowDisallowModal}
        setShowDeleteModal={setShowDeleteModal}
        handleChangeResourceStatus={(eventType) => handleChangeResourceStatus(selectedHomeroomResource, eventType)}
      />
    </Box>
  )
}
