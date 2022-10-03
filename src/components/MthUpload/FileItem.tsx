import React from 'react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import { useStyles } from './styles'
import { FileType } from './types'

const FileItem: React.FC<FileType> = ({ file, onDelete }) => {
  return (
    <Box sx={useStyles.fileItem}>
      <Typography>{file.name}</Typography>
      <IconButton onClick={() => onDelete(file)}>
        <Tooltip title='Delete' color='primary' placement='top'>
          <DeleteForeverOutlined />
        </Tooltip>
      </IconButton>
    </Box>
  )
}
export default FileItem
