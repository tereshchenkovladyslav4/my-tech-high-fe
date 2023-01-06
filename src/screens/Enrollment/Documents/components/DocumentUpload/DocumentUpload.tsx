import React, { useEffect, useState } from 'react'
import { Button, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { filter } from 'lodash'
import { DocumentListItem } from '@mth/components/DocumentUploadModal/DocumentListItem'
import { DocumentUploadModal } from '@mth/components/DocumentUploadModal/DocumentUploadModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { QUESTION_TYPE } from '@mth/enums'
import { EnrollmentQuestionItem } from '../../../Question'
import { useStyles } from './styles'
import { DocumentUploadProps } from './types'

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  item,
  formik,
  handleUpload,
  files,
  handleDelete,
  fileName,
  disabled,
}) => {
  const classes = useStyles

  const [open, setOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFile = (tempFiles: File[]) => {
    const myRenamedFile = tempFiles.map((f) => {
      const fileType = f.name.split('.')[1]
      return new File([f], `${fileName}.${fileType}`, {
        type: f.type,
      })
    })
    setUploadedFiles((prev) => prev.concat(myRenamedFile))
  }

  const deleteFile = (currFile: File) => {
    setUploadedFiles(filter(uploadedFiles, (validFile) => validFile !== currFile))
  }

  useEffect(() => {
    handleUpload(item[0].question, uploadedFiles)
  }, [item[0], uploadedFiles])

  if (item[0].type !== QUESTION_TYPE.UPLOAD) {
    return (
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <EnrollmentQuestionItem item={item} group={'root'} formik={formik} />
      </Grid>
    )
  } else {
    return (
      <Box sx={classes.container}>
        <Box display='flex' alignItems='center' justifyContent='start'>
          <Subtitle fontWeight='700'>{`${item[0].question} ${item[0].required ? '(required)' : ''}`}</Subtitle>
        </Box>
        <Paragraph size='medium'>
          <span dangerouslySetInnerHTML={{ __html: item[0]?.options?.[0].value?.toString() || '' }}></span>
        </Paragraph>
        <Box>
          {(files || []).map((curr, index) => (
            <DocumentListItem
              file={curr}
              key={index}
              closeAction={() => {
                if (handleDelete) handleDelete(curr)
              }}
            />
          ))}
        </Box>
        <Box>
          {uploadedFiles.map((curr, index) => (
            <DocumentListItem file={curr} key={index} closeAction={() => deleteFile(curr)} />
          ))}
        </Box>
        <Box sx={classes.buttonContainer}>
          <Paragraph size='medium'>{'Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)'}</Paragraph>
          <Button disabled={disabled} style={classes.button} onClick={() => setOpen(true)}>
            <Paragraph size='medium'>Upload</Paragraph>
          </Button>
        </Box>
        {open && <DocumentUploadModal handleModem={() => setOpen(!open)} handleFile={handleFile} />}
      </Box>
    )
  }
}
