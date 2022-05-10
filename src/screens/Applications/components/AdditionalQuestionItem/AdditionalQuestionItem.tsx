import React, {useState} from 'react'
import { Box, Checkbox, IconButton, outlinedInputClasses,FormControl, FormControlLabel, Radio, TextField, RadioGroup } from '@mui/material'
import { ApplicationQuestion } from './types'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { SYSTEM_05, SYSTEM_07 } from '../../../../utils/constants'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { useStyles } from '../../styles'
import { Field, FieldArray, Form, Formik, useFormik } from 'formik'
export function AdditionalQuestionItem({ question: q, field, meta, form }: { question: ApplicationQuestion, field: any, meta: any, form: any }) {
    const classes = useStyles
    const [value, setValue] = useState(1)
    const handleChange = (e) => {
        setValue(e.target.value)
    }
    // const index = values.find((i) => i.id === q.id)?.id
    function onChange(value: string) {
      // setValues(values.map((v) => (v.id === q.id ? { ...v, response: value } : v)))
    }
    if (q.type === 1) {
      return (
        <DropDown
          labelTop
          dropDownItems={q.options || []}
          placeholder={q.question}
          setParentValue={(id) => form.setFieldValue(field.name, id)}
          alternate={true}
          size='small'
          name={q.question.toLowerCase().replace(' ', '_')}
          sx={
            !!(meta.touched && Boolean(meta.error))
              ? classes.textFieldError
              : classes.dropdown
          }
          error={{
            error: !!(meta.touched && meta.error),
            errorMsg: (meta.touched &&  meta.error) as string,
          }}
        />
      )
    } else if (q.type === 2) {
      return (
        <TextField
          size='small'
          sx={
            !!(meta.touched && meta.error)
              ? classes.textFieldError
              : classes.textfield
          }
          label={q.question}
          name={q.question.toLowerCase().replace(' ', '_')}
          variant='outlined'
          focused
          inputProps={{
            style: { color: 'black' },
          }}
          InputLabelProps={{
            style: { color: SYSTEM_05 },
          }}
          {...field}
          error={meta.touched && meta.error}
          helperText={meta.touched && meta.error}
        />
      )
    } else if (q.type === 3) {
      return (
        <Box sx={{marginBottom: 1}}>
          <Subtitle
            color={SYSTEM_05}
            sx={{
              paddingLeft: '20px',
              paddingBottom: '10px',
              width: '100%',
              textAlign: 'start',
              borderBottom: '1px solid ' + SYSTEM_07,
              marginTop: 2,
              marginBottom: 1,
              wordWrap: 'break-word',
            }}
          >
            {q.question}
          </Subtitle>
          {(q.options ?? []).map((o) => (
            <Box
              key={o.value}
              display='flex'
              alignItems='center'
              sx={{
                borderBottom: '1px solid ' + SYSTEM_07,
                marginTop: '10px',
                width: '100%',
              }}
            >
              <Checkbox name={q.question.toLowerCase().replace(' ', '_')} {...field} value={o.label}/>
              {/* <Field type="checkbox" name="additional_questions.checked" value={o.label}>
              {({ field, form, meta }) => (
                <Checkbox />
              )}
              </Field> */}
              <Subtitle size='small' sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start'}}>{o.label}</Subtitle>
            </Box>
          ))}
        </Box>
      )
    } else if (q.type === 4) {
      return (
        <Box display='flex' alignItems='center' sx={{marginTop: 2, marginBottom: 1,}}>
          <Checkbox
            name={q.question.toLowerCase().replace(' ', '_')} {...field} value={true}
          />
          <Subtitle size='small' color={SYSTEM_05} sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start'}}>
            {q.question}
          </Subtitle>
        </Box>
      )
    } else if (q.type === 5) {
      return (
        <Box sx={{marginBottom: 1}}>
          <Subtitle
            sx={{
              marginTop: 2,
              marginBottom: 1,
              paddingLeft: '20px',
              paddingBottom: '10px',
              width: '100%',
              textAlign: 'start',
              borderBottom: '1px solid ' + SYSTEM_07,
              wordWrap: 'break-word'
            }}
            color={SYSTEM_05}
          >
            {q.question}
          </Subtitle>
          <FormControl
            sx={{
              width: '100%',
            }}
          >
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name={q.question.toLowerCase().replace(' ', '_')}
              {...field}
            >
              {(q.options ?? []).map((o) => (
                <Box
                  key={o.value}
                  display='flex'
                  alignItems='center'
                  sx={{
                    borderBottom: '1px solid ' + SYSTEM_07,
                    marginTop: '10px',
                    width: '100%',
                    paddingLeft: '11px',
                  }}
                >
                  <FormControlLabel value={o.label} control={<Radio />} label={o.label} />
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
          
        </Box>
      )
    }  else if (q.type === 6) {
      return (
        <TextField
          size='small'
          sx={
            !!(meta.touched && meta.error)
              ? classes.textFieldError
              : classes.textfield
          }
          InputLabelProps={{
            style: { color: SYSTEM_05 },
          }}
          label={q.question}
          variant='outlined'
          focused
          inputProps={{
            style: { color: 'black' },
          }}
          name={q.question.toLowerCase().replace(' ', '_')}
          {...field}
          error={meta.touched && meta.error}
          helperText={meta.touched && meta.error}
          type="date"
        />
      )
    } else if (q.type === 7) {
      return (
        <Paragraph size='large'>
          <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
        </Paragraph>
      )
    }
    return null
  }