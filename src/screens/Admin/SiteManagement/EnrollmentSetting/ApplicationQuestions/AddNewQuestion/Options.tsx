import React, { useEffect, useState } from 'react'
import CloseSharp from '@mui/icons-material/CloseSharp'
import { Box, Radio, TextField, Checkbox, IconButton, outlinedInputClasses } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { QUESTION_TYPE } from '@mth/enums'
import { CustomModal } from '../../../../../../screens/Admin/SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { SYSTEM_07 } from '../../../../../../utils/constants'

type QuestionOptionProps = {
  options: Array<unknown>
  setOptions: (options: Array<unknown>) => void
  type: QUESTION_TYPE
  setFocused?: (event: Event) => void
  setBlured?: (event: Event) => void
  isDefault: boolean
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
  options,
  setOptions,
  type,
  setFocused,
  setBlured,
  isDefault,
}) => {
  const [enableAction] = useState(true)
  const [warningPopup, setWarningPopup] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [selectedValue, setValue] = useState(0)
  const [warningType, setWarningType] = useState('')

  const setCancelWarningPopup = () => {
    setWarningPopup(false)
  }

  const setConfirmWarningPopup = () => {
    if (warningType == 'DeleteOption') {
      setOptions(
        options
          .filter((o) => o.value !== currentIndex)
          .map((v, i) => ({ value: i, label: v.label.trim(), action: v.action })),
      )
    } else if (warningType == 'ChangeOption') {
      const newOps = options.map((o) => (o.value === currentIndex ? { ...o, action: selectedValue } : o))
      setOptions(newOps)
    }

    setWarningPopup(false)
  }
  useEffect(() => {
    //if(options.filter((o) => o.action === 2).length > 0) {
    //	setEnableAction(false)
    //}
    //else {
    //	setEnableAction(true)
    //}
  }, [options])

  return (
    <>
      <Box display='flex' flexDirection='column' width='100%'>
        {options.map((opt, i) => (
          <Box
            display='flex'
            width='100%'
            sx={{
              alignItems: 'center',
              justifyContent: 'space-around',
              borderBottom: `2px solid ${SYSTEM_07}`,
              opacity: opt.label.trim() || i === 0 ? 1 : 0.3,
            }}
            key={opt.value}
          >
            <Box
              key={opt.value}
              sx={{
                display: 'flex',
                py: '10px',
                alignItems: 'center',
              }}
              width='50%'
            >
              {type === QUESTION_TYPE.CHECKBOX ? (
                <Checkbox />
              ) : type === QUESTION_TYPE.MULTIPLECHOICES ? (
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
                onFocus={(v) => setFocused(v)}
                onBlur={(v) => setBlured(v)}
                onChange={(e) => {
                  const val = e.currentTarget.value
                  const newOps = options.map((o) => (o.value === opt.value ? { ...o, label: val } : o))
                  if (i === options.length - 1) {
                    setOptions([...newOps, { value: options.length + 1, label: '', action: 1 }])
                  } else {
                    setOptions(newOps)
                  }
                }}
              />
              {opt.label.trim() ? (
                <IconButton
                  sx={{
                    color: '#fff',
                    bgcolor: '#000',
                    width: '30px',
                    height: '30px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                  }}
                  onClick={() => {
                    if (isDefault) {
                      setWarningType('DeleteOption')
                      setWarningPopup(true)
                      setCurrentIndex(opt.value)
                    } else {
                      setOptions(
                        options
                          .filter((o) => o.value !== opt.value)
                          .map((v, i) => ({ value: i, label: v.label.trim(), action: v.action })),
                      )
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
                  (opt.action !== 2 && !enableAction) ||
                  opt.label.trim() == '' ||
                  options.filter((op) => op.label.trim() !== '').length < 2
                    ? actionTypes.filter((a) => a.value === 1)
                    : actionTypes
                }
                defaultValue={opt.action || 1}
                setParentValue={(v) => {
                  const val = +v
                  if (isDefault) {
                    setWarningType('ChangeOption')
                    setWarningPopup(true)
                    setCurrentIndex(opt.value)
                    setValue(val)
                  } else {
                    const newOps = options.map((o) => (o.value === opt.value ? { ...o, action: val } : o))
                    setOptions(newOps)
                  }
                }}
                size='small'
                auto={false}
              />
            </Box>
          </Box>
        ))}
      </Box>
      {warningPopup && (
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
