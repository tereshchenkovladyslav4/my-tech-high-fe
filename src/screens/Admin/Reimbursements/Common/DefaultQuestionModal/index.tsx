import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Modal, Typography, OutlinedInput, InputAdornment } from '@mui/material'
import { FormError } from '@mth/components/FormError'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { mthButtonClasses } from '@mth/styles/button.style'
import { REIMBURSEMENT_DEFAULT_QUESTION } from '../../defaultValues'
import { defaultQuestionClasses } from './styles'

type DefaultQuestionModalProps = {
  defaultQuestions: RadioGroupOption[]
  onClose: () => void
  onAddDefaultQuestion: (value: REIMBURSEMENT_DEFAULT_QUESTION) => void
  onCustomQuestion: () => void
}

export const DefaultQuestionModal: React.FC<DefaultQuestionModalProps> = ({
  defaultQuestions,
  onClose,
  onAddDefaultQuestion,
  onCustomQuestion,
}) => {
  const [searchField, setSearchField] = useState<string>('')
  const [selectedQuestion, setSelectedQuestion] = useState<REIMBURSEMENT_DEFAULT_QUESTION>()
  const [defaultQuestionOptions, setDefaultQuestionOptions] = useState<RadioGroupOption[]>([])
  const [showError, setShowError] = useState<boolean>(false)

  const handleAddDefaultQuestionAction = () => {
    if (selectedQuestion) {
      onAddDefaultQuestion(selectedQuestion)
    } else setShowError(true)
  }

  useEffect(() => {
    if (defaultQuestions?.length) {
      setDefaultQuestionOptions(defaultQuestions)
    }
  }, [defaultQuestions])

  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box sx={defaultQuestionClasses.container}>
        <Box sx={defaultQuestionClasses.header}>
          <Typography style={defaultQuestionClasses.title}>Default Questions</Typography>
          <Box sx={defaultQuestionClasses.search}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              fullWidth
              value={searchField}
              placeholder='Search'
              onChange={(e) => {
                setSearchField(e.target.value)
              }}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
          <Box sx={defaultQuestionClasses.body}>
            <MthRadioGroup
              ariaLabel='reimbursements_default_questions'
              options={defaultQuestionOptions}
              handleChangeOption={(value: RadioGroupOption[]) => {
                setDefaultQuestionOptions(value)
                setSelectedQuestion(value?.find((item) => item.value)?.label as REIMBURSEMENT_DEFAULT_QUESTION)
              }}
            />
            <FormError error={showError && 'Required'}></FormError>
          </Box>
          <Box sx={defaultQuestionClasses.btnGroup}>
            <Button sx={{ ...mthButtonClasses.roundSmallGray, width: '160px' }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              sx={{ ...mthButtonClasses.roundSmallDark, width: '160px' }}
              onClick={handleAddDefaultQuestionAction}
            >
              Add Default Question
            </Button>
          </Box>
          <Box sx={defaultQuestionClasses.centerBtn}>
            <Button
              sx={{ ...mthButtonClasses.xsPrimary, width: '160px' }}
              startIcon={<AddIcon />}
              onClick={onCustomQuestion}
            >
              Custom Question
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
