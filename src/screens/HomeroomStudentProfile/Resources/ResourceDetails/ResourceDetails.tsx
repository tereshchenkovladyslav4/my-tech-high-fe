import React from 'react'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Card, Grid, Link, Stack, TextField, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ResourceRequestStatus, ResourceSubtitle } from '@mth/enums'
import { renderGrades } from '@mth/utils'
import { ResourceCard } from '../ResourceCard'
import { ResourceDetailsProps, ResourcePage } from '../types'

const ResourceDetails: React.FC<ResourceDetailsProps> = ({ item, handleBack, onCardAction }) => {
  return (
    <Card sx={{ p: 4, m: 4, textAlign: 'left', borderRadius: '12px', boxShadow: 'none' }}>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Grid container sx={{ background: 'inherit' }}>
          <ButtonBase onClick={handleBack} disableRipple>
            <Grid container justifyContent='flex-start' alignItems='center'>
              <Stack sx={{ p: '4px' }}>
                <ArrowBackIosOutlinedIcon />
              </Stack>
              <Typography sx={{ fontWeight: 700, fontSize: 20, ml: '20px' }}>Resources</Typography>
            </Grid>
          </ButtonBase>
        </Grid>
      </Box>
      <Box sx={{ px: 6, py: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <ResourceCard page={ResourcePage.DETAILS} item={item} onAction={onCardAction} />
          </Grid>
          <Grid item xs={7}>
            <Subtitle sx={{ fontSize: '27px', fontWeight: 700 }}>{item.title}</Subtitle>
            <Typography sx={{ fontWeight: 600, fontSize: 16, color: MthColor.SYSTEM_06, mt: 1, mb: 2 }}>
              {renderGrades(item.grades)}
            </Typography>
            {item.website && (
              <Link
                href={item.website}
                target='_blank'
                underline='hover'
                sx={{ fontWeight: 600, fontSize: 27, color: MthColor.MTHBLUE }}
              >
                {item.website}
              </Link>
            )}
            {item.RequestStatus === ResourceRequestStatus.ACCEPTED ||
              (item.subtitle === ResourceSubtitle.INCLUDED && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: '24px',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                    mt: 4,
                  }}
                >
                  {item.std_user_name && (
                    <Box sx={{ mb: 3, flex: 1 }}>
                      <Subtitle sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>Username</Subtitle>
                      <TextField
                        fullWidth
                        aria-readonly
                        focused
                        value={item.std_user_name}
                        InputProps={{ style: { fontSize: 14, fontWeight: 700 } }}
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #E7E7E7',
                          },
                        }}
                      />
                    </Box>
                  )}
                  {item.std_password && (
                    <Box sx={{ mb: 3, flex: 1 }}>
                      <Subtitle sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>Password</Subtitle>
                      <TextField
                        fullWidth
                        aria-readonly
                        focused
                        value={item.std_password}
                        InputProps={{ style: { fontSize: 14, fontWeight: 700, color: MthColor.SYSTEM_01 } }}
                        sx={{
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #E7E7E7',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
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
