import React from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import EastIcon from '@mui/icons-material/East'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Box, Button, Card, CardContent, CardMedia, Stack, Tooltip, Typography } from '@mui/material'
import { s3URL } from '@mth/constants'
import { MthColor, ResourceRequestStatus, ResourceSubtitle } from '@mth/enums'
import { EventType, ResourceCardProps, ResourcePage } from '../types'
import { resourceCardClasses } from './styles'

const ResourceCard: React.FC<ResourceCardProps> = ({ page, item, onAction }) => {
  const actionHandler = (e: React.MouseEvent<HTMLElement>, eventType?: EventType) => {
    e.stopPropagation()
    if (onAction && eventType) onAction(eventType)
  }

  const showRequestCta = (): boolean => {
    return !item.RequestStatus && !item.accepted && item.subtitle !== ResourceSubtitle.INCLUDED
  }

  const shouldWaitResource = (): boolean => {
    return !!item?.resource_limit
  }

  return (
    <Card
      id='item-card'
      sx={{
        ...resourceCardClasses.card,
        opacity: item.HiddenByStudent ? 0.5 : 1,
        boxShadow: page === ResourcePage.DETAILS ? 'none' : '',
      }}
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
        <Tooltip title={item.CartDate ? 'Remove' : shouldWaitResource() ? 'Join Waitlist' : 'Request'}>
          <Stack
            onClick={(e) => actionHandler(e, EventType.ADD_CART)}
            sx={{
              ...resourceCardClasses.iconButton,
              top: 15,
              right: 15,
              color: item.CartDate ? MthColor.WHITE : MthColor.SYSTEM_01,
              background: item.CartDate
                ? page !== ResourcePage.REQUEST
                  ? MthColor.SYSTEM_01
                  : MthColor.MTHORANGE
                : MthColor.WHITE,
            }}
          >
            {item.CartDate ? (
              page !== ResourcePage.REQUEST ? (
                <CheckOutlinedIcon />
              ) : (
                <CloseOutlinedIcon />
              )
            ) : (
              <AddOutlinedIcon />
            )}
          </Stack>
        </Tooltip>
      )}
      {page !== ResourcePage.REQUEST && (
        <Tooltip title={item.HiddenByStudent ? 'Unhide' : 'Hide'}>
          <Stack
            onClick={(e) => actionHandler(e, item.HiddenByStudent ? EventType.UNHIDE : EventType.HIDE)}
            sx={{
              ...resourceCardClasses.iconButton,
              top: showRequestCta() ? 77 : 15,
              right: 15,
              color: MthColor.WHITE,
              background: item.HiddenByStudent ? MthColor.SYSTEM_01 : MthColor.MTHORANGE,
            }}
          >
            {item.HiddenByStudent ? (
              <VisibilityOffOutlinedIcon sx={{ transform: 'scaleX(-1)' }} />
            ) : (
              <VisibilityOutlinedIcon />
            )}
          </Stack>
        </Tooltip>
      )}

      {item.subtitle === ResourceSubtitle.INCLUDED && (
        <Button variant='contained' sx={resourceCardClasses.blackButton}>
          Included
        </Button>
      )}
      {item.RequestStatus === ResourceRequestStatus.REQUESTED && !item.accepted && (
        <Button variant='contained' sx={resourceCardClasses.blackButton}>
          Requested
        </Button>
      )}
      {shouldWaitResource() && !item.CartDate && !item.RequestStatus && (
        <Button variant='contained' sx={resourceCardClasses.purpleButton}>
          Join Waitlist
        </Button>
      )}
      {shouldWaitResource() && (item.CartDate || item.RequestStatus) && (
        <Button variant='contained' sx={resourceCardClasses.purpleButton}>
          Waitlist
        </Button>
      )}
      {(item.accepted || item.subtitle === ResourceSubtitle.INCLUDED) && (
        <Button variant='contained' sx={resourceCardClasses.primaryButton}>
          Login
        </Button>
      )}
      <CardContent sx={{ textAlign: 'left', pb: '20px !important', px: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'start',
            alignContent: 'flex-start',
          }}
        >
          <Box sx={{ height: 48 }}>
            <Typography component='div' sx={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.1 }}>
              {item.title}
            </Typography>
            <Typography
              sx={{ fontSize: '16px', fontWeight: 700, lineHeight: '22px', color: MthColor.SYSTEM_06, mt: '4px' }}
            >
              {item.subtitle == ResourceSubtitle.PRICE
                ? `$${item.price}`
                : item.subtitle == ResourceSubtitle.INCLUDED
                ? 'Included'
                : page === ResourcePage.REQUEST
                ? 'Free'
                : ''}
            </Typography>
          </Box>
          {page !== ResourcePage.DETAILS && (
            <Tooltip title={'Details'}>
              <Stack
                direction='row'
                spacing={1.5}
                alignItems='center'
                sx={{ mt: '8px', mr: 2 }}
                onClick={(e) => actionHandler(e, EventType.DETAILS)}
              >
                <EastIcon />
              </Stack>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ResourceCard
