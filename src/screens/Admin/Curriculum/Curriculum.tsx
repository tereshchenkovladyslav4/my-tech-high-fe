import React, { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { map } from 'lodash'
import { useRouteMatch } from 'react-router-dom'
import ItemBackground from '../../../assets/quick-link-blue.png'
import { ItemCard } from '../../../components/ItemCard/ItemCard'
import { CURRICULUM } from '../../../utils/constants'
import { HomeroomResources } from './HomeroomResources/HomeroomResources'
import { CurriculumItem, CurriculumType } from './types'

const Curriculum: React.FC = () => {
  const isExact = useRouteMatch(CURRICULUM)?.isExact
  const [currentView, setCurrentView] = useState<CurriculumType>(CurriculumType.NONE)

  const items: CurriculumItem[] = [
    {
      id: 1,
      title: 'Homeroom Resources',
      subtitle: 'Add, Edit, & Archive',
      img: ItemBackground,
      isLink: false,
      type: CurriculumType.HOMEROOM_RESOURCES,
    },
  ]

  const onBackPress = () => {
    setCurrentView(CurriculumType.NONE)
  }

  const renderCardsHandler = (items: CurriculumItem[]) => (
    <Grid container rowSpacing={4} columnSpacing={0}>
      {map(items, (item, idx) => (
        <Grid item xs={4} key={idx}>
          <ItemCard
            title={item.title}
            subTitle={item.subtitle}
            img={item.img}
            isLink={item.isLink}
            link={`${CURRICULUM}/${item.type}`}
            action={item.action}
            hasTitle={true}
            onClick={() => {
              setCurrentView(item.type)
            }}
          />
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Box sx={{ px: 1, my: 4 }}>
      {isExact &&
        (currentView === CurriculumType.NONE ? (
          renderCardsHandler(items)
        ) : currentView === CurriculumType.HOMEROOM_RESOURCES ? (
          <HomeroomResources backAction={onBackPress}></HomeroomResources>
        ) : (
          <></>
        ))}
    </Box>
  )
}

export { Curriculum as default }
