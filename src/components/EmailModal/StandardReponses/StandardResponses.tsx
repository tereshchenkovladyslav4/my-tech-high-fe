import { FormControl, FormLabel, RadioGroup, FormControlLabel, Checkbox, Radio } from '@mui/material'
import { Box } from '@mui/system'
import { fi } from 'date-fns/locale'
import { map } from 'lodash'
import React from 'react'
import { BLACK } from '../../../utils/constants'
import { Paragraph } from '../../Typography/Paragraph/Paragraph'
import { Subtitle } from '../../Typography/Subtitle/Subtitle'
import { StandardResponseTemplateType } from './types'

export const StandardResponses = ({ options, type, setBody, setStandardResponse }) => {
  const [previousValue, setPreviousValue] = React.useState('')

  const SelectionComponent = type === 'missingInfo' ? Checkbox : Radio

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
          {map(type === 'missingInfo' ? options.values : options, (option) => (
            <FormControlLabel
              value={option.title}
              control={
                <SelectionComponent
                  onChange={(e) => {
                    setStandardResponse(option)
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
