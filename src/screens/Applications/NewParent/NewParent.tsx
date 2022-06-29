import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Box, Button, Card, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../components/Typography/Title/Title'
import {
  checkEmailQuery,
  newParentApplicationMutation,
  getActiveSchoolYearsByRegionId,
  getQuestionsGql,
} from './service'
import { useStyles } from '../styles'
import BGSVG from '../../../assets/ApplicationBG.svg'
import { DASHBOARD, GRADES, MTHBLUE, RED, SYSTEM_05 } from '../../../utils/constants'
import { NewApplicationFooter } from '../../../components/NewApplicationFooter/NewApplicationFooter'
import { Field, FieldArray, Form, Formik } from 'formik'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { getAllRegion } from '../../../graphql/queries/region'
import { LoadingScreen } from '../../LoadingScreen/LoadingScreen'
import { map, toNumber } from 'lodash'
import { toOrdinalSuffix, isNumber } from '../../../utils/stringHelpers'
import moment from 'moment'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { object, string } from 'yup'
import { ApplicationQuestion } from '../components/AdditionalQuestionItem/types'
import { AdditionalQuestionItem } from '../components/AdditionalQuestionItem/AdditionalQuestionItem'
import { omit } from 'lodash'
import { QUESTION_TYPE } from '../../../components/QuestionItem/QuestionItemProps'

export type StudentInput = {
  first_name: string
  last_name: string
  program_year: string
  grade_level: string
}

