import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useEffect, useState, useRef } from 'react'
import { DropDownItem } from '../../../../../../components/DropDown/types'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_07 } from '../../../../../../utils/constants'
import { EnrollmentQuestion, EnrollmentQuestionGroup, EnrollmentQuestionTab, OptionsType, QuestionTypes } from '../types'

export default function AddQuestionModal({
  onClose,
  editItem,
}: {
  onClose: () => void
  editItem?: EnrollmentQuestion
}) {

  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const [uploadTitle, setUploadTitle ] = useState(editItem?.question || '')
  const [ fileName, setFileName ] = useState(editItem?.options[0]?.label || '')
  const [description, setDescription] = useState(editItem?.options[0]?.value || '')

  const [required, setRequired] = useState(editItem?.required || false)
  const [removable, setRemovable] = useState(editItem?.removable || false)
  const [error, setError] = useState('')

  const currentTabData = values.filter((v) => v.tab_name === "Documents")[0]

  function onSave() {
    if (fileName.trim() === '') {
      setError('File name is required')
      return
    }
    if (uploadTitle.trim() === '') {
        setError('Title is required')
        return
    }
    let newQuestions : EnrollmentQuestion[]
    if(editItem) {
        const newQuestion : EnrollmentQuestion = {
            type: 8,
            question: uploadTitle,
            order: editItem.order,
            options: [{label: fileName, value: description}],
            required,
            removable,
            validation: 0,
            default_question: false,
            display_admin: false,
            slug: editItem?.slug || `meta_${+ new Date()}`
        }
        newQuestions = currentTabData.groups[0]?.questions.map((q) => q.question === editItem.question ? newQuestion : q)

    }
    else {
        const newQuestion : EnrollmentQuestion = {
            type: 8,
            question: uploadTitle,
            order: currentTabData.groups[0]?.questions?.length + 1 || 1,
            options: [{label: fileName, value: description}],
            required,
            removable,
            validation: 0,
            display_admin: false,
            default_question: false,
            slug: editItem?.slug || `meta_${+ new Date()}`
        }
        newQuestions = currentTabData.groups[0]?.questions ? [...currentTabData.groups[0]?.questions, newQuestion] : [newQuestion]
    }
    const newGroup : EnrollmentQuestionGroup = {
        group_name: "root",
        order: 1,
        questions: newQuestions
    }
    const updatedTab = {...currentTabData, groups: [newGroup]}
    setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
    onClose()
  }

  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          bgcolor: '#fff',
          borderRadius: 8,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: '40px',
            width: '100%',
            justifyContent: 'end',
          }}
        >
          <Button sx={styles.cancelButton} onClick={() => onClose()}>
            Cancel
          </Button>
          <Button sx={styles.actionButtons} onClick={() => onSave()}>
            Save
          </Button>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '40px',
            mt: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            size='small'
            sx={{
              minWidth: '300px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: SYSTEM_07,
                },
            }}
            label='Title'
            variant='outlined'
            value={uploadTitle}
            onChange={(v) => setUploadTitle(v.currentTarget.value)}
            focused
          />
          <TextField
            size='small'
            sx={{
              minWidth: '200px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: SYSTEM_07,
                },
            }}
            label='File Name'
            variant='outlined'
            value={fileName}
            onChange={(v) => setFileName(v.currentTarget.value)}
            focused
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '40px',
            mt: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            size='small'
            sx={{
              minWidth: '300px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: SYSTEM_07,
                },
            }}
            label='Description'
            variant='outlined'
            value={description}
            onChange={(v) => setDescription(v.currentTarget.value)}
            focused
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '40px',
            mt: '40px',
            mb: '20px',
            display: 'flex',
            // alignItems: 'center',
            flexDirection: 'column',
            alignItems: 'end',
          }}
        >
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
                <Checkbox checked={required} onClick={() => setRequired(!required)} />
                <Subtitle size='small'>Required</Subtitle>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Checkbox checked={removable} onClick={() => setRemovable(!removable)} />
              <Subtitle size='small'>Removable</Subtitle>
            </Box>
          </Box>
        </Box>
        {error && <Typography color='red'>{error}</Typography>}
      </Box>
    </Modal>
  )
}

const styles = {
  actionButtons: {
    borderRadius: 4,

    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    fontWeight: 'bold',
    padding: '11px 60px',
    color: 'white',
  },
  cancelButton: {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #D23C33 0%, rgba(62, 39, 131, 0) 100%) #D23C33',
    fontWeight: 'bold',
    mr: 2,
    color: 'white',
    padding: '11px 60px',
  },
}
