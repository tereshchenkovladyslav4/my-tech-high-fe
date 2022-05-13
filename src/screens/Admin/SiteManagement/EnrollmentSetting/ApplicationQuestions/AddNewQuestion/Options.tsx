import React from 'react'
import { Box, Radio, TextField, Checkbox, IconButton, Button } from '@mui/material'
import { OptionsType } from '../types'
import { SYSTEM_07 } from '../../../../../../utils/constants'
import CloseSharp from '@mui/icons-material/CloseSharp'

export default function QuestionOptions({
  options,
  setOptions,
  type,
  isDefault,
}: {
  options: OptionsType[]
  setOptions: (options: OptionsType[]) => void
  type: 1 | 2 | 3 | 4 | 5 | 6  
  isDefault: boolean
}) {
  return (
    <Box display='flex' flexDirection='column' width='80%'>
      {options.map((opt, i) => (
        <Box
          key={opt.value}
          sx={{
            display: 'flex',
            py: '10px',
            opacity: opt.label.trim() || i === 0 ? 1 : 0.3,
          }}
        >
          {type === 3 ? <Checkbox /> : type === 5 ? <Radio /> : null}
          <TextField
            size='small'
            sx={{
              flex: 1,
              pl: '10px',
              '& .MuiInput-underline:after': {
                borderWidth: '1px',
                borderColor: SYSTEM_07,
              },
            }}
            placeholder='Add Option'
            variant='standard'
            value={opt.label}
            focused
            disabled={isDefault}
            onChange={(e) => {
              const val = e.currentTarget.value
              const newOps = options.map((o) => (o.value === opt.value ? { ...o, label: val } : o))
              if (i === options.length - 1) {
                setOptions([...newOps, { value: options.length + 1, label: '' }])
              } else {
                setOptions(newOps)
              }
            }}
          />
          {options.length > 1 ? (
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
              disabled={isDefault}
              onClick={() => {
                setOptions(
                  options.filter((o) => o.value !== opt.value).map((v, i) => ({ value: i, label: v.label.trim() })),
                )
              }}
            >
              <CloseSharp />
            </IconButton>
          ) : (
            <Box width='40px' />
          )}
        </Box>
      ))}
    </Box>
  )
}
