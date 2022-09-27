import React from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze'
import EastIcon from '@mui/icons-material/East'
import EditIcon from '@mui/icons-material/Edit'
import LoginIcon from '@mui/icons-material/Login'
import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import AddNewIcon from '../../assets/add-new.png'
import { SYSTEM_01 } from '../../utils/constants'
import { ItemCardProps } from './ItemCardProps'
import { useStyles } from './styles'

export const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subTitle,
  img,
  link,
  isLink,
  onClick,
  action,
  hasTitle = false,
  icon,
  disabled,
}) => {
  const history = useHistory()
  return (
    <Card
      id='item-card'
      sx={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 2,
        marginX: 4,
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={() => {
        if (!disabled) {
          if (isLink !== false) {
            history.push(link)
          } else {
            if (onClick) {
              onClick()
            }
          }
        }
      }}
    >
      {hasTitle ? (
        <Box sx={useStyles.cardHeader}>
          <CardMedia component='img' src={img} sx={{ height: 240 }} />
          <Box className='card-title'>
            <Typography fontSize='45px' component='div' fontWeight='600'>
              {icon || title}
            </Typography>
          </Box>
        </Box>
      ) : (
        <CardMedia component='img' sx={{ minHeight: img ? 'auto' : 240 }} src={img} />
      )}

      {!img && (
        <img onClick={() => history.push(link)} src={AddNewIcon} style={{ position: 'absolute', top: 15, right: 15 }} />
      )}
      <CardContent sx={{ textAlign: 'left' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'flex-start',
          }}
        >
          <Box>
            <Typography fontSize='20px' component='div' fontWeight={'700'}>
              {title}
            </Typography>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography
                color='#A1A1A1'
                fontSize='16px'
                fontWeight='700'
                sx={{ visibility: subTitle ? 'shown' : 'hidden' }}
              >
                {subTitle || 'N/A'}
              </Typography>
              {action && (
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <DehazeIcon htmlColor={SYSTEM_01} />
                  <EditIcon
                    htmlColor={SYSTEM_01}
                    onClick={(e) => {
                      alert(`Edit ${title}`)
                      e.stopPropagation()
                    }}
                  />
                  <LoginIcon
                    htmlColor={SYSTEM_01}
                    sx={{ transform: 'rotate(90deg)' }}
                    onClick={(e) => {
                      alert(`Download ${title}`)
                      e.stopPropagation()
                    }}
                  />
                </Stack>
              )}
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!action && <EastIcon sx={{ mt: subTitle ? 0 : 0.75 }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
