import { Avatar, Box, Button, Card, Checkbox, FormControlLabel, Grid, OutlinedInput } from '@mui/material'
import { find } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Prompt, useHistory, useLocation } from 'react-router-dom'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../components/DropDown/types'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { Title } from '../../../../components/Typography/Title/Title'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { UserContext, UserInfo } from '../../../../providers/UserContext/UserProvider'
import { ENROLLMENT, GRAY, HOMEROOM, LIGHTGRAY, MTHBLUE, RED, SYSTEM_02 } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { StudentComponentType, StudentType } from '../types'
import { useStyles } from './styles'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client'
import { updateProfile, removeProfilePhoto } from './service'
import { DocumentUploadModal } from '../../../Enrollment/Documents/components/DocumentUploadModal/DocumentUploadModal'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';


export const StudentProfile = () => {

  // hook up formik
  // if formik values !== me && navigating -> show warning

  const { me } = useContext(UserContext)
  const { students } = me as UserInfo
  const location = useLocation()
  const studentId = location.pathname.split('/').at(-1)
  const currStudent = find(students, { student_id: studentId })
  const [student, setStudent] = useState<StudentType>(currStudent)
  const history = useHistory()

  const { person } = student
  const {status} = student?.packets.at(-1)
  const [email, setEmail] = useState(person.email)
  const [password, setPassword] = useState(undefined)

  const [submitUpdate, { data }] = useMutation(updateProfile)
  const [submitRemoveProfilePhoto, {data:userData}] = useMutation(removeProfilePhoto);
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [warningModalOpen, setWarningModalOpen] = useState(false)
  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState<undefined | File>()

  const enrollmentLink = `${HOMEROOM+ENROLLMENT}/${student.student_id}`
  
  useEffect(() => {
    setStudent(currStudent)
  }, [location])


  const [testingPreferences, setTestingPreferences] = useState('')
  const testingPreferencesItems: DropDownItem[] = [
    {
      label: 'Select',
      value: undefined,
    },
    {
      label: 'Opt In',
      value: 1,
    },
    {
      label: 'Opt Out',
      value: 0,
    },
  ]
  const setState = (id: any) => (formik.values.testingPref = id)

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .nullable(),
      lastName: yup
      .string()
      .nullable(),
    email: yup
      .string()
      .email('Please enter a valid email')
      .nullable()
      .required('Email is required')
  })

  const formik = useFormik({
    initialValues: {
      firstName: person.preferred_first_name,
      lastName: person.preferred_last_name,
      email: person.email,
      testingPref: undefined,
      password: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async() => {
      await onSave()
    },
  })

  const onSave = async () => {
    let variables = {
      student_id: parseFloat(studentId as unknown as string),
      preferred_first_name: formik.values.firstName,
      preferred_last_name: formik.values.lastName,
      email: formik.values.email,
      photo: avatar
    }
    if( file ){
      const uploadData = await uploadPhoto(file).then( async(res) => {
          return res.json()
            .then( ({data}) => {
            console.log("Upload: ", data)
            return data
            })
      })

      if( uploadData && uploadData.key ){
        variables.photo = uploadData.key
      }
    }

    submitUpdate({
      variables: {
        updateStudentProfileInput: variables,
      },
    }).then((res)  => {
      // set catch and then here, return snackbox for both success and fail
    })
  }

  const uploadPhoto = async (file) => {
    var bodyFormData = new FormData();
      bodyFormData.append('file',file[0])
      bodyFormData.append('region', 'UT')
      bodyFormData.append('year', '2022')

      return await fetch( import.meta.env.SNOWPACK_PUBLIC_S3_URL,{
          method: 'POST',
          body: bodyFormData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('JWT')}`
          },
        })
  }

  const onRemoveProfilePhoto = () => {
    setWarningModalOpen(!warningModalOpen)
    submitRemoveProfilePhoto(
      {
        variables: {
          updateStudentProfileInput: {student_id:parseFloat(studentId as unknown as string)},
        },
      }
    ).then((res) => {
      setFile(undefined)
      setAvatar(null)
    })
  }

  const convertToBlob = (file) => {
    const fileUrl = URL.createObjectURL(file[0])
    return fileUrl
  }

  const getProfilePhoto = () => {
      if( !avatar )
      return;

      const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/';
      return s3URL + person.photo;
  }

  const openImageModal = () =>  setImageModalOpen(true)

  const handleFile = (fileName: File) => setFile(fileName)

  const Image = () => (
    <Box 
      display='flex' 
      flexDirection='column' 
      justifyContent={'center'}
      sx={{height: 167, width: 167}}
    >
    {
      ( file || avatar )
        ? <>
        <Avatar 
          src={file ? convertToBlob(file) : getProfilePhoto()} 
          variant='rounded' 
          sx={{height: '100%', width: '100%'}}  
        />
        <Box onClick={() => setWarningModalOpen(true)} sx={{cursor:'pointer'}}>
          <Paragraph size='medium' fontWeight='500' textAlign='center'>Remove Profile Picture</Paragraph>
        </Box>
        </>
        : <Box 
          display='flex' 
          flexDirection='column' 
          justifyContent={'center'} 
          sx={{backgroundColor: '#FAFAFA', alignItems:'center', cursor:'pointer', height: '100%', width: '100%'}}
          onClick={() => openImageModal()}
        >
          <SystemUpdateAltIcon/>
          <Paragraph size='medium' fontWeight='500'>Upload Photo</Paragraph>
        </Box>
    }
  </Box>
  )

  const classes = useStyles
  const grade = student.grade_levels.at(-1).grade_level
  const warnUser = 
      formik.values.firstName !== person.preferred_first_name
      || person.preferred_last_name !== formik.values.lastName
      || (status !== 'Missing Info' 
        && ( email !== person.email || password !== undefined)
      )

  useEffect(() => {
    if(person && person.photo)
      setAvatar(person.photo)
    
      console.log(file), [file]
  }, [person] )

  return (
    <form onSubmit={formik.handleSubmit} >
      <Card style={{ borderRadius: 12 }}>
        <Prompt
          when={ warnUser }
          message={JSON.stringify({
            header: "Unsaved Work",
            content: "Changes you made will not be saved",
          })}
        />
        {/*<WarningModal title='Unsaved Work' subtitle='Changes you made will not be saved' />*/}
        <Grid sx={classes.gridContainer}>
        <Title>Student</Title>
          <Grid item container xs={12} rowSpacing={4} paddingX={8} columnSpacing={4} marginTop={1}>
            <Grid item xs={6}>
              <Box display='flex' flexDirection='column'>
                <Box display='flex' flexDirection='row'>
                {Image()}
                  <Box display='flex' flexDirection='column' justifyContent='center' marginLeft={4} color={GRAY}>
                    <Title>{grade === 'Kin' ? 'Kindergarten' : `${toOrdinalSuffix(student.grade_levels.at(-1).grade_level as number)} Grade`}</Title>
                    {/*{ status !== 'Missing Info' && status !== 'Submitted' && <Title>GPA</Title>}*/}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              {
                status !== 'Missing Info' && status !== 'Submitted' && 
                <Box display='flex' flexDirection='column' justifyContent='end' alignItems='end' height='100%'>
                  <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                    <Subtitle size='large' fontWeight='700' color={GRAY}>1st Semester</Subtitle>
                  </Box>
                  <Box display='flex' flexDirection='row' alignItems='center'>
                    <Subtitle size='large' fontWeight='700' color={GRAY}>2nd Semester</Subtitle>
                  </Box>
                </Box>
              }
            </Grid>
            <Grid item xs={3}>
              <Box display='flex' flexDirection='column'>
                <Paragraph size='medium' fontWeight='500'>
                  Preferred First Name
                </Paragraph>
                <OutlinedInput 
                  name='firstName'
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  sx={classes.textField}
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
                  onChange={formik.handleChange}
                  sx={classes.textField}
                />
              </Box>
            </Grid>
            <Grid item xs={3}/>
            <Grid item xs={3}>
              {
                status !== 'Missing Info' && status !== 'Submitted' && 
                <Box>
                  <Box display='flex' flexDirection='column' alignItems='center'>
                    <Paragraph size='medium' fontWeight='500'>
                      Learning Logs
                    </Paragraph>
                    <Button variant='contained' sx={classes.button} disableElevation>
                      Download
                    </Button>
                  </Box>
                </Box>
              }
            </Grid>
            <Grid item xs={3}>
              {status !== 'Missing Info' && 
              <Box display='flex' flexDirection='column'>
                <Paragraph size='medium' fontWeight='500'>
                  Testing Preference
                </Paragraph>
                <DropDown
                  dropDownItems={testingPreferencesItems}
                  defaultValue={undefined}
                  setParentValue={setState}
                  dropdownColor={`rgba(236, 89, 37, 0.1)`}
                />
              </Box>
              }
            </Grid>
            <Grid item xs={3}>
              <Box display='flex' flexDirection='column' alignItems='center'>
                <Paragraph size='medium' fontWeight='500'>
                  Enrollment Packet
                </Paragraph>
                {
                  status === 'Missing Info'
                  ? <Button 
                    sx={classes.resubmitButton} 
                    variant='contained' 
                    onClick={() => history.push(enrollmentLink)}
                  >
                    Resubmit
                  </Button>
                : status === 'Submitted'
                  ?<Button 
                    sx={classes.enrollmentButton} 
                    variant='contained' 
                    onClick={() => history.push(enrollmentLink)}
                  >
                    Submitted
                  </Button>
                  : <Button 
                    sx={classes.enrollmentButton} 
                    variant='contained' 
                    onClick={() => history.push(enrollmentLink)}
                  >
                    View
                  </Button>
                }
              </Box>
            </Grid>
            <Grid item xs={3}/>
            <Grid item xs={3}>
              {
                status !== 'Missing Info' && status !== 'Submitted' && 
                  <Box display='flex' flexDirection='column' alignItems='center'>
                    <Paragraph size='medium' fontWeight='500'>
                      Unofficial Transcript
                    </Paragraph>
                    <Button variant='contained' sx={classes.button} disableElevation>
                      Download
                    </Button>
                  </Box>
              }
            </Grid>
            <Grid item xs={6}>
              { status !== 'Missing Info' && 
              <Box display='flex' flexDirection='column'>
                <Paragraph size='medium' fontWeight='500'>
                  Student Email
                </Paragraph>
                <OutlinedInput 
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  sx={classes.textField}
                />
              </Box>
              }
            </Grid>
            <Grid item xs={6}/>
            <Grid item xs={6}>
              {status !== 'Missing Info' && 
              <Box display='flex' flexDirection='column' width='100%'>
                <Paragraph size='medium' fontWeight='500'>
                  Password
                </Paragraph>
                <OutlinedInput
                  name='password'
                  type='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  sx={classes.textField}
                />
              </Box>
              }
            </Grid>
            <Grid item xs={3}/>
            <Grid item xs={3}>
              <Box display='flex' flexDirection='column' width='100%' alignItems={'center'}>
                <Paragraph size='medium' fontWeight='500'>
                  &nbsp;
                </Paragraph>
                <Button variant='contained' sx={classes.saveButton} type='submit'>Save Changes</Button>
              </Box> 
            </Grid>
          </Grid>
        </Grid>
        { 
          imageModalOpen 
            && <DocumentUploadModal
              handleModem={() => setImageModalOpen(!imageModalOpen)}
              handleFile={handleFile}
            /> 
        }
        {
          warningModalOpen 
            && <WarningModal
              handleSubmit={() => onRemoveProfilePhoto()}
              handleModem={() => setWarningModalOpen(!warningModalOpen)}
              title='Delete Image'
              subtitle='Are you sure you  want to delete  this image'
            /> 
        }
      </Card>
    </form>
  )
}
