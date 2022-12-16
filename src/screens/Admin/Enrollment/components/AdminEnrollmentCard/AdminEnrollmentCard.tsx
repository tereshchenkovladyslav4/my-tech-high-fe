import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { Card, CardMedia, CardContent, Box, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { AdminEnrolmentCardProps } from './types'

export const AdminEnrollmentCard: React.FC<AdminEnrolmentCardProps> = ({
  title,
  disabled,
  link,
  img,
  showTitle,
  fullTitle,
}) => {
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
          <Box
            sx={{
              width: '100%',
              position: 'absolute',
              textAlign: 'center',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
            }}
          >
            <Typography fontSize='40px' component='div' fontWeight='600'>
              {fullTitle || title}
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
