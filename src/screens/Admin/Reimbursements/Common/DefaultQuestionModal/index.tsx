import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Modal, Typography, OutlinedInput, InputAdornment } from '@mui/material'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { mthButtonClasses } from '@mth/styles/button.style'
import { defaultQuestionClasses } from './styles'

type DefaultQuestionModalProps = {
  defaultQuestions: RadioGroupOption[]
  onClose: () => void
  onAddDefaultQuestion: (value: string | number) => void
  onCustomQuestion: () => void
}

export const DefaultQuestionModal: React.FC<DefaultQuestionModalProps> = ({
  defaultQuestions,
  onClose,
  onAddDefaultQuestion,
  onCustomQuestion,
}) => {
  const [searchField, setSearchField] = useState<string>('')
  const [selectedQuestion, setSelectedQuestion] = useState<string | number>('')
  const [defaultQuestionOptions, setDefaultQuestionOptions] = useState<RadioGroupOption[]>([])

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
                setSelectedQuestion(value?.find((item) => item.value)?.option_id || '')
              }}
            />
          </Box>

          <Box sx={defaultQuestionClasses.btnGroup}>
            <Button sx={{ ...mthButtonClasses.roundSmallGray, width: '160px' }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              sx={{ ...mthButtonClasses.roundSmallDark, width: '160px' }}
              onClick={() => onAddDefaultQuestion(selectedQuestion)}
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
