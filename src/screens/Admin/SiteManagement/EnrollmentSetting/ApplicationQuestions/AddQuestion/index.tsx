import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState } from 'react'
import { DropDown } from '../../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_07 } from '../../../../../../utils/constants'
import { ApplicationQuestion, OptionsType, QuestionTypes } from '../types'
import QuestionOptions from './Options'

export default function AddQuestionModal({
  onClose,
  editItem,
}: {
  onClose: () => void
  editItem?: ApplicationQuestion
}) {
  const { values, setValues } = useFormikContext<ApplicationQuestion[]>()
  const [question, setQuestion] = useState(editItem?.question || '')
  const [type, setType] = useState<1 | 2 | 3 | 4 | 5>(editItem?.type || 1)
  const [required, setRequired] = useState(editItem?.required || false)
  const [options, setOptions] = useState<OptionsType[]>([
    ...(editItem?.options || [{ label: '', value: 1 }]),
    { label: '', value: (editItem?.options?.length || 1) + 1 },
  ])

  const [error, setError] = useState('')
  function onSave() {
    if (question.trim() === '') {
      setError('Question is required')
      return
    } else if ([1, 3, 5].includes(type) && options.length && options[0].label.trim() === '') {
      setError('Options are required')
      return
    }
    const item = {
      id: editItem?.id,
      order: editItem?.order || values.length + 1,
      question,
      type,
      options: options.filter((v) => v.label.trim()),
      required,
    }
    if (editItem) {
      setValues(values.map((v) => (v.id === editItem.id ? item : v)))
    } else {
      setValues([...values, item])
    }

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
          bgcolor: '#EEF4F8',
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
            label='Question'
            variant='outlined'
            value={question}
            onChange={(v) => setQuestion(v.currentTarget.value)}
            focused
          />
          <DropDown
            sx={{
              minWidth: '200px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: SYSTEM_07,
              },
            }}
            labelTop
            dropDownItems={QuestionTypes}
            placeholder='Type'
            defaultValue={type}
            // @ts-ignore
            setParentValue={(v) => setType(+v)}
            size='small'
          />
        </Box>
        <Box mt='30px' width='100%' display='flex' flexDirection='column'>
          {type === 2 || type === 4 ? (
            <Box height='50px' />
          ) : (
            <QuestionOptions options={options} setOptions={setOptions} type={type} />
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '40px',
            mt: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
          }}
        >
          <Checkbox checked={required} onClick={() => setRequired(!required)} />
          <Subtitle size='small'>Required</Subtitle>
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
