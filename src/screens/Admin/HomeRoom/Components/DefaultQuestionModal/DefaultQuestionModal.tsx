import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Modal, Typography, OutlinedInput, InputAdornment } from '@mui/material'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { mthButtonClasses } from '@mth/styles/button.style'

type DefaultQuestionModalProps = {
  onClose: () => void
  onAction: (value: 'default' | 'custom') => void
  setQuestionType: (value: RadioGroupOption[]) => void
  questionType: RadioGroupOption[]
}

export const DefaultQuestionModal: React.FC<DefaultQuestionModalProps> = ({
  onClose,
  onAction,
  setQuestionType,
  questionType,
}) => {
  const [searchField, setSearchField] = useState('')

  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '441px',
          height: 'auto',
          bgcolor: '#fff',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontWeight={700}>
            Default Questions
          </Typography>

          <Box sx={{ marginTop: '30px', px: 4 }}>
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

          <Box sx={{ marginTop: '30px', px: 2, overflowX: 'auto', height: '120px' }}>
            <MthRadioGroup
              ariaLabel='learning_log_default-questions'
              options={questionType}
              handleChangeOption={(value: RadioGroupOption[]) => {
                setQuestionType(value)
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', gap: '20px' }}>
            <Button sx={{ ...mthButtonClasses.roundGray, width: '160px' }} onClick={onClose}>
              Cancel
            </Button>
            <Button sx={{ ...mthButtonClasses.roundDark, width: '160px' }} onClick={() => onAction('default')}>
              Add Default Question
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
            <Button sx={{ ...mthButtonClasses.primary, width: '160px' }} onClick={() => onAction('custom')}>
              + Custom Question
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
