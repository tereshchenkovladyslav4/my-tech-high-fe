import React from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EastIcon from '@mui/icons-material/East'
import EditIcon from '@mui/icons-material/Edit'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Card, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { SortableHandle } from 'react-sortable-hoc'
import { quickLinkCardClasses } from '@mth/components/QuickLink/styles'
import { MthColor } from '@mth/enums'
import { QuickLinkCardProps, QUICKLINK_TYPE } from './QuickLinkCardProps'

export const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ item, action, onAction, background }) => {
  const DragHandle = SortableHandle(() => (
    <IconButton>
      <Tooltip title='Move'>
        <DehazeIcon htmlColor={MthColor.SYSTEM_01} />
      </Tooltip>
    </IconButton>
  ))

  return (
    <Card
      id='item-card'
      sx={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 2,
        margin: 1,
        opacity: item.flag == 1 ? 0.5 : 1,
        minWidth: { xs: 0, sm: 300 },
        marginX: { xs: 3, sm: 0 },
      }}
      onClick={() => {
        if (onAction) onAction('click')
      }}
    >
      {item.id != 0 && (
        <>
          <CardMedia
            component='img'
            sx={{ height: 240 }}
            src={
              item.image_url
                ? 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/' + item.image_url
                : background == 'orange'
                ? '../src/assets/quick-link-orange.png'
                : '../src/assets/quick-link-blue.png'
            }
          />
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
      {item.id == 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: item.subtitle ? 'center' : 'flex-start',
            alignContent: 'flex-start',
            height: 240,
          }}
        ></Box>
      )}
      {item.id == 0 && (
        <Tooltip title='Add'>
          <Stack
            onClick={(e) => {
              if (onAction) onAction('add')
              e.stopPropagation()
            }}
            sx={{
              ...quickLinkCardClasses.iconButton,
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
      {item.flag == 1 && item.type != QUICKLINK_TYPE.WITHDRAWAL && (
        <Tooltip title='Delete'>
          <Stack
            onClick={(e) => {
              if (onAction) onAction('delete')
              e.stopPropagation()
            }}
            sx={{
              ...quickLinkCardClasses.iconButton,
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
      <CardContent sx={{ textAlign: 'left' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: item.subtitle ? 'center' : 'flex-start',
            alignContent: 'flex-start',
          }}
        >
          <Typography fontSize='20px' component='div' fontWeight={900}>
            {item.title}
          </Typography>
          {/* !action &&
						<EastIcon sx={{ mt: item.subtitle ? 0 : 0.75 }} />
					*/}
        </Box>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ height: 40 }}>
          <Typography
            color='#A1A1A1'
            fontSize='16px'
            fontWeight='700px'
            sx={{ visibility: item.subtitle ? 'shown' : 'hidden' }}
          >
            {item.subtitle || 'N/A'}
          </Typography>
          {!action && item.id != 0 && (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <EastIcon />
            </Stack>
          )}
          {action && (
            <Stack direction='row' spacing={0.5} alignItems='center'>
              <Tooltip title='Edit'>
                <IconButton
                  sx={quickLinkCardClasses.actionButton}
                  onClick={(e) => {
                    if (onAction) onAction('edit')
                    e.stopPropagation()
                  }}
                  disabled={!!item.flag}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {item.flag == 0 && (
                <Tooltip title='Archive'>
                  <IconButton
                    sx={quickLinkCardClasses.actionButton}
                    onClick={(e) => {
                      if (onAction) onAction('archive')
                      e.stopPropagation()
                    }}
                  >
                    <SystemUpdateAltRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
              {item.flag == 1 && (
                <Tooltip title='Unarchive'>
                  <IconButton
                    sx={quickLinkCardClasses.actionButton}
                    onClick={(e) => {
                      if (onAction) onAction('restore')
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
