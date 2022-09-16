import React, { useContext, useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { map } from 'lodash'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { useCurrentSchoolYearByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ItemCard } from '../../../components/ItemCard/ItemCard'
import { CURRICULUM_HOMEROOM_RESOURCES, CURRICULUM_COURSE_CATALOG } from '../../../utils/constants'
import { CurriculumItem } from './types'

const Curriculum: React.FC = () => {
  const { me } = useContext(UserContext)
  const { data: schoolYear } = useCurrentSchoolYearByRegionId(Number(me?.selectedRegionId))
  const [items, setItems] = useState<CurriculumItem[]>([])

  useEffect(() => {
    if (schoolYear) {
      setItems([
        {
          id: 1,
          title: 'Homeroom Resources',
          subtitle: 'Add, Edit, & Archive',
          img: BgOrange,
          link: CURRICULUM_HOMEROOM_RESOURCES,
          disabled: false,
        },
        {
          id: 2,
          icon: 'Course Catalog',
          title: 'Subjects, Providers, & Settings',
          subtitle: 'Add, Edit, & Archive',
          img: BgBlue,
          link: CURRICULUM_COURSE_CATALOG,
          disabled: !schoolYear?.schedule,
        },
      ])
    }
  }, [schoolYear])
  return (
    <Grid container rowSpacing={4} columnSpacing={4} sx={{ marginTop: 2, px: 4 }}>
      {map(items, (item, idx) => (
        <Grid item key={idx} sm={12} md={6} lg={4}>
          <ItemCard
            icon={item.icon}
            title={item.title}
            subTitle={item.subtitle}
            img={item.img}
            isLink={true}
            link={item.link}
            action={item.action}
            hasTitle={true}
            disabled={item.disabled}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default Curriculum
