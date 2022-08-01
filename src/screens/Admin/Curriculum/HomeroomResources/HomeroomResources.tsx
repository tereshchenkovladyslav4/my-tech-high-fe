import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Typography } from '@mui/material'
import moment from 'moment'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { getResourcesQuery } from '@mth/graphql/queries/resource'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { HomeroomResourceCard } from './HomeroomResourceCard'
import { EventType, HomeroomResource, HomeroomResourceProps, HomeroomResourceCardProps } from './HomeroomResourcesProps'

export const HomeroomResources: React.FC<HomeroomResourceProps> = ({ backAction }) => {
  const { me } = useContext(UserContext)

  const addCard = {
    id: me?.selectedRegionId,
    title: 'Lorem ipsum',
  }
  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )
  const [resources, setResources] = useState<HomeroomResource[]>([])
  const [visibleResources, setVisibleResources] = useState<HomeroomResource[]>([])
  const [selectedYear, setSelectedYear] = useState<string | number>('')

  const { data: resourcesData } = useQuery(getResourcesQuery, {
    variables: { schoolYearId: selectedYear },
    skip: !selectedYear,
    fetchPolicy: 'network-only',
  })

  const hasPermission = () => {
    return me?.level && me.level <= 2
  }

  const isPast = (): boolean => {
    const selectedSchoolYear = schoolYears.find((item) => item.school_year_id === selectedYear)
    return !!selectedSchoolYear && moment().isAfter(selectedSchoolYear.date_end)
  }

  const arrangeItems = (items: HomeroomResource[]) => {
    console.log(items)
  }

  const SortableCard = SortableElement(({ item, action, isPast, onAction }: HomeroomResourceCardProps) => (
    <li style={{ listStyleType: 'none', display: 'inline-block', width: '33%' }}>
      <HomeroomResourceCard item={item} action={action} isPast={isPast} onAction={onAction} />
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
          isPast={isPast()}
          onAction={(evtType: EventType) => {
            console.log('Resource event:', evtType)
          }}
        />
      ))}
    </ul>
  ))

  useEffect(() => {
    const items = JSON.parse(JSON.stringify(resources))
    if (!isPast()) items.splice(3, 0, addCard)
    setVisibleResources(items)
  }, [resources])

  useEffect(() => {
    if (resourcesData) {
      const { resources } = resourcesData
      setResources(resources || [])
    }
  }, [resourcesData])

  useEffect(() => {
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

  return (
    <Box>
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
              setSelectedYear(val)
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
    </Box>
  )
}
