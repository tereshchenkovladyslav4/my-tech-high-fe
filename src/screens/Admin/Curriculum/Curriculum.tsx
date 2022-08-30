import React from 'react'
import { Grid } from '@mui/material'
import { map } from 'lodash'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { ItemCard } from '../../../components/ItemCard/ItemCard'
import { CURRICULUM_HOMEROOM_RESOURCES, CURRICULUM_COURSE_CATALOG } from '../../../utils/constants'

import { CurriculumItem } from './types'

const Curriculum: React.FC = () => {
  const items: CurriculumItem[] = [
    {
      id: 1,
      title: 'Homeroom Resources',
      subtitle: 'Add, Edit, & Archive',
      img: BgOrange,
      link: CURRICULUM_HOMEROOM_RESOURCES,
    },
    {
      id: 2,
      icon: 'Course Catalog',
      title: 'Subjects, Providers, & Settings',
      subtitle: 'Add, Edit, & Archive',
      img: BgBlue,
      link: CURRICULUM_COURSE_CATALOG,
    },
  ]
  return (
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ marginTop: 2 }} columns={{ xs: 4, md: 12 }}>
      {map(items, (item, idx) => (
        <Grid item key={idx}>
          <ItemCard
            icon={item.icon}
            title={item.title}
            subTitle={item.subtitle}
            img={item.img}
            isLink={true}
            link={item.link}
            action={item.action}
            hasTitle={true}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default Curriculum
