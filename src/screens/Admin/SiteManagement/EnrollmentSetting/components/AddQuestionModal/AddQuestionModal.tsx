import React, { useState } from 'react'
import { Box, Button, Modal, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'

type AddQuestionModalProps = {
  onClose: () => void
  onCreate: (value: string) => void
}
export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ onClose, onCreate }) => {
  const [value, setValue] = useState('default')
  const handleChange = (e) => {
    setValue(e.target.value)
  }
  const handleCreate = () => {
    onCreate(value)
  }
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
          <Typography variant='h5'>Add Question</Typography>
          {/* <Typography>{description}</Typography> */}
          <Box sx={{ marginTop: '30px' }}>
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel value='default' control={<Radio />} label='Use a default question' />
                <FormControlLabel value='new' control={<Radio />} label='Create a new question' />
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
              Create Question
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
