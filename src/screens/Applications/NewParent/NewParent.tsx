import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Box, Button, Card, Container, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../components/Typography/Title/Title'
import { AddStudent } from '../components/AddStudent/AddStudent'
import { checkEmailQuery, newParentApplicationMutation, getSchoolYearQuery } from './service'
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
import { isPhoneNumber } from '../../../utils/stringHelpers'
import moment from 'moment'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { array, boolean, number, object, string, ValidationError } from 'yup';

export type StudentInput = {
  first_name: string
  last_name: string
  program_year: string
  grade_level: string
}

export const NewParent = () => {
  const emptyStudent = { first_name: '', last_name: '' ,grade_level: undefined}

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

  const formVal = { first_name: "", last_name : "", grade_level: ""}

  const [availableRegions, setAvailableRegions] = useState([])
  const [yearLabel, setYearLabel] = useState(programYearItems[0].label.split('-')[0])
  const programYearChanged = new CustomEvent('yearChanged', { detail: { yearLabel } })
  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([])
  const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearQuery)

  const [showEmailError, setShowEmailError] = useState(false)
  
  const classes = useStyles

  const [showConfirmationText, setShowConfirmationText] = useState(false)

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
    if (!schoolLoading && schoolYearData.schoolYears) {
      setSchoolYears(
        schoolYearData.schoolYears.map((item) => {
          return {
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
            value: item.school_year_id,
          }
        }),
      )
    }
  }, [schoolYearData])

  const submitApplication = async (values) => {
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          referred_by: values.refferedBy,
          state: values.state,
          program_year: parseInt(values.programYear!),
          parent: {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            phone_number: values.phoneNumber,
          },
          students: values.students,
        },
      },
    }).then(() => {
      setShowConfirmationText(true)
    })
  }

  const parseGrades = map(GRADES, (grade) => {
    return {
      label: grade,
      value: grade.toString()
    }
  })

  useEffect(() => {
    if (
      applicationError?.networkError ||
      applicationError?.graphQLErrors?.length > 0 ||
      applicationError?.clientErrors.length > 0
    ) {
      formik.setErrors({
        email: (
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
        ),
      })
    }
  }, [applicationLoading])


  const [checkEmail, { loading: emailLoading, data: emailData, error: emailError }] = useLazyQuery(checkEmailQuery, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && emailData !== undefined) {
      if (emailData.emailTaken === true) {
        const response = new CustomEvent('emailTaken',  { detail: {error: true} })
        document.dispatchEvent(response)

        setShowEmailError(true)
      } else {
        setShowEmailError(false)
      }
    }
  }, [emailLoading, emailData])
  
  
  
  return !loading ? (
    <Card sx={{ paddingTop: 8, margin: 4 }} >
      {!showConfirmationText 
        ? <Formik
          initialValues={{
            programYear: undefined,
            state: undefined,
            firstName: undefined,
            lastName: undefined,
            phoneNumber: undefined,
            email: undefined,
            emailConfirm: undefined,
            refferedBy: undefined,
            students: [emptyStudent],
          }}
          validationSchema={ object({
            state: string().required('State is required'),
            programYear: string().required('Grade Level is required'),
            firstName: string().required('First Name is required'),
            lastName: string().required('Last Name is required'),
            phoneNumber: string()
              .matches(isPhoneNumber, 'Phone number is invalid')
              .test('max_spacing_interval', 'Phone number is invalid', function (value) {
                if (value !== undefined) {
                  return this.parent.phoneNumber.replace('-', '').length >= 10
                }
              })
              .required('Phone number is required'),
            email: yup.string().email('Enter a valid email').required('Email is required'),
            emailConfirm: yup
              .string()
              .required('Email is required')
              .oneOf([yup.ref('email')], 'Emails do not match'),
            refferedBy: yup.string(),
            students: yup.array(
              yup.object({
                first_name: yup.string()
                  .required('First Name needed'),
                last_name: yup.string()
                  .required('Last Name needed'),
                grade_level: yup.string()
                  .required('Grade Level is required'),
              })
            )
          })}

          onSubmit={async (values) => {
            await submitApplication(values)
          }}
        > 
          {({ values, errors, isSubmitting, isValid, }) => {
            console.log(errors)
            return (
            <Form>
              <Box
                paddingX={36}
                paddingTop={18}
                paddingBottom={10}
                sx={{
                  backgroundImage: `url(${BGSVG})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'top',
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
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
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Paragraph
                    textAlign='center'
                    sx={{
                      fontSize: '11.2px',
                    }}
                  >
                    Our tuition-free, personalized distance education program is available to home-based Utah residents
                    between the ages of 5-18.
                  </Paragraph>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Paragraph
                    sx={{
                      fontSize: '11.2px',
                      width: '125%',
                      textAlign: 'center',
                    }}
                  >
                    If you already have an InfoCenter account,
                    <span style={{ fontSize: '11.2px', fontWeight: 700 }}>
                      {'\u00A0'}please{'\u00A0'}
                    </span>
                    <Link
                      to={DASHBOARD}
                      style={{ fontSize: '11.2px', fontWeight: 700, color: MTHBLUE, textDecoration: 'none' }}
                      >
                      login{'\u00A0'}
                    </Link>
                    before submitting an application. Thank you!.
                  </Paragraph>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <Field 
                      name={`firstName`}
                      fullWidth
                      focused
                    >
                      {({ field, form, meta }) => (
                        <Box width={'100%'}>
                          <TextField
                            name='firstName'
                            size='small'
                            label='Parent First Name'
                            focused
                            variant='outlined'
                            {...field}
                            inputProps={{
                              style: { color: 'black' },
                            }}
                            InputLabelProps={{
                              style: { color: SYSTEM_05 },
                            }}
                            type="text"
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
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <Field 
                      name={`lastName`}
                      fullWidth
                      focused
                    >
                    {({ field, form, meta }) => (
                      <Box width={'100%'}>
                        <TextField
                          name='lastName'
                          size='small'
                          label='Parent Last Name'
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
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <Field 
                      name={`phoneNumber`}
                      fullWidth
                      focused
                    >
                    {({ field, form, meta }) => (
                      <Box width={'100%'}>
                        <TextField
                          name='phoneNumber'
                          size='small'
                          label='Parent Phone Number'
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
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <Field 
                      name={`email`}
                      fullWidth
                      focused
                    >
                    {({ field, form, meta }) => {
                      document.addEventListener('emailTaken', (e) => {
                        form.setErrors({
                          email: (
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
                          ),
                        })
                        console.log(form.errors)
                      })
                      return (
                        <Box width={'100%'}>
                          <TextField
                            name='email'
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
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            onBlur={() => {
                              // TODO fix validation here
                              //checkEmail({
                              //  variables: {
                              //    email: field.value
                              //  },
                              //})
                            }}
                          />
                        </Box>
                      )
                    }}
                    </Field>
                  </Box>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <Field 
                      name={`emailConfirm`}
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
                <Grid item xs={12} display='flex' justifyContent={'center'}>
                  <Box width={'451.53px'}>
                    <FieldArray name="students">
                      {({ push, remove }) => (
                        <>
                          {values.students.map((_, index) => (
                              <Grid item container spacing={2} xs={12} sm="auto">
                                <Grid item xs={12}>
                                  <Box 
                                    width={index === 0 ? '100%' : '103.9%'} 
                                    display='flex' 
                                    flexDirection='row' 
                                    alignItems={'center'}
                                  >
                                    <Field 
                                      name={`students[${index}].first_name`}
                                      fullWidth
                                      focused
                                    >
                                      {({ field, form, meta }) => (
                                        <Box width={'100%'}>
                                          <TextField 
                                            type="text"
                                            size='small'
                                            label='Student First Name'
                                            focused
                                            variant='outlined'
                                            sx={
                                              !!(meta.touched && meta.error)
                                                ? classes.textFieldError
                                                : classes.textfield
                                            }
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
                                        </Box>
                                      )}
                                    </Field>
                                    {
                                      index !== 0
                                      ? <DeleteForeverOutlinedIcon 
                                          sx={{left: 12, position: 'relative', color: 'darkgray'}}
                                          onClick={() => remove(index)}
                                        />
                                      : null
                                    }
                                  </Box>
                                </Grid>
                                <Grid item xs={12}>
                                  <Field 
                                    name={`students[${index}].last_name`}
                                    fullWidth
                                    focused
                                  >
                                    {({ field, form, meta }) => (
                                      <Box width={'100%'}>
                                        <TextField
                                          type="text"
                                          size='small'
                                          label='Student Last Name'
                                          focused
                                          variant='outlined'
                                          sx={
                                            !!(meta.touched && meta.error)
                                              ? classes.textFieldError
                                              : classes.textfield
                                          }
                                          inputProps={{
                                            style: { color: 'black' },
                                          }}
                                          InputLabelProps={{
                                            style: { color: SYSTEM_05 },
                                          }}
                                          {...field}
                                          error={meta.touched && meta.error}
                                          helperText={meta.touched &&  meta.error}
                                        />
                                      </Box>
                                    )}
                                  </Field>
                                </Grid>
                                <Grid item xs={12}>
                                  <Field 
                                    name={`students[${index}].grade_level`}
                                    fullWidth
                                    focused
                                  >
                                    {({ field, form, meta }) => (
                                      <Box width={'100%'}>
                                      <DropDown
                                        name={`students[${index}].grade_level`}
                                        labelTop
                                        placeholder={`Student Grade Level (age) as of September 1, ${2022}`}
                                        dropDownItems={parseGrades}
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
                                </Grid>
                            
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
                  >
                    Submit to Utah School
                  </Button>
                </Grid>
              </Grid>
            </Box>
            </Form>
          )}
        }
        </Formik>
        : <>
        <Box paddingX={36} paddingY={12} height={'100vh'}>
            <Box
              sx={{
                backgroundImage: `url(${BGSVG})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',
                display: 'flex',
                flexDirection: 'column',
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
              <Box marginTop={'25%'}>
                <Title size='medium' fontWeight='500' textAlign='center'>
                  Please check your email for a verification link to complete your account.
                </Title>
              </Box>
            </Box>
          </Box></>
      }
        <Box paddingBottom={4}>
          <NewApplicationFooter />
        </Box>
  </Card>
  ) : (
    <LoadingScreen />
  )
}
