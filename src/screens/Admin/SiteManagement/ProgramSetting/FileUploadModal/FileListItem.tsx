import { Box } from '@mui/system'
import React, { useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { useStyles } from './styles'
import { FileListItemTemplateType, S3FileType } from './types'
import CustomModal from '../../EnrollmentSetting/components/CustomModal/CustomModals'

export const FileListItem: FileListItemTemplateType = ({ file, closeAction }) => {
  const classes = useStyles
  const [open, setOpen] = useState(false)
  const handleDelete = () => setOpen(true)
  const handleSave = () => {
    closeAction(file)
    setOpen(false)
  }

  return (
    <>
      <Box onClick={() => !closeAction && window.open((file as S3FileType).signedUrl)} sx={classes.fileListItem}>
        <Paragraph sx={classes.text}>{file.name}</Paragraph>
        {closeAction && <DeleteForeverOutlinedIcon style={classes.delete} onClick={() => handleDelete()} />}
      </Box>
      {open && (
        <CustomModal
          title='Delete File'
          description='Are you sure you want to delete this file?'
          confirmStr='Delete'
          cancelStr='Cancel'
          onConfirm={() => handleSave()}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
