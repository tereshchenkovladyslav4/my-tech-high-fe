import { Box, Checkbox, IconButton, outlinedInputClasses, Radio, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState } from 'react'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { ApplicationQuestion } from './types'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { SortableHandle } from 'react-sortable-hoc'
import AddQuestionModal from './AddQuestion'
import { useMutation } from '@apollo/client'
import { deleteQuestionGql } from './services'
import CustomModal from './CustomModals'
import { SYSTEM_05, SYSTEM_07 } from '../../../../../utils/constants'

const DragHandle = SortableHandle(() => (
  <IconButton>
    <DehazeIcon />
  </IconButton>
))

export default function ApplicationQuestionItem({
  item,
  mainQuestion = false,
}: {
  item: ApplicationQuestion
  mainQuestion?: boolean
}) {
  const { values, setValues } = useFormikContext<ApplicationQuestion[]>()
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [deleteQuestion] = useMutation(deleteQuestionGql)
  return (
    <>
      <Box display='flex' mt='20px' alignItems='center' justifyContent='center'>
        <Box flex='1' paddingTop='10px'>
          <Item question={item} />
        </Box>
        {!mainQuestion && (
          <Box display='inline-flex' height='40px'>
            <IconButton onClick={() => setShowEditDialog(true)}>
              <EditIcon />
            </IconButton>

            <IconButton onClick={() => setShowDeleteDialog(true)}>
              <DeleteForeverOutlinedIcon />
            </IconButton>
            <DragHandle />
          </Box>
        )}
      </Box>
      {showEditDialog && <AddQuestionModal onClose={() => setShowEditDialog(false)} editItem={item} />}
      {showDeleteDialog && (
        <CustomModal
          title='Delete Question'
          description='Are you sure you want to delete this question?'
          confirmStr='Delete'
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => {
            setShowDeleteDialog(false)
            setValues(values.filter((i) => i.id !== item.id))
            deleteQuestion({ variables: { id: item.id } })
          }}
        />
      )}
    </>
  )
}
function Item({ question: q }: { question: ApplicationQuestion }) {
  const { values, errors, touched, setValues } = useFormikContext<ApplicationQuestion[]>()

  const index = values.find((i) => i.id === q.id)?.id

  function onChange(value: string) {
    setValues(values.map((v) => (v.id === q.id ? { ...v, response: value } : v)))
  }
  if (q.type === 1) {
    return (
      <DropDown
        sx={{
          marginTop: '10px',
          minWidth: '100%',
          borderColor: errors[index] ? 'red' : '',
          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: SYSTEM_07,
          },
        }}
        labelTop
        dropDownItems={q.options || []}
        placeholder={q.question}
        setParentValue={(v) => onChange(v as string)}
        alternate={true}
        size='small'
        error={{
          error: !!touched[index] && !!errors[index],
          errorMsg: !!touched[index] && !!errors[index] ? 'This field is required' : '',
        }}
      />
    )
  } else if (q.type === 2) {
    return (
      <TextField
        size='small'
        sx={{
          marginTop: '20px',
          minWidth: '100%',

          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: SYSTEM_07,
          },
        }}
        InputLabelProps={{
          style: { color: SYSTEM_05 },
        }}
        label={q.question}
        variant='outlined'
        value={q.response}
        onChange={(v) => onChange(v.currentTarget.value)}
        focused
        error={!!touched[index] && !!errors[index]}
        helperText={errors[index]}
      />
    )
  } else if (q.type === 3) {
    return (
      <Box>
        <Subtitle
          color={SYSTEM_05}
          sx={{
            paddingLeft: '20px',
            paddingBottom: '10px',
            width: '100%',
            textAlign: 'start',
            borderBottom: '1px solid ' + SYSTEM_07,
          }}
        >
          {q.question}
        </Subtitle>
        {(q.options ?? []).map((o) => (
          <Box
            key={o.value}
            display='flex'
            alignItems='center'
            sx={{
              borderBottom: '1px solid ' + SYSTEM_07,
              marginTop: '10px',
              width: '100%',
            }}
          >
            <Checkbox checked={o.value === +q.response} onClick={() => onChange(o.value + '')} />
            <Subtitle size='small'>{o.label}</Subtitle>
          </Box>
        ))}
      </Box>
    )
  } else if (q.type === 4) {
    return (
      <Box display='flex' alignItems='center'>
        <Checkbox
          checked={q.response === 'true'}
          onChange={(e) => onChange(e.currentTarget.checked ? 'true' : 'false')}
        />
        <Subtitle size='small' color={SYSTEM_05}>
          {q.question}
        </Subtitle>
      </Box>
    )
  } else if (q.type === 5) {
    return (
      <Box>
        <Subtitle
          sx={{
            paddingLeft: '20px',
            paddingBottom: '10px',
            width: '100%',
            textAlign: 'start',
            borderBottom: '1px solid ' + SYSTEM_07,
          }}
          color={SYSTEM_05}
        >
          {q.question}
        </Subtitle>

        {(q.options ?? []).map((o) => (
          <Box
            key={o.value}
            display='flex'
            alignItems='center'
            sx={{
              borderBottom: '1px solid ' + SYSTEM_07,
              marginTop: '10px',
              width: '100%',
            }}
          >
            <Radio checked={false} />
            <Subtitle size='small'>{o.label}</Subtitle>
          </Box>
        ))}
      </Box>
    )
  }

  return null
}
