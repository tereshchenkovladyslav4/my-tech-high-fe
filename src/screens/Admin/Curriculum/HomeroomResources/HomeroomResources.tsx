import React, { useContext, useState } from 'react'
import { Box, ButtonBase, Grid, Typography } from '@mui/material'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { EventType, HomeroomeResource, HomeroomeResourceProps, HOMEROOME_RESOURCE_TYPE } from './HomeroomResourcesProps'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { HomeroomeResourceCard } from './HomeroomResourceCard'
import { DropDownItem } from '../../../../components/DropDown/types'
import { DropDown } from '../../../../components/DropDown/DropDown'

export const HomeroomResources: React.FC<any> = ({ backAction }) => {
  const { me } = useContext(UserContext)
  const [resources] = useState<HomeroomeResource[]>([
    {
      id: 1,
      region_id: 1,
      title: 'Lorem ipsum',
      show_cost: true,
      cost: 20,
      image_url: './src/assets/email-template.png',
      type: HOMEROOME_RESOURCE_TYPE.WEBSITE_LINK,
      sequence: 1,
      website: 'https://google.com',
      hidden: false,
    },
    {
      id: 2,
      region_id: 2,
      title: 'Lorem ipsum',
      show_cost: true,
      cost: 30,
      image_url: './src/assets/immunizations.png',
      type: HOMEROOME_RESOURCE_TYPE.WEBSITE_LINK,
      sequence: 2,
      website: 'https://google.com',
      hidden: false,
      allow_request: true,
    },
    {
      id: 3,
      region_id: 3,
      title: 'Lorem ipsum',
      show_cost: false,
      cost: 20,
      image_url: './src/assets/email-template.png',
      type: HOMEROOME_RESOURCE_TYPE.WEBSITE_LINK,
      sequence: 3,
      website: 'https://google.com',
      hidden: false,
    },
    {
      id: 0,
      region_id: 3,
      title: 'Lorem ipsum',
      show_cost: true,
      cost: 20,
      image_url: './src/assets/email-template.png',
      type: HOMEROOME_RESOURCE_TYPE.WEBSITE_LINK,
      sequence: 3,
      website: 'https://google.com',
      hidden: false,
    },
    {
      id: 4,
      region_id: 4,
      title: 'Lorem ipsum',
      show_cost: true,
      cost: 30,
      image_url: './src/assets/immunizations.png',
      type: HOMEROOME_RESOURCE_TYPE.WEBSITE_LINK,
      sequence: 4,
      website: 'https://google.com',
      hidden: true,
    },
  ])
  const [schoolYears] = useState<Array<DropDownItem>>([
    { label: '2020-21', value: '2020-2021' },
    { label: '2021-22', value: '2021-2022' },
  ])
  const [selectedYear, setSelectedYear] = useState<string | number>('2020-2021')

  const isEditable = () => {
    return me && me.level && me.level <= 2
  }

  const arrangeItems = (resources: HomeroomeResource[]) => {
    console.log(resources)
  }

  const SortableQuickLinkCard = SortableElement(({ item, action, onAction }: HomeroomeResourceProps) => (
    <li style={{ listStyleType: 'none', display: 'inline-block', width: '33%' }}>
      <HomeroomeResourceCard item={item} action={action} onAction={onAction} />
    </li>
  ))

  const SortableListContainer = SortableContainer(({ items }: { items: HomeroomeResource[] }) => (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, idx) => (
        <SortableQuickLinkCard
          index={idx}
          key={idx}
          item={item}
          action={!isEditable() || item.id == 0 ? false : true}
          onAction={(evtType: EventType) => {
            console.log('Resource event:', evtType)
          }}
        />
      ))}
    </ul>
  ))

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
            dropDownItems={schoolYears}
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
        items={resources}
        useDragHandle={true}
        onSortEnd={({ oldIndex, newIndex }) => {
          const newResources = arrayMove(resources, oldIndex, newIndex)
          arrangeItems(newResources)
        }}
      />
    </Box>
  )
}
