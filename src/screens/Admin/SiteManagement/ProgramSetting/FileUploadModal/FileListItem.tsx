import React, { useState } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box } from '@mui/system'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { CustomModal } from '../../EnrollmentSetting/components/CustomModal/CustomModals'
import { fileUploadModalClassess } from './styles'
import { FileListItemProps, S3FileType } from './types'

export const FileListItem: React.FC<FileListItemProps> = ({ file, hasDeleteAction, deleteAction }) => {
  const [open, setOpen] = useState(false)
  const handleDelete = () => setOpen(true)
  const handleSave = () => {
    deleteAction(file)
    setOpen(false)
  }

  return (
    <>
      <Box
        onClick={() => !deleteAction && window.open((file as S3FileType).signedUrl)}
        sx={fileUploadModalClassess.fileListItem}
      >
        <Paragraph sx={fileUploadModalClassess.text}>{file.name}</Paragraph>
        {hasDeleteAction && (
          <DeleteForeverOutlinedIcon style={fileUploadModalClassess.delete} onClick={() => handleDelete()} />
        )}
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
