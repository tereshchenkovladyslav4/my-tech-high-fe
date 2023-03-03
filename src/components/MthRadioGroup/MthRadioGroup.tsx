import React, { ReactNode } from 'react'
import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { MthColor } from '@mth/enums'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { RadioGroupOption } from './types'

type MthRadioGroupProps = {
  ariaLabel: string
  title?: string
  description?: string | null | ReactNode
  options: RadioGroupOption[]
  handleChangeOption: (value: RadioGroupOption[]) => void
  isError?: boolean
}

const MthRadioGroup: React.FC<MthRadioGroupProps> = ({
  ariaLabel,
  title,
  description,
  options,
  handleChangeOption,
  isError,
}) => {
  return (
    <Box>
      {title && (
        <Subtitle sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 700 }}>
          {title}
        </Subtitle>
      )}
      {description && (
        <Paragraph size={'large'} color={MthColor.SYSTEM_03} sx={{ paddingY: 1 }}>
          {description}
        </Paragraph>
      )}
      {isError && (
        <Subtitle sx={{ color: MthColor.RED, fontSize: '12px', fontWeight: 600, lineHeight: '20px' }}>
          Required
        </Subtitle>
      )}
      <RadioGroup aria-label={ariaLabel} name='radio-buttons-group'>
        {options?.map((option, index) => (
          <FormControlLabel
            value={option.label}
            key={index}
            control={
              <Radio
                checked={option.value}
                onChange={(e) => {
                  handleChangeOption(
                    options?.map((item) => {
                      if (item.option_id == option.option_id) {
                        return { ...item, value: e.target.checked }
                      } else {
                        return { ...item, value: false }
                      }
                    }),
                  )
                }}
              />
            }
            label={
              <Paragraph size='large' color={option?.color}>
                {option.label}
              </Paragraph>
            }
            style={{ fontSize: '12px' }}
          />
        ))}
      </RadioGroup>
    </Box>
  )
}

export default MthRadioGroup
