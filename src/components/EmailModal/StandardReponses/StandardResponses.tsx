import { FormControl, FormLabel, RadioGroup, FormControlLabel, Checkbox, Radio } from '@mui/material'
import { Box } from '@mui/system'
import { fi } from 'date-fns/locale'
import { map } from 'lodash'
import React, { useEffect } from 'react'
import { BLACK } from '../../../utils/constants'
import { Paragraph } from '../../Typography/Paragraph/Paragraph'
import { Subtitle } from '../../Typography/Subtitle/Subtitle'
import { StandardResponseTemplateType } from './types'

export const StandardResponses = ({ options, type, setBody, standardResponses, setStandardResponses }) => {
  const [previousValue, setPreviousValue] = React.useState('')

  const SelectionComponent = type === 'missingInfo' ? Checkbox : Radio
  
  const checkResponse = (title, evt) => {
    let responses = [];
    if(SelectionComponent == Checkbox) {
      if(evt.target.checked) {
        for(let i = 0; i < options.length; i++) {
          if(options[i].title == title)
            responses.push(options[i]);
          else {
            for(let j = 0; j < standardResponses.length; j++) {
              if(standardResponses[j].title == options[i].title)
                responses.push(standardResponses[j]);
            }
          }
        }
      }
      else {
        for(let i = 0; i < standardResponses.length; i++) {
          if(standardResponses[i].title != title)
            responses.push(standardResponses[i]);
        }
      }
    }
    else if(SelectionComponent == Radio) {
      for(let i = 0; i < options.length; i++) {
        if(options[i].title == title
          && evt.target.checked)
          responses.push(options[i]);
      }
    }
    setStandardResponses(responses);
  }

  const checkGroupResponse = (group, title, evt) => {
    let responses = [];
    console.log(group, title, evt);
    if(evt.target.checked) {
      for(let i = 0; i < options.length; i++) {
        for(let j = 0; j < options[i].responses.length; j++) {
          if(options[i].responses[j].title == title)
            responses.push(options[i].responses[j]);
          else {
            for(let k = 0; k < standardResponses.length; k++) {
              if(standardResponses[k].title == options[i].responses[j].title)
                responses.push(standardResponses[k]);
            }
          }
        }
      }
    }
    else {
      for(let i = 0; i < standardResponses.length; i++) {
        if(standardResponses[i].title != title)
          responses.push(standardResponses[i]);
      }
    }
    setStandardResponses(responses);
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
          <Subtitle size='large' fontWeight='700' color={BLACK}>
            Standard Responses
          </Subtitle>
        </FormLabel>
        <RadioGroup aria-label='gender' name='radio-buttons-group'>
          {type !== 'missingInfo' && map(options, (option) => (
            <FormControlLabel
              value={option.title}
              control={
                <SelectionComponent
                  onChange={(e) => {
                    checkResponse(option.title, e);
                  }}
                />
              }
              label={<Paragraph size='large'>{option.title}</Paragraph>}
              style={{ fontSize: '12px' }}
            />
          ))}
          {type === 'missingInfo' && map(options, (option) => (
            map(option.responses, (response) => (
              response.title != '' &&
                <FormControlLabel
                  value={response.title}
                  control={
                    <SelectionComponent
                      onChange={(e) => {
                        checkGroupResponse(option.title, response.title, e);
                      }}
                    />
                  }
                  label={<Paragraph size='large'>{response.title}</Paragraph>}
                  style={{ fontSize: '12px' }}
                />
            ))
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}
