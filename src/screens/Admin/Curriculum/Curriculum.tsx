import React, { useContext, useEffect, useState } from 'react'
import { Grid, Box } from '@mui/material'
import { map } from 'lodash'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { useCurrentSchoolYearByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ItemCard } from '../../../components/ItemCard/ItemCard'
import { CURRICULUM_HOMEROOM_RESOURCES, CURRICULUM_COURSE_CATALOG } from '../../../utils/constants'
import { useStyles } from './styles'
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
          icon: (
            <>
              <Box>Homeroom</Box>
              <Box>Resources</Box>
            </>
          ),
          title: 'Homeroom Resources',
          subtitle: 'Add, Edit, & Archive',
          img: BgOrange,
          link: CURRICULUM_HOMEROOM_RESOURCES,
          disabled: false,
        },
        {
          id: 2,
          icon: (
            <>
              <Box>Course</Box>
              <Box>Catalog</Box>
            </>
          ),
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
    <Box sx={{ marginTop: '64px', px: '56px', ...useStyles.cardBox }}>
      <Grid container rowSpacing={4} columnSpacing={8}>
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
    </Box>
  )
}

export default Curriculum
