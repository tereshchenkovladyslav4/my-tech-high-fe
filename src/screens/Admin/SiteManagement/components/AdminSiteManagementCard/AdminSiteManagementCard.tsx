import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { Card, CardMedia, CardContent, Box, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { AdminSiteManagementCardProps } from './types'

export const AdminSiteManagementCard: React.FC<AdminSiteManagementCardProps> = ({ title, link, img, subTitle }) => {
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
      <CardMedia component='img' src={img} />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'flex-start',
        }}
      >
        <Box textAlign='start'>
          <Typography fontSize='20px' component='div'>
            {title}
          </Typography>
          <Typography color='#A1A1A1' fontSize='16px' fontWeight='700px'>
            {subTitle}
          </Typography>
        </Box>
        <EastIcon />
      </CardContent>
    </Card>
  )
}
