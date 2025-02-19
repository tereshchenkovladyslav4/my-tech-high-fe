import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  TextField,
  RadioGroup,
  FormHelperText,
} from '@mui/material'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, QUESTION_TYPE } from '@mth/enums'
import { getSchoolDistrictsByRegionId } from '@mth/graphql/queries/school-district'
import { getCountiesByRegionId } from '../../../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/services'
import { useStyles } from '../../styles'
import { ApplicationQuestionProps } from './types'

export const AdditionalQuestionItem: React.FC<ApplicationQuestionProps> = ({
  question: q,
  field,
  meta,
  form,
  handleAddQuestion,
  emptyDropdownBg,
}) => {
  const classes = useStyles

  const updateOptionsForDefaultQuestion = () => {
    //setOptions(updatedOptions)
  }
  //	address_county_id
  const { loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
    variables: { regionId: q?.region_id },
    skip: q?.slug != 'address_county_id' || !q?.region_id,
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (!countyLoading && countyData?.getCounties)
      updateOptionsForDefaultQuestion(
        countyData.getCounties.map((v) => {
          return { label: v.county_name, value: Number(v.id) }
        }),
      )
  }, [countyData])

  const { loading: schoolDistrictsDataLoading, data: schoolDistrictsData } = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: q?.region_id,
    },
    skip: q?.slug != 'address_school_district' || !q?.region_id,
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (!schoolDistrictsDataLoading && schoolDistrictsData?.schoolDistrict.length > 0)
      updateOptionsForDefaultQuestion(
        schoolDistrictsData?.schoolDistrict.map((d) => {
          return { label: d.school_district_name, value: d.school_district_name }
        }),
      )
  }, [schoolDistrictsData])
  if (q.type === QUESTION_TYPE.DROPDOWN) {
    return (
      <DropDown
        labelTop
        labelTopBgColor={emptyDropdownBg ? '' : MthColor.SYSTEM_09}
        labelTopColor={MthColor.SYSTEM_05}
        dropDownItems={q.options || []}
        // dropDownItems={options || []}
        placeholder={q.question}
        defaultValue={field.value}
        // defaultValue={q.response}
        setParentValue={(id) => {
          form.setFieldValue(field.name, id)
          handleAddQuestion(id, q)
        }}
        alternate={true}
        size='small'
        name={q.question.toLowerCase().replace(' ', '_')}
        sx={!!(meta.touched && Boolean(meta.error)) ? classes.textFieldError : classes.dropdown}
        error={{
          error: !!(meta.touched && meta.error),
          errorMsg: (meta.touched && meta.error) as string,
        }}
      />
    )
  } else if (q.type === QUESTION_TYPE.TEXTFIELD) {
    return (
      <TextField
        size='small'
        sx={!!(meta.touched && meta.error) ? classes.textFieldError : classes.textField}
        label={q.question}
        name={q.question.toLowerCase().replace(' ', '_')}
        variant='outlined'
        focused
        inputProps={{
          style: { color: 'black' },
        }}
        InputLabelProps={{
          style: { color: MthColor.SYSTEM_05 },
        }}
        {...field}
        error={meta.touched && meta.error}
        helperText={meta.touched && meta.error}
      />
    )
  } else if (q.type === QUESTION_TYPE.CHECKBOX) {
    return (
      <Box sx={{ marginY: 2 }}>
        <Subtitle
          color={MthColor.SYSTEM_05}
          sx={{
            paddingLeft: 0,
            paddingBottom: '10px',
            width: '100%',
            textAlign: 'start',
            borderBottom: '1px solid ' + MthColor.SYSTEM_07,
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
              borderBottom: '1px solid ' + MthColor.SYSTEM_07,
              width: '100%',
            }}
          >
            <Checkbox
              name={q.question.toLowerCase().replace(' ', '_')}
              {...field}
              value={o.label}
              onClick={() => handleAddQuestion(o.value, q)}
              // checked={q.response?.indexOf(o.value) >= 0}
              checked={field.value?.indexOf(o.label) >= 0}
              sx={{
                paddingLeft: 0,
                color: '#4145FF',
                '&.Mui-checked': {
                  color: '#4145FF',
                },
              }}
            />

            {/* <Field type="checkbox" name="additional_questions.checked" value={o.label}>
              {({ field, form, meta }) => (
                <Checkbox />
              )}
              </Field> */}
            <Subtitle
              size='small'
              sx={{ wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start', color: MthColor.SYSTEM_05 }}
            >
              {o.label}
            </Subtitle>
          </Box>
        ))}
        {meta.touched && meta.error && <FormHelperText sx={{ color: MthColor.RED }}>{meta.error}</FormHelperText>}
      </Box>
    )
  } else if (q.type === QUESTION_TYPE.AGREEMENT) {
    return (
      <Box>
        <Box display='flex' alignItems='center' sx={{ marginTop: 2, marginBottom: 2, '& p': { margin: 0 } }}>
          <Checkbox
            // checked={q.response === true}
            checked={field.value === true}
            onClick={(e) => handleAddQuestion(e.target.checked, q)}
            name={q.question.toLowerCase().replace(' ', '_')}
            {...field}
            value={true}
            sx={{
              paddingLeft: 0,
              paddingY: 0,
              color: '#4145FF',
              '&.Mui-checked': {
                color: '#4145FF',
              },
            }}
          />
          <Paragraph size='medium' sx={{ fontSize: 16, color: MthColor.SYSTEM_05 }}>
            <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
          </Paragraph>
        </Box>
        {meta.touched && meta.error && <FormHelperText sx={{ color: MthColor.RED }}>{meta.error}</FormHelperText>}
      </Box>
    )
  } else if (q.type === QUESTION_TYPE.MULTIPLECHOICES) {
    return (
      <Box sx={{ marginY: 2 }}>
        <Subtitle
          sx={{
            paddingLeft: 0,
            paddingBottom: '10px',
            width: '100%',
            textAlign: 'start',
            borderBottom: '1px solid ' + MthColor.SYSTEM_07,
            wordWrap: 'break-word',
          }}
          color={MthColor.SYSTEM_05}
        >
          {q.question}
        </Subtitle>
        <FormControl
          sx={{
            width: '100%',
          }}
        >
          <RadioGroup
            aria-labelledby='demo-controlled-radio-buttons-group'
            name={q.question.toLowerCase().replace(' ', '_')}
            {...field}
          >
            {q.options.map((o) => (
              <Box
                key={o.value}
                display='flex'
                alignItems='center'
                sx={{
                  borderBottom: '1px solid ' + MthColor.SYSTEM_07,
                  width: '100%',
                  paddingLeft: 0,
                }}
              >
                <FormControlLabel
                  value={q.slug == 'meta_special_education' ? o.value : o.label}
                  control={
                    <Radio
                      // checked={o.value === q.response}
                      checked={(q.slug == 'meta_special_education' ? o.value : o.label).toString() === field.value}
                      onChange={(e) => e.currentTarget.checked && handleAddQuestion(o.value, q)}
                      sx={{
                        color: '#4145FF',
                        '&.Mui-checked': {
                          color: '#4145FF',
                        },
                      }}
                    />
                  }
                  label={o.label}
                  sx={{ color: MthColor.SYSTEM_05 }}
                />
              </Box>
            ))}
          </RadioGroup>
          {meta.touched && meta.error && <FormHelperText sx={{ color: MthColor.RED }}>{meta.error}</FormHelperText>}
        </FormControl>
      </Box>
    )
  } else if (q.type === QUESTION_TYPE.CALENDAR) {
    return (
      <TextField
        size='small'
        sx={!!(meta.touched && meta.error) ? classes.textFieldError : classes.textField}
        InputLabelProps={{
          style: { color: MthColor.SYSTEM_05 },
        }}
        label={q.question}
        variant='outlined'
        focused
        inputProps={{
          style: { color: 'black' },
        }}
        name={q.question.toLowerCase().replace(' ', '_')}
        {...field}
        value={moment(field.value).tz('UTC').format('YYYY-MM-DD')}
        error={meta.touched && meta.error}
        helperText={meta.touched && meta.error}
        type='date'
      />
    )
  } else if (q.type === QUESTION_TYPE.INFORMATION) {
    return (
      <Box display='block' sx={{ marginTop: 2, marginBottom: 2, textAlign: 'center' }}>
        <Paragraph size='large' sx={{ fontSize: 16 }}>
          <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
        </Paragraph>
      </Box>
    )
  }
  return null
}
