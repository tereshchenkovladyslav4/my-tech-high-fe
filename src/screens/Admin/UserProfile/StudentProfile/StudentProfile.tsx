import { Avatar, Button, Checkbox, FormControlLabel, Grid, TextField, Select, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../components/DropDown/types'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { Title } from '../../../../components/Typography/Title/Title'
import { BUTTON_LINEAR_GRADIENT, MTHBLUE, RED } from '../../../../utils/constants'
import { StudentFilters } from './components/StudentFilters'
import { getStudentDetail } from '../services'
import moment from 'moment'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { KeyboardArrowDown } from '@mui/icons-material'
import { makeStyles } from '@material-ui/styles'

const selectStyles = makeStyles({
  select: {
    maxWidth: '150px',
    height: '35px',
    textAlign: 'left',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'red',
      display: 'none',
    },
  },
  backgroundSelect: {
    fontSize: '12px',
    borderRadius: '15px',
    minWidth: '80px',
    height: '29px',
    textAlign: 'center',
    background: BUTTON_LINEAR_GRADIENT,
    color: '#F2F2F2',
    '&:before': {
      borderColor: BUTTON_LINEAR_GRADIENT,
    },
    '&:after': {
      borderColor: BUTTON_LINEAR_GRADIENT,
    },
  },
})
const ordinal = (n) => {
  var s = ['th', 'st', 'nd', 'rd']
  var v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
export const StudentProfile = ({ studentId, setStudentPerson, setStudentStatus, studentStatus }) => {
  const classes = selectStyles()
  const {
    loading: userLoading,
    error: userError,
    data: currentUserData,
    refetch,
  } = useQuery(getStudentDetail, {
    variables: {
      student_id: studentId,
    },
    fetchPolicy: 'cache-and-network',
  })

  const [userInfo, setUserInfo] = useState<any>({})
  const [preferedFirstName, setPreferredFirstName] = useState('')
  const [preferedLastName, setPreferredLastName] = useState('')
  const [hispanicOrLatino, setHispanicOrLatino] = useState('')

  const [legalFirstName, setLegalFirstName] = useState('')
  const [legalMiddleName, setLegalMiddleName] = useState('')
  const [legalLastName, setLegalLastName] = useState('')

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [street1, setStreet1] = useState('')
  const [street2, setStreet2] = useState('')
  const [state, setState] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [packets, setPackets] = useState([])
  const [openNotes, setOpenNotes] = useState(false)
  const [canMessage, setCanMessage] = useState(false)

  const hispanicOrLatinoItems: DropDownItem[] = [
    {
      label: 'Opt-in',
      value: 'Opt-in',
    },
    {
      label: 'Opt-out',
      value: 'Opt-out',
    },
    {
      label: 'Prefer not to say',
      value: 'Prefer not to say',
    },
  ]

  const genderItems: DropDownItem[] = [
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Female',
      value: 'Female',
    },
  ]
  useEffect(() => {
    setStudentPerson(userInfo)
  }, [userInfo])
  useEffect(() => {
    if (currentUserData) {
      setEmail(currentUserData.student.person.email)
      setPreferredFirstName(currentUserData.student.person.preferred_first_name)
      setPreferredLastName(currentUserData.student.person.preferred_last_name)
      setLegalFirstName(currentUserData.student.person.first_name)
      setLegalLastName(currentUserData.student.person.last_name)
      setLegalMiddleName(currentUserData.student.person.middle_name)
      setGender(currentUserData.student.person.gender)
      setCity(currentUserData.student.person.address.city)
      setState(currentUserData.student.person.address.state)
      setStreet1(currentUserData.student.person.address.street)
      setStreet2(currentUserData.student.person.address.street2)
      setZip(currentUserData.student.person.address.zip)
      setPhone(currentUserData.student.person.phone.number)
      setUserInfo(currentUserData.student.person)
      setPackets(currentUserData.student.packets)
      console.log(currentUserData.student.person.gender)
      if (currentUserData.student.grade_levels && currentUserData.student.grade_levels[0]) {
        setGradeLevel(currentUserData.student.grade_levels[0].grade_level)
      }
      if (currentUserData.student.person.phone.ext) {
        setCanMessage(true)
      }
      setStudentStatus({
        student_id: +studentId,
        special_ed: currentUserData.student.special_ed,
        diploma_seeking: currentUserData.student.diploma_seeking,
        status: currentUserData.student.status.length && currentUserData.student.status[0].status,
        // grade_level: currentUserData.student.status.length && currentUserData.student.status[0].grade_level,
        school_year_id:
          currentUserData.student.applications.length && currentUserData.student.applications[0].school_year_id,
      })
    }
  }, [currentUserData])

  useEffect(() => {
    refetch()
  }, [studentId])
  return (
    <Box
      sx={{
        marginTop: '24px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Button
          sx={{
            background: BUTTON_LINEAR_GRADIENT,
            textTransform: 'none',
            color: 'white',
            marginRight: 2,
            width: '264px',
            height: '34px',
            borderRadius: 2,
          }}
        >
          Reimbursements
        </Button>
        <Button
          sx={{
            background: BUTTON_LINEAR_GRADIENT,
            textTransform: 'none',
            color: 'white',
            marginRight: 2,
            width: '264px',
            height: '34px',
            borderRadius: 2,
          }}
        >
          Homeroom Resources
        </Button>
        <Button
          sx={{
            background: BUTTON_LINEAR_GRADIENT,
            textTransform: 'none',
            color: 'white',
            marginRight: 2,
            width: '264px',
            height: '34px',
            borderRadius: 2,
          }}
        >
          Homeroom (Sample Teacher)
        </Button>
      </Box>
      <Grid container marginTop={4} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Avatar
              alt='Remy Sharp'
              variant='rounded'
              style={{ height: '127px', width: '127px', marginRight: '12px' }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <Title textAlign='left' fontWeight='700' color={MTHBLUE}>
                {legalFirstName} {legalLastName}
              </Title>
              {/* <Subtitle textAlign='left' fontWeight='700'>
                {gradeLevel.includes('K') ? 'K' : ordinal(gradeLevel)} Grade
              </Subtitle> */}
              <Select
                IconComponent={KeyboardArrowDown}
                className={classes.select}
                value={gradeLevel.includes('K') ? 'K' : gradeLevel}
                sx={{ fontWeight: 700 }}
              >
                <MenuItem value='K'>K</MenuItem>
                {[...Array(12).keys()].map((item) => (
                  <MenuItem value={item + 1}>{ordinal(item + 1)} Grade</MenuItem>
                ))}
              </Select>
              {/* <Subtitle textAlign='left'>Unassigned</Subtitle> */}
              <Select IconComponent={KeyboardArrowDown} className={classes.select} value={'Unassigned'}>
                <MenuItem value='Unassigned'>Unassigned</MenuItem>
              </Select>
            </Box>
          </Box>
        </Grid>
        <Grid item container xs={4}>
          <Grid item xs={3} sx={{ alignItems: 'center', display: 'flex', fontWeight: '700' }}>
            Packet
          </Grid>
          <Grid item xs={9} sx={{ alignItems: 'center', display: 'flex' }}>
            <Button
              sx={{
                background: BUTTON_LINEAR_GRADIENT,
                textTransform: 'none',
                color: 'white',
                marginRight: 2,
                width: '198px',
                height: '29px',
                borderRadius: 2,
                fontWeight: '800',
              }}
            >
              {packets.length && packets[0].status === 'Accepted'
                ? `Accepted ${moment(packets[0].date_accepted).format('l')}`
                : ''}
            </Button>
          </Grid>
          <Grid item xs={3} sx={{ alignItems: 'center', display: 'flex', fontWeight: '700' }}>
            Schedule
          </Grid>
          <Grid item xs={9} sx={{ alignItems: 'center', display: 'flex' }}>
            <Button
              sx={{
                background: BUTTON_LINEAR_GRADIENT,
                textTransform: 'none',
                color: 'white',
                marginRight: 2,
                width: '198px',
                height: '29px',
                borderRadius: 2,
                fontWeight: '800',
              }}
            ></Button>
          </Grid>
        </Grid>
        <Grid item container xs={4}>
          <Grid item xs={12} sx={{ alignItems: 'center', display: 'flex' }}>
            <Subtitle fontWeight='700' color={MTHBLUE}>
              92%
            </Subtitle>
            <Subtitle textAlign='left' fontWeight='700' color={'#CCCCCC'} sx={{ marginLeft: 3 }}>
              1st Semester # of Zeros
            </Subtitle>
          </Grid>
          <Grid item xs={12} sx={{ alignItems: 'center', display: 'flex' }}>
            <Subtitle fontWeight='700' color={RED}>
              65%
            </Subtitle>
            <Subtitle textAlign='left' fontWeight='700' color={'#CCCCCC'} sx={{ marginLeft: 3 }}>
              2nd Semester # of Zeros
            </Subtitle>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Grid item container xs={4}>
            <Grid item xs={12} sx={{ alignItems: 'center', display: 'flex' }}>
              <Button
                sx={{
                  background: BUTTON_LINEAR_GRADIENT,
                  textTransform: 'none',
                  color: 'white',
                  marginLeft: 5,
                  width: '198px',
                  height: '29px',
                  borderRadius: 2,
                  fontWeight: '800',
                }}
                onClick={() => setOpenNotes(true)}
              >
                Notes and Inventions
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <StudentFilters
            currentUserData={currentUserData}
            setStudentStatuData={setStudentStatus}
            studentStatusData={studentStatus}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Preferred First Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={preferedFirstName}
            onChange={(e) => {
              setPreferredFirstName(e.target.value)
              setUserInfo({ ...userInfo, ...{ preferred_first_name: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Preferred Last Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={preferedLastName}
            onChange={(e) => {
              setPreferredLastName(e.target.value)
              setUserInfo({ ...userInfo, ...{ preferred_last_name: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Paragraph size='medium' textAlign='left'>
            Gender
          </Paragraph>
          <DropDown
            sx={{ width: '70%' }}
            size='small'
            dropDownItems={genderItems}
            defaultValue={gender}
            placeholder={gender}
            setParentValue={(e) => {
              setGender(e)
              setUserInfo({ ...userInfo, ...{ gender: e } })
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Paragraph size='medium' textAlign='left'>
            Testing Preference
          </Paragraph>
          <DropDown
            size='small'
            sx={{ width: '50%' }}
            dropDownItems={hispanicOrLatinoItems}
            defaultValue={hispanicOrLatino}
            setParentValue={(e) => {
              setHispanicOrLatino(e)
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Legal First Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={legalFirstName}
            onChange={(e) => {
              setLegalFirstName(e.target.value)
              setUserInfo({ ...userInfo, ...{ first_name: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Legal Middle Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={legalMiddleName}
            onChange={(e) => {
              setLegalMiddleName(e.target.value)
              setUserInfo({ ...userInfo, ...{ middle_name: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ width: '50%' }}>
            <Paragraph size='medium' textAlign='left'>
              Legal Last Name
            </Paragraph>
            <TextField
              size='small'
              variant='outlined'
              fullWidth
              value={legalLastName}
              onChange={(e) => {
                setLegalLastName(e.target.value)
                setUserInfo({ ...userInfo, ...{ last_name: e.target.value } })
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Phone
          </Paragraph>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              size='small'
              variant='outlined'
              fullWidth
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setUserInfo({ ...userInfo, phone: { ...userInfo.phone, number: e.target.value } })
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={canMessage}
                  onChange={(e) => {
                    setCanMessage(e.target.checked)
                    setUserInfo({ ...userInfo, phone: { ...userInfo.phone, ext: e.target.checked ? '1' : null } })
                  }}
                />
              }
              label={<Paragraph>I can receive text messages via this number</Paragraph>}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Email
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setUserInfo({ ...userInfo, ...{ email: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Paragraph size='medium' textAlign='left'>
            City
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, city: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Paragraph size='medium' textAlign='left'>
            Address line 1
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={street1}
            onChange={(e) => {
              setStreet1(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, street: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            State
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={state}
            onChange={(e) => {
              setState(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, state: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Zip
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={zip}
            onChange={(e) => {
              setZip(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, zip: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ width: '49.25%' }}>
            <Paragraph size='medium' textAlign='left'>
              Address line 2
            </Paragraph>
            <TextField
              size='small'
              variant='outlined'
              fullWidth
              value={street2}
              onChange={(e) => {
                setStreet2(e.target.value)
                setUserInfo({ ...userInfo, address: { ...userInfo.address, street2: e.target.value } })
              }}
            />
          </Box>
        </Grid>
      </Grid>
      {openNotes && (
        <WarningModal
          handleModem={() => setOpenNotes(false)}
          title={'Notes'}
          subtitle={''}
          btntitle='Close'
          handleSubmit={() => setOpenNotes(false)}
          showIcon={false}
        />
      )}
    </Box>
  )
}
