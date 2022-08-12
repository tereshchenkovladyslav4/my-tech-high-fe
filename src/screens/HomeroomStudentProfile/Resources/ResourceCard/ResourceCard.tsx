import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { Box, Button, Card, CardContent, CardMedia, Stack, Tooltip, Typography } from '@mui/material'
import AllowingRequestIcon from '@mth/assets/check-white-bg-black.png'
import UnHideIcon from '@mth/assets/eye-white-bg-black.png'
import HideIcon from '@mth/assets/eye-white-bg-orange.png'
import ViewOnlyIcon from '@mth/assets/plus-black-bg-white.png'
import { s3URL } from '@mth/constants'
import { ResourceSubtitle } from '@mth/enums'
import { EventType, ResourceCardProps } from '../types'
import { resourceCardClasses } from './styles'

const ResourceCard: React.FC<ResourceCardProps> = ({ item, onAction }) => {
  const actionHandler = (e: React.MouseEvent<HTMLElement>, eventType?: EventType) => {
    e.stopPropagation()
    if (onAction && eventType) onAction(eventType)
  }

  const showRequestCta = (): boolean => {
    return !item.requested && !item.accepted && item.subtitle !== ResourceSubtitle.INCLUDED
  }

  const shouldWaitResource = (): boolean => {
    return !!item?.resource_limit
  }

  return (
    <Card
      id='item-card'
      sx={{ ...resourceCardClasses.card, opacity: item.HiddenByStudent ? 0.5 : 1 }}
      onClick={(e) => actionHandler(e, EventType.CLICK)}
    >
      <CardMedia
        component='img'
        sx={{ height: 240 }}
        src={item.image ? `${s3URL}${item.image}` : `../src/assets/quick-link-${item.background}.png`}
      />
      {!item.image && (
        <Box sx={{ width: '100%', position: 'absolute', left: 0, textAlign: 'center', top: '100px', color: 'white' }}>
          <Typography fontSize='40px' component='div'>
            {item.title}
          </Typography>
        </Box>
      )}
      {showRequestCta() && (
        <Tooltip title={item.inCart ? 'Remove' : shouldWaitResource() ? 'Join Waitlist' : 'Request'}>
          <img
            onClick={(e) => actionHandler(e, EventType.ADD_CART)}
            src={item.inCart ? AllowingRequestIcon : ViewOnlyIcon}
            style={{ position: 'absolute', top: 15, right: 15 }}
          />
        </Tooltip>
      )}
      <Tooltip title={item.HiddenByStudent ? 'Unhide' : 'Hide'}>
        <img
          onClick={(e) => actionHandler(e, item.HiddenByStudent ? EventType.UNHIDE : EventType.HIDE)}
          src={item.HiddenByStudent ? UnHideIcon : HideIcon}
          style={{
            position: 'absolute',
            top: showRequestCta() ? 77 : 15,
            right: 15,
          }}
        />
      </Tooltip>

      {item.subtitle === ResourceSubtitle.INCLUDED && (
        <Button variant='contained' sx={resourceCardClasses.blackButton}>
          Included
        </Button>
      )}
      {item.requested && !item.accepted && (
        <Button variant='contained' sx={resourceCardClasses.blackButton}>
          Requested
        </Button>
      )}
      {shouldWaitResource() && !item.inCart && !item.requested && (
        <Button variant='contained' sx={resourceCardClasses.purpleButton}>
          Join Waitlist
        </Button>
      )}
      {shouldWaitResource() && (item.inCart || item.requested) && (
        <Button variant='contained' sx={resourceCardClasses.purpleButton}>
          Waitlist
        </Button>
      )}
      {(item.accepted || item.subtitle === ResourceSubtitle.INCLUDED) && (
        <Button variant='contained' sx={resourceCardClasses.primaryButton}>
          Login
        </Button>
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
          <Typography fontSize='20px' component='div' fontWeight={900}>
            {item.title}
          </Typography>
        </Box>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ height: 40 }}>
          <Typography color='#A1A1A1' fontSize='16px' fontWeight='700'>
            {item.subtitle == ResourceSubtitle.PRICE
              ? `$${item.price}`
              : item.subtitle == ResourceSubtitle.INCLUDED
              ? 'Included'
              : ''}
          </Typography>
          <Tooltip title={'Details'}>
            <Stack direction='row' spacing={1.5} alignItems='center' onClick={(e) => actionHandler(e, EventType.CLICK)}>
              <EastIcon />
            </Stack>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ResourceCard
