import React, { useState, useEffect, useContext, useCallback, ReactElement } from 'react'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import {
  Box,
  Checkbox,
  FormLabel,
  outlinedInputClasses,
  Radio,
  TextField,
  Grid,
  FormGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material'
import moment from 'moment-timezone'
import { v4 as uuidv4 } from 'uuid'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { studentEmailTaken } from '@mth/graphql/queries/email-template'
import { EnrollmentContext } from '@mth/providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SYSTEM_05, SYSTEM_07, ERROR_RED, GRADES } from '../../utils/constants'
import { toOrdinalSuffix } from '../../utils/stringHelpers'
import { EnrollmentQuestion } from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import { EnrollmentQuestionTemplateType } from './types'

export const getActiveSchoolYearsByRegionId = gql`
  query GetActiveSchoolYears($regionId: ID!) {
    getSchoolYearsByRegionId(region_id: $regionId) {
      grades
      school_year_id
    }
  }
`

export const EnrollmentQuestionItem: EnrollmentQuestionTemplateType = ({ item, formik }) => {
  const [questionItems, setQuestionItems] = useState<Array<unknown>>([<Grid key={uuidv4()}></Grid>])

  useEffect(() => {
    if (item) {
      let childsEnable = false
      setQuestionItems(
        item.map((i) => {
          if (formik.values.meta && formik.values.meta[`${i.additional_question}`]) {
            const parentIsAction = item
              .find((ii) => ii.slug == i.additional_question)
              ?.options?.filter((o) => o.action == 2)
              .find((po) =>
                Array.isArray(formik.values.meta[`${i.additional_question}`])
                  ? formik.values.meta[`${i.additional_question}`].find((fv) => fv.label == po.label)
                  : po.label == formik.values.meta[`${i.additional_question}`] ||
                    po.value == formik.values.meta[`${i.additional_question}`],
              )
            if (parentIsAction && !childsEnable) {
              return { ...i, isEnable: true }
            } else {
              childsEnable = true
              return { ...i, isEnable: false }
            }
          } else {
            return { ...i, isEnable: false }
          }
        }),
      )
    } else {
      setQuestionItems([<Grid key={uuidv4()}></Grid>])
    }
  }, [item])

  const handleAdditionalAction = (slug, value) => {
    let index = 1000
    const updateQuestionItems = questionItems?.map((q) => {
      if (q.additional_question === slug) {
        index = q.order
        return { ...q, isEnable: value }
      } else {
        if (value) {
          return q
        } else {
          if (q.order > index) {
            return { ...q, isEnable: false }
          } else {
            return q
          }
        }
      }
    })
    setQuestionItems(updateQuestionItems)
  }

  return (
    <>
      {questionItems?.map((q, index): ReactElement | undefined => {
        if ((q.additional_question && q.isEnable) || !q.additional_question) {
          if (q.type === QUESTION_TYPE.INFORMATION) {
            return (
              <Grid key={index} item xs={12} sm={6}>
                <Box display='flex' alignItems='center'>
                  <Paragraph size='large'>
                    <span dangerouslySetInnerHTML={{ __html: q.question }}></span>
                  </Paragraph>
                </Box>
              </Grid>
            )
          } else {
            return (
              <Grid key={index} item xs={12} sm={questionItems.length > 1 ? 12 : 6}>
                {q.type !== QUESTION_TYPE.AGREEMENT && (
                  <Box
                    display='flex'
                    alignItems='center'
                    width={{ xs: '100%', sm: questionItems.length > 1 ? '50%' : '100%' }}
                  >
                    <Subtitle fontWeight='500'>{q.question}</Subtitle>
                  </Box>
                )}
                <Box alignItems='center' width={{ xs: '100%', sm: questionItems.length > 1 ? '49%' : '100%' }}>
                  <Item
                    question={q}
                    setAdditionalQuestion={(slug, value) => handleAdditionalAction(slug, value)}
                    formik={formik}
                  />
                </Box>
              </Grid>
            )
          }
        } else {
          return undefined
        }
      })}
    </>
  )
}
function Item({
  question: q,
  setAdditionalQuestion,
  formik,
}: {
  question: EnrollmentQuestion
  setAdditionalQuestion: (slug: string, flag: boolean) => void
  formik: unknown
}) {
  const { me } = useContext(UserContext)
  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: me?.userRegion[0]?.region_id,
    },
    fetchPolicy: 'network-only',
  })

  const [grades, setGrades] = useState([])
  useEffect(() => {
    if (!schoolLoading && schoolYearData?.getSchoolYearsByRegionId) {
      schoolYearData.getSchoolYearsByRegionId.forEach((element) => {
        if (formik?.values?.school_year_id == element.school_year_id) {
          setGrades(element.grades?.split(','))
        }
      })
    }
  }, [me, schoolLoading, schoolYearData, formik])

  const { disabled } = useContext(EnrollmentContext)

  const keyName = q.slug?.split('_')[0]
  const fieldName = !q.slug?.includes('meta_') ? q.slug?.replace(`${keyName}_`, '') : q.slug

  const [fieldData, setFieldData] = useState(
    formik.values[`${keyName}`] ? formik.values[`${keyName}`][`${fieldName}`] : null,
  )

  useEffect(() => {
    setFieldData(formik.values[`${keyName}`] ? formik.values[`${keyName}`][`${fieldName}`] : null)
    if (q.type === QUESTION_TYPE.CHECKBOX) {
      const otherTemp = multiSelected('Other')
      if (otherTemp) {
        setOtherValue(formik.values[`${keyName}`][`${fieldName}`].find((other) => other.label == 'Other').value)
      }
    }
  }, [formik, q])
  const [otherValue, setOtherValue] = useState('')
  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])
  const [dropDownItemsData, setDropDownItemsData] = useState<Array<DropDownItem>>([])

  useEffect(() => {
    if (q.slug === 'student_grade_level') {
      setDropDownItemsData(gradesDropDownItems || [])
    } else {
      setDropDownItemsData(q.options || [])
    }
  }, [q, gradesDropDownItems])

  useEffect(() => {
    parseGrades()
  }, [grades])

  const parseGrades = () => {
    const dropDownItems = []
    GRADES.forEach((grade) => {
      if (grades?.includes(grade.toString())) {
        if (typeof grade !== 'string') {
          dropDownItems.push({
            label: toOrdinalSuffix(grade) + ' Grade',
            value: grade.toString(),
          })
        }
        if (typeof grade == 'string') {
          dropDownItems.push({
            label: grade,
            value: grade,
          })
        }
      }
    })
    setGradesDropDownItems(dropDownItems)
  }

  const multiSelected = useCallback(
    (value: string | number) => {
      let res = false
      if (q.type === QUESTION_TYPE.CHECKBOX) {
        res = Array.isArray(fieldData) && fieldData?.find((f) => f.label == value) ? true : false
      } else {
        res = fieldData?.indexOf(value) >= 0
      }
      return res
    },
    [fieldData],
  )

  useEffect(() => {
    if (
      q.type !== QUESTION_TYPE.TEXTFIELD &&
      q.type !== QUESTION_TYPE.CALENDAR &&
      keyName &&
      fieldName &&
      fieldData != undefined
    ) {
      formik.values[`${keyName}`][`${fieldName}`] = fieldData
    }
  }, [fieldData, q, keyName, fieldName])

  function getDropDownLabel(value: string | number) {
    const selected = dropDownItemsData.find((f) => f.value === value)
    return selected?.value || ''
  }

  function onChangeDropDown(value: string | number) {
    const selected = dropDownItemsData.find((f) => f.value === value)
    onChange(selected?.value)
  }

  function handleChangeOther(value: string) {
    const otherTemp = multiSelected('Other')
    if (otherTemp) {
      const updateOther = fieldData?.map((f) => (f.label === 'Other' ? { label: 'Other', value: value } : f))
      setFieldData(updateOther)
    }
    setOtherValue(value)
  }

  const onChange = useCallback(
    (value: string | number) => {
      if (q.type !== QUESTION_TYPE.TEXTFIELD && q.type !== QUESTION_TYPE.CALENDAR) {
        if (q?.options?.find((f) => f.value === value || f.label === value)?.action == 2) {
          if (q.type === QUESTION_TYPE.CHECKBOX) {
            if (Array.isArray(fieldData) && fieldData?.find((f) => f.label === value)) {
              setAdditionalQuestion(q.slug, false)
            } else {
              setAdditionalQuestion(q.slug, true)
            }
          } else {
            setAdditionalQuestion(q.slug, true)
          }
        } else {
          if (q.type === QUESTION_TYPE.CHECKBOX) {
            if (
              Array.isArray(fieldData) &&
              fieldData?.find((f) => q.options?.find((qq) => qq.action == 2 && f.label == qq.label))
            ) {
              setAdditionalQuestion(q.slug, true)
            } else {
              setAdditionalQuestion(q.slug, false)
            }
          } else {
            setAdditionalQuestion(q.slug, false)
          }
        }
        if (q.type === QUESTION_TYPE.AGREEMENT) {
          if (fieldData && fieldData.indexOf(value) >= 0) {
            setFieldData(fieldData.filter((f) => f !== value))
          } else {
            setFieldData(fieldData ? [...fieldData, value] : [value])
          }
        } else if (q.type === QUESTION_TYPE.CHECKBOX) {
          if (Array.isArray(fieldData) && fieldData?.find((f) => f.label === value)) {
            setFieldData(fieldData?.filter((f) => f.label !== value))
          } else {
            if (value === 'Other') {
              setFieldData(
                fieldData ? [...fieldData, { label: value, value: otherValue }] : [{ label: value, value: otherValue }],
              )
            } else {
              setFieldData(
                fieldData ? [...fieldData, { label: value, value: value }] : [{ label: value, value: value }],
              )
            }
          }
        } else {
          setFieldData(value)
        }
      }
    },
    [fieldData, otherValue, q],
  )

  const [checkEmail, { loading: emailLoading, data: emailData }] = useLazyQuery(studentEmailTaken, {
    fetchPolicy: 'network-only',
  })

  const [showEmailError, setShowEmailError] = useState<boolean>(false)

  useEffect(() => {
    if (!emailLoading && emailData !== undefined) {
      if (emailData.studentEmailTaken === true) {
        setShowEmailError(true)
        const response = new CustomEvent('emailTaken', { detail: { error: true } })
        document.dispatchEvent(response)
        // formik.setErrors({
        //   student: {
        //     email: (
        //       <Paragraph fontWeight='400' fontSize='0.75rem'>
        //         This email is already being used.
        //       </Paragraph>
        //     ),
        //   },
        // })
      } else {
        setShowEmailError(false)
      }
    }
  }, [emailLoading, emailData])

  if (q.type === QUESTION_TYPE.DROPDOWN) {
    return (
      <>
        <DropDown
          sx={{
            minWidth: '100%',
            [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: SYSTEM_07,
              },
            marginY: 0,
          }}
          defaultValue={getDropDownLabel(fieldData)}
          labelTop
          disabled={disabled}
          dropDownItems={dropDownItemsData}
          setParentValue={(v) => onChangeDropDown(v as string)}
          size='small'
          error={{
            error: !!(
              formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              Boolean(formik.errors[`${keyName}`][`${fieldName}`])
            ),
            errorMsg: (formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              formik.errors[`${keyName}`][`${fieldName}`]) as string,
          }}
          // error={{
          //   error: !!(formik.errors[`${keyName}`] && Boolean(formik.errors[`${keyName}`][`${fieldName}`])),
          //   errorMsg: (formik.errors[`${keyName}`] && formik.errors[`${keyName}`][`${fieldName}`]) as string,
          // }}
        />
      </>
    )
  } else if (q.type === QUESTION_TYPE.TEXTFIELD) {
    if (keyName === 'student' && fieldName === 'email') {
      return (
        <>
          <TextField
            disabled={disabled}
            name={`${keyName}.${fieldName}`}
            value={formik.values[`${keyName}`] ? formik.values[`${keyName}`][`${fieldName}`] : ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size='small'
            sx={{
              maxWidth: '100%',

              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: SYSTEM_07,
                },
            }}
            InputLabelProps={{
              style: { color: SYSTEM_05 },
            }}
            variant='outlined'
            fullWidth
            focused
            error={
              (formik.touched[`${keyName}`] &&
                Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
                formik.errors[`${keyName}`] &&
                Boolean(formik.errors[`${keyName}`][`${fieldName}`])) ||
              showEmailError
            }
            helperText={
              (formik.touched[`${keyName}`] &&
                Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
                formik.errors[`${keyName}`] &&
                formik.errors[`${keyName}`][`${fieldName}`]) as string
            }
            onKeyUp={() => {
              // TODO fix validation here
              checkEmail({
                variables: {
                  email: formik.values[`${keyName}`][`${fieldName}`] + '-' + formik.values.student.person_id,
                },
              })
            }}
          />
          {showEmailError &&
            formik.setErrors({
              ...formik.errors,
              student: {
                email: (
                  <Paragraph fontWeight='400' fontSize='0.75rem'>
                    This email is already being used.
                  </Paragraph>
                ),
              },
            })}
        </>
      )
    } else {
      return (
        <TextField
          disabled={disabled}
          name={`${keyName}.${fieldName}`}
          value={formik.values[`${keyName}`] ? formik.values[`${keyName}`][`${fieldName}`] : ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          size='small'
          sx={{
            maxWidth: '100%',

            [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: SYSTEM_07,
              },
          }}
          InputLabelProps={{
            style: { color: SYSTEM_05 },
          }}
          variant='outlined'
          fullWidth
          focused
          error={
            formik.touched[`${keyName}`] &&
            Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
            formik.errors[`${keyName}`] &&
            Boolean(formik.errors[`${keyName}`][`${fieldName}`])
          }
          helperText={
            (formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              formik.errors[`${keyName}`][`${fieldName}`]) as string
          }
        />
      )
    }
  } else if (q.type === QUESTION_TYPE.CHECKBOX) {
    return (
      <>
        <FormControl
          required
          component='fieldset'
          variant='standard'
          sx={{ width: '100%' }}
          error={
            !!(
              formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              Boolean(formik.errors[`${keyName}`][`${fieldName}`])
            )
          }
        >
          <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Grid container>
              {q.options?.map((o, index) => (
                <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={disabled}
                        checked={multiSelected(o.label)}
                        onClick={() => onChange(o.label)}
                      />
                    }
                    label={o.label}
                  />
                  {o.label === 'Other' && (
                    <TextField
                      disabled={disabled}
                      size='small'
                      sx={{
                        maxWidth: '50%',

                        [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                          {
                            borderColor: SYSTEM_07,
                          },
                      }}
                      InputLabelProps={{
                        style: { color: SYSTEM_05 },
                      }}
                      variant='outlined'
                      fullWidth
                      value={otherValue}
                      onChange={(e) => handleChangeOther(e.target.value)}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </FormControl>
        <FormLabel sx={{ marginLeft: '14px', color: ERROR_RED, fontSize: '0.75rem' }}>
          {
            (formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              formik.errors[`${keyName}`][`${fieldName}`]) as string
          }
        </FormLabel>
      </>
    )
  } else if (q.type === QUESTION_TYPE.AGREEMENT) {
    return (
      <>
        <FormControl
          required
          name='acknowledge'
          component='fieldset'
          variant='standard'
          error={
            !!(
              formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              Boolean(formik.errors[`${keyName}`][`${fieldName}`])
            )
          }
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={multiSelected(q.slug)} onClick={() => onChange(q.slug)} disabled={disabled} />
              }
              label={
                <Paragraph size='medium'>
                  {disabled == true && <p dangerouslySetInnerHTML={{ __html: q.question }}></p>}
                  {disabled == false && <p dangerouslySetInnerHTML={{ __html: q.question }}></p>}
                </Paragraph>
              }
            />
          </FormGroup>
        </FormControl>
        <FormLabel sx={{ marginLeft: '14px', color: ERROR_RED, fontSize: '0.75rem' }}>
          {
            (formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              formik.errors[`${keyName}`][`${fieldName}`]) as string
          }
        </FormLabel>
      </>
    )
  } else if (q.type === QUESTION_TYPE.MULTIPLECHOICES) {
    return (
      <>
        <FormControl
          required
          component='fieldset'
          variant='standard'
          sx={{ width: '100%' }}
          error={
            !!(
              formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              Boolean(formik.errors[`${keyName}`][`${fieldName}`])
            )
          }
        >
          <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Grid container>
              {q.options?.map((o, index) => (
                <Grid item xs={q.options.length > 3 ? 6 : 12} key={index}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={fieldData === (q.slug == 'meta_special_education' ? o.value : o.label)}
                        onClick={() => onChange(q.slug == 'meta_special_education' ? o.value : o.label)}
                        disabled={disabled}
                      />
                    }
                    label={o.label}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </FormControl>
        <FormLabel sx={{ marginLeft: '14px', color: ERROR_RED, fontSize: '0.75rem' }}>
          {
            (formik.touched[`${keyName}`] &&
              Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
              formik.errors[`${keyName}`] &&
              formik.errors[`${keyName}`][`${fieldName}`]) as string
          }
        </FormLabel>
      </>
    )
  } else if (q.type === QUESTION_TYPE.CALENDAR) {
    return (
      <TextField
        size='small'
        disabled={disabled}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name={`${keyName}.${fieldName}`}
        defaultValue={null}
        value={
          formik.values[`${keyName}`] &&
          formik.values[`${keyName}`][`${fieldName}`] &&
          moment(formik.values[`${keyName}`][`${fieldName}`]).tz('UTC').format('YYYY-MM-DD')
        }
        sx={{
          minWidth: '100%',

          [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: SYSTEM_07,
          },
        }}
        InputLabelProps={{
          style: { color: SYSTEM_05 },
        }}
        variant='outlined'
        focused
        type='date'
        error={
          !!(
            formik.touched[`${keyName}`] &&
            Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
            formik.errors[`${keyName}`] &&
            Boolean(formik.errors[`${keyName}`][`${fieldName}`])
          )
        }
        helperText={
          (formik.touched[`${keyName}`] &&
            Boolean(formik.touched[`${keyName}`][`${fieldName}`]) &&
            formik.errors[`${keyName}`] &&
            formik.errors[`${keyName}`][`${fieldName}`]) as string
        }
      />
    )
  }
  return null
}
