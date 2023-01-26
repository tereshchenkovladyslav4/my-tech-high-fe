import React, { useState } from 'react'
import CloseSharp from '@mui/icons-material/CloseSharp'
import { Box, Radio, TextField, Checkbox, IconButton, outlinedInputClasses } from '@mui/material'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { QUESTION_TYPE } from '@mth/enums'
import { AdditionalQuestionAction } from '@mth/enums'
import { AdditionalQuestionActionList } from '../../../defaultValues'
import { optionClasses } from './styles'

type OptionsProps = {
  options: DropDownItem[] | RadioGroupOption[]
  setOptions: (options: DropDownItem[]) => void
  type: QUESTION_TYPE
  setFocused: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void
  setBlured: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void
  isDefault: boolean
}

export const Options: React.FC<OptionsProps> = ({ options, setOptions, type, setFocused, setBlured, isDefault }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const [selectedAction, setSelectedAction] = useState<AdditionalQuestionAction>(
    AdditionalQuestionAction.CONTINUE_TO_NEXT,
  )
  const [warningType, setWarningType] = useState<string>('')
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false)

  const setCancelWarningPopup = () => {
    setShowWarningModal(false)
  }

  const setConfirmWarningPopup = () => {
    if (warningType == 'DeleteOption') {
      //   setOptions([
      //     ...options
      //       ?.filter((_item, index) => index !== currentIndex)
      //       .map((v, i) => ({ value: i, label: v.label.trim(), action: v.action })),
      //   ])
    } else if (warningType == 'ChangeOption') {
      const newOptions = options.map((option, index) =>
        index === currentIndex ? { ...option, action: selectedAction } : option,
      )
      setOptions(newOptions as Array<DropDownItem>)
    }

    setShowWarningModal(false)
  }

  return (
    <>
      <Box sx={optionClasses.main}>
        {options.map((option, index) => (
          <Box
            key={`${option.value}_${index}`}
            sx={{ ...optionClasses.container, opacity: option?.label || index === 0 ? 1 : 0.3 }}
          >
            <Box sx={optionClasses.item}>
              {type === QUESTION_TYPE.CHECKBOX ? (
                <Checkbox />
              ) : type === QUESTION_TYPE.MULTIPLECHOICES ? (
                <Radio />
              ) : null}
              <TextField
                size='small'
                placeholder='Add Option'
                variant='standard'
                value={option.label}
                sx={optionClasses.textField}
                focused
                onFocus={(v) => setFocused(v)}
                onBlur={(v) => setBlured(v)}
                onChange={(e) => {
                  const val = e.currentTarget.value
                  const newOptions = options.map((o, index) =>
                    o.value === option.value
                      ? type === QUESTION_TYPE.MULTIPLECHOICES
                        ? { ...o, label: val, value: false, option_id: index + 1 }
                        : { ...o, label: val, value: type === QUESTION_TYPE.CHECKBOX ? `${val}` : val }
                      : o,
                  )
                  if (index === options.length - 1) {
                    setOptions([
                      ...newOptions,
                      { value: options.length + 1, label: '', action: AdditionalQuestionAction.CONTINUE_TO_NEXT },
                    ] as DropDownItem[])
                  } else {
                    setOptions(newOptions as DropDownItem[])
                  }
                }}
              />
              {typeof option?.label == 'string' && option?.label?.trim() ? (
                <IconButton
                  sx={optionClasses.deleteBtn}
                  onClick={() => {
                    if (isDefault) {
                      setWarningType('DeleteOption')
                      setShowWarningModal(true)
                      setCurrentIndex(index)
                    } else {
                      const newOptions = (options as DropDownItem[])
                        ?.filter((opt, i) => opt.label != option.label && i != index)
                        ?.map((v, i) => ({
                          value: i,
                          label: typeof v?.label == 'string' && v.label.trim(),
                          action: v.action,
                        }))
                      setOptions(newOptions as DropDownItem[])
                    }
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
                  (typeof option.label == 'string' && option.label.trim() == '') ||
                  (options as DropDownItem[]).filter((op) => typeof op.label == 'string' && op.label.trim() !== '')
                    .length < 2
                    ? AdditionalQuestionActionList.filter(
                        (a) => a.value === AdditionalQuestionAction.CONTINUE_TO_NEXT.toString(),
                      )
                    : AdditionalQuestionActionList
                }
                defaultValue={option.action || 1}
                setParentValue={(v) => {
                  if (isDefault) {
                    setWarningType('ChangeOption')
                    setShowWarningModal(true)
                    setCurrentIndex(index)
                    setSelectedAction(
                      v == AdditionalQuestionAction.CONTINUE_TO_NEXT
                        ? AdditionalQuestionAction.CONTINUE_TO_NEXT
                        : AdditionalQuestionAction.ASK_ADDITIONAL_QUESTION,
                    )
                  } else {
                    const newOps = options.map((o) => (o.value === option.value ? { ...o, action: v } : o))
                    setOptions(newOps as DropDownItem[])
                  }
                }}
                size='small'
                auto={false}
              />
            </Box>
          </Box>
        ))}
      </Box>
      {showWarningModal && (
        <CustomModal
          title='Default Question'
          description='You are attempting to edit a default question. You may customize the way the question is asked, but the default ask of question will remain the same in the application. Are you sure you want to edit?'
          cancelStr='No'
          confirmStr='Yes'
          onClose={() => {
            setCancelWarningPopup()
          }}
          onConfirm={() => {
            setConfirmWarningPopup()
          }}
        />
      )}
    </>
  )
}
