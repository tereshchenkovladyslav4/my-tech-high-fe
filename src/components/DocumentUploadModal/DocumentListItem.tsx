import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box } from '@mui/system'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { documentUploadModalClasses } from './styles'
import { DocumentListItemProp, S3FileType } from './types'

export const DocumentListItem: React.FC<DocumentListItemProp> = ({ file, closeAction }) => {
  return (
    <Box
      onClick={() => !closeAction && window.open((file as S3FileType).signedUrl)}
      display='flex'
      flexDirection='row'
      color='#7B61FF'
      marginTop='6px'
    >
      <Paragraph sx={documentUploadModalClasses.text}>{file.name}</Paragraph>
      {closeAction && <CloseIcon style={documentUploadModalClasses.close} onClick={() => closeAction()} />}
    </Box>
  )
}
