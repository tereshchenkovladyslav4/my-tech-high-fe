import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Box, Button, Card, Container, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../components/Typography/Title/Title'
import { AddStudent } from '../components/AddStudent/AddStudent'
import { checkEmailQuery, newParentApplicationMutation, getActiveSchoolYearsByRegionId, getQuestionsGql } from './service'
import { useStyles } from './styles'
import BGSVG from '../../../assets/ApplicationBG.svg'
import { DASHBOARD, GRADES, MTHBLUE, RED, SYSTEM_05 } from '../../../utils/constants'
import { NewApplicationFooter } from '../../../components/NewApplicationFooter/NewApplicationFooter'
import { Field, FieldArray, Form, Formik, useFormik } from 'formik'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { getAllRegion } from '../../../graphql/queries/region'
import { LoadingScreen } from '../../LoadingScreen/LoadingScreen'
import { find, map, pullAt, toNumber } from 'lodash'
import { isPhoneNumber, toOrdinalSuffix, isNumber } from '../../../utils/stringHelpers'
import moment from 'moment'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { array, boolean, number, object, string, ValidationError } from 'yup'
import { ApplicationQuestion } from '../components/AdditionalQuestionItem/types'
import { AdditionalQuestionItem } from '../components/AdditionalQuestionItem/AdditionalQuestionItem'
import { omit } from 'lodash';

export type StudentInput = {
  first_name: string
  last_name: string
  program_year: string
  grade_level: string
}

