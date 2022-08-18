import React from 'react'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Card, Grid, Link, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { renderGrades } from '@mth/utils'
import { ResourceCard } from '../ResourceCard'
import { ResourceDetailsProps, ResourcePage } from '../types'

const ResourceDetails: React.FC<ResourceDetailsProps> = ({ item, handleBack }) => {
  return (
    <Card sx={{ p: 4, m: 4, textAlign: 'left' }}>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Grid container sx={{ background: 'inherit' }}>
          <ButtonBase onClick={handleBack} sx={{ p: 1 }} disableRipple>
            <Grid container justifyContent='flex-start' alignItems='center'>
              <ArrowBackIosOutlinedIcon />
              <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>Resources</Typography>
            </Grid>
          </ButtonBase>
        </Grid>
      </Box>
      <Box sx={{ p: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={5}>
            <ResourceCard page={ResourcePage.DETAILS} item={item} onAction={() => {}} />
          </Grid>
          <Grid item xs={7}>
            <Subtitle sx={{ fontSize: '27px', fontWeight: 700 }}>{item.title}</Subtitle>
            <Typography sx={{ fontWeight: 600, fontSize: 16, color: MthColor.SYSTEM_06, mt: 1, mb: 2 }}>
              {renderGrades(item.grades)}
            </Typography>
            <Link
              href={item.website}
              target='_blank'
              underline='hover'
              sx={{ fontWeight: 600, fontSize: 27, color: MthColor.MTHBLUE }}
            >
              {item.website}
            </Link>
          </Grid>
        </Grid>
        <Box sx={{ px: 6, py: 5 }}>
          <Subtitle size='medium' sx={{ fontSize: '27px' }} fontWeight='700'>
            Details
          </Subtitle>
          <Typography component={'span'} variant={'body2'} dangerouslySetInnerHTML={{ __html: item.detail }} />
        </Box>
      </Box>
    </Card>
  )
}

export default ResourceDetails
