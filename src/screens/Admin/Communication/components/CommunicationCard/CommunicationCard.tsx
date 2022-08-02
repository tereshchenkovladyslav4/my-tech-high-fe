import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { Card, CardMedia, CardContent, Box, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { CommunicationCardTemplateType } from './types'

export const CommunicationCard: CommunicationCardTemplateType = ({ title, link, img, description = '' }) => {
  const history = useHistory()

  return (
    <Card
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        marginX: 4,
      }}
      onClick={() => history.push(link)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia component='img' src={img} sx={{ height: 240 }} />
        <Box sx={{ width: '100%', position: 'absolute', left: 0, textAlign: 'center', top: '100px', color: 'white' }}>
          <Typography fontSize='40px' component='div' fontWeight='600'>
            {title}
          </Typography>
        </Box>
      </Box>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '54px',
          }}
        >
          <Box>
            <Subtitle size='large' fontWeight='700'>
              {title}
            </Subtitle>
            {description && (
              <Typography color='#A1A1A1' fontSize='16px' fontWeight='600'>
                {description || 'N/A'}
              </Typography>
            )}
          </Box>
          <Box sx={{ paddingTop: '10px' }}>
            <EastIcon />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