export const NewParent = () => {
  const classes = useStyles
  const [emptyStudent, setEmptyStudent] = useState({ first_name: '', last_name: '', grade_level: undefined, meta: {}, packet: {}, address: {} })
  const initSchema = {
    state: string().required('State is required'),
    programYear: string().required('Grade Level is required'),
  }
  const [validationSchema, setValidationSchema] = useState()
  const [availableRegions, setAvailableRegions] = useState([])
  const [regionId, setRegionId] = useState('')
  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([])
  const [showEmailError, setShowEmailError] = useState(false)
  const [schoolYearsData, setSchoolYearsData] = useState([])
  const [midYearApplication, setMidYearApplication] = useState<boolean>(false)
  const [grades, setGrades] = useState<string[]>([])
  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])
  const [birthDateCut, setBirthDateCut] = useState<string>('')
  const [showConfirmationText, setShowConfirmationText] = useState(false)
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([])

  const { loading: questionLoading, data: questionData } = useQuery(getQuestionsGql, {
    variables: { input: { region_id: Number(regionId) } },
    fetchPolicy: 'network-only',
  })
  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: regionId,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!questionLoading && questionData?.getApplicationQuestions) {
      setQuestions(
        questionData.getApplicationQuestions
          .map((v) => ({ ...v, options: v.options ? JSON.parse(v.options || '[]') : [] }))
          .sort((a, b) => a.order - b.order),
      )
    }
  }, [questionData, regionId, questionLoading])

  useEffect(() => {
    if (questions.length > 0) {
      let empty: any = { ...emptyStudent }
      let valid_student: any = {}
      let valid_student_meta: any = {}
      let valid_student_address: any = {}
      let valid_student_packet: any = {}
      let valid_parent: any = {}
      let valid_address: any = {}
      let valid_packet: any = {}
      let valid_meta: any = {}
      questions.map((q) => {
        if (q.type !== QUESTION_TYPE.INFORMATION) {
          if (q.slug?.includes('student_')) {
            empty[`${q.slug?.replace('student_', '')}`] = ''
            if (q.required) {
              if (q.slug?.toLocaleLowerCase().includes('emailconfrim')) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .string()
                  .required('Email is required')
                  .oneOf([yup.ref('email')], 'Emails do not match')
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .array()
                  .min(1, `${q.question} is required`)
                  .required(`${q.question} is required`)
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                  .boolean()
                  .oneOf([true], 'This field must be checked')
              } else {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup.string().required(`${q.question} is required`)
              }
            }
          } else if (q.slug?.includes('parent_')) {
            if (q.required) {
              if (q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  .required('Email is required')
                  .oneOf([yup.ref('email')], 'Emails do not match')
              } else if (q.validation === 1) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .required('Email is required')
              } else if (q.validation === 2) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .string()
                  // .matches(isPhoneNumber, 'Phone number is invalid')
                  // .test('max_spacing_interval', 'Phone number is invalid', function (value) {
                  //   if (value !== undefined) {
                  //     return this.parent.phone_number.replaceAll('-', '').length >= 13
                  //   }
                  // })
                  // .required('Phone number is required')
                  .required(`${q.question} is required`)
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: any) => {
                    return isNumber.test(value)
                  })
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .array()
                  .min(1, `${q.question} is required`)
                  .required(`${q.question} is required`)
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                  .boolean()
                  .oneOf([true], 'This field must be checked')
              } else {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string().required(`${q.question} is required`)
              }
            }
          } else if (q.slug?.includes('meta_') && q.required) {
            if (q.student_question) {
              empty['meta'][`${q.slug}`] = ''
              if (q.validation === 1) {
                valid_student_meta[`${q.slug}`] = yup
                  .string()
                  .email('Enter a valid email')
                  .required('Email is required')
              } else if (q.validation === 2) {
                valid_student_meta[`${q.slug}`] = yup
                  .string()
                  .required(`${q.question} is required`)
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: any) => {
                    return isNumber.test(value)
                  })
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_student_meta[`${q.slug}`] = yup
                  .array()
                  .min(1, `${q.question} is required`)
                  .required(`${q.question} is required`)
                  .nullable()
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_student_meta[`${q.slug}`] = yup.boolean().oneOf([true], 'This field must be checked')
              } else {
                valid_student_meta[`${q.slug}`] = yup.string().required(`${q.question} is required`)
              }
            } else {
              if (q.validation === 1) {
                valid_meta[`${q.slug}`] = yup.string().email('Enter a valid email').required('Email is required')
              } else if (q.validation === 2) {
                valid_meta[`${q.slug}`] = yup
                  .string()
                  .required(`${q.question} is required`)
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: any) => {
                    return isNumber.test(value)
                  })
              } else if (q.type === QUESTION_TYPE.CHECKBOX) {
                valid_meta[`${q.slug}`] = yup
                  .array()
                  .min(1, `${q.question} is required`)
                  .required(`${q.question} is required`)
                  .nullable()
              } else if (q.type === QUESTION_TYPE.AGREEMENT) {
                valid_meta[`${q.slug}`] = yup.boolean().oneOf([true], 'This field must be checked')
              } else {
                valid_meta[`${q.slug}`] = yup.string().required(`${q.question} is required`)
              }
            }
          }
          else if (q.slug?.includes('address_') && q.required){
            if (!q.student_question) {
              if (q.validation === 2) {
                valid_address[`${q.slug?.replace('address_', '')}`] = yup
                  .string()
                  // .matches(isPhoneNumber, 'Phone number is invalid')
                  // .test('max_spacing_interval', 'Phone number is invalid', function (value) {
                  //   if (value !== undefined) {
                  //     return this.parent.phone_number.replaceAll('-', '').length >= 13
                  //   }
                  // })
                  // .required('Phone number is required')
                  .required(`${q.question} is required`)
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: any) => {
                    return isNumber.test(value)
                  })
              }
              else {
                valid_address[`${q.slug?.replace('address_', '')}`] = yup.string().required(`${q.question} is required`)
              }
            }
            else {
              if (q.validation === 2) {
                valid_student_address[`${q.slug?.replace('address_', '')}`] = yup
                  .string()
                  .required(`${q.question} is required`)
                  .test(`${q.question}-selected`, `${q.question} is invalid`, (value: any) => {
                    return isNumber.test(value)
                  })
              } else {
                valid_student_address[`${q.slug?.replace('address_', '')}`] = yup.string().required(`${q.question} is required`)
              }
            }
          }
          else if (q.slug?.includes('packet_') && q.required){
            if (!q.student_question) {
              valid_packet[`${q.slug?.replace('packet_', '')}`] = yup.string().required(`${q.question} is required`)                
            }
            else {
              valid_student_packet[`${q.slug?.replace('packet_', '')}`] = yup.string().required(`${q.question} is required`)
            }
          }
        }
      })
      setEmptyStudent(empty)
      setValidationSchema({
        ...initSchema,
        parent: yup.object(valid_parent),        
        address: yup.object(valid_address),      
        packet: yup.object(valid_packet),
        students: yup.array(yup.object({ ...valid_student, meta: yup.object(valid_student_meta), address: yup.object(valid_student_address), packet: yup.object(valid_student_packet) })),
        meta: yup.object(valid_meta),
      })
    }
  }, [questions])

  const [submitApplicationAction] = useMutation(newParentApplicationMutation)

  const { data: regionData, loading, error } = useQuery(getAllRegion)

  useEffect(() => {
    !loading &&
      setAvailableRegions(
        map(regionData.regions, (region) => ({
          label: region.name,
          value: region.id,
        })),
      )
  }, [regionData])

  useEffect(() => {
    if (!schoolLoading && schoolYearData.getSchoolYearsByRegionId) {
      let schoolYearsArray: Array<DropDownItem> = []
      schoolYearData.getSchoolYearsByRegionId.map(
        (item: {
          date_begin: string
          date_end: string
          school_year_id: string
          midyear_application: number
          midyear_application_open: string
          midyear_application_close: string
        }) => {
          schoolYearsArray.push({
            label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YYYY')}`,
            value: item.school_year_id,
          })
          if (item?.midyear_application) {
            schoolYearsArray.push({
              label: `${moment(item.midyear_application_open).format('YYYY')} - ${moment(
                item.midyear_application_close,
              ).format('YYYY')} Mid-year Program`,
              value: `${item.school_year_id}-mid`,
            })
          }
        },
      ),
        setSchoolYears(schoolYearsArray)
      setSchoolYearsData(schoolYearData.getSchoolYearsByRegionId)
    }
  }, [regionId, schoolYearData])

  const submitApplication = async (values) => {
    const submitStudents = values.students?.map((s) => {
      return { ...s, meta: JSON.stringify(s?.meta || {}), address: {...s.address, school_district: s.packet.school_district}, packet: omit(s.packet, ['school_district']) }
    })
    console.log('values', values)
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          referred_by: values.refferedBy,
          state: values.state,
          program_year: parseInt(values.programYear!),
          parent: omit(values.parent, ['emailConfirm']),
          students: submitStudents,
          midyear_application: midYearApplication,
          meta: JSON.stringify(values.meta),
          address: {...values.address, school_district: values.packet?.school_district},
          packet: omit(values.packet, ['school_district']),
        },
      },
    }).then(() => {
      setShowConfirmationText(true)
    })
  }

  const parseGrades = () => {
    let dropDownItems: DropDownItem[] = []
    GRADES.forEach((grade: string | number) => {
      if (grades?.includes(grade?.toString())) {
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

  const setGradesAndBirthDateCut = (id) => {
    schoolYearsData.forEach((element) => {
      if (id == element?.school_year_id) {
        setGrades(element.grades?.split(','))
        setBirthDateCut(element.birth_date_cut)
      }
    })
  }

  useEffect(() => {
    parseGrades()
  }, [grades])

  const [checkEmail, { loading: emailLoading, data: emailData }] = useLazyQuery(checkEmailQuery, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && emailData !== undefined) {
      if (emailData.emailTaken === true) {
        const response = new CustomEvent('emailTaken', { detail: { error: true } })
        document.dispatchEvent(response)
        setShowEmailError(true)
      } else {
        setShowEmailError(false)
      }
    }
  }, [emailLoading, emailData])

  return !loading ? (
    <Card sx={{ paddingTop: 6, backgroundColor: '#EEF4F8' }}>
      {!showConfirmationText ? (
        <Formik
          initialValues={{
            programYear: undefined,
            state: undefined,
            refferedBy: undefined,
            students: [emptyStudent],
            meta: {},
            parent: undefined,
            address: undefined,
            packet: undefined,
          }}
          validationSchema={object(validationSchema)}
          onSubmit={async (values) => {
            await submitApplication(values)
          }}
        >
          {({ values, errors }) => {
            console.log('errors',errors)
            return (
              <Form>
                <Box
                  // paddingX={36}
                  paddingBottom={10}
                  sx={{
                    backgroundImage: `url(${BGSVG})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '88vh',
                  }}
                >
                  <Grid container rowSpacing={2} paddingTop={10}>
                    <Grid item xs={12}>
                      <Title color={MTHBLUE} textAlign='center'>
                        InfoCenter
                      </Title>
                    </Grid>
                    <Grid item xs={12}>
                      <Title fontWeight='500' textAlign='center'>
                        Apply
                      </Title>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent={'center'}>
                      <Field name={`state`} fullWidth focused>
                        {({ field, form, meta }) => (
                          <Box width={'451.53px'}>
                            <DropDown
                              name='state'
                              labelTop
                              dropDownItems={availableRegions}
                              placeholder='State'
                              setParentValue={(id) => {
                                form.setFieldValue(field.name, id)
                                setRegionId(id)
                              }}
                              alternate={true}
                              sx={!!(meta.touched && Boolean(meta.error)) ? classes.textFieldError : classes.dropdown}
                              size='small'
                              error={{
                                error: !!(meta.touched && Boolean(meta.error)),
                                errorMsg: (meta.touched && meta.error) as string,
                              }}
                            />
                          </Box>
                        )}
                      </Field>
                    </Grid>
                    {!questionLoading &&
                      questions.length > 0 &&
                      questions.map((q) => {
                        if (q.slug === 'program_year') {
                          return (
                            <Grid item xs={12} display='flex' justifyContent={'center'}>
                              <Box width={'451.53px'}>
                                <Field name='programYear' fullWidth focused>
                                  {({ field, form, meta }) => (
                                    <Box width={'100%'}>
                                      <DropDown
                                        name='programYear'
                                        labelTop
                                        placeholder='Program Year'
                                        dropDownItems={schoolYears}
                                        setParentValue={(id) => {
                                          if (id?.indexOf('mid') > 0) {
                                            id = id?.split('-')?.at(0)
                                            setMidYearApplication(true)
                                          } else {
                                            setMidYearApplication(false)
                                          }
                                          form.setFieldValue(field.name, toNumber(id))
                                          setGradesAndBirthDateCut(id)
                                        }}
                                        alternate={true}
                                        size='small'
                                        sx={!!(meta.touched && meta.error) ? classes.textFieldError : classes.dropdown}
                                        error={{
                                          error: !!(meta.touched && meta.error),
                                          errorMsg: (meta.touched && meta.error) as string,
                                        }}
                                      />
                                    </Box>
                                  )}
                                </Field>
                              </Box>
                            </Grid>
                          )
                        } else if (q.slug === 'parent_email') {
                          return (
                            <Grid item xs={12} display='flex' justifyContent={'center'}>
                              <Box width={'451.53px'}>
                                <Field name={`parent.email`} fullWidth focused>
                                  {({ field, form, meta }) => {
                                    if (showEmailError) {
                                      form.setErrors({
                                        parent: {
                                          email: (
                                            <Paragraph>
                                              This email is already being used.&nbsp;&nbsp;
                                              <Link
                                                to={DASHBOARD}
                                                style={{
                                                  fontSize: '11.2px',
                                                  fontWeight: 700,
                                                  color: MTHBLUE,
                                                  textDecoration: 'none',
                                                }}
                                              >
                                                Please login{'\u00A0'}
                                              </Link>
                                              to complete an application
                                            </Paragraph>
                                          ),
                                        },
                                      })
                                    }
                                    return (
                                      <Box width={'100%'}>
                                        <TextField
                                          name='parent.email'
                                          size='small'
                                          label='Parent Email'
                                          focused
                                          variant='outlined'
                                          inputProps={{
                                            style: { color: 'black' },
                                          }}
                                          InputLabelProps={{
                                            style: { color: SYSTEM_05 },
                                          }}
                                          sx={
                                            !!(meta.touched && meta.error) ? classes.textFieldError : classes.textField
                                          }
                                          {...field}
                                          error={meta.error || showEmailError}
                                          helperText={meta.touched && meta.error}
                                          onKeyUp={() => {
                                            // TODO fix validation here
                                            checkEmail({
                                              variables: {
                                                email: field.value,
                                              },
                                            })
                                          }}
                                        />
                                      </Box>
                                    )
                                  }}
                                </Field>
                              </Box>
                            </Grid>
                          )
                        } else if (q.slug === 'parent_emailConfirm') {
                          return (
                            <Grid item xs={12} display='flex' justifyContent={'center'}>
                              <Box width={'451.53px'}>
                                <Field name={`parent.emailConfirm`} fullWidth focused>
                                  {({ field, meta }) => (
                                    <Box width={'100%'}>
                                      <TextField
                                        name='emailConfirm'
                                        size='small'
                                        label='Parent Email Confirm'
                                        focused
                                        variant='outlined'
                                        inputProps={{
                                          style: { color: 'black' },
                                        }}
                                        InputLabelProps={{
                                          style: { color: SYSTEM_05 },
                                        }}
                                        sx={!!(meta.touched && meta.error) ? classes.textFieldError : classes.textField}
                                        {...field}
                                        error={meta.touched && meta.error}
                                        helperText={meta.touched && meta.error}
                                      />
                                    </Box>
                                  )}
                                </Field>
                              </Box>
                            </Grid>
                          )
                        } else if (q.slug?.includes('student_') || q.student_question) {
                          if (q.slug === 'student_grade_level') {
                            return (
                              <Grid item xs={12} display='flex' justifyContent={'center'}>
                                <Box width={'451.53px'}>
                                  <Field name={`students[0].grade_level`} fullWidth focused>
                                    {({ field, form, meta }) => (
                                      <Box width={'100%'}>
                                        <DropDown
                                          name={`students[0].grade_level`}
                                          labelTop
                                          placeholder={`Student Grade Level (age) as of ${moment(birthDateCut).format(
                                            'MMM Do YYYY',
                                          )}`}
                                          dropDownItems={gradesDropDownItems}
                                          setParentValue={(id) => {
                                            form.setFieldValue(field.name, id)
                                          }}
                                          alternate={true}
                                          size='small'
                                          sx={
                                            !!(meta.touched && meta.error) ? classes.textFieldError : classes.dropdown
                                          }
                                          error={{
                                            error: !!(meta.touched && meta.error),
                                            errorMsg: (meta.touched && meta.error) as string,
                                          }}
                                        />
                                      </Box>
                                    )}
                                  </Field>
                                </Box>
                              </Grid>
                            )
                          } else if (q.slug?.includes('student_')) {
                            console.log(q.slug);
                            return (
                              <Grid item xs={12} display='flex' justifyContent={'center'}>
                                <Box width={'451.53px'} display='flex' flexDirection='row' alignItems={'center'}>
                                  <Field name={`students[0].${q.slug?.replace('student_', '')}`} fullWidth focused>
                                    {({ field, form, meta }) => (
                                      <Box width={'100%'}>
                                        <AdditionalQuestionItem question={q} field={field} form={form} meta={meta} />
                                      </Box>
                                    )}
                                  </Field>
                                </Box>
                              </Grid>
                            )
                          } else if (q.slug?.includes('meta_') && q.student_question) {
                            return (
                              <Grid item xs={12} display='flex' justifyContent={'center'}>
                                <Box width={'451.53px'} display='flex' flexDirection='row' alignItems={'center'}>
                                  <Field name={`students[0].meta.${q.slug}`} fullWidth focused>
                                    {({ field, form, meta }) => (
                                      <Box width={'100%'}>
                                        <AdditionalQuestionItem question={q} field={field} form={form} meta={meta} />
                                      </Box>
                                    )}
                                  </Field>
                                </Box>
                              </Grid>
                            )
                          }
                          else if (!q.slug?.includes('meta_') && q.student_question) {
                            const parentFieldName = q.slug?.split('_')[0]
                            const childFieldName = q.slug?.replace(parentFieldName + '_', '')
                            return (
                              <Grid item xs={12}  display='flex' justifyContent={'center'}>
                                <Box
                                  width={'451.53px'}
                                  display='flex'
                                  flexDirection='row'
                                  alignItems={'center'}
                                >
                                  <Field
                                    name={`students[0].${parentFieldName}.${childFieldName}`}
                                    fullWidth
                                    focused
                                  >
                                    {({ field, form, meta }) => (
                                      <Box width={'100%'}>
                                        <AdditionalQuestionItem
                                          question={q}
                                          field={field}
                                          form={form}
                                          meta={meta}
                                        />
                                      </Box>
                                    )}
                                  </Field>
                                </Box>
                              </Grid>
                            )
                          }
                        }
                        else if(q.slug?.includes('meta_')) {
                          return (
                            <Grid item xs={12} display='flex' justifyContent={'center'}>
                              <Box width={'451.53px'}>
                                <Field name={`meta.${q.slug}`} fullWidth focused>
                                  {({ field, form, meta }) => (
                                    <AdditionalQuestionItem question={q} field={field} form={form} meta={meta} />
                                  )}
                                </Field>
                              </Box>
                            </Grid>
                          )
                        }
                        else{
                          const parentFieldName = q.slug?.split('_')[0]
                          const childFieldName = q.slug?.replace(parentFieldName + '_', '')
                          return (
                            <Grid item xs={12} display='flex' justifyContent={'center'}>
                              <Box width={'451.53px'}>
                                <Field name={`${parentFieldName}.${childFieldName}`} fullWidth focused>
                                  {({ field, form, meta }) => (
                                    <AdditionalQuestionItem question={q} field={field} form={form} meta={meta} />
                                  )}
                                </Field>
                              </Box>
                            </Grid>
                          )
                        }
                      })}
                    <Grid item xs={12} display='flex' justifyContent={'center'}>
                      <Box width={'451.53px'}>
                        <FieldArray name='students'>
                          {({ push, remove }) => (
                            <Grid item container spacing={2} xs={12} sm='auto'>
                              {values.students.map((_, index) => (
                                <>
                                  {!questionLoading &&
                                    questions.length > 0 &&
                                    index > 0 &&
                                    questions.map((q, qIndex) => {
                                      const firstQuestionSlug = questions.filter(
                                        (qf) => qf.question.includes('student_') || qf.student_question,
                                      )[0].slug
                                      if (q.slug === 'student_grade_level') {
                                        return (
                                          <Grid item xs={12}>
                                            <Field name={`students[${index}].grade_level`} fullWidth focused>
                                              {({ field, form, meta }) => (
                                                <Box width={'100%'}>
                                                  <DropDown
                                                    name={`students[${index}].grade_level`}
                                                    labelTop
                                                    placeholder={`Student Grade Level (age) as of ${moment(
                                                      birthDateCut,
                                                    ).format('MMM Do YYYY')}`}
                                                    dropDownItems={gradesDropDownItems}
                                                    setParentValue={(id) => {
                                                      form.setFieldValue(field.name, id)
                                                    }}
                                                    alternate={true}
                                                    size='small'
                                                    sx={
                                                      !!(meta.touched && meta.error)
                                                        ? classes.textFieldError
                                                        : classes.dropdown
                                                    }
                                                    error={{
                                                      error: !!(meta.touched && meta.error),
                                                      errorMsg: (meta.touched && meta.error) as string,
                                                    }}
                                                  />
                                                </Box>
                                              )}
                                            </Field>
                                            {index !== 0 && q.slug === firstQuestionSlug ? (
                                              <DeleteForeverOutlinedIcon
                                                sx={{ left: 12, position: 'relative', color: 'darkgray' }}
                                                onClick={() => remove(index)}
                                              />
                                            ) : null}
                                          </Grid>
                                        )
                                      } else if (q.slug?.includes('student_')) {
                                        return (
                                          <Grid item xs={12}>
                                            <Box
                                              width={'100%'}
                                              display='flex'
                                              flexDirection='row'
                                              alignItems={'center'}
                                            >
                                              <Field
                                                name={`students[${index}].${q.slug?.replace('student_', '')}`}
                                                fullWidth
                                                focused
                                              >
                                                {({ field, form, meta }) => (
                                                  <Box width={'100%'}>
                                                    <AdditionalQuestionItem
                                                      question={q}
                                                      key={index}
                                                      field={field}
                                                      form={form}
                                                      meta={meta}
                                                    />
                                                  </Box>
                                                )}
                                              </Field>
                                              {index !== 0 && q.slug === firstQuestionSlug ? (
                                                <DeleteForeverOutlinedIcon
                                                  sx={{ left: 12, position: 'relative', color: 'darkgray' }}
                                                  onClick={() => remove(index)}
                                                />
                                              ) : null}
                                            </Box>
                                          </Grid>
                                        )
                                      } else if (q.slug?.includes('meta_') && q.student_question) {
                                        return (
                                          <Grid item xs={12}>
                                            <Box
                                              width={'100%'}
                                              display='flex'
                                              flexDirection='row'
                                              alignItems={'center'}
                                            >
                                              <Field name={`students[${index}].meta.${q.slug}`} fullWidth focused>
                                                {({ field, form, meta }) => (
                                                  <Box width={'100%'}>
                                                    <AdditionalQuestionItem
                                                      question={q}
                                                      key={index}
                                                      field={field}
                                                      form={form}
                                                      meta={meta}
                                                    />
                                                  </Box>
                                                )}
                                              </Field>
                                              {index !== 0 && q.slug === firstQuestionSlug ? (
                                                <DeleteForeverOutlinedIcon
                                                  sx={{ left: 12, position: 'relative', color: 'darkgray' }}
                                                  onClick={() => remove(index)}
                                                />
                                              ) : null}
                                            </Box>
                                          </Grid>
                                        )
                                      }
                                      else if (!q.slug?.includes('meta_') && q.student_question) {
                                        const parentFieldName = q.slug?.split('_')[0]
                                        const childFieldName = q.slug?.replace(parentFieldName + '_', '')
                                        return (
                                          <Grid item xs={12}  display='flex' justifyContent={'center'}>
                                            <Box
                                              width={'451.53px'}
                                              display='flex'
                                              flexDirection='row'
                                              alignItems={'center'}
                                            >
                                              <Field
                                                name={`students[${index}].${parentFieldName}.${childFieldName}`}
                                                fullWidth
                                                focused
                                              >
                                                {({ field, form, meta }) => (
                                                  <Box width={'100%'}>
                                                    <AdditionalQuestionItem
                                                      question={q}
                                                      field={field}
                                                      form={form}
                                                      meta={meta}
                                                    />
                                                  </Box>
                                                )}
                                              </Field>
                                              {index !== 0 && q.slug === firstQuestionSlug ? (
                                                <DeleteForeverOutlinedIcon
                                                  sx={{ left: 12, position: 'relative', color: 'darkgray' }}
                                                  onClick={() => remove(index)}
                                                />
                                              ) : null}
                                            </Box>
                                          </Grid>
                                        )
                                      }
                                    })}
                                </>
                              ))}
                              <Grid item>
                                {typeof errors.students === 'string' ? (
                                  <Paragraph color={RED}>{errors.students}</Paragraph>
                                ) : null}
                              </Grid>
                              <Grid item xs={12} display='flex' justifyContent={'center'}>
                                <Button
                                  // color='secondary'
                                  // variant='contained'
                                  disabled={
                                    regionId && questions.filter((q) => q.slug.includes('student_')).length > 0
                                      ? false
                                      : true
                                  }
                                  style={classes.addStudentButton}
                                  onClick={() => push(emptyStudent)}
                                >
                                  Add Student
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                        </FieldArray>
                      </Box>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent={'center'}>
                      <Button
                        variant='contained'
                        type='submit'
                        style={classes.submitButton}
                        disabled={Boolean(Object.keys(errors).length) || showEmailError}
                      >
                        {`Submit to ${availableRegions[Number(regionId) - 1]?.label || ''} School`}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Form>
            )
          }}
        </Formik>
      ) : (
        <>
          <Box
            sx={{
              backgroundImage: `url(${BGSVG})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '1088px',
              minHeight: '1300px',
            }}
          >
            <Box marginTop={12}>
              <Title color={MTHBLUE} textAlign='center'>
                InfoCenter
              </Title>
            </Box>
            <Title fontWeight='500' textAlign='center'>
              Apply
            </Title>
            <Box sx={{ width: '510px', marginLeft: 'auto', marginRight: 'auto', marginTop: '370px' }}>
              <Title size='medium' fontWeight='500' textAlign='center'>
                Please check your email for a verification link to complete your account.
              </Title>
            </Box>
          </Box>
        </>
      )}
      <Box paddingBottom={4}>
        <NewApplicationFooter />
      </Box>
    </Card>
  ) : (
    <LoadingScreen />
  )
}
