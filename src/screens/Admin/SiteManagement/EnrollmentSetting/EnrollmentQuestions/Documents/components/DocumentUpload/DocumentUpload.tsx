import React, { useState } from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { Button, IconButton, Grid, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { useFormikContext } from 'formik'
import { filter, map } from 'lodash'
import { SortableHandle } from 'react-sortable-hoc'
import { DocumentListItem } from '@mth/components/DocumentUploadModal/DocumentListItem'
import { DocumentUploadModal } from '@mth/components/DocumentUploadModal/DocumentUploadModal'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { CustomModal } from '../../../../components/CustomModal/CustomModals'
import { AddUploadModal } from '../../../AddUpload/index'
import { EnrollmentQuestionItem } from '../../../Question'
import { EnrollmentQuestionTab, EnrollmentQuestion } from '../../../types'
import { useStyles } from './styles'

const DragHandle = SortableHandle(() => (
  <Tooltip title='Move'>
    <IconButton>
      <DehazeIcon />
    </IconButton>
  </Tooltip>
))

export const DocumentUpload: React.FC<{ item: EnrollmentQuestion[]; specialEd: unknown }> = ({ item, specialEd }) => {
  const classes = useStyles

  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<undefined | File[]>()
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const handleFile = (fileName: File[]) => {
    setFiles(
      fileName.map((f, index) => {
        return { ...f, name: `F.Last${item[0].options?.[0].label}(${index + 1})` }
      }),
    )
  }
  const deleteFile = (currFile: File) => {
    setFiles(filter(files, (validFile) => validFile !== currFile))
  }

  const renderFiles = () => {
    return map(files, (curr) => <DocumentListItem file={curr} closeAction={() => deleteFile(curr)} />)
  }
  if (item[0].type !== QUESTION_TYPE.UPLOAD) {
    return (
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <EnrollmentQuestionItem item={item} group={'root'} />
      </Grid>
    )
  } else {
    return (
      <Box sx={classes.container}>
        <Box display='flex' alignItems='center' justifyContent='start'>
          <Subtitle fontWeight='700'>{`${item[0].question} ${item[0].required ? '(required)' : ''}`}</Subtitle>
          <Box display='inline-flex' height='40px'>
            <Tooltip title='Edit'>
              <IconButton onClick={() => setShowEditDialog(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Delete'>
              <IconButton onClick={() => setShowDeleteDialog(true)}>
                <DeleteForeverOutlinedIcon />
              </IconButton>
            </Tooltip>

            <DragHandle />
          </Box>
        </Box>
        <Paragraph size='medium'>
          <p dangerouslySetInnerHTML={{ __html: item[0].options?.[0].value?.toString() || '' }}></p>
        </Paragraph>
        {files && renderFiles()}
        <Box sx={classes.buttonContainer}>
          <Paragraph size='medium'>{'Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)'}</Paragraph>
          <Button style={classes.button} onClick={() => setOpen(true)}>
            <Paragraph size='medium'>Upload</Paragraph>
          </Button>
        </Box>
        {open && <DocumentUploadModal handleModem={() => setOpen(!open)} handleFile={handleFile} />}
        {showEditDialog && (
          <AddUploadModal onClose={() => setShowEditDialog(false)} editItem={item[0]} specialEd={specialEd} />
        )}
        {showDeleteDialog && (
          <CustomModal
            title='Delete Question'
            description='Are you sure you want to delete this question?'
            confirmStr='Delete'
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={() => {
              setShowDeleteDialog(false)
              const newValues = values.map((v) => {
                if (v.tab_name === 'Documents') {
                  const newQuestions = v.groups[0]?.questions
                    .filter((q) => q.question !== item[0].question)
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => {
                      item.order = index + 1
                      return item
                    })
                  // v.groups[0].questions = newQuestions;
                  return { ...v, groups: [{ ...v.groups[0], questions: newQuestions }] }
                }
                return v
              })

              setValues(newValues)
            }}
          />
        )}
      </Box>
    )
  }
}
