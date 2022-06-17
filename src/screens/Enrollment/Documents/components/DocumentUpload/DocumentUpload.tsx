import { Button, IconButton, Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { DocumentUploadModal } from '../DocumentUploadModal/DocumentUploadModal'
import { DocumentListItem } from '../DocumentList/DocumentListItem'
import { filter, map } from 'lodash'
import {  useFormikContext } from 'formik'
import EnrollmentQuestionItem from '../../../Question'
import { QUESTION_TYPE } from '../../../../../components/QuestionItem/QuestionItemProps'

export const DocumentUpload = ({item, formik, handleUpload, file, firstName, lastName, disabled}) => {
  const classes = useStyles

  const  [open, setOpen] = useState(false)
  const [files, setFiles] = useState<undefined | File[]>()
  const handleFile = (fileName: File[]) => {

    const myRenamedFile = fileName.map((f, index) => {
      const fileType = f.name.split('.')[1]
      return new File([f], `${firstName.charAt(0).toUpperCase()}.${lastName}${item.options[0].label}.${fileType}`, {type: f.type})
    })
    setFiles(myRenamedFile)
  }
	const deleteFile = (currFile: File) => {
		setFiles(filter(files, (validFile) => validFile !== currFile))
	}

  useEffect(() =>{
    handleUpload(item.question, files)
  },[item, files])

  const renderFiles = (upload) => {
    return upload
    ? map(files, (curr, index) => (
        <DocumentListItem 
          file={curr}
          key={index}
          closeAction={deleteFile}
        />
    ))
    :
    //  map(file, (curr, index) => (
      file?.length > 0 && <DocumentListItem 
        file={file?.at(-1)}
        // key={index}
      />
    // ))
  }
  if(item.type !== QUESTION_TYPE.UPLOAD) {
    return (
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <EnrollmentQuestionItem item={item} group={'root'} formik={formik}/>
      </Grid>
    )
  }
  else {
    return (
      <Box sx={classes.container}>
        <Box display='flex' alignItems='center' justifyContent='start'>
          <Subtitle fontWeight='700'>{`${item.question} ${item.required ? "(required)" : ""}`}</Subtitle>
        </Box>
        <Paragraph size='medium'>
          <p dangerouslySetInnerHTML={{ __html: item.options[0].value }}></p>
        </Paragraph>
        { files ? renderFiles(true) :  renderFiles(false)}
        <Box sx={classes.buttonContainer}>
          <Paragraph size='medium'>{'Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)'}</Paragraph>
          <Button 
            disabled={disabled}
            style={classes.button}
            onClick={() => setOpen(true)}
          >
            <Paragraph size='medium'>Upload</Paragraph>
          </Button>
        </Box>
        { open 
          && <DocumentUploadModal
            handleModem={() => setOpen(!open)}
            handleFile={handleFile}
            limit = {1}
          /> 
        }
      </Box>
    )
  }
  
}
