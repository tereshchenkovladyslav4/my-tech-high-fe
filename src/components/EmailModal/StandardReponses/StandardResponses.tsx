import { FormControl, FormLabel, RadioGroup, FormControlLabel, Checkbox, Radio } from '@mui/material'
import { Box } from '@mui/system'
import { fi } from 'date-fns/locale'
import { map } from 'lodash'
import React from 'react'
import { BLACK } from '../../../utils/constants'
import { Paragraph } from '../../Typography/Paragraph/Paragraph'
import { Subtitle } from '../../Typography/Subtitle/Subtitle'
import { StandardResponseTemplateType } from './types'

export const StandardResponses: StandardResponseTemplateType = ({ options, setTemplate }) => {
  let SelectionComponent = Checkbox
  if (options.type === 'AGE_ISSUE') SelectionComponent = Radio

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormControl component='fieldset'>
        <FormLabel component='legend'>
          <Subtitle size='large' fontWeight='700' color={BLACK}>
            Standard Responses
          </Subtitle>
        </FormLabel>
        <RadioGroup aria-label='gender' name='radio-buttons-group'>
          {map(options.values, (option) => (
            <FormControlLabel
              value={option.title}
              control={
                <SelectionComponent
                  onChange={(e) => {
                    if (options.type === 'AGE_ISSUE') {
                      const currentSelected = e.target.value
                      options.values.forEach((option) => {
                        if (option.title !== currentSelected) option.checked = false
                      })
                    }
                    option.checked = !option.checked
                    setTemplate()
                  }}
                />
              }
              label={<Paragraph size='large'>{option.title}</Paragraph>}
              style={{ fontSize: '12px' }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}
