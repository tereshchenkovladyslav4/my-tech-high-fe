import React from 'react'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Box, Tooltip, Typography } from '@mui/material'
import { testingPreferenceClassess } from './styles'
import { AssessmentItemProps } from './types'

const AssessmentItem: React.FC<AssessmentItemProps> = ({ index, item, setIsDragDisable }) => {
  return (
    <Box
      sx={{
        ...testingPreferenceClassess.tableCotainer,
        color: item.isArchived ? '#A3A3A4' : '#000',
        background: index % 2 == 0 ? '#FAFAFA' : '',
        textAlign: 'left',
      }}
      draggable='false'
    >
      <Typography
        sx={{ minWidth: '150px' }}
        onMouseOver={() => {
          setIsDragDisable(true)
        }}
      >
        {item.title}
      </Typography>
      <Box sx={testingPreferenceClassess.verticalLine}></Box>
      <Typography
        sx={{ minWidth: '300px', paddingLeft: 4 }}
        onMouseOver={() => {
          setIsDragDisable(true)
        }}
      >
        {item.value}
      </Typography>
      <Box sx={testingPreferenceClassess.action}>
        {item.isArchived ? (
          <>
            <Tooltip title='Edit' placement='top'>
              <ModeEditIcon
                sx={testingPreferenceClassess.iconCursor}
                fontSize='medium'
                onMouseOver={() => {
                  setIsDragDisable(true)
                }}
              />
            </Tooltip>
            <Tooltip title='Unarchive' placement='top'>
              <CallMissedOutgoingIcon sx={testingPreferenceClassess.iconCursor} fontSize='medium' />
            </Tooltip>
            <Tooltip title='Delete' placement='top'>
              <DeleteForeverOutlinedIcon sx={testingPreferenceClassess.iconCursor} fontSize='medium' />
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title='Edit' placement='top'>
              <ModeEditIcon
                sx={testingPreferenceClassess.iconCursor}
                fontSize='medium'
                onMouseOver={() => {
                  setIsDragDisable(true)
                }}
              />
            </Tooltip>
            <Tooltip title='Archive' placement='top'>
              <SystemUpdateAltIcon
                sx={testingPreferenceClassess.iconCursor}
                fontSize='medium'
                onMouseOver={() => {
                  setIsDragDisable(true)
                }}
              />
            </Tooltip>
            <Tooltip title='Move' placement='top'>
              <MenuIcon
                sx={testingPreferenceClassess.iconCursor}
                onMouseOver={() => {
                  setIsDragDisable(false)
                }}
                fontSize='medium'
              />
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  )
}

export default AssessmentItem
