import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box } from '@mui/system'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { documentUploadModalClasses } from './styles'
import { DocumentListItemProp, S3FileType } from './types'

export const DocumentListItem: React.FC<DocumentListItemProp> = ({ file, secondaryModal, closeAction }) => {
  return (
    <Box
      onClick={() => !closeAction && window.open((file as S3FileType).signedUrl)}
      display='flex'
      flexDirection='row'
      color='#7B61FF'
      marginTop='6px'
    >
      <Paragraph sx={documentUploadModalClasses.text}>{file.name}</Paragraph>
      {closeAction && !secondaryModal && (
        <CloseIcon style={documentUploadModalClasses.close} onClick={() => closeAction()} />
      )}
      {closeAction && secondaryModal && (
        <DeleteForeverOutlinedIcon style={documentUploadModalClasses.delete} onClick={() => closeAction()} />
      )}
    </Box>
  )
}
