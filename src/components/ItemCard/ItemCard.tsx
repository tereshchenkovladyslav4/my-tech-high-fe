import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { ItemCardProps } from './ItemCardProps'
import { useStyles } from './styles'

export const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subTitle,
  img,
  link,
  isLink,
  onClick,
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
        borderRadius: '16px',
        marginX: 4,
        opacity: disabled ? 0.5 : 1,
        boxShadow: 'none',
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
          <CardMedia component='img' src={img} sx={{ height: img ? 'auto' : 240 }} />
          <Box className='card-title'>
            <Typography fontSize='45px' component='div' fontWeight='600'>
              {icon || title}
            </Typography>
          </Box>
        </Box>
      ) : (
        <CardMedia component='img' sx={{ minHeight: img ? 'auto' : 240 }} src={img} />
      )}

      <CardContent sx={{ textAlign: 'left' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            minHeight: '54px',
          }}
        >
          <Box>
            <Typography fontSize='20px' component='div' fontWeight={'700'}>
              {title}
            </Typography>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              {!!subTitle && (
                <Typography
                  color='#A1A1A1'
                  fontSize='16px'
                  fontWeight='700'
                  sx={{ visibility: subTitle ? 'shown' : 'hidden' }}
                >
                  {subTitle || 'N/A'}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: '8px' }}>
            <EastIcon sx={{ mt: subTitle ? 0 : 0.75 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
