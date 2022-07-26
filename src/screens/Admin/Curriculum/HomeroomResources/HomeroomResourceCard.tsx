import React from 'react'
import { Box, Card, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DehazeIcon from '@mui/icons-material/Dehaze'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import EastIcon from '@mui/icons-material/East'
import AddNewIcon from '../../../../assets/add-new.png'
import DeleteIcon from '../../../../assets/delete.png'
import ArchiveIcon from '../../../../assets/archive.png'
import ViewOnlyIcon from '../../../../assets/plus-black-bg-white.png'
import AllowingRequestIcon from '../../../../assets/check-white-bg-black.png'
import DuplicateIcon from '../../../../assets/plus-black-bg-orange.png'
import { SYSTEM_01 } from '../../../../utils/constants'
import { SortableHandle } from 'react-sortable-hoc'
import { EventType, HomeroomeResourceProps } from './HomeroomResourcesProps'

export const HomeroomeResourceCard: React.FC<HomeroomeResourceProps> = ({ item, action, onAction }) => {
  const DragHandle = SortableHandle(() => (
    <IconButton>
      <Tooltip title='Move'>
        <DehazeIcon htmlColor={SYSTEM_01} />
      </Tooltip>
    </IconButton>
  ))

  const actionHandler = (eventType: EventType) => {
    onAction && onAction(eventType)
  }

  return (
    <Card
      id='item-card'
      sx={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 2,
        margin: 1,
        opacity: item.hidden ? 0.5 : 1,
        minWidth: 300,
      }}
      onClick={() => {
        actionHandler(EventType.CLICK)
      }}
    >
      {Boolean(item.id) && (
        <>
          <CardMedia component='img' sx={{ height: 240 }} src={item.image_url} />
          {!item.image_url && (
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
      {!item.id && (
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
      {!item.id && (
        <img
          onClick={(e) => {
            actionHandler(EventType.ADD)
            e.stopPropagation()
          }}
          src={AddNewIcon}
          style={{ position: 'absolute', top: 15, right: 15 }}
        />
      )}
      {item.hidden && (
        <img
          onClick={(e) => {
            actionHandler(EventType.DELETE)
            e.stopPropagation()
          }}
          src={DeleteIcon}
          style={{ position: 'absolute', top: 15, right: 15 }}
        />
      )}
      {Boolean(item.id && !item.hidden) && (
        <img
          onClick={(e) => {
            actionHandler(EventType.ALLOWREQUEST)
            e.stopPropagation()
          }}
          src={item.allow_request ? AllowingRequestIcon : ViewOnlyIcon}
          style={{ position: 'absolute', top: 15, right: 15 }}
        />
      )}
      {Boolean(item.id && !item.hidden) && (
        <img
          onClick={(e) => {
            actionHandler(EventType.DUPLICATE)
            e.stopPropagation()
          }}
          src={DuplicateIcon}
          style={{ position: 'absolute', top: 77, right: 15 }}
        />
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
          <Typography color='#A1A1A1' fontSize='16px' fontWeight='700px'>
            {item.id ? (item.show_cost ? `$${item.cost}` : 'Included') : 'Lorem ipsum'}
          </Typography>
          {!action && item.id != 0 && (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <EastIcon />
            </Stack>
          )}
          {action && (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <Tooltip title='Edit'>
                <EditIcon
                  htmlColor={SYSTEM_01}
                  onClick={(e) => {
                    actionHandler(EventType.EDIT)
                    e.stopPropagation()
                  }}
                />
              </Tooltip>
              {!item.hidden && (
                <Tooltip title='Archive'>
                  <img
                    onClick={(e) => {
                      actionHandler(EventType.ARCHIVE)
                      e.stopPropagation()
                    }}
                    src={ArchiveIcon}
                  />
                </Tooltip>
              )}
              {item.hidden && (
                <Tooltip title='Unarchive'>
                  <CallMissedOutgoingIcon
                    htmlColor={SYSTEM_01}
                    onClick={(e) => {
                      actionHandler(EventType.RESTORE)
                      e.stopPropagation()
                    }}
                  />
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
