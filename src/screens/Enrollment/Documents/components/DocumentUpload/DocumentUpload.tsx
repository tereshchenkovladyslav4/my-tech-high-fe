import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { DocumentUploadTemplateType } from './types'
import { useStyles } from './styles'
import { DocumentUploadModal } from '../DocumentUploadModal/DocumentUploadModal'
import { EnrollmentContext } from '../../../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { DocumentListItem } from '../DocumentList/DocumentListItem'
import { filter, map } from 'lodash'
export const DocumentUpload: DocumentUploadTemplateType = ({ title, subtitle, document, handleUpload, file, disabled }) => {
  const classes = useStyles

  const  [open, setOpen] = useState(false)
  const [files, setFiles] = useState<undefined | File[]>()
  const handleFile = (fileName: File[]) => {setFiles(fileName)}
	const deleteFile = (currFile: File) => {
		setFiles(filter(files, (validFile) => validFile !== currFile))
	}

  useEffect(() =>{
    handleUpload(document, files)
  },[files])

  const renderFiles = (upload) => {
    return upload
    ? map(files, (curr) => (
        <DocumentListItem 
          file={curr}
          closeAction={deleteFile}
        />
    ))
    : map(file, (curr) => (
      <DocumentListItem 
        file={curr}
      />
  ))
  }
  console.log(file,'ss')
  return (
    <Box sx={classes.container}>
      <Subtitle fontWeight='700'>{title}</Subtitle>
      { files ? renderFiles(true) :  renderFiles(false)}
      <Box sx={classes.buttonContainer}>
        <Paragraph size='medium'>{subtitle}</Paragraph>
        <Button 
          style={classes.button}
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          <Paragraph size='medium'>Upload</Paragraph>
        </Button>
      </Box>
      { open 
				&& <DocumentUploadModal
          handleModem={() => setOpen(!open)}
          handleFile={handleFile}
				/> 
			}
    </Box>
  )
}
