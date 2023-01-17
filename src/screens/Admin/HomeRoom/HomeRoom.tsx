import React from 'react'
import { Grid, Box } from '@mui/material'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { ItemCard } from '@mth/components/ItemCard/ItemCard'
import { MthRoute } from '@mth/enums'
import { useStyles } from './styles'

export const HomeRoom: React.FC = () => {
  const items = [
    {
      title: 'Gradebook',
      subtitle: 'Grades & Reports',
      link: MthRoute.HOMEROOM_GRADEBOOK.toString(),
      disabled: true,
    },
    {
      title: 'Homerooms & Learning Logs',
      subtitle: 'Create, Edit, & Delete',
      link: MthRoute.HOMEROOM_LEARNING_LOGS.toString(),
    },
    {
      title: 'Homeroom Assignments',
      subtitle: 'Assign & Transfer',
      link: MthRoute.HOMEROOM_ASSIGNMENTS.toString(),
    },
    {
      title: 'Settings',
      subtitle: 'Edit',
      link: MthRoute.HOMEROOM_SETTINGS.toString(),
    },
    {
      title: 'Checklist',
      subtitle: 'Import, Edit, & Delete',
      link: MthRoute.HOMEROOM_CHECKLIST.toString(),
    },
  ]
  return (
    <Box sx={{ marginTop: '29px', px: 2, ...useStyles.cardBox }}>
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
