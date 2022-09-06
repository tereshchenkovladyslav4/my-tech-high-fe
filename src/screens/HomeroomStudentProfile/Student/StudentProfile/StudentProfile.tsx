import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Avatar, Box, Button, Card, FormHelperText, Grid, OutlinedInput, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { Prompt, useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { DocumentUploadModal } from '@mth/components/DocumentUploadModal/DocumentUploadModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { s3URL, SNOWPACK_PUBLIC_S3_URL } from '@mth/constants'
import { MthColor, MthRoute, PacketStatus } from '@mth/enums'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { gradeText } from '@mth/utils'
import { Person, StudentType } from '../types'
import { updateProfile, removeProfilePhoto } from './service'
import { studentProfileClasses } from './styles'

export const StudentProfile: React.FC = () => {
  const history = useHistory()
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo
  const studentId = location.pathname.split('/').at(-1)

  const [student, setStudent] = useState<StudentType>()
  const [person, setPerson] = useState<Person>()
  const [status, setStatus] = useState<string>()

  const [isFormChanged, setIsFormChanged] = useState(false)
  const [submitUpdate] = useMutation(updateProfile)
  const [submitRemoveProfilePhoto] = useMutation(removeProfilePhoto)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [warningModalOpen, setWarningModalOpen] = useState(false)
  const [avatar, setAvatar] = useState<string | undefined>()
  const [file, setFile] = useState<undefined | File>()

  const enrollmentLink = `${MthRoute.HOMEROOM + MthRoute.ENROLLMENT}/${student?.student_id}`

  const testingPreferencesItems: DropDownItem[] = [
    {
      label: 'Select',
      value: '',
    },
    {
      label: 'Opt In',
      value: 'Opt In',
    },
    {
      label: 'Opt Out',
      value: 'Opt Out',
    },
  ]
  const setState = (id: number | string) => {
    formik.values.testingPref = id?.toString()
  }

  const uploadLimit = 1

  const validationSchema = yup.object({
    firstName: yup.string().nullable(),
    lastName: yup.string().nullable(),
    email: yup.string().email('Please enter a valid email').nullable().required('Email is required'),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Passwords must contain 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
      )
      .nullable(),
  })

  const formik = useFormik({
    initialValues: {
      firstName: person?.preferred_first_name || '',
      lastName: person?.preferred_last_name || '',
      email: person?.email || '',
      testingPref: student?.testing_preference || '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await onSave()
    },
  })

  const onSave = async () => {
    const variables = {
      student_id: parseFloat(studentId as unknown as string),
      preferred_first_name: formik.values.firstName,
      preferred_last_name: formik.values.lastName,
      email: formik.values.email,
      photo: avatar,
      testing_preference: formik.values.testingPref,
      password: formik.values.password,
    }
    if (file) {
      const uploadData = await uploadPhoto(file).then(async (res) => {
        return res.json().then(({ data }) => {
          return data
        })
      })

      if (uploadData && uploadData.key) {
        variables.photo = uploadData.key
      }
    }

    submitUpdate({
      variables: {
        updateStudentProfileInput: variables,
      },
    }).then(() => {
      // set catch and then here, return snack box for both success and fail
      location.reload()
    })
  }

  const uploadPhoto = async (file: File) => {
    const bodyFormData = new FormData()
    bodyFormData.append('file', file)
    bodyFormData.append('region', 'UT')
    bodyFormData.append('year', '2022')

    return await fetch(SNOWPACK_PUBLIC_S3_URL, {
      method: 'POST',
      body: bodyFormData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
    })
  }

  const onRemoveProfilePhoto = () => {
    setWarningModalOpen(!warningModalOpen)
    submitRemoveProfilePhoto({
      variables: {
        updateStudentProfileInput: { student_id: parseFloat(studentId as unknown as string) },
      },
    }).then(() => {
      setFile(undefined)
      setAvatar(undefined)
      location.reload()
    })
  }

  const convertToBlob = (file: File) => {
    return URL.createObjectURL(file)
  }

  const getProfilePhoto = (): string | undefined => {
    if (avatar) {
      return s3URL + person?.photo
    } else {
      return undefined
    }
  }

  const openImageModal = () => setImageModalOpen(true)

  const handleFile = (files: File[]) => {
    if (files.length) setFile(files[0])
  }

  const Image = () => (
    <Box display='flex' flexDirection='column' justifyContent={'center'} sx={{}}>
      {file || avatar ? (
        <>
          <Avatar
            src={file ? convertToBlob(file) : getProfilePhoto()}
            variant='rounded'
            sx={{ height: 167, width: 167, borderRadius: 1 }}
          />
          <Box component='a' onClick={() => setWarningModalOpen(true)} sx={{ cursor: 'pointer', p: 1 }}>
            <Paragraph size='medium' color='#7B61FF' fontWeight='500' textAlign='center'>
              Remove Profile Picture
            </Paragraph>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          flexDirection='column'
          justifyContent={'center'}
          sx={{ backgroundColor: '#FAFAFA', alignItems: 'center', cursor: 'pointer', height: '100%', width: '100%' }}
          onClick={() => openImageModal()}
        >
          <SystemUpdateAltIcon />
          <Paragraph size='medium' fontWeight='500'>
            Upload Photo
          </Paragraph>
        </Box>
      )}
    </Box>
  )

  useEffect(() => {
    if (person && person.photo) setAvatar(person?.photo)
  }, [person])

  useEffect(() => {
    if (!studentId) {
      history.push(MthRoute.HOMEROOM)
      return
    }

    const currStudent: StudentType | undefined = students?.find((item) => +item.student_id === +studentId)
    if (!currStudent) {
      history.push(MthRoute.HOMEROOM)
      return
    }
    setStudent(currStudent)
    const { person: currPerson } = currStudent
    setPerson(currStudent?.person)
    setStatus(student?.packets?.at(-1)?.status)

    formik.setValues({
      firstName: currPerson?.preferred_first_name || '',
      lastName: currPerson?.preferred_last_name || '',
      email: currPerson?.email || '',
      testingPref: currStudent?.testing_preference || '',
      password: '',
    })
  }, [studentId])

  return (
    <form onSubmit={formik.handleSubmit}>
      {student && person && (
        <Card style={{ borderRadius: 12 }}>
          <Prompt
            when={isFormChanged}
            message={JSON.stringify({
              header: 'Unsaved Changes',
              content: 'Are you sure you want to leave without saving changes?',
            })}
          />
          {/* Needed to prevent auto complete for the new password field */}
          <Box sx={{ width: 0, height: 0, overflow: 'hidden' }}>
            <TextField name='fakePassword' type='password' autoComplete='off' />
          </Box>
          {/*<WarningModal title='Unsaved Work' subtitle='Changes you made will not be saved' />*/}
          <Grid sx={studentProfileClasses.gridContainer}>
            <Title>Student</Title>
            <Grid item container xs={12} rowSpacing={4} paddingX={8} columnSpacing={4} marginTop={1}>
              <Grid item xs={6}>
                <Box display='flex' flexDirection='column'>
                  <Box display='flex' flexDirection='row'>
                    {Image()}
                    <Box
                      display='flex'
                      flexDirection='column'
                      justifyContent='center'
                      marginLeft={4}
                      color={MthColor.GRAY}
                    >
                      <Title>{gradeText(student)}</Title>
                      {/*{ status !== PacketStatus.MISSING_INFO && status !== 'Submitted' && <Title>GPA</Title>}*/}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                {status !== PacketStatus.MISSING_INFO && status !== 'Submitted' && (
                  <Box display='flex' flexDirection='column' justifyContent='end' alignItems='end' height='100%'>
                    <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                      <Subtitle size='large' fontWeight='700' color={MthColor.GRAY}>
                        1st Semester
                      </Subtitle>
                    </Box>
                    <Box display='flex' flexDirection='row' alignItems='center'>
                      <Subtitle size='large' fontWeight='700' color={MthColor.GRAY}>
                        2nd Semester
                      </Subtitle>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid item xs={3}>
                <Box display='flex' flexDirection='column'>
                  <Paragraph size='medium' fontWeight='500'>
                    Preferred First Name
                  </Paragraph>
                  <OutlinedInput
                    name='firstName'
                    value={formik.values.firstName}
                    onChange={(e) => {
                      formik.handleChange(e)
                      setIsFormChanged(true)
                    }}
                    sx={studentProfileClasses.formField}
                  />
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box display='flex' flexDirection='column'>
                  <Paragraph size='medium' fontWeight='500'>
                    Preferred Last Name
                  </Paragraph>
                  <OutlinedInput
                    name='lastName'
                    value={formik.values.lastName}
                    onChange={(e) => {
                      formik.handleChange(e)
                      setIsFormChanged(true)
                    }}
                    sx={studentProfileClasses.formField}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} />
              <Grid item xs={3}>
                {status !== PacketStatus.MISSING_INFO && status !== 'Submitted' && (
                  <Box>
                    <Box display='flex' flexDirection='column' alignItems='center'>
                      <Paragraph size='medium' fontWeight='500'>
                        Learning Logs
                      </Paragraph>
                      <Button variant='contained' sx={studentProfileClasses.button} disableElevation>
                        Download
                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid item xs={3}>
                {status !== PacketStatus.MISSING_INFO && (
                  <Box display='flex' flexDirection='column'>
                    <Paragraph size='medium' fontWeight='500'>
                      Testing Preference
                    </Paragraph>
                    <DropDown
                      dropDownItems={testingPreferencesItems}
                      defaultValue={student.testing_preference}
                      setParentValue={(value) => {
                        setState(value)
                        setIsFormChanged(true)
                      }}
                      dropdownColor={'rgba(236, 89, 37, 0.1)'}
                      sx={studentProfileClasses.formField}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={3}>
                <Box display='flex' flexDirection='column' alignItems='center'>
                  <Paragraph size='medium' fontWeight='500'>
                    Enrollment Packet
                  </Paragraph>
                  {status === PacketStatus.MISSING_INFO ? (
                    <Button
                      sx={studentProfileClasses.resubmitButton}
                      variant='contained'
                      onClick={() => history.push(enrollmentLink)}
                    >
                      Resubmit
                    </Button>
                  ) : status === 'Submitted' ? (
                    <Button sx={studentProfileClasses.pendingBtn} variant='contained'>
                      Pending Approval
                    </Button>
                  ) : (
                    <Button
                      sx={studentProfileClasses.enrollmentButton}
                      variant='contained'
                      onClick={() => history.push(enrollmentLink)}
                    >
                      View
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item xs={3} />
              <Grid item xs={3}>
                {status !== PacketStatus.MISSING_INFO && status !== 'Submitted' && (
                  <Box display='flex' flexDirection='column' alignItems='center'>
                    <Paragraph size='medium' fontWeight='500'>
                      Unofficial Transcript
                    </Paragraph>
                    <Button variant='contained' sx={studentProfileClasses.button} disableElevation>
                      Download
                    </Button>
                  </Box>
                )}
              </Grid>
              <Grid item xs={6}>
                {status !== PacketStatus.MISSING_INFO && (
                  <Box display='flex' flexDirection='column'>
                    <Paragraph size='medium' fontWeight='500'>
                      Student Email
                    </Paragraph>
                    <OutlinedInput
                      name='email'
                      value={formik.values.email}
                      onChange={(e) => {
                        formik.handleChange(e)
                        if (status !== PacketStatus.MISSING_INFO) setIsFormChanged(true)
                      }}
                      sx={studentProfileClasses.formField}
                      autoComplete='off'
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={6}>
                {status !== PacketStatus.MISSING_INFO && (
                  <Box display='flex' flexDirection='column' width='100%'>
                    <Paragraph size='medium' fontWeight='500'>
                      Password
                    </Paragraph>
                    <OutlinedInput
                      name='password'
                      type='password'
                      value={formik.values.password}
                      onChange={(e) => {
                        formik.handleChange(e)
                        if (status !== PacketStatus.MISSING_INFO) setIsFormChanged(true)
                      }}
                      sx={studentProfileClasses.formField}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                    />
                    <FormHelperText sx={{ color: MthColor.RED }}>
                      {formik.touched.password && formik.errors.password}
                    </FormHelperText>
                  </Box>
                )}
              </Grid>
              <Grid item xs={3} />
              <Grid item xs={3}>
                <Box display='flex' flexDirection='column' width='100%' alignItems={'center'}>
                  <Paragraph size='medium' fontWeight='500'>
                    &nbsp;
                  </Paragraph>
                  <Button variant='contained' sx={studentProfileClasses.saveButton} type='submit'>
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {imageModalOpen && (
            <DocumentUploadModal
              handleModem={() => setImageModalOpen(!imageModalOpen)}
              handleFile={handleFile}
              limit={uploadLimit}
            />
          )}
          {warningModalOpen && (
            <WarningModal
              handleSubmit={() => onRemoveProfilePhoto()}
              handleModem={() => setWarningModalOpen(!warningModalOpen)}
              title='Delete Image'
              subtitle='Are you sure you  want to delete  this image'
            />
          )}
        </Card>
      )}
    </form>
  )
}
