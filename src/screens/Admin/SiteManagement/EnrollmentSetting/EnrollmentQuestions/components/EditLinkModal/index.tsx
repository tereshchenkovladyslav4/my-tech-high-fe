import React, { useState, useEffect } from 'react'
import {
  Modal,
  Box,
  TextField,
  Button,
  outlinedInputClasses,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { MthColor } from '@mth/enums'

type EditItem = {
  type: string
  link: string
  text: string
}

type EditModalProps = {
  onClose: () => void
  setOption: (_: EditItem) => void
  editItem?: EditItem
}

export const EditLinkModal: React.FC<EditModalProps> = ({ onClose, setOption, editItem }) => {
  const [value, setValue] = useState(editItem?.type || 'web')
  const [text, setText] = useState(editItem?.text || '')
  const [link, setLink] = useState(editItem?.link || '')
  const [errText, setErrText] = useState('')
  const [errLink, setErrLink] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  useEffect(() => {
    if (text) {
      setErrText('')
    }
  }, [text])

  useEffect(() => {
    if (link) {
      setErrLink('')
    }
  }, [link])

  const handleSend = () => {
    if (text && link) {
      setOption({ text, type: value, link })
      onClose()
    } else {
      if (text) setErrText('')
      else setErrText('Text is required')

      if (link) setErrLink('')
      else setErrLink('Address is required')
    }
  }

  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          bgcolor: '#fff',
          borderRadius: 8,
          px: 8,
          py: 4,
        }}
      >
        <Box>
          <Title>Edit Link</Title>
          <Subtitle fontWeight='500' sx={{ mt: 4 }}>
            Text to Display
          </Subtitle>
          <TextField
            size='small'
            sx={{
              maxWidth: '100%',
              mt: 2,
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: MthColor.SYSTEM_07,
                },
            }}
            InputLabelProps={{
              style: { color: MthColor.SYSTEM_05 },
            }}
            // label={q.question}
            variant='outlined'
            fullWidth
            value={text}
            onChange={(v) => setText(v.currentTarget.value)}
            focused
          />
          <Paragraph color={MthColor.RED} size='medium' fontWeight='700'>
            {errText}
          </Paragraph>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Box sx={{ width: '30%' }}>
              <Subtitle fontWeight='500'>Link to:</Subtitle>
              <FormControl sx={{ mt: 2 }}>
                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label'
                  defaultValue='web'
                  name='radio-buttons-group'
                  value={value}
                  onChange={handleChange}
                >
                  <FormControlLabel value='web' control={<Radio />} label='Web Address' />
                  <FormControlLabel value='email' control={<Radio />} label='Email Address' />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box sx={{ width: '70%' }}>
              <Subtitle fontWeight='500'>To what {value} address should this link?</Subtitle>
              <TextField
                size='small'
                sx={{
                  maxWidth: '100%',
                  mt: 2,
                  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                    {
                      borderColor: MthColor.SYSTEM_07,
                    },
                }}
                InputLabelProps={{
                  style: { color: MthColor.SYSTEM_05 },
                }}
                placeholder='enter address'
                variant='outlined'
                fullWidth
                value={link}
                onChange={(v) => setLink(v.currentTarget.value)}
                focused
              />
              <Paragraph color={MthColor.RED} size='medium' fontWeight='700'>
                {errLink}
              </Paragraph>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Button
              sx={{ width: '160px', height: '46px', background: '#E7E7E7', borderRadius: '50px', mr: 2 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              sx={{
                width: '160px',
                height: '46px',
                background: '#111',
                borderRadius: '50px',
                color: 'white',
              }}
              onClick={() => handleSend()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
