import React from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Card, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { SortableHandle } from 'react-sortable-hoc'
import { s3URL } from '@mth/constants'
import { MthColor, ResourceSubtitle } from '@mth/enums'
import { EventType, HomeroomResourceCardProps } from '../types'
import { homeroomResourcesCardClasses } from './styles'

const HomeroomResourceCard: React.FC<HomeroomResourceCardProps> = ({ item, action, isPast, onAction }) => {
  const DragHandle = SortableHandle(() => (
    <IconButton>
      <Tooltip title='Move'>
        <DehazeIcon htmlColor={MthColor.SYSTEM_01} />
      </Tooltip>
    </IconButton>
  ))

  const actionHandler = (eventType: EventType) => {
    if (onAction) onAction(eventType)
  }

  return (
    <Card
      id='item-card'
      sx={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '16px',
        opacity: item.resource_id && !item.is_active ? 0.5 : 1,
        minWidth: 300,
        boxShadow: 'none',
      }}
      onClick={() => {
        actionHandler(EventType.CLICK)
      }}
    >
      {!!item.resource_id && (
        <>
          <CardMedia
            component='img'
            sx={{ height: 240 }}
            src={item.image ? `${s3URL}${item.image}` : `../src/assets/quick-link-${item.background}.png`}
          />
          {!item.image && (
            <Box
              sx={{ width: '100%', position: 'absolute', left: 0, textAlign: 'center', top: '100px', color: 'white' }}
            >
              <Typography fontSize='40px' component='div'>
                {item.title}
              </Typography>
            </Box>
          )}
        </>
      )}
      {!item.resource_id && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'flex-start',
            height: 240,
          }}
        ></Box>
      )}
      {item.resource_id === 0 && (
        <Tooltip title='Add'>
          <Stack
            onClick={(e) => {
              actionHandler(EventType.ADD)
              e.stopPropagation()
            }}
            sx={{
              ...homeroomResourcesCardClasses.iconButton,
              top: 15,
              right: 15,
              color: MthColor.SYSTEM_01,
              background: MthColor.BUTTON_LINEAR_GRADIENT,
            }}
          >
            <AddOutlinedIcon />
          </Stack>
        </Tooltip>
      )}
      {action && !isPast && !item.is_active && (
        <Tooltip title='Delete'>
          <Stack
            onClick={(e) => {
              actionHandler(EventType.DELETE)
              e.stopPropagation()
            }}
            sx={{
              ...homeroomResourcesCardClasses.iconButton,
              top: 15,
              right: 15,
              color: MthColor.SYSTEM_01,
              background: MthColor.BUTTON_LINEAR_GRADIENT,
            }}
          >
            <DeleteForeverOutlinedIcon />
          </Stack>
        </Tooltip>
      )}
      {!!item.resource_id && item.is_active && (
        <Tooltip title={item.allow_request ? 'View Only' : 'Allow Request'}>
          <Stack
            onClick={(e) => {
              actionHandler(item.allow_request ? EventType.DISALLOW_REQUEST : EventType.ALLOW_REQUEST)
              e.stopPropagation()
            }}
            sx={{
              ...homeroomResourcesCardClasses.iconButton,
              top: 15,
              right: 15,
              color: item.allow_request ? MthColor.WHITE : MthColor.BLACK,
              background: item.allow_request ? MthColor.SYSTEM_01 : MthColor.WHITE,
            }}
          >
            {item.allow_request ? <CheckOutlinedIcon /> : <AddOutlinedIcon />}
          </Stack>
        </Tooltip>
      )}
      {action && !isPast && !!item.resource_id && item.is_active && (
        <Tooltip title='Clone'>
          <Stack
            onClick={(e) => {
              actionHandler(EventType.DUPLICATE)
              e.stopPropagation()
            }}
            sx={{
              ...homeroomResourcesCardClasses.iconButton,
              top: 77,
              right: 15,
              color: MthColor.BLACK,
              background: MthColor.ORANGE_GRADIENT,
            }}
          >
            <AddOutlinedIcon />
          </Stack>
        </Tooltip>
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
          <Typography component='div' sx={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.1 }}>
            {item.resource_id ? item.title : 'Add New'}
          </Typography>
        </Box>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ height: 40 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, lineHeight: '22px', color: MthColor.SYSTEM_06 }}>
            {item.resource_id
              ? item.subtitle == ResourceSubtitle.PRICE
                ? `$${item.price}`
                : item.subtitle == ResourceSubtitle.INCLUDED
                ? 'Included'
                : ''
              : 'Subtitle'}
          </Typography>
          {item.resource_id != 0 && action && !isPast && (
            <Stack direction='row' spacing={0.5} alignItems='center'>
              <Tooltip title='Edit'>
                <IconButton
                  sx={homeroomResourcesCardClasses.actionButton}
                  onClick={(e) => {
                    actionHandler(EventType.EDIT)
                    e.stopPropagation()
                  }}
                  disabled={!item.is_active}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {item.is_active && (
                <Tooltip title='Archive'>
                  <IconButton
                    sx={homeroomResourcesCardClasses.actionButton}
                    onClick={(e) => {
                      actionHandler(EventType.ARCHIVE)
                      e.stopPropagation()
                    }}
                  >
                    <SystemUpdateAltRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
              {!item.is_active && (
                <Tooltip title='Unarchive'>
                  <IconButton
                    sx={homeroomResourcesCardClasses.actionButton}
                    onClick={(e) => {
                      actionHandler(EventType.RESTORE)
                      e.stopPropagation()
                    }}
                  >
                    <CallMissedOutgoingIcon />
                  </IconButton>
                </Tooltip>
              )}
              <DragHandle />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default HomeroomResourceCard
