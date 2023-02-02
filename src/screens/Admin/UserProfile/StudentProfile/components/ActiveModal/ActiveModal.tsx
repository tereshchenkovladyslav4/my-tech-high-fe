import React, { useState } from 'react'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { Box, Button, FormControl, FormControlLabel, Modal, Radio, RadioGroup, Typography } from '@mui/material'
import { ActivateOption } from '@mth/enums'

type ActiveModalProps = {
  title: string
  description: string
  subDescription?: string
  onClose: () => void
  onActive: (value: number) => void
  confirmStr?: string
  cancelStr?: string
  backgroundColor?: string
}

export const ActiveModal: React.FC<ActiveModalProps> = ({
  title,
  description,
  subDescription,
  onClose,
  onActive,
  confirmStr = 'Confirm',
  cancelStr = 'Cancel',
  backgroundColor = '#FFFFFF',
}) => {
  const [activeOption, setActiveOption] = useState<ActivateOption>(ActivateOption.DELETE_WITHDRAWAL_FORM)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveOption(parseInt(e.target.value))
  }

  const handleWithdraw = () => {
    onActive(activeOption)
  }
  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '550px',
          height: 'auto',
          bgcolor: backgroundColor ? backgroundColor : '#EEF4F8',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontWeight='bold'>
            {title}
          </Typography>
          <InfoIcon sx={{ fontSize: 50, margin: '20px 0px' }} />
          <Typography fontWeight={'bold'}>{description}</Typography>
          {subDescription && <Typography>{subDescription}</Typography>}
          <Box sx={{ marginTop: '30px' }}>
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={activeOption}
                onChange={handleChange}
              >
                <FormControlLabel
                  value={ActivateOption.DELETE_WITHDRAWAL_FORM}
                  control={<Radio />}
                  label='Delete Withdraw Form from Records'
                />
                <FormControlLabel
                  value={ActivateOption.KEEP_WITHDRAWAL_FORM}
                  control={<Radio />}
                  label='Keep Withdraw Form'
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '20px' }}>
            <Button
              sx={{ width: '160px', height: '36px', background: '#E7E7E7', borderRadius: '50px' }}
              onClick={onClose}
            >
              {cancelStr}
            </Button>
            <Button
              sx={{
                width: '160px',
                height: '36px',
                background: '#43484F',
                borderRadius: '50px',
                color: 'white',
              }}
              onClick={handleWithdraw}
            >
              {confirmStr}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
