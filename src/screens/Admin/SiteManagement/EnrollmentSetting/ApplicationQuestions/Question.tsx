import { Box, Checkbox, IconButton, outlinedInputClasses, Radio, TextField, FormGroup, FormControl, FormControlLabel, Tooltip, inputLabelClasses } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState, useContext } from 'react'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { ApplicationQuestion } from './types'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { SortableHandle } from 'react-sortable-hoc'
import AddNewQuestionModal from './AddNewQuestion'
import CustomModal from '../components/CustomModal/CustomModals'
import { SYSTEM_05, SYSTEM_07 } from '../../../../../utils/constants'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { ProgramYearContext } from '../provider/ProgramYearProvider'

const DragHandle = SortableHandle(() => (
  <Tooltip title="Move">
    <IconButton>
      <DehazeIcon />
    </IconButton>
  </Tooltip>
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

  return (
    <>
      <Box display='flex' mt='20px' alignItems='center' justifyContent='center'>
        <Box flex='1' paddingTop='10px' maxWidth={'80%'}>
          <Item question={item} />
        </Box>
        {!mainQuestion && (
          <Box display='inline-flex' paddingTop='10px' height='40px' alignItems='center' justifyContent='center'>
            <Tooltip title="Edit">
              <IconButton onClick={() => setShowEditDialog(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton onClick={() => setShowDeleteDialog(true)}>
                <DeleteForeverOutlinedIcon />
              </IconButton>
            </Tooltip>
            <DragHandle />
          </Box>
        )}
      </Box>
      {showEditDialog && <AddNewQuestionModal onClose={() => setShowEditDialog(false)} editItem={item} />}
      {showDeleteDialog && (
        <CustomModal
          title='Delete Question'
          description='Are you sure you want to delete this question?'
          confirmStr='Delete'
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => {
            setShowDeleteDialog(false)
            setValues(values.filter((i) => i.question !== item.question))
          }}
        />
      )}
    </>
  )
}
function Item({ question: q }: { question: ApplicationQuestion }) {
  const { values, errors, touched } = useFormikContext<ApplicationQuestion[]>()
  const { setProgramYear } = useContext(ProgramYearContext)

  const index = values.find((i) => i.id === q.id)?.id

  function onChange(value: string) {
    if(q.slug === 'program_year') {
      setProgramYear(value)
    }
  }
  if (q.type === 1) {
    return (
      <DropDown
        sx={{
          // marginTop: '10px',
          minWidth: '100%',
          maxWidth: '100%',
          borderColor: errors[index] ? 'red' : '',
          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: SYSTEM_07,
            borderWidth: '2px'
          },
          [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
            transform: 'translate(14px, -11px) scale(1)'
          },
          [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
            fontSize: 16
          }
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
          marginTop: '10px',
          minWidth: '100%',
          maxWidth: '100%',
          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: SYSTEM_07,
          },
          [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
            transform: 'translate(14px, -11px) scale(1)'
          },
          [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
            fontSize: 16
          }
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
            paddingLeft: 0,
            paddingBottom: '10px',
            width: '100%',
            maxWidth: '100%',
            textAlign: 'start',
            wordWrap: 'break-word',
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
            <Checkbox checked={o.value === +q.response} onClick={() => onChange(o.value + '')}
              sx={{
                paddingLeft: 0,
                color: '#4145FF',
                '&.Mui-checked': {
                  color: '#4145FF'
                }
              }} />
            <Subtitle size='small' sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start',}}>{o.label}</Subtitle>
          </Box>
        ))}
      </Box>
    )
  } else if (q.type === 4) {
    return (
      <Box display="flex" alignItems='center'>
        <Checkbox checked={q.response == 'true'} onClick={() => {}}
          sx={{
            paddingLeft: 0,
            color: '#4145FF',
            '&.Mui-checked': {
              color: '#4145FF'
            }
          }} />
        <Paragraph size='large' sx={{fontSize: 16}}>
            <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
        </Paragraph>
      </Box>
    )
  } else if (q.type === 5) {
    return (
      <Box>
        <Subtitle
          sx={{
            paddingLeft: 0,
            paddingBottom: '10px',
            width: '100%',
            textAlign: 'start',
            borderBottom: '1px solid ' + SYSTEM_07,
            wordWrap: 'break-word',
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
            <Radio checked={false}
              sx={{
                paddingLeft: 0,
                color: '#4145FF',
                '&.Mui-checked': {
                  color: '#4145FF'
                }
              }} />
            <Subtitle size='small' sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start'}}>{o.label}</Subtitle>
          </Box>
        ))}
      </Box>
    )
  }
  else if (q.type === 6) {
    return (
      <TextField
        size='small'
        sx={{
          marginTop: '10px',
          minWidth: '100%',
          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: SYSTEM_07,
          },
          [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
            transform: 'translate(14px, -11px) scale(1)'
          },
          [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
            fontSize: 16
          }
        }}
        InputLabelProps={{
          style: { color: SYSTEM_05 },
        }}
        label={q.question}
        variant='outlined'
        value={q.response}
        onChange={(v) => onChange(v.currentTarget.value)}
        focused
        type="date"
        error={!!touched[index] && !!errors[index]}
        helperText={errors[index]}
      />
    )
  }
  else if (q.type === 7) {
    return (
      <Paragraph size='large' sx={{fontSize: 16}}>
          <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
      </Paragraph>
    )
  }

  return null
}
