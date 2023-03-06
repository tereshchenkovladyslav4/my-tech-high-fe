import React, { useCallback, useEffect, useState } from 'react'
import { Button, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { useFlag } from '@unleash/proxy-client-react'
import { filter } from 'lodash'
import { DocumentListItem } from '@mth/components/DocumentUploadModal/DocumentListItem'
import { DocumentUploadModal } from '@mth/components/DocumentUploadModal/DocumentUploadModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { BUG_1719 } from '@mth/constants'
import { MthColor, PacketStatus, QUESTION_TYPE } from '@mth/enums'
import { EnrollmentQuestionItem } from '../../../Question'
import { useStyles } from './styles'
import { DocumentUploadProps } from './types'

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  packet,
  item,
  formik,
  handleUpload,
  handleDelete,
  files,
  fileName,
  disabled,
}) => {
  const classes = useStyles
  const [open, setOpen] = useState(false)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const infoctr1719 = useFlag(BUG_1719)

  const handleFile = useCallback(
    (tempFiles: File[]) => {
      const myRenamedFile = tempFiles.map((f) => {
        const fileType = f.name.split('.')[1]
        return new File([f], `${fileName}.${fileType}`, {
          type: f.type,
        })
      })
      setNewFiles((prev) => prev.concat(myRenamedFile))
    },
    [fileName],
  )

  const deleteNewFile = (currFile: File) => {
    setNewFiles(filter(newFiles, (validFile) => validFile !== currFile))
  }

  useEffect(() => {
    handleUpload(item[0].question, newFiles)
  }, [item, newFiles])

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
          <Subtitle
            fontWeight='700'
            sx={{
              color: item[0].missedInfo && !newFiles.length ? MthColor.RED : '',
            }}
          >{`${item[0].question} ${item[0].required ? '(required)' : ''}`}</Subtitle>
        </Box>
        <Paragraph size='medium'>
          <span dangerouslySetInnerHTML={{ __html: item[0]?.options?.[0].value?.toString() || '' }}></span>
        </Paragraph>
        <Box>
          {(files || []).map((curr, index) => {
            const indexedFileName = `${curr.name.split('.').slice(0, -1).join('.')}${index !== 0 ? index + 1 : ''}`
            const fileExt = curr.name.split('.').slice(-1)
            const newCurr = { ...curr, name: `${indexedFileName}.${fileExt}` }
            if (infoctr1719 && packet?.status == 'Started')
              return <DocumentListItem file={newCurr} key={index} closeAction={() => handleDelete(curr)} />
            return <DocumentListItem file={newCurr} key={index} closeAction={undefined} />
          })}
        </Box>
        <Box>
          {newFiles.map((curr, index) => {
            const fileNumber = files && files?.length > 0 ? files.length + index + 1 : index !== 0 ? index + 1 : ''
            const indexedFileName = `${curr.name.split('.').slice(0, -1).join('.')}${fileNumber}`
            const fileExt = curr.name.split('.').slice(-1)
            const newCurr = { ...curr, name: `${indexedFileName}.${fileExt}` }
            return <DocumentListItem file={newCurr} key={index} closeAction={() => deleteNewFile(curr)} />
          })}
        </Box>
        <Box sx={classes.buttonContainer}>
          <Paragraph size='medium'>{'Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)'}</Paragraph>
          {Boolean(
            packet?.status != PacketStatus.MISSING_INFO || item[0].missedInfo || (item[0].required && !files?.length),
          ) && (
            <Button disabled={disabled} style={classes.button} onClick={() => setOpen(true)}>
              <Paragraph size='medium'>Upload</Paragraph>
            </Button>
          )}
        </Box>
        {open && <DocumentUploadModal handleModem={() => setOpen(!open)} handleFile={handleFile} />}
      </Box>
    )
  }
}
