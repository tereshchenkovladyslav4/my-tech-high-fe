import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../components/Typography/Title/Title'
import { AddStudent } from '../components/AddStudent/AddStudent'
import { checkEmailQuery, newParentApplicationMutation, getSchoolYearQuery } from './service'
import { useStyles } from './styles'
import BGSVG from '../../../assets/ApplicationBG.svg'
import { DASHBOARD, MTHBLUE, SYSTEM_05 } from '../../../utils/constants'
import { NewApplicationFooter } from '../../../components/NewApplicationFooter/NewApplicationFooter'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { getAllRegion } from '../../../graphql/queries/region'
import { LoadingScreen } from '../../LoadingScreen/LoadingScreen'
import { find, map } from 'lodash'
import { isPhoneNumber } from '../../../utils/stringHelpers'
import moment from 'moment'

export type StudentInput = {
  first_name: string
  last_name: string
  program_year: string
  grade_level: string
}

export const NewParent = () => {
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

  const [studentData, setStudentData] = useState<Array<StudentInput>>([])
  const [availableRegions, setAvailableRegions] = useState([])
  const [yearLabel, setYearLabel] = useState(programYearItems[0].label.split('-')[0])
  const submitPressed = new CustomEvent('checkStudents')
  const programYearChanged = new CustomEvent('yearChanged', { detail: { yearLabel } })
  const [schoolYears, setSchollYears] = useState<Array<DropDownItem>>([])
  const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearQuery)

  const [showEmailError, setShowEmailError] = useState(false)

  const onStudentFieldChanged = (idx, fieldName, value) => {
    setStudentData((prev) => {
      if (prev[idx] === undefined) {
        return [
          ...prev,
          {
            [fieldName]: value,
          },
        ]
      } else {
        const data = [...prev]
        const element = data[idx]
        element[fieldName] = value
        setStudentData(data)
      }
    })
  }

  const removeStudent = (idx) => {
    setStudents(students.filter((_, el) => idx !== el))
    setStudentData(studentData.filter((_, el) => idx !== el))
  }

  const classes = useStyles

  const AddNewStudent = (idx: number) => (
    <AddStudent
      idx={idx}
      onFieldChange={onStudentFieldChanged}
      handleRemoveStudent={removeStudent}
      yearLabel={yearLabel}
    />
  )

  const setState = (id: any) => (formik.values.state = id)

  const setProgramYear = (id: any) => {
    formik.values.programYear = id
    const currProgramYear = find(schoolYears, { value: id })
    setYearLabel(currProgramYear.label.split('-')[0])
  }

  const [showConfirmationText, setShowConfirmationText] = useState(false)

  const [students, setStudents] = useState([AddNewStudent(0)])

  const appendAddStudentList = () =>
    setStudents(() => {
      const element = students.length
      return [...students, AddNewStudent(element)]
    })

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
      setSchollYears(
        schoolYearData.schoolYears.map((item) => {
          return {
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
            value: item.school_year_id,
          }
        }),
      )
    }
  }, [schoolYearData])
  const submitApplication = async () => {
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          referred_by: formik.values.refferedBy,
          state: formik.values.state,
          program_year: parseInt(formik.values.programYear!),
          parent: {
            first_name: formik.values.firstName,
            last_name: formik.values.lastName,
            email: formik.values.email,
            phone_number: formik.values.phoneNumber,
          },
          students: studentData,
        },
      },
    }).then(() => {
      setShowConfirmationText(true)
    })
  }

  const validationSchema = yup.object().shape({
    state: yup.string().required('State is required'),
    programYear: yup.string().required('Grade Level is required'),
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    phoneNumber: yup
      .string()
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
  })

  const formik = useFormik({
    initialValues: {
      state: undefined,
      programYear: undefined,
      firstName: undefined,
      lastName: undefined,
      phoneNumber: undefined,
      email: undefined,
      emailConfirm: undefined,
      refferedBy: undefined,
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: () => {
      submitApplication()
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    document.dispatchEvent(submitPressed)
    formik.handleSubmit()
  }

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

  useEffect(() => {
    document.dispatchEvent(programYearChanged)
  }, [yearLabel])

  const [checkEmail, { loading: emailLoading, data: emailData, error: emailError }] = useLazyQuery(checkEmailQuery, {
    fetchPolicy: 'network-only',
  })

  const checkEmailExist = () => {
    checkEmail({
      variables: {
        email: formik.values.email,
      },
    })
  }

  useEffect(() => {
    if (!loading && emailData !== undefined) {
      if (emailData.emailTaken === true) {
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
              to complete an applicadion
            </Paragraph>
          ),
        })
        setShowEmailError(true)
      } else {
        setShowEmailError(false)
      }
    }
  }, [emailLoading, emailData])
  return !loading ? (
    <form onSubmit={handleSubmit}>
      <Container sx={{ bgcolor: '#EEF4F8' }}>
        {!showConfirmationText ? (
          <Box paddingY={12}>
            <Box
              sx={{
                backgroundImage: `url(${BGSVG})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',
              }}
            >
            <Box paddingX={36}>
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
                  <Grid item xs={12}>
                    <Box marginTop={2}>
                      <DropDown
                        name='state'
                        labelTop
                        dropDownItems={availableRegions}
                        placeholder='State'
                        setParentValue={setState}
                        alternate={true}
                        sx={
                          !!(formik.touched.state && Boolean(formik.errors.state))
                            ? classes.textFieldError
                            : classes.textField
                        }
                        size='small'
                        error={{
                          error: !!(formik.touched.state && Boolean(formik.errors.state)),
                          errorMsg: (formik.touched.state && formik.errors.state) as string,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box marginTop={2}>
                      <DropDown
                        name='programYear'
                        labelTop
                        dropDownItems={schoolYears}
                        placeholder='Program Year'
                        setParentValue={setProgramYear}
                        alternate={true}
                        sx={
                          !!(formik.touched.programYear && Boolean(formik.errors.programYear))
                            ? classes.textFieldError
                            : classes.textField
                        }
                        size='small'
                        error={{
                          error: !!(formik.touched.programYear && Boolean(formik.errors.programYear)),
                          errorMsg: (formik.touched.programYear && formik.errors.programYear) as string,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <TextField
                      name='firstName'
                      size='small'
                      label='Parent First Name'
                      focused
                      variant='outlined'
                      sx={
                        !!(formik.touched.firstName && Boolean(formik.errors.firstName))
                          ? classes.textFieldError
                          : classes.textField
                      }
                      inputProps={{
                        style: { color: 'black' },
                      }}
                      InputLabelProps={{
                        style: { color: SYSTEM_05 },
                      }}
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      helperText={formik.touched.firstName && formik.errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='lastName'
                      size='small'
                      label='Parent Last Name'
                      focused
                      variant='outlined'
                      sx={
                        !!(formik.touched.lastName && Boolean(formik.errors.lastName))
                          ? classes.textFieldError
                          : classes.textField
                      }
                      inputProps={{
                        style: { color: 'black' },
                      }}
                      InputLabelProps={{
                        style: { color: SYSTEM_05 },
                      }}
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      helperText={formik.touched.lastName && formik.errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='phoneNumber'
                      size='small'
                      label='Parent Phone'
                      focused
                      variant='outlined'
                      sx={
                        !!(formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber))
                          ? classes.textFieldError
                          : classes.textField
                      }
                      inputProps={{
                        style: { color: 'black' },
                      }}
                      InputLabelProps={{
                        style: { color: SYSTEM_05 },
                      }}
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                      helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='email'
                      size='small'
                      label='Parent Email'
                      focused
                      variant='outlined'
                      sx={
                        showEmailError || !!(formik.touched.email && Boolean(formik.errors.email))
                          ? classes.textFieldError
                          : classes.textField
                      }
                      inputProps={{
                        style: { color: 'black' },
                      }}
                      InputLabelProps={{
                        style: { color: SYSTEM_05 },
                      }}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.email)}
                      helperText={
                        (showEmailError && formik.errors.email) || (formik.touched.email && formik.errors.email)
                      }
                      onBlur={checkEmailExist}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='emailConfirm'
                      size='small'
                      label='Parent Email Again'
                      focused
                      variant='outlined'
                      sx={
                        !!(formik.touched.emailConfirm && Boolean(formik.errors.emailConfirm))
                          ? classes.textFieldError
                          : classes.textField
                      }
                      inputProps={{
                        style: { color: 'black' },
                      }}
                      InputLabelProps={{
                        style: { color: SYSTEM_05 },
                      }}
                      value={formik.values.emailConfirm}
                      onChange={formik.handleChange}
                      error={formik.touched.emailConfirm && Boolean(formik.errors.emailConfirm)}
                      helperText={formik.touched.emailConfirm && formik.errors.emailConfirm}
                    />
                  </Grid>
                </Grid>
                <Box marginTop={2}>{students}</Box>
                <Grid container>
                  <Grid item xs={12}>
                    <Button
                      color='secondary'
                      variant='contained'
                      style={{
                        borderRadius: 8,
                        border: '1px solid black',
                        fontSize: 12,
                        width: '100%',
                        height: 48,
                        backgroundColor: '#EEF4F8',
                      }}
                      onClick={appendAddStudentList}
                    >
                      Add Student
                    </Button>
                  </Grid>
                  <Typography sx={{ fontSize: '7.66px', width: '125%', marginY: 4 }}>
                    Student(s) agrees to adhere to all program policies and requirements, including participation in state
                    testing. Review details at{'\u00A0'}
                    <span style={{ color: MTHBLUE, fontSize: '11.2px' }}>mytechhigh.com/utah</span>
                  </Typography>
                  <Grid item xs={12}>
                    <TextField
                      name='refferedBy'
                      size='small'
                      label='If new to My Tech High, please tell us who referred you so we can thank them!'
                      focused
                      variant='outlined'
                      sx={
                        !!(formik.touched.refferedBy && Boolean(formik.errors.refferedBy))
                          ? classes.textFieldError
                          : classes.textField
                      }
                      inputProps={{
                        style: { color: 'black' },
                      }}
                      InputLabelProps={{
                        style: { color: SYSTEM_05 },
                      }}
                      value={formik.values.refferedBy}
                      onChange={formik.handleChange}
                      error={formik.touched.refferedBy && Boolean(formik.errors.refferedBy)}
                      helperText={formik.touched.refferedBy && formik.errors.refferedBy}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      type='submit'
                      style={{
                        borderRadius: 8,
                        fontSize: 12,
                        background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
                        width: '100%',
                        height: 48,
                        marginTop: 50,
                      }}
                    >
                      Submit to Utah School
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box paddingY={12}>
            <Box
              sx={{
                backgroundImage: `url(${BGSVG})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
            <Box paddingX={36} height={'175vh'}>
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
            </Box>
          </Box>
        )}
        <Box paddingBottom={4}>
          <NewApplicationFooter />
        </Box>
      </Container>
    </form>
  ) : (
    <LoadingScreen />
  )
}
