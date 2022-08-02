import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box } from '@mui/system'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { S3FileType } from '../DocumentUploadModal/types'
import { useStyles } from './styles'
import { DocumentListItemTemplateType } from './types'

export const DocumentListItem: DocumentListItemTemplateType = ({ file, closeAction }) => {
  const classes = useStyles
  return (
    <Box
      onClick={() => !closeAction && window.open((file as S3FileType).signedUrl)}
      display='flex'
      flexDirection='row'
      color='#7B61FF'
      marginTop='6px'
    >
      <Paragraph sx={classes.text}>{file.name}</Paragraph>
      {closeAction && <CloseIcon style={classes.close} onClick={() => closeAction(file)} />}
    </Box>
  )
}
