import React, { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Modal,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  OutlinedInput,
  InputAdornment,
} from '@mui/material'
import { defaultQuestions } from '../../constant/defaultQuestions'

type DefaultQuestionModalProps = {
  onClose: () => void
  onCreate: (value: string) => void
  special_ed: boolean
}

export const DefaultQuestionModal: React.FC<DefaultQuestionModalProps> = ({
  onClose,
  onCreate,
  special_ed = false,
}) => {
  const [value, setValue] = useState(defaultQuestions[0].label)
  const [questions, setQuestions] = useState(defaultQuestions)
  const [searchField, setSearchField] = useState('')
  const handleChange = (e) => {
    setValue(e.target.value)
  }
  const handleCreate = () => {
    onCreate(value)
  }

  useEffect(() => {
    if (special_ed == true) {
      setQuestions([
        ...questions,
        {
          label: 'Special Education',
          type: 'Multiple Choices',
          slug: 'meta_special_education',
          validation: 0,
        },
      ])
    }
  }, [special_ed])

  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '641px',
          bgcolor: '#fff',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography variant='h5' style={{ fontWeight: 700 }}>
            Default Questions
          </Typography>
          <Box sx={{ marginTop: '30px', px: 6 }}>
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
          <Box sx={{ marginTop: '30px', height: '60vh', overflow: 'auto', width: '100%', textAlign: 'start', px: 4 }}>
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={value}
                onChange={handleChange}
              >
                {questions
                  .sort((a, b) => {
                    if (a.label < b.label) {
                      return -1
                    }
                    if (a.label > b.label) {
                      return 1
                    }
                    return 0
                  })
                  .filter((v) => v.label.toLowerCase().includes(searchField.toLowerCase()))
                  .map((d, index) => (
                    <FormControlLabel value={d.label} control={<Radio />} label={d.label} key={index} />
                  ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '20px' }}>
            <Button
              sx={{ width: '160px', height: '36px', background: '#E7E7E7', borderRadius: '50px' }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              sx={{
                width: '160px',
                height: '36px',
                background: '#111',
                borderRadius: '50px',
                color: 'white',
              }}
              onClick={handleCreate}
            >
              Add Question
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
