import React, { useState, useContext } from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Checkbox,
  IconButton,
  outlinedInputClasses,
  Radio,
  TextField,
  Tooltip,
  inputLabelClasses,
} from '@mui/material'
import { useFormikContext } from 'formik'
import { SortableHandle } from 'react-sortable-hoc'
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { SYSTEM_05, SYSTEM_07 } from '../../../../../utils/constants'

import { ProgramYearContext } from '../provider/ProgramYearProvider'
import { AddNewQuestionModal } from './AddNewQuestion'
import { ApplicationQuestion } from './types'

type ApplicationQuestionItemProps = {
  questions: ApplicationQuestion[]
  mainQuestion?: boolean
  questionTypes: unknown[]
  additionalQuestionTypes: unknown[]
  hasAction: boolean
}

const DragHandle = SortableHandle(() => (
  <Tooltip title='Move'>
    <IconButton>
      <DehazeIcon />
    </IconButton>
  </Tooltip>
))

export const ApplicationQuestionItem: React.FC<ApplicationQuestionItemProps> = ({
  questions,
  questionTypes,
  additionalQuestionTypes,
  hasAction,
}) => {
  const { values, setValues } = useFormikContext<ApplicationQuestion[]>()
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <>
      <Box display='flex' mt='20px' alignItems='center' justifyContent='center'>
        <Box flex='1' paddingTop='10px' maxWidth={'80%'}>
          <Item question={questions[0]} />
        </Box>
        {hasAction && !questions[0]?.main_question && (
          <Box display='inline-flex' paddingTop='10px' height='40px' alignItems='center' justifyContent='center'>
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
        )}
      </Box>
      {showEditDialog && (
        <AddNewQuestionModal
          onClose={() => setShowEditDialog(false)}
          questions={questions}
          questionTypes={questionTypes}
          additionalQuestionTypes={additionalQuestionTypes}
        />
      )}
      {showDeleteDialog && (
        <CustomConfirmModal
          header='Delete Question'
          content='Are you sure you want to delete this question?'
          handleConfirmModalChange={(isOk: boolean) => {
            setShowDeleteDialog(false)
            if (isOk) {
              setValues(values.filter((i) => i.id !== questions[0].id))
            }
          }}
        />
      )}
    </>
  )
}
function Item({ question: q }: { question: ApplicationQuestion }) {
  const { values, setValues, errors, touched } = useFormikContext<ApplicationQuestion[]>()
  const { setProgramYear, schoolYears, gradesDropDownItems } = useContext(ProgramYearContext)
  const index = values.find((i) => i.id === q.id)?.id

  //	Response
  const onChange = (value) => {
    if (q.question === 'Program Year') {
      setProgramYear(value)
    } else {
      if (q.type == QUESTION_TYPE.CHECKBOX) {
        if (q.response.indexOf(value) >= 0) {
          q.response = q.response.replace(value, '')
        } else {
          q.response += value
        }
        value = q.response
      }
      const newValues = values.map((v) =>
        v.id == q.id
          ? {
              ...v,
              response: value,
            }
          : v,
      )
      // let current = q
      // while (
      //   newValues.find((x) => current.slug == x.additionalQuestion) &&
      //   (current.response == '' ||
      //     current.options.find((x) => x.value == current.response || current.response.toString().indexOf(x.value) >= 0)
      //       .action != 2)
      // ) {
      //   current = newValues.find((x) => current.slug == x.additionalQuestion)
      //   current.response = ''
      // }

      newValues.forEach((item: ApplicationQuestion, index: number) => {
        if (item.additional_question) {
          const parent = newValues.find((x) => item.additional_question == x.slug)
          if (
            parent?.response &&
            parent.options.find((x) => x.value == parent.response || parent.response.toString().indexOf(x.value) >= 0)
              .action == 2 &&
            parent?.active
          ) {
            newValues[index] = {
              ...item,
              active: true,
            }
          } else {
            newValues[index] = {
              ...item,
              active: false,
            }
          }
        } else {
          newValues[index] = item
        }
      })

      setValues(newValues)
    }
  }

  if (q.type === QUESTION_TYPE.DROPDOWN) {
    const dropItems =
      q.question === 'Program Year'
        ? schoolYears
        : q.slug === 'student_grade_level'
        ? gradesDropDownItems
        : q.options || []
    return (
      <DropDown
        sx={{
          // marginTop: '10px',
          minWidth: '100%',
          maxWidth: '100%',
          borderColor: errors[index] ? 'red' : '',
          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: SYSTEM_07,
            borderWidth: '2px',
          },
          [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
            transform: 'translate(14px, -11px) scale(1)',
          },
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: SYSTEM_07,
            borderWidth: '2px',
          },
          [`& .${inputLabelClasses.root}.${inputLabelClasses.shrink}`]: {
            transform: 'translate(14px, -11px) scale(1)',
          },
          [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
            fontSize: 16,
          },
        }}
        labelTop
        dropDownItems={dropItems}
        placeholder={q.question}
        setParentValue={(v) => onChange(v as string)}
        alternate={true}
        defaultValue={q.response}
        size='small'
        error={{
          error: !!touched[index] && !!errors[index],
          errorMsg: !!touched[index] && !!errors[index] ? 'This field is required' : '',
        }}
      />
    )
  } else if (q.type === QUESTION_TYPE.TEXTFIELD) {
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
            transform: 'translate(14px, -11px) scale(1)',
          },
          [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
            fontSize: 16,
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
  } else if (q.type === QUESTION_TYPE.CHECKBOX) {
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
            <Checkbox
              checked={q.response?.indexOf(o.value) >= 0}
              onClick={() => onChange(o.value)}
              sx={{
                paddingLeft: 0,
                color: '#4145FF',
                '&.Mui-checked': {
                  color: '#4145FF',
                },
              }}
            />
            <Subtitle
              size='small'
              sx={{ wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start', color: SYSTEM_05 }}
            >
              {o.label}
            </Subtitle>
          </Box>
        ))}
      </Box>
    )
  } else if (q.type === QUESTION_TYPE.AGREEMENT) {
    return (
      <Box display='flex' alignItems='center'>
        <Checkbox
          checked={q.response === true}
          onChange={(e) => onChange(e.currentTarget.checked)}
          sx={{
            paddingLeft: 0,
            color: '#4145FF',
            '&.Mui-checked': {
              color: '#4145FF',
            },
          }}
        />
        <Paragraph size='large' sx={{ fontSize: 16, color: SYSTEM_05 }}>
          <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
        </Paragraph>
      </Box>
    )
  } else if (q.type === QUESTION_TYPE.MULTIPLECHOICES) {
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
            <Radio
              checked={o.value === q.response}
              onChange={(e) => e.currentTarget.checked && onChange(o.value)}
              sx={{
                paddingLeft: 0,
                color: '#4145FF',
                '&.Mui-checked': {
                  color: '#4145FF',
                },
              }}
            />
            <Subtitle
              size='small'
              sx={{ wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start', color: SYSTEM_05 }}
            >
              {o.label}
            </Subtitle>
          </Box>
        ))}
      </Box>
    )
  } else if (q.type === QUESTION_TYPE.CALENDAR) {
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
            transform: 'translate(14px, -11px) scale(1)',
          },
          [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
            fontSize: 16,
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
        type='date'
        error={!!touched[index] && !!errors[index]}
        helperText={errors[index]}
      />
    )
  } else if (q.type === QUESTION_TYPE.INFORMATION) {
    return (
      <Paragraph size='large' sx={{ fontSize: 16 }}>
        <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
      </Paragraph>
    )
  }

  return null
}
