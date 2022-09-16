import React, { FunctionComponent } from 'react'
import { Grid, Box } from '@mui/material'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { ItemCard } from '@mth/components/ItemCard/ItemCard'
import PageHeader from '@mth/components/PageHeader'
import {
  CURRICULUM_COURSE_CATALOG_SETTINGS,
  CURRICULUM_COURSE_CATALOG_PERIODS,
  CURRICULUM_COURSE_CATALOG_SUBJECTS,
  CURRICULUM_COURSE_CATALOG_PROVIDERS,
  CURRICULUM_COURSE_CATALOG_STATE_CODES,
} from '../../../../utils/constants'

const CourseCatalog: FunctionComponent = () => {
  const items = [
    {
      icon: 'Settings',
      title: 'Schedule Builder Settings',
      subtitle: 'Edit',
      link: CURRICULUM_COURSE_CATALOG_SETTINGS,
    },
    {
      icon: 'Periods',
      title: 'Schedule Periods',
      subtitle: 'Edit',
      link: CURRICULUM_COURSE_CATALOG_PERIODS,
    },
    {
      title: 'Subjects',
      subtitle: 'Add, Edit, & Archive',
      link: CURRICULUM_COURSE_CATALOG_SUBJECTS,
    },
    {
      title: 'Providers',
      subtitle: 'Add, Edit, & Archive',
      link: CURRICULUM_COURSE_CATALOG_PROVIDERS,
    },
    {
      title: 'State Codes',
      subtitle: 'Import, Delete, & Edit',
      link: CURRICULUM_COURSE_CATALOG_STATE_CODES,
    },
  ]
  return (
    <Box sx={{ marginTop: '29px', px: 3 }}>
      <Box mb={2}>
        <PageHeader title='Course Catalog' to='/curriculum'></PageHeader>
      </Box>
      <Grid container rowSpacing={'22px'} columnSpacing={'35px'}>
        {items.map((item, idx) => (
          <Grid item key={idx} sm={12} md={6} lg={4}>
            <ItemCard
              icon={item.icon}
              title={item.title}
              subTitle={item.subtitle}
              img={idx % 2 ? BgOrange : BgBlue}
              isLink={true}
              link={item.link}
              hasTitle={true}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default CourseCatalog