export const NewParent = () => {
  const [emptyStudent, setEmptyStudent] = useState({ first_name: '', last_name: '' , grade_level: undefined})
  const initSchema = {
    state: string().required('State is required'),
    programYear: string().required('Grade Level is required')
  }
  const [validationSchema, setValidationSchema] = useState()

  const programYearItems: DropDownItem[] = [
    {
      label: '2021-2022',
      value: '1',
    },
    {
      label: '2023-2024',
      value: '2',
    },
    {
      label: '2024-2025',
      value: '3',
    },
  ]

  const formVal = { first_name: '', last_name: '', grade_level: '' }

  const [availableRegions, setAvailableRegions] = useState([])
  const [yearLabel, setYearLabel] = useState(programYearItems[0].label.split('-')[0])
  const programYearChanged = new CustomEvent('yearChanged', { detail: { yearLabel } })
  const [regionId, setRegionId] = useState('')
  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([])
  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: regionId,
    },
    fetchPolicy: 'network-only',
  })

  const [showEmailError, setShowEmailError] = useState(true)
  const [schoolYearsData, setSchoolYearsData] = useState([])
  const [grades, setGrades] = useState([])
  const [gradesDropDownItems, setGradesDropDownItems] = useState<Array<DropDownItem>>([])
  const [birthDateCut, setBirthDateCut] = useState<string>('')

  const classes = useStyles

  const [showConfirmationText, setShowConfirmationText] = useState(false)

  const { loading: questionLoading, data: questionData } = useQuery(getQuestionsGql, {
    variables: { input: { region_id: Number(regionId) } },
    fetchPolicy: 'network-only',
  })
  
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([])
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
    if(questions.length > 0) {
      let empty = {...emptyStudent}
      let valid_student = {}
      let valid_parent = {}
      let valid_meta = {}
      questions.map((q) => {
        if(q.type !== 7) {
          if(q.slug?.includes('student_')) {
            empty[`${q.slug?.replace('student_', '')}`] = ''
            if(q.required) {
              if(q.slug?.toLocaleLowerCase().includes('emailconfrim')) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup
                    .string()
                    .required('Email is required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
              }
              else if(q.type === 3) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup.array().min(1, `${q.question} is required`).required(`${q.question} is required`)
              }
              else if(q.type === 4) {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup.boolean().oneOf([true], 'This field must be checked')
              }
              else {
                valid_student[`${q.slug?.replace('student_', '')}`] = yup.string().required(`${q.question} is required`)
              }
            }
          }
          else if(q.slug?.includes('parent_')) {
            if(q.required) {
              if(q.slug?.toLocaleLowerCase().includes('emailconfirm')) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup
                    .string()
                    .required('Email is required')
                    .oneOf([yup.ref('email')], 'Emails do not match')
              }
              else if(q.validation === 1) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string().email('Enter a valid email').required('Email is required')
              }
              else if(q.validation === 2) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string()
                // .matches(isPhoneNumber, 'Phone number is invalid')
                // .test('max_spacing_interval', 'Phone number is invalid', function (value) {
                //   if (value !== undefined) {
                //     return this.parent.phone_number.replaceAll('-', '').length >= 13
                //   }
                // })
                // .required('Phone number is required')
                .required(`${q.question} is required`)
                .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                  return isNumber.test(value)
                })
              }
              else if(q.type === 3) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.array().min(1, `${q.question} is required`).required(`${q.question} is required`)
              }
              else if(q.type === 4) {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.boolean().oneOf([true], 'This field must be checked')
              }
              else {
                valid_parent[`${q.slug?.replace('parent_', '')}`] = yup.string().required(`${q.question} is required`)
              }
            }
          }
          else if(q.slug?.includes('meta_') && q.required) {
            if(q.validation === 1) {
              valid_meta[`${q.slug}`] = yup.string().email('Enter a valid email').required('Email is required')
            }
            else if(q.validation === 2) {
              valid_meta[`${q.slug}`] = yup.string()
              .required(`${q.question} is required`)
              .test(`${q.question}-selected`, `${q.question} is invalid`, (value) => {
                return isNumber.test(value)
              })
            }
            else if(q.type === 3) {
              valid_meta[`${q.slug}`] = yup.array().min(1, `${q.question} is required`).required(`${q.question} is required`)
            }
            else if(q.type === 4) {
              valid_meta[`${q.slug}`] = yup.boolean().oneOf([true], 'This field must be checked')
            }
            else {
              valid_meta[`${q.slug}`] = yup.string().required(`${q.question} is required`)
            }
          }
        }
      })
      setEmptyStudent(empty)
      setValidationSchema({...initSchema, parent: yup.object(valid_parent), students: yup.array(yup.object(valid_student)), meta: yup.object(valid_meta)})
    }
  }, [questions])

  const [submitApplicationAction, { data, loading: applicationLoading, error: applicationError }] =
    useMutation(newParentApplicationMutation)

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
    if (!schoolLoading && schoolYearData.getActiveSchoolYears) {
      setSchoolYears(
        schoolYearData.getActiveSchoolYears.map((item) => {
          return {
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
            value: item.school_year_id,
          }
        }),
      )
      setSchoolYearsData(schoolYearData.getActiveSchoolYears)
    }
  }, [regionId, schoolYearData])

  const submitApplication = async (values) => {
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          referred_by: values.refferedBy,
          state: values.state,
          program_year: parseInt(values.programYear!),
          parent: omit(values.parent, ['emailConfirm']),
          students: values.students,
          meta: JSON.stringify(values.meta),
        },
      },
    }).then(() => {
      setShowConfirmationText(true)
    })
  }

  const parseGrades = () => {
    let dropDownItems = []
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

  const setGradesAndBirthDateCut = (id) => {
    schoolYearsData.forEach((element) => {
      if (id == element.school_year_id) {
        setGrades(element.grades?.split(','))
        setBirthDateCut(element.birth_date_cut)
      }
    })
  }

  useEffect(() => {
    if (
      applicationError?.networkError ||
      applicationError?.graphQLErrors?.length > 0 ||
      applicationError?.clientErrors.length > 0
    ) {
      //console.log("ApplicationError: ", applicationError)
      // formik.setErrors({
      //   email: (
      //     <Paragraph>
      //       This email is already being used.
      //       <Link
      //         to={DASHBOARD}
      //         style={{ fontSize: '11.2px', fontWeight: 700, color: MTHBLUE, textDecoration: 'none' }}
      //       >
      //         Please login{'\u00A0'}
      //       </Link>
      //       to complete an application
      //     </Paragraph>
      //   ),
      // })
    }
  }, [applicationLoading])

  useEffect(() => {
    parseGrades()
  }, [grades])

  const [checkEmail, { loading: emailLoading, data: emailData, error: emailError }] = useLazyQuery(checkEmailQuery, {
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
            meta: undefined,
            parent: undefined,
          }}
          validationSchema={object(validationSchema)}
          onSubmit={async (values) => {
            await submitApplication(values)
          }}
        >
          {({ values, errors, isSubmitting, isValid }) => {
            return (
            <Form>
              <Box
                paddingX={36}
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
                    <Field 
                      name={`state`}
                      fullWidth
                      focused
                    >
                      {({ field, form, meta }) => (
                        <Box width={'406.73px'}>                                
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
                            sx={
                              !!(meta.touched && Boolean(meta.error))
                                ? classes.textFieldError
                                : classes.dropdown
                            }
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
                {!questionLoading && questions.length > 0 && 
                  questions.map((q) => 
                    {
                      if(q.slug === 'program_year') {
                        return (
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Box width={'406.73px'}>                                
                              <Field 
                                name='programYear'
                                fullWidth
                                focused
                              >
                              {({ field, form, meta }) => (
                                <Box width={'100%'}>
                                  <DropDown
                                    name='programYear'
                                    labelTop
                                    placeholder='Program Year'
                                    dropDownItems={schoolYears}
                                    setParentValue={(id) => {
                                      form.setFieldValue(field.name, toNumber(id))
                                      setGradesAndBirthDateCut(id)
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
                                      errorMsg: (meta.touched &&  meta.error) as string,
                                    }}
                                  />
                                </Box>
                              )}
                              </Field>
                            </Box>
                          </Grid>
                        )
                      }
                      else if(q.slug === 'parent_email') {
                        return (
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Box width={'451.53px'}>
                              <Field 
                                name={`parent.email`}
                                fullWidth
                                focused
                              >
                              {({ field, form, meta }) => {
                                  if( showEmailError ) {
                                    form.setErrors({
                                      parent: {email: (
                                        <Paragraph>
                                          This email is already being used.
                                          <Link
                                            to={DASHBOARD}
                                            style={{ fontSize: '11.2px', fontWeight: 700, color: MTHBLUE, textDecoration: 'none' }}
                                          >
                                            Please login{'\u00A0'}
                                          </Link>
                                          to complete an application
                                        </Paragraph>
                                      )},
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
                                        !!(meta.touched && meta.error)
                                          ? classes.textFieldError
                                          : classes.textfield
                                      }
                                      {...field}
                                      error={meta.error || showEmailError}
                                      helperText={meta.touched && meta.error}
                                      onKeyUp={() => {
                                        // TODO fix validation here
                                        checkEmail({
                                        variables: {
                                          email: field.value
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
                      }
                      else if(q.slug === 'parent_emailConfirm') {
                        return (
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Box width={'451.53px'}>
                              <Field 
                                name={`parent.emailConfirm`}
                                fullWidth
                                focused
                              >
                              {({ field, form, meta }) => (
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
                                    sx={
                                      !!(meta.touched && meta.error)
                                        ? classes.textFieldError
                                        : classes.textfield
                                    }
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
                      }
                      else if(!q.slug?.includes('student_')) {
                        return (
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Box width={'451.53px'}>
                              {q.slug?.includes('parent_') && (
                                <Field
                                  name = {`parent.${q.slug?.replace('parent_', '')}`}
                                  fullWidth
                                  focused
                                >
                                  {({ field, form, meta }) => (
                                    <AdditionalQuestionItem question={q} field={field} form={form} meta={meta}/>
                                  )}
                                </Field>
                              )}
                              {q.slug?.includes('meta_') && (
                                <Field
                                  name = {`meta.${q.slug}`}
                                  fullWidth
                                  focused
                                >
                                  {({ field, form, meta }) => (
                                    <AdditionalQuestionItem question={q} field={field} form={form} meta={meta}/>
                                  )}
                                </Field>
                              )}
                            </Box>
                          </Grid>
                        )
                      }
                    }
                  )
                }
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <FieldArray name="students">
                      {({ push, remove }) => (
                        <>
                          {values.students.map((_, index) => (
                              <Grid item container spacing={2} xs={12} sm="auto">
                                {!questionLoading && questions.length > 0 && 
                                  questions.map((q) => {
                                    if(q.slug === 'student_grade_level') {
                                      return (
                                        <Grid item xs={12}>
                                          <Field name={`students[${index}].grade_level`} fullWidth focused>
                                            {({ field, form, meta }) => (
                                              <Box width={'100%'}>
                                                <DropDown
                                                  name={`students[${index}].grade_level`}
                                                  labelTop
                                                  placeholder={`Student Grade Level (age) as of ${moment(birthDateCut).format('MMM Do YYYY')}`}
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
                                        </Grid>
                                      )
                                    }
                                    else if(q.slug?.includes('student_')) {
                                      return (
                                        <Grid item xs={12}>
                                          <Box 
                                            width={index === 0 ? '100%' : '103.9%'} 
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
                                                  <AdditionalQuestionItem question={q} key={index} field={field} form={form} meta={meta}/>
                                                </Box>
                                              )}
                                            </Field>
                                            {
                                              index !== 0 && q.slug === 'student_first_name'
                                              ? <DeleteForeverOutlinedIcon 
                                                  sx={{left: 12, position: 'relative', color: 'darkgray'}}
                                                  onClick={() => remove(index)}
                                                />
                                              : null
                                            }
                                          </Box>
                                        </Grid>
                                      )
                                    }
                                  })
                                }
                              </Grid>
                          ))}
                          <Grid item>
                            {typeof errors.students === 'string' ? (
                              <Paragraph color={RED}>
                                {errors.students}
                              </Paragraph>
                            ) : null}
                          </Grid>
                          <Grid item xs={12} display='flex' justifyContent={'center'}>
                            <Button
                              color='secondary'
                              variant='contained'
                              disabled={regionId && questions.filter(q => q.slug.includes('student_')).length > 0 ? false : true}
                              style={classes.addStudentButton}
                              onClick={() => push(emptyStudent)}
                            >
                              Add Student
                            </Button>
                          </Grid>
                        </>
                      )}
                    </FieldArray>
                  </Box>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Button
                    variant='contained'
                    type='submit'
                    style={classes.submitButton}
                    disabled={ Boolean(Object.keys(errors).length) || showEmailError}
                  >
                    {`Submit to ${availableRegions[regionId - 1]?.label || ''} School`}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            </Form>
          )}
        }
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
