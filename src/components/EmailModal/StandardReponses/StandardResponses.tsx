import React from 'react'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Checkbox, Radio } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { MthColor } from '@mth/enums'
import { Paragraph } from '../../Typography/Paragraph/Paragraph'
import { Subtitle } from '../../Typography/Subtitle/Subtitle'

type StandardResponses = {
  options: { title: string }[]
  type: string
  standardResponses: { title: string }[]
  setStandardResponses: () => void
}
export const StandardResponses: React.FC<StandardResponses> = ({
  options,
  type,
  standardResponses,
  setStandardResponses,
}) => {
  const SelectionComponent = type === 'missingInfo' ? Checkbox : Radio

  const checkResponse = (title, evt) => {
    const responses = []
    if (SelectionComponent == Checkbox) {
      if (evt.target.checked) {
        for (let i = 0; i < options.length; i++) {
          if (options[i].title == title) responses.push(options[i])
          else {
            for (let j = 0; j < standardResponses.length; j++) {
              if (standardResponses[j].title == options[i].title) responses.push(standardResponses[j])
            }
          }
        }
      } else {
        for (let i = 0; i < standardResponses.length; i++) {
          if (standardResponses[i].title != title) responses.push(standardResponses[i])
        }
      }
    } else if (SelectionComponent == Radio) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].title == title && evt.target.checked) responses.push(options[i])
      }
    }
    setStandardResponses(responses)
  }

  const checkGroupResponse = (group, title, evt) => {
    const responses = []

    if (evt.target.checked) {
      for (let i = 0; i < options.length; i++) {
        for (let j = 0; j < options[i].responses.length; j++) {
          if (options[i].responses[j].title == title) responses.push(options[i].responses[j])
          else {
            for (let k = 0; k < standardResponses.length; k++) {
              if (standardResponses[k].title == options[i].responses[j].title) responses.push(standardResponses[k])
            }
          }
        }
      }
    } else {
      for (let i = 0; i < standardResponses.length; i++) {
        if (standardResponses[i].title != title) responses.push(standardResponses[i])
      }
    }
    setStandardResponses(responses)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormControl component='fieldset'>
        <FormLabel component='legend'>
          <Subtitle size='large' fontWeight='700' color={MthColor.BLACK}>
            Standard Responses
          </Subtitle>
        </FormLabel>
        <RadioGroup aria-label='gender' name='radio-buttons-group'>
          {type !== 'missingInfo' &&
            map(
              options,
              (option, index) =>
                !!option.title && (
                  <FormControlLabel
                    key={index}
                    value={option.title}
                    control={
                      <SelectionComponent
                        onChange={(e) => {
                          checkResponse(option.title, e)
                        }}
                      />
                    }
                    label={<Paragraph size='large'>{option.title}</Paragraph>}
                    style={{ fontSize: '12px' }}
                  />
                ),
            )}
          {type === 'missingInfo' &&
            map(options, (option) =>
              map(
                option.responses,
                (response, index) =>
                  !!response.title && (
                    <FormControlLabel
                      key={index}
                      value={response.title}
                      control={
                        <SelectionComponent
                          onChange={(e) => {
                            checkGroupResponse(option.title, response.title, e)
                          }}
                        />
                      }
                      label={<Paragraph size='large'>{response.title}</Paragraph>}
                      style={{ fontSize: '12px' }}
                    />
                  ),
              ),
            )}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}
