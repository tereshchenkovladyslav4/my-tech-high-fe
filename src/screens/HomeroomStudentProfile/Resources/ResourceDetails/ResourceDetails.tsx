import React from 'react'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Card, Grid, Link, TextField, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ResourceRequestStatus } from '@mth/enums'
import { renderGrades } from '@mth/utils'
import { ResourceCard } from '../ResourceCard'
import { ResourceDetailsProps, ResourcePage } from '../types'

const ResourceDetails: React.FC<ResourceDetailsProps> = ({ item, handleBack, onCardAction }) => {
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
          <Grid item xs={4}>
            <ResourceCard page={ResourcePage.DETAILS} item={item} onAction={onCardAction} />
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
            {item.RequestStatus === ResourceRequestStatus.ACCEPTED && (
              <Box
                sx={{
                  display: 'flex',
                  gap: '24px',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                  mt: 4,
                }}
              >
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Subtitle sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>Username</Subtitle>
                  <TextField
                    fullWidth
                    value={item.std_user_name}
                    InputProps={{ style: { fontSize: 14, fontWeight: 700 } }}
                  />
                </Box>
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Subtitle sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>Password</Subtitle>
                  <TextField
                    fullWidth
                    value={item.std_password}
                    InputProps={{ style: { fontSize: 14, fontWeight: 700 } }}
                  />
                </Box>
              </Box>
            )}
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
