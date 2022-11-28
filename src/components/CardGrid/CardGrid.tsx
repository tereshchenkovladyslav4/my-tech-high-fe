import React from 'react'
import { Grid, Box } from '@mui/material'
import { map } from 'lodash'
import { ItemCard } from '@mth/components/ItemCard/ItemCard'
import { CardGridProps } from './types'

export const CardGrid: React.FC<CardGridProps> = ({ items }) => {
  return (
    <Box
      sx={{
        textAlign: 'left',
        '& .MuiCard-root': {
          marginLeft: '0 !important',
          marginRight: '0 !important',
        },
      }}
    >
      <Grid container rowSpacing='32px' columnSpacing='36px'>
        {map(items, (item, idx) => (
          <Grid item key={idx} sm={12} md={6} lg={4}>
            <ItemCard
              icon={item.icon}
              title={item.title}
              img={item.img}
              isLink={item.isLink}
              link={item.link?.toString() || ''}
              onClick={item.onClick}
              hasTitle={true}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
