import React, { FunctionComponent } from 'react'
import { Grid, Box } from '@mui/material'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { ItemCard } from '@mth/components/ItemCard/ItemCard'
import {
  HOMEROOM_GRADEBOOK,
  HOMEROOM_LEARNING_LOGS,
  HOMEROOM_ASSIGNMENTS,
  HOMEROOM_SETTINGS,
  HOMEROOM_CHECKLIST,
} from '../../../utils/constants'
import { useStyles } from './styles'

export const HomeRoom: FunctionComponent = () => {
  const items = [
    {
      title: 'Gradebook',
      subtitle: 'Grades & Reports',
      link: HOMEROOM_GRADEBOOK,
      disabled: true,
    },
    {
      title: 'Homerooms & Learning Logs',
      subtitle: 'Create, Edit, & Delete',
      link: HOMEROOM_LEARNING_LOGS,
    },
    {
      title: 'Homeroom Assignments',
      subtitle: 'Assign & Transfer',
      link: HOMEROOM_ASSIGNMENTS,
    },
    {
      title: 'Settings',
      subtitle: 'Edit',
      link: HOMEROOM_SETTINGS,
    },
    {
      title: 'Checklist',
      subtitle: 'Import, Edit, & Delete',
      link: HOMEROOM_CHECKLIST,
    },
  ]
  return (
    <Box sx={{ marginTop: '29px', px: 3, ...useStyles.cardBox }}>
      <Grid container rowSpacing={4} columnSpacing={8} padding={4}>
        {items.map((item, idx) => (
          <Grid item key={idx} sm={12} md={6} lg={4}>
            <ItemCard
              title={item.title}
              subTitle={item.subtitle}
              img={idx % 2 ? BgOrange : BgBlue}
              isLink={true}
              link={item.link}
              hasTitle={true}
              disabled={item.disabled}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
