import React from 'react'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Box } from '@mui/system'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { studentInfoClassess } from '../StudentInfo/styles'
import { DiplomaSeekingProps } from '../types'
import { diplomaSeekingClassess } from './styles'

const DiplomaSeeking: React.FC<DiplomaSeekingProps> = ({ title, description, options, setOptions }) => {
  return (
    <Box sx={diplomaSeekingClassess.main}>
      <Subtitle sx={{ ...studentInfoClassess.text, fontWeight: 500 }}>{title}</Subtitle>
      <Paragraph size={'large'} color={'#ccc'} sx={{ paddingY: 1 }}>
        {description}
      </Paragraph>
      <RadioGroup aria-label='diploma-seeking' name='radio-buttons-group'>
        {options?.map((option, index) => (
          <FormControlLabel
            value={option.label}
            key={index}
            control={
              <Radio
                onChange={(e) => {
                  setOptions(
                    options?.map((item) => {
                      if (item.label == option.label) {
                        return { ...item, value: e.target.checked }
                      } else {
                        return item
                      }
                    }),
                  )
                }}
              />
            }
            label={<Paragraph size='large'>{option.label}</Paragraph>}
            style={{ fontSize: '12px' }}
          />
        ))}
      </RadioGroup>
    </Box>
  )
}

export default DiplomaSeeking
