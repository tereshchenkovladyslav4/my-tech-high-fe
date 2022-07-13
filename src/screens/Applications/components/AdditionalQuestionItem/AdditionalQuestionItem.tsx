import React, {useState, useEffect} from 'react'
import { Box, Checkbox, FormControl, FormControlLabel, Radio, TextField, RadioGroup } from '@mui/material'
import { ApplicationQuestion } from './types'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { SYSTEM_05, SYSTEM_07 } from '../../../../utils/constants'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { useStyles } from '../../styles'
import { useQuery } from '@apollo/client'
import { 
	getCountiesByRegionId,
	getSchoolDistrictsByRegionId,
} from '../../../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/services'
import { QUESTION_TYPE } from '../../../../components/QuestionItem/QuestionItemProps'
export function AdditionalQuestionItem({ question: q, field, meta, form }: { question: ApplicationQuestion, field: any, meta: any, form: any }) {
    const classes = useStyles
    const [options, setOptions] = useState(q?.options || [])
    const updateOptionsForDefaultQuestion = (updatedOptions) => {
      //setOptions(updatedOptions)
    }
    //	address_county_id
    const {loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
      variables: {regionId: q?.region_id},
      skip: q?.slug != 'address_county_id' || !q?.region_id,
      fetchPolicy: 'network-only',
    });
    useEffect(() => {
      !countyLoading && countyData?.getCounties &&
        updateOptionsForDefaultQuestion(
          countyData.getCounties
            .map((v) => {return {label: v.county_name, value: Number(v.id)}})
        )
        
    }, [countyData]);
    //	packet_school_district
    const {loading: schoolDistrictsDataLoading, data: schoolDistrictsData} = useQuery(getSchoolDistrictsByRegionId, {
      variables: {
        regionId: q?.region_id,
      },
      skip: q?.slug != 'packet_school_district' || !q?.region_id,
      fetchPolicy: 'network-only',
    })
    useEffect(() => {
      console.log('schoolDistrictsData', schoolDistrictsDataLoading,schoolDistrictsData)
      !schoolDistrictsDataLoading && schoolDistrictsData?.schoolDistrict.length > 0 &&
        updateOptionsForDefaultQuestion(
          schoolDistrictsData?.schoolDistrict.map((d) => {return {label: d.school_district_name, value: d.school_district_name}})
        )
    }, [schoolDistrictsData])
    
    if (q.type === QUESTION_TYPE.DROPDOWN) {
      return (
        <DropDown
          labelTop
          dropDownItems={options || []}
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
    } else if (q.type === QUESTION_TYPE.TEXTFIELD) {
      return (
        <TextField
          size='small'
          sx={
            !!(meta.touched && meta.error)
              ? classes.textFieldError
              : classes.textField
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
    } else if (q.type === QUESTION_TYPE.CHECKBOX) {
      return (
        <Box sx={{marginY: 2}}>
          <Subtitle
            color={SYSTEM_05}
            sx={{
              paddingLeft: 0,
              paddingBottom: '10px',
              width: '100%',
              textAlign: 'start',
              borderBottom: '1px solid ' + SYSTEM_07,
              wordWrap: 'break-word',
            }}
          >
            {q.question}
          </Subtitle>
          {(options ?? []).map((o) => (
            <Box
              key={o.value}
              display='flex'
              alignItems='center'
              sx={{
                borderBottom: '1px solid ' + SYSTEM_07,
                width: '100%',
              }}
            >
              <Checkbox name={q.question.toLowerCase().replace(' ', '_')} {...field} value={o.label}
                sx={{
                  paddingLeft: 0,
                  color: '#4145FF',
                  '&.Mui-checked': {
                    color: '#4145FF'
                  }
                }} />
              {/* <Field type="checkbox" name="additional_questions.checked" value={o.label}>
              {({ field, form, meta }) => (
                <Checkbox />
              )}
              </Field> */}
              <Subtitle size='small' sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start', color: SYSTEM_05}}>{o.label}</Subtitle>
            </Box>
          ))}
        </Box>
      )
    } else if (q.type === QUESTION_TYPE.AGREEMENT) {
      return (
        <Box display='flex' alignItems='center' sx={{marginTop: 2, marginBottom: 2, '& p': {margin: 0}}}>
          <Checkbox
            name={q.question.toLowerCase().replace(' ', '_')} {...field} value={true}
            sx={{
              paddingLeft: 0,
              paddingY: 0,
              color: '#4145FF',
              '&.Mui-checked': {
                color: '#4145FF'
              }
            }}
          />
          <Paragraph size='medium' sx={{fontSize: 16, color: SYSTEM_05}}>
            <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
          </Paragraph>
        </Box>
      )
    } else if (q.type === QUESTION_TYPE.MULTIPLECHOICES) {
      return (
        <Box sx={{marginY: 2}}>
          <Subtitle
            sx={{
              paddingLeft: 0,
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
              {options.map((o) => (
                <Box
                  key={o.value}
                  display='flex'
                  alignItems='center'
                  sx={{
                    borderBottom: '1px solid ' + SYSTEM_07,
                    width: '100%',
                    paddingLeft: 0,
                  }}
                >
                  <FormControlLabel value={o.label} control={<Radio sx={{
                      color: '#4145FF',
                      '&.Mui-checked': {
                        color: '#4145FF'
                      }
                    }} />} label={o.label} sx={{color: SYSTEM_05}}/>
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
          
        </Box>
      )
    }  else if (q.type === QUESTION_TYPE.CALENDAR) {
      return (
        <TextField
          size='small'
          sx={
            !!(meta.touched && meta.error)
              ? classes.textFieldError
              : classes.textField
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
    } else if (q.type === QUESTION_TYPE.INFORMATION) {
      return (
        <Box display='block' sx={{marginTop: 2, marginBottom: 2, textAlign: 'center'}}>
          <Paragraph size='large' sx={{fontSize: 16}}>
            <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
          </Paragraph>
        </Box>
      )
    }
    return null
  }