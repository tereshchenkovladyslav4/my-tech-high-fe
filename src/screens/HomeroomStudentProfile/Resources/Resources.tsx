import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Box, Grid, Stack } from '@mui/material'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { CartEventType, ResourceSubtitle } from '@mth/enums'
import { HomeroomResource, ResourceLevel, SchoolYear } from '@mth/models'
import { ResourceCard } from './ResourceCard'
import { ResourceCartBar } from './ResourceCartBar'
import { ResourceDetails } from './ResourceDetails'
import { ResourceLevelSelector } from './ResourceLevelSelector'
import { ResourceModal } from './ResourceModal'
import { ResourceRequest } from './ResourceRequest'
import {
  getActiveHomeroomResourceSchoolYearsQuery,
  getStudentResourcesQuery,
  shouldConfirmWaitlist,
  toggleHiddenResourceMutation,
  toggleResourceCartMutation,
} from './services'
import { ResourcePage } from './types'
import { WaitListModal } from './WaitListModal'

export const Resources: React.FC = () => {
  const currentStudentId = Number(location.pathname.split('/').at(-1))

  const [page, setPage] = useState<ResourcePage>(ResourcePage.ROOT)
  const [prePage, setPrePage] = useState<ResourcePage>(ResourcePage.ROOT)
  const [resources, setResources] = useState<HomeroomResource[]>([])
  const [resourcesInCart, setResourcesInCart] = useState<HomeroomResource[]>([])
  const [joinWaitlistResources, setJoinWaitlistResources] = useState<HomeroomResource[]>([])
  const [selectedResource, setSelectedResource] = useState<HomeroomResource>()
  const [selectedResourceLevel, setSelectedResourceLevel] = useState<ResourceLevel>()
  const [showHideModal, setShowHideModal] = useState<boolean>(false)
  const [showResourceLevelModal, setShowResourceLevelModal] = useState<boolean>(false)
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [schoolYears, setSchoolYears] = useState<DropDownItem[]>([])
  const { loading: schoolYearsLoading, data: schoolYearsData } = useQuery(getActiveHomeroomResourceSchoolYearsQuery, {
    variables: {
      studentId: currentStudentId,
    },
    skip: !currentStudentId,
    fetchPolicy: 'network-only',
  })

  const {
    loading: resourcesLoading,
    data: resourcesData,
    refetch,
  } = useQuery(getStudentResourcesQuery, {
    variables: { studentId: currentStudentId, schoolYearId: +selectedYear },
    skip: !currentStudentId || !selectedYear || schoolYearsLoading,
    fetchPolicy: 'network-only',
  })
  const [toggleHiddenResource, {}] = useMutation(toggleHiddenResourceMutation)
  const [toggleResourceCart, {}] = useMutation(toggleResourceCartMutation)

  const handleChangeResourceStatus = async (
    resource: HomeroomResource | undefined,
    eventType: CartEventType,
    resourceLevelId?: number,
    waitlist_confirmed?: boolean,
  ) => {
    if (resource) {
      switch (eventType) {
        case CartEventType.HIDE:
        case CartEventType.UN_HIDE: {
          await toggleHiddenResource({
            variables: {
              toggleHiddenResourceInput: {
                student_id: currentStudentId,
                resource_id: Number(resource.resource_id),
                hidden: !resource.HiddenByStudent,
              },
            },
          })
          break
        }
        case CartEventType.ADD_CART:
        case CartEventType.REMOVE_CART: {
          await toggleResourceCart({
            variables: {
              toggleResourceCartInput: {
                student_id: currentStudentId,
                resource_id: Number(resource.resource_id),
                inCart: eventType == CartEventType.ADD_CART,
                resource_level_id: Number(resourceLevelId),
                waitlist_confirmed,
              },
            },
          })
          break
        }
      }
      await refetch()
    }
  }

  const handleCardActions = async (resource: HomeroomResource, evtType: CartEventType) => {
    setSelectedResource(resource)
    switch (evtType) {
      case CartEventType.ADD_CART: {
        if (resource.add_resource_level && resource.ResourceLevels?.length) {
          setShowResourceLevelModal(true)
        } else if (shouldConfirmWaitlist(resource)) {
          setJoinWaitlistResources([resource])
        } else {
          await handleChangeResourceStatus(resource, evtType)
        }
        break
      }
      case CartEventType.REMOVE_CART: {
        await handleChangeResourceStatus(resource, evtType)
        break
      }
      case CartEventType.HIDE: {
        if (resource.RequestStatus && resource.subtitle === ResourceSubtitle.PRICE) {
          setShowHideModal(true)
        } else {
          await handleChangeResourceStatus(resource, CartEventType.HIDE)
        }
        break
      }
      case CartEventType.UN_HIDE: {
        await handleChangeResourceStatus(resource, CartEventType.UN_HIDE)
        break
      }
      case CartEventType.CLICK:
      case CartEventType.DETAILS: {
        setPage(ResourcePage.DETAILS)
        setPrePage(ResourcePage.ROOT)
        break
      }
    }
  }

  useEffect(() => {
    const items: HomeroomResource[] = sortBy(
      (resources || []).filter((item) => item.CartDate),
      'CartDate',
    ).reverse()
    setResourcesInCart(items)
    if (selectedResource) {
      const resource = (resources || []).find((item) => item.resource_id === selectedResource.resource_id)
      setSelectedResource(resource)
    }
  }, [resources])

  useEffect(() => {
    if (!resourcesLoading && resourcesData) {
      const colors = ['blue', 'orange']
      const { studentResources: resources }: { studentResources: HomeroomResource[] } = resourcesData
      resources?.filter((item) => !item.image).map((item, index) => (item.background = colors[index % 2]))
      setResources(resources || [])
    }
  }, [resourcesLoading, resourcesData])

  useEffect(() => {
    if (!schoolYearsLoading && schoolYearsData?.activeHomeroomResourceSchoolYears?.length) {
      const { activeHomeroomResourceSchoolYears: schoolYears } = schoolYearsData
      const sortedSchoolYears = sortBy(schoolYears, 'date_begin').map((item: SchoolYear) => ({
        value: item.school_year_id,
        label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
      }))
      setSelectedYear(Number(sortedSchoolYears.at(0)?.value))
      setSchoolYears(sortedSchoolYears)
    }
  }, [schoolYearsLoading, schoolYearsData])

  useEffect(() => {
    setSelectedYear(0)
    setSchoolYears([])
    setResources([])
  }, [currentStudentId])

  return (
    <Stack>
      {page === ResourcePage.ROOT && (
        <>
          {!!resourcesInCart?.length && (
            <ResourceCartBar
              resourcesInCart={resourcesInCart}
              handleChangeResourceStatus={(resource, eventType) =>
                handleChangeResourceStatus(resource, eventType, resource.ResourceLevelId, true)
              }
              setPage={setPage}
            />
          )}
          {schoolYears?.length > 1 && (
            <Box display='flex' flexDirection='row' justifyContent='flex-end' sx={{ mr: 3, mt: 3 }} alignItems='center'>
              <DropDown
                dropDownItems={schoolYears}
                placeholder={'Select Year'}
                defaultValue={selectedYear}
                borderNone={true}
                setParentValue={(val) => {
                  setSelectedYear(Number(val))
                }}
              />
            </Box>
          )}
          <Grid container padding={4} spacing={4}>
            {resources.map((item, idx) => (
              <Grid key={idx} item xs={4} paddingTop={4}>
                <ResourceCard item={item} onAction={(evtType: CartEventType) => handleCardActions(item, evtType)} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {page === ResourcePage.REQUEST && (
        <ResourceRequest
          currentStudentId={currentStudentId}
          resourcesInCart={resourcesInCart}
          setPage={setPage}
          handleChangeResourceStatus={(resource, eventType) =>
            handleChangeResourceStatus(resource, eventType, resource.ResourceLevelId, true)
          }
          refetch={refetch}
          goToDetails={(item: HomeroomResource) => {
            setSelectedResource(item)
            setPage(ResourcePage.DETAILS)
            setPrePage(ResourcePage.REQUEST)
          }}
        />
      )}

      {page === ResourcePage.DETAILS && selectedResource && (
        <ResourceDetails
          item={selectedResource}
          handleBack={() => setPage(prePage)}
          onCardAction={(evtType: CartEventType) => handleCardActions(selectedResource, evtType)}
        />
      )}

      {showResourceLevelModal && selectedResource && (
        <ResourceLevelSelector
          resource={selectedResource}
          handleCancel={() => setShowResourceLevelModal(false)}
          handleSelect={async (resourceLevelId: number) => {
            setShowResourceLevelModal(false)
            const resourceLevel = selectedResource.ResourceLevels?.find(
              (item) => item.resource_level_id == resourceLevelId,
            )
            setSelectedResourceLevel(resourceLevel)
            if (shouldConfirmWaitlist({ ...selectedResource, ResourceLevelId: resourceLevelId })) {
              setJoinWaitlistResources([selectedResource])
            } else {
              await handleChangeResourceStatus(selectedResource, CartEventType.ADD_CART, resourceLevelId)
            }
          }}
        />
      )}

      {!!joinWaitlistResources?.length && (
        <WaitListModal
          joinWaitlistResources={joinWaitlistResources}
          handleChangeResourceStatus={async (resource, eventType) => {
            await handleChangeResourceStatus(resource, eventType, selectedResourceLevel?.resource_level_id, true)
          }}
          isAllDone={() => {
            setJoinWaitlistResources([])
          }}
        />
      )}

      <ResourceModal
        showHideModal={showHideModal}
        setShowHideModal={setShowHideModal}
        handleChangeResourceStatus={async (eventType) => await handleChangeResourceStatus(selectedResource, eventType)}
      />
    </Stack>
  )
}

export default Resources
