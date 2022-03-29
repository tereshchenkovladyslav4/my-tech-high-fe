import { Card, CardMedia, CardContent, Box, Typography } from '@mui/material'
import React from 'react'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { AdminSiteManagementCardTemplateType } from './types'
import EastIcon from '@mui/icons-material/East'
import { DASHBOARD } from '../../../../../utils/constants'
import { useHistory } from 'react-router-dom'

export const AdminSiteManagementCard: AdminSiteManagementCardTemplateType = ({ title, link, img, subTitle }) => {
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
