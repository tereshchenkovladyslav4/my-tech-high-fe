import { Button, IconButton, Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { Paragraph } from '../../../../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { DocumentUploadModal } from '../DocumentUploadModal/DocumentUploadModal'
import { DocumentListItem } from '../DocumentList/DocumentListItem'
import { filter, map } from 'lodash'
import CustomModal from '../../../../components/CustomModal/CustomModals'
import EditIcon from '@mui/icons-material/Edit'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { SortableHandle } from 'react-sortable-hoc'
import {  useFormikContext } from 'formik'
import { EnrollmentQuestionTab, EnrollmentQuestion } from '../../../types'
import AddUploadModal from '../../../AddUpload/index'
import EnrollmentQuestionItem from '../../../Question'

const DragHandle = SortableHandle(() => (
  <IconButton>
    <DehazeIcon />
  </IconButton>
))

export const DocumentUpload = ({ item } : {item : EnrollmentQuestion}) => {
  const classes = useStyles

  const  [open, setOpen] = useState(false)
  const [files, setFiles] = useState<undefined | File[]>()
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const handleFile = (fileName: File[]) => {setFiles(fileName)}
	const deleteFile = (currFile: File) => {
		setFiles(filter(files, (validFile) => validFile !== currFile))
	}

  const renderFiles = () => {
    return map(files, (curr) => (
      <DocumentListItem 
        file={curr}
        closeAction={deleteFile}
      />
    ))
  }
  if(item.type !== 7) {
    return (
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <EnrollmentQuestionItem item={item} group={'root'} />
      </Grid>
    )
  }
  else {
    return (
      <Box sx={classes.container}>
        <Box display='flex' alignItems='center' justifyContent='start'>
          <Subtitle fontWeight='700'>{`${item.question} ${item.required ? "(required)" : ""}`}</Subtitle>
          <Box display='inline-flex' height='40px'>
            <IconButton onClick={() => setShowEditDialog(true)}>
              <EditIcon />
            </IconButton>
  
            <IconButton onClick={() => setShowDeleteDialog(true)}>
              <DeleteForeverOutlinedIcon />
            </IconButton>
            <DragHandle />
          </Box>
        </Box>
        <Paragraph size='medium'>{item.options[0].value}</Paragraph>
        { files && renderFiles()}
        <Box sx={classes.buttonContainer}>
          <Paragraph size='medium'>{'Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)'}</Paragraph>
          <Button 
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
          /> 
        }
        {showEditDialog && <AddUploadModal onClose={() => setShowEditDialog(false)} editItem={item} />}
        {showDeleteDialog && (
          <CustomModal
            title='Delete Group'
            description='Are you sure you want to delete this group?'
            confirmStr='Delete'
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={() => {
              setShowDeleteDialog(false)
              const newValues = values.map((v) => {
                  if(v.tab_name === "Documents") {
                      const newQuestions = v.groups[0]?.questions.filter((q) => q.question !== item.question).sort((a, b) => a.order - b.order).map((item, index) => {
                          item.order = index + 1
                          return item
                      })
                      v.groups[0].questions = newQuestions
                  }
                  return v
              })
              setValues(newValues)
            }}
          />)
        }
      </Box>
    )
  }
  
}
