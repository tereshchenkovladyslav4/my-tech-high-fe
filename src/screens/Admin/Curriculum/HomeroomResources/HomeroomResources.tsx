import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Typography } from '@mui/material'
import moment from 'moment'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { getResourcesQuery } from '@mth/graphql/queries/resource'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { defaultHomeroomFormData } from '../defaultValues'
import { createOrUpdateResourceMutation } from '../services'
import { HomeroomResourceCard } from './HomeroomResourceCard'
import { HomeroomResourceEdit } from './HomeroomResourceEdit'
import { EventType, HomeroomResource, HomeroomResourceProps, HomeroomResourceCardProps } from './types'

export const HomeroomResources: React.FC<HomeroomResourceProps> = ({ backAction }) => {
  const { me } = useContext(UserContext)

  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )
  const [stateName, setStateName] = useState<string>('')
  const [resources, setResources] = useState<HomeroomResource[]>([])
  const [visibleResources, setVisibleResources] = useState<HomeroomResource[]>([])
  const [selectedYear, setSelectedYear] = useState<string | number>('')
  const [page, setPage] = useState<string>('root')
  const [selectedHomeroomResource, setSelectedHomeroomResource] = useState<HomeroomResource>()

  const {
    loading,
    data: resourcesData,
    refetch,
  } = useQuery(getResourcesQuery, {
    variables: { schoolYearId: selectedYear },
    skip: !selectedYear,
    fetchPolicy: 'network-only',
  })
  const [updateResource, {}] = useMutation(createOrUpdateResourceMutation)

  const hasPermission = () => {
    return me?.level && me.level <= 2
  }

  const isPast = (): boolean => {
    const selectedSchoolYear = schoolYears.find((item) => item.school_year_id === selectedYear)
    return !!selectedSchoolYear && moment().isAfter(selectedSchoolYear.date_end)
  }

  const arrangeItems = async (items: HomeroomResource[]) => {
    await items
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
    <li style={{ listStyleType: 'none', display: 'inline-block', width: '33%' }}>
      <HomeroomResourceCard item={item} action={action} isPast={isPast} onAction={onAction} setPage={setPage} />
    </li>
  ))

  const SortableListContainer = SortableContainer(({ items }: { items: HomeroomResource[] }) => (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, idx) => (
        <SortableCard
          index={idx}
          key={idx}
          item={item}
          action={!(!hasPermission() || item.resource_id == 0)}
          setPage={setPage}
          isPast={isPast()}
          onAction={(evtType: EventType) => {
            setSelectedHomeroomResource(item)
            switch (evtType) {
              case EventType.ADD: {
                setPage(EventType.ADD)
                break
              }
              case EventType.EDIT: {
                setPage(EventType.EDIT)
                break
              }
              case EventType.CLICK: {
                if (item.website) window.open(item.website, '_blank')
              }
            }
          }}
        />
      ))}
    </ul>
  ))

  useEffect(() => {
    const colors = ['blue', 'orange']
    const items: HomeroomResource[] = JSON.parse(JSON.stringify(resources))
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
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

  useEffect(() => {
    const selectedRegion = me?.userRegion?.find((region) => region.region_id === me?.selectedRegionId)
    setStateName(selectedRegion?.regionDetail?.name || '')
  }, [me?.selectedRegionId])

  return (
    <Box>
      {page === 'root' ? (
        <>
          <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' paddingX={4}>
            <Grid container sx={{ p: 2, background: 'inherit' }}>
              <ButtonBase onClick={backAction} sx={{ p: 1 }} disableRipple>
                <Grid container justifyContent='flex-start' alignItems='center'>
                  <ArrowBackIosOutlinedIcon />
                  <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>Resources</Typography>
                </Grid>
              </ButtonBase>
            </Grid>
            <Box display='flex' flexDirection='row' justifyContent='flex-end' alignItems='center'>
              <DropDown
                dropDownItems={schoolYearDropdownItems}
                placeholder={'Select Year'}
                defaultValue={selectedYear}
                borderNone={true}
                setParentValue={(val) => {
                  setSelectedYear(Number(val))
                }}
              />
            </Box>
          </Box>
          <SortableListContainer
            axis='xy'
            items={visibleResources}
            useDragHandle={true}
            onSortEnd={({ oldIndex, newIndex }) => {
              const newResources = arrayMove(visibleResources, oldIndex, newIndex)
              arrangeItems(newResources)
            }}
          />
        </>
      ) : (
        <HomeroomResourceEdit
          schoolYearId={Number(selectedYear)}
          item={selectedHomeroomResource}
          stateName={stateName}
          setPage={setPage}
          refetch={refetch}
        />
      )}
    </Box>
  )
}
