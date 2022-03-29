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
import { useFormik } from 'formik'


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
  const {status} = student.packets.at(-1)
  const [email, setEmail] = useState(person.email)
  const [password, setPassword] = useState(undefined)

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

  const formik = useFormik({
    initialValues: {
      firstName: person.preferred_first_name,
      lastName: person.preferred_last_name,
      email: person.email,
      testingPref: undefined,
      password: undefined,
    },
    //validationSchema,
    validateOnBlur: true,
    onSubmit: () => {
      //submitApplication()
    },
  })


  const classes = useStyles

  const warnUser = 
      formik.values.firstName !== person.preferred_first_name
      || person.preferred_last_name !== formik.values.lastName
      || (status !== 'Missing Info' 
        && ( email !== person.email || password !== undefined)
      )


  return (
    <form>
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
                  <Avatar variant='square' style={classes.avatar} />
                  <Box display='flex' flexDirection='column' justifyContent='end' marginLeft={4} color={GRAY}>
                    <Title>{toOrdinalSuffix(student.grade_levels.at(-1).grade_level)} Grade</Title>
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
              <Box display='flex' flexDirection='column' width='100%' alignItems={'flex-end'}>
                <Paragraph size='medium' fontWeight='500'>
                  &nbsp;
                </Paragraph>
                <Button variant='contained' sx={classes.enroollmentButton}>Save Changes</Button>
              </Box> 
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </form>
  )
}
