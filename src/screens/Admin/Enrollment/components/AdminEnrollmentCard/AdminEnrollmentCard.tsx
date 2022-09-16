import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { Card, CardMedia, CardContent } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { AdminEnrolmentCardProps } from './types'

export const AdminEnrollmentCard: React.FC<AdminEnrolmentCardProps> = ({ title, disabled, link, img }) => {
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
      <CardMedia component='img' src={img} />
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
