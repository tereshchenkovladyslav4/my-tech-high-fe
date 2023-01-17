import React, { useEffect, useState } from 'react'
import CloseSharp from '@mui/icons-material/CloseSharp'
import { Box, Radio, TextField, Checkbox, IconButton, outlinedInputClasses } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { QuestionTypes } from '@mth/constants'
import { MthColor } from '@mth/enums'

import { AssignmentQuestionType, QuestionOptionType } from '../types'

type QuestionOptionProps = {
  questionItem: AssignmentQuestionType
  options: QuestionOptionType[]
  handleQuestionList: (targetIndex: number, questionOptions: QuestionOptionType[]) => void
  handleAdditionalQuestion: (
    questionItem: AssignmentQuestionType,
    val: number,
    newOps: QuestionOptionType[],
    targetIndex: number,
  ) => void
  targetIndex: number
}
const actionTypes = [
  {
    value: 1,
    label: 'Continue to next',
  },
  {
    value: 2,
    label: 'Ask an additional question',
  },
]

export const QuestionOptions: React.FC<QuestionOptionProps> = ({
  questionItem,
  options,
  handleQuestionList,
  handleAdditionalQuestion,
  targetIndex,
}) => {
  const [questionOptions, setQuestionOptions] = useState<QuestionOptionType[]>([])

  useEffect(() => {
    if (options.length > 0) {
      setQuestionOptions(options)
    } else {
      setQuestionOptions([
        {
          value: 1,
          label: '',
          action: 1,
        },
      ])
    }
  }, [options])

  const handleQuestionOption = (options: QuestionOptionType[]) => {
    setQuestionOptions(options)
    handleQuestionList(targetIndex, options)
  }

  return (
    <>
      <Box display='flex' flexDirection='column' width='100%'>
        {questionOptions.map((opt: QuestionOptionType, i: number) => (
          <Box
            display='flex'
            width='100%'
            sx={{
              alignItems: 'center',
              justifyContent: 'space-around',
              borderBottom: `2px solid ${MthColor.SYSTEM_07}`,
              opacity: opt.label.trim() || i === 0 ? 1 : 0.3,
            }}
            key={opt.value}
          >
            <Box
              sx={{
                display: 'flex',
                py: '10px',
                alignItems: 'center',
              }}
              width='50%'
            >
              {questionItem.type === QuestionTypes.CHECK_BOX ? (
                <Checkbox />
              ) : questionItem.type === QuestionTypes.MULTIPLE_CHOSE ? (
                <Radio />
              ) : null}
              <TextField
                size='small'
                sx={{
                  flex: 1,
                  p: '5px',
                  pl: '10px',
                  '& .MuiInput-underline:after': {
                    borderWidth: '0px',
                    borderColor: 'transparent',
                  },
                  '& .MuiInput-underline:before': {
                    borderWidth: '0px',
                    borderColor: 'transparent',
                  },
                  '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                    borderWidth: '0px',
                    borderColor: 'transparent',
                  },
                  '& :hover': {
                    borderWidth: '0px',
                    borderColor: 'transparent',
                  },
                }}
                placeholder='Add Option'
                variant='standard'
                value={opt.label}
                focused
                onChange={(e) => {
                  const val = e.currentTarget.value
                  const newOps = questionOptions.map((o) => (o.value === opt.value ? { ...o, label: val } : o))
                  if (i === questionOptions.length - 1) {
                    handleQuestionOption([...newOps, { value: questionOptions.length + 1, label: '', action: 1 }])
                  } else {
                    handleQuestionOption(newOps)
                  }
                }}
              />
              {opt.label.trim() ? (
                <IconButton
                  sx={{
                    color: MthColor.WHITE,
                    bgcolor: MthColor.BLACK,
                    width: '30px',
                    height: '30px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                  }}
                  onClick={() => {
                    handleQuestionOption(
                      questionOptions
                        .filter((o) => o.value !== opt.value)
                        .map((v, i) => ({ value: i + 1, label: v.label.trim(), action: v.action })),
                    )
                  }}
                >
                  <CloseSharp />
                </IconButton>
              ) : (
                <Box width='40px' />
              )}
            </Box>
            <Box width='30%'>
              <DropDown
                sx={{
                  minWidth: '200px',
                  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                    {
                      borderColor: 'transparent',
                    },
                }}
                labelTop
                dropDownItems={
                  // (opt.action !== 2 && !enableAction) ||
                  opt.label.trim() == '' || questionOptions.filter((op) => op.label.trim() !== '').length < 2
                    ? actionTypes.filter((a) => a.value === 1)
                    : actionTypes
                }
                defaultValue={opt.action || 1}
                setParentValue={(v) => {
                  const val = +v
                  const newOps = questionOptions.map((o) => (o.value === opt.value ? { ...o, action: val } : o))
                  setQuestionOptions(newOps)
                  handleAdditionalQuestion(questionItem, val, newOps, targetIndex)
                }}
                size='small'
                auto={false}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </>
  )
}
