import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { Card, CardMedia, CardContent, Box, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { AdminEnrolmentCardProps } from './types'

export const AdminEnrollmentCard: React.FC<AdminEnrolmentCardProps> = ({ title, disabled, link, img, showTitle }) => {
  const history = useHistory()

  return (
    <Card
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        marginX: 4,
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={() => {
        if (!disabled) history.push(link)
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia component='img' src={img} />
        {showTitle && (
          <Box sx={{ width: '100%', position: 'absolute', left: 0, textAlign: 'center', top: '40%', color: 'white' }}>
            <Typography fontSize='40px' component='div' fontWeight='600'>
              {title}
            </Typography>
          </Box>
        )}
      </Box>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
        }}
      >
        <Subtitle size='large' fontWeight='700'>
          {title}
        </Subtitle>
        <EastIcon />
      </CardContent>
    </Card>
  )
}
