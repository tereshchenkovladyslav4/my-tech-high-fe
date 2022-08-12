import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { Box, Card, CardMedia, Stack, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { s3URL } from '@mth/constants'
import { ResourceCartBarProps } from '../types'

const ResourceCartBar: React.FC<ResourceCartBarProps> = ({ resourcesInCart }) => {
  return (
    <Card sx={{ padding: 4, marginTop: 4, marginX: 4 }}>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Subtitle sx={{ fontSize: '30px', fontWeight: 700 }}>New Request</Subtitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {resourcesInCart.slice(0, 5).map((item, idx) => (
            <Box key={idx} sx={{ position: 'relative' }}>
              <CardMedia
                component='img'
                sx={{ width: 70, height: 88, borderRadius: 1 }}
                src={item.image ? `${s3URL}${item.image}` : `../src/assets/quick-link-${item.background}.png`}
              />
              {!item.image && (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography fontSize='16px' component='div'>
                    {item.title?.slice(0, 5)}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
          <Stack
            direction='row'
            spacing={1.5}
            sx={{ marginLeft: 3, cursor: 'pointer' }}
            alignItems='center'
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <EastIcon sx={{ fontSize: '36px' }} />
          </Stack>
        </Box>
      </Box>
    </Card>
  )
}

export default ResourceCartBar
