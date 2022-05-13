import { Box, Card, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { QuickLinkCardProps, QUICKLINK_TYPE } from './QuickLinkCardProps'
import AddNewIcon from '../../assets/add-new.png';
import DeleteIcon from '../../assets/delete.png';
import EditIcon from '@mui/icons-material/Edit';
import DehazeIcon from '@mui/icons-material/Dehaze'
import LoginIcon from '@mui/icons-material/Login';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import { SYSTEM_01 } from '../../utils/constants'
import { SortableHandle } from 'react-sortable-hoc';

export const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ item, action, onAction }) => {
  const DragHandle = SortableHandle(() => (
    <IconButton>
      <DehazeIcon htmlColor={SYSTEM_01} />
    </IconButton>
  ))

  return (
    <Card
      id="item-card"
      sx={{
        position: "relative",
        cursor: 'pointer',
        borderRadius: 2,
        margin: 1,
        opacity: item.flag == 1 ? 0.5 : 1,
        minWidth: 300
      }}
      onClick={(e) => {
        onAction && onAction('click')
    /*    isLink !== false ? history.push(link) : onClick()*/
      }}
    >
      {item.id != 0 &&
        <CardMedia component='img' sx={{ height: 240 }} src={item.image_url ? 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/' + item.image_url : '../src/assets/quick-link.png'} />
      }
      {item.id == 0 && 
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: item.subtitle ? "center" : "flex-start",
          alignContent: 'flex-start',
          height: 240
        }}
        ></Box>}
      {item.id == 0 && <img onClick={() => onAction && onAction('add')} src={AddNewIcon} style={{ position: "absolute", top: 15, right: 15 }} />}
      {item.flag == 1 && item.type != QUICKLINK_TYPE.WITHDRAWAL && <img onClick={() => onAction && onAction('delete')} src={DeleteIcon} style={{ position: "absolute", top: 15, right: 15 }} />}
      <CardContent sx={{ textAlign: "left" }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: item.subtitle ? "center" : "flex-start",
          alignContent: 'flex-start',
        }}>
          <Typography fontSize='20px' component='div'>
            {item.title}
          </Typography>
          {/* !action &&
            <EastIcon sx={{ mt: item.subtitle ? 0 : 0.75 }} />
          */}
        </Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{height: 40}}>
          <Typography color='#A1A1A1' fontSize='16px' fontWeight='700px' sx={{ visibility: item.subtitle ? "shown" : "hidden" }}>
            {item.subtitle || "N/A"}
          </Typography>
          {action &&
            <Stack direction="row" spacing={1.5} alignItems="center">
              <DragHandle />
              <EditIcon htmlColor={SYSTEM_01} onClick={(e) => {
                onAction('edit');
                e.stopPropagation();
              }} />
              {item.flag == 0 &&
                <LoginIcon htmlColor={SYSTEM_01} sx={{ transform: 'rotate(90deg)' }} onClick={(e) => {
                  onAction('archive');
                  e.stopPropagation();
                }} />
              }
              {item.flag == 1 &&
                <CallMissedOutgoingIcon htmlColor={SYSTEM_01} onClick={(e) => {
                  onAction('restore');
                  e.stopPropagation();
                }} />
              }
            </Stack>
          }
        </Stack>
      </CardContent>
    </Card>
  )
}
