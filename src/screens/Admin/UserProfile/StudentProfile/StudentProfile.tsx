import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { makeStyles } from '@material-ui/styles'
import { KeyboardArrowDown } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { ApplicationStatus, MthTitle } from '@mth/enums'
import { getAssessmentsBySchoolYearId, getStudentAssessmentsByStudentId } from '@mth/graphql/queries/assessment'
import { getWithdrawalStatusQuery } from '@mth/graphql/queries/withdrawal'
import { Packet, Person, Phone } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { AssessmentType } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/types'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { BUTTON_LINEAR_GRADIENT, MTHBLUE } from '../../../../utils/constants'
import { STATES_WITH_ABBREVIATION } from '../../../../utils/states'
import { getPreviousSchoolYearId, phoneFormat } from '../../../../utils/utils'
import { ProfilePacketModal } from '../../EnrollmentPackets/EnrollmentPacketModal/ProfilePacketModal'
import { GetSchoolsPartner } from '../../SchoolOfEnrollment/services'
import { getStudentDetail, getSchoolYearsByRegionId } from '../services'
import { StudentFilters } from './components/StudentFilters'

type StudentTemp = {
  student_id: number
  special_ed: string
  diploma_seeking: string
  testing_preference: string
  status: string
  date: string
  school_year_id: number
  school_partner_id: number
  school_partner_id_updated: boolean
}

type StudentProfileProps = {
  studentId: number
  setStudentPerson: StudentType
  setStudentStatus: (_: StudentTemp) => void
  studentStatus: StudentTemp
  applicationState: ApplicationStatus
  setIsChanged: (_: boolean) => void
  phoneInfo: Phone
  setPhoneInfo: (_: Phone) => void
}

type StudentAssessment = {
  assessmentId: number
  assessmentOptionId?: number | undefined
  optionId: number | undefined
  assessmentOptionOutText: string
}

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
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
export const StudentProfile: React.FC<StudentProfileProps> = ({
  studentId,
  setStudentPerson,
  setStudentStatus,
  studentStatus,
  applicationState,
  setIsChanged,
  phoneInfo,
  setPhoneInfo,
}) => {
  const { me } = useContext(UserContext)
  const classes = selectStyles()
  const [originStudentStatus, setOriginStudentStatus] = useState({})
  const [studentAssessments, setStudentAssessments] = useState<StudentAssessment[]>([])
  const [assessmentItems, setAssessmentItems] = useState<AssessmentType[]>([])
  const [specialEdOptions, setSpecialEdOptions] = useState<string[]>([])

  const { data: currentUserData, refetch } = useQuery(getStudentDetail, {
    variables: {
      student_id: studentId,
    },
    fetchPolicy: 'cache-and-network',
  })
  const { data: regionData } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'cache-and-network',
  })

  const selectedYearId = useMemo(() => {
    return currentUserData?.student?.applications?.[0]?.school_year_id
  }, [currentUserData])

  const { data: schoolPartnerData } = useQuery(GetSchoolsPartner, {
    variables: {
      schoolPartnerArgs: {
        region_id: me?.selectedRegionId,
        school_year_id: selectedYearId,
        sort: {
          column: 'name',
          direction: 'ASC',
        },
      },
    },
    skip: !selectedYearId,
    fetchPolicy: 'network-only',
  })

  const { data: assessments, loading: assessmentsLoading } = useQuery(getAssessmentsBySchoolYearId, {
    variables: {
      schoolYearId: selectedYearId,
    },
    skip: !selectedYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!assessmentsLoading && assessments?.getAssessmentsBySchoolYearId) {
      const items = assessments?.getAssessmentsBySchoolYearId
      setAssessmentItems(items.map((item: AssessmentType) => ({ ...item, assessment_id: Number(item.assessment_id) })))
    } else {
      setAssessmentItems([])
    }
  }, [assessments, assessmentsLoading])

  const { loading: studentAssessmentLoading, data: studentAssessmentsData } = useQuery(
    getStudentAssessmentsByStudentId,
    {
      variables: {
        studentId: Number(studentId),
      },
      skip: Number(studentId) ? false : true,
      fetchPolicy: 'network-only',
    },
  )

  useEffect(() => {
    if (!studentAssessmentLoading && studentAssessmentsData?.getStudentAssessmentsByStudentId) {
      setStudentAssessments(
        studentAssessmentsData?.getStudentAssessmentsByStudentId?.map(
          (assessment: { AssessmentId: number; assessment_option_id: number; OptionId: number; out_text: string }) => ({
            assessmentId: assessment?.AssessmentId,
            assessmentOptionId: assessment?.assessment_option_id,
            optionId: assessment?.OptionId,
            assessmentOptionOutText: assessment?.out_text,
          }),
        ),
      )
    }
  }, [studentAssessmentLoading, studentAssessmentsData])

  const SoEitems = useMemo(() => {
    if (schoolPartnerData?.getSchoolsOfEnrollmentByRegion?.length) {
      const partnerList = schoolPartnerData.getSchoolsOfEnrollmentByRegion
        .filter((el) => !!el.active)
        .map((item) => ({
          value: item.school_partner_id,
          label: item.name,
          abb: item.abbreviation,
        }))
      partnerList.push({
        value: 'unassigned',
        label: 'Unassigned',
        abb: 'Unassigned',
      })
      return partnerList
    } else return []
  }, [schoolPartnerData])

  const [withdrawalStatus, setWithdrawalStatus] = useState('')
  //  Load withdrawal status from database
  const { data: withdrawalStatusData } = useQuery(getWithdrawalStatusQuery, {
    variables: {
      filter: {
        StudentId: studentId,
      },
    },
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (withdrawalStatusData && withdrawalStatusData.withdrawalStatus.error === false) {
      if (withdrawalStatusData.withdrawalStatus.results.length > 0)
        setWithdrawalStatus(withdrawalStatusData.withdrawalStatus.results[0])
    }
  }, [withdrawalStatusData])
  //

  const [userInfo, setUserInfo] = useState<Person>({})
  const [preferedFirstName, setPreferredFirstName] = useState('')
  const [preferedLastName, setPreferredLastName] = useState('')

  const [legalFirstName, setLegalFirstName] = useState('')
  const [legalMiddleName, setLegalMiddleName] = useState('')
  const [legalLastName, setLegalLastName] = useState('')

  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [street1, setStreet1] = useState('')
  const [street2, setStreet2] = useState('')
  const [state, setState] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [packets, setPackets] = useState<Packet[]>([])
  const [openNotes, setOpenNotes] = useState(false)
  const [canMessage, setCanMessage] = useState(false)
  const [showPacketModal, setShowPacketModal] = useState(false)
  const [packetID, setPacketID] = useState(0)
  const [tempSoE, setTempSoE] = useState('')
  const [assignOrTransfer, setAssignOrTransfer] = useState('assign')
  const [modalAssign, setModalAssign] = useState(false)
  const [schoolPartnerId, setSchoolPartnerId] = useState('')

  const handlePacket = () => {
    if (packets.length <= 0) return

    setPacketID(packets[0].packet_id)
    setShowPacketModal(true)
  }

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
      const stateSelected = currentUserData.student.person.address.state || applicationState

      setEmail(currentUserData.student.person.email)
      setPreferredFirstName(currentUserData.student.person.preferred_first_name)
      setPreferredLastName(currentUserData.student.person.preferred_last_name)
      setLegalFirstName(currentUserData.student.person.first_name)
      setLegalLastName(currentUserData.student.person.last_name)
      setLegalMiddleName(currentUserData.student.person.middle_name)
      setGender(currentUserData.student.person.gender)
      setCity(currentUserData.student.person.address.city)
      setState(STATES_WITH_ABBREVIATION[stateSelected] || stateSelected)
      setStreet1(currentUserData.student.person.address.street)
      setStreet2(currentUserData.student.person.address.street2)
      setZip(currentUserData.student.person.address.zip)
      setUserInfo(currentUserData.student.person)
      setPackets(currentUserData.student.packets)
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
        testing_preference: currentUserData.student.testing_preference,
        status: currentUserData?.student?.status?.length && currentUserData.student.status.at(-1).status,
        date: currentUserData?.student?.status?.length > 0 ? currentUserData.student.status.at(-1).date_updated : '',
        // grade_level: currentUserData.student.status.length && currentUserData.student.status[0].grade_level,
        school_year_id:
          currentUserData.student.applications.length && currentUserData.student.applications[0].school_year_id,
        school_partner_id: currentUserData.student?.currentSoe?.[0]?.school_partner_id,
        school_partner_id_updated: false,
      })
      setOriginStudentStatus({
        status: currentUserData?.student?.status?.length && currentUserData.student.status.at(-1).status,
      })
    }
  }, [currentUserData])

  useEffect(() => {
    refetch()
  }, [studentId])

  const currentSoE = useMemo(() => {
    let currentSoE = false
    if (selectedYearId && currentUserData.student.currentSoe?.length) {
      currentSoE = currentUserData.student.currentSoe.find((soe) => soe.school_year_id == selectedYearId)
      if (currentSoE) setSchoolPartnerId(currentSoE.school_partner_id)
    }
    return currentSoE?.school_partner_id
  }, [selectedYearId])

  const previousYearId = useMemo(() => {
    const shoolYears = regionData?.region?.SchoolYears || []
    let special_ed_options = ''
    shoolYears
      .filter((item) => moment(item.date_begin).format('YYYY') >= moment().format('YYYY'))
      .map((item: { special_ed_options: string; special_ed: boolean }): void => {
        if (
          item.special_ed == true &&
          item.special_ed_options != '' &&
          item.special_ed_options != null &&
          special_ed_options == ''
        )
          special_ed_options = item.special_ed_options
      })
    if (special_ed_options == '') setSpecialEdOptions([])
    else setSpecialEdOptions(special_ed_options.split(','))

    return getPreviousSchoolYearId(selectedYearId, shoolYears)
  }, [regionData, selectedYearId])

  const previousSoE = useMemo(
    () => currentUserData?.student?.currentSoe?.find((soe) => soe.school_year_id == previousYearId),
    [currentUserData, previousYearId],
  )

  const setSOE = (school_partner_id) => {
    setSchoolPartnerId(school_partner_id)
    const school_partner = { school_partner_id, school_partner_id_updated: false }
    if (school_partner_id != currentSoE) {
      school_partner.school_partner_id_updated = true
    }
    setStudentStatus({
      ...studentStatus,
      ...school_partner,
    })
  }
  const handleChangeSoE = (e) => {
    if (!currentSoE) {
      setSOE(e.target.value)
    } else if (e.target.value != currentSoE) {
      setTempSoE(e.target.value)
      setModalAssign(true)
    }
  }
  const handleAssignOrTransfer = async () => {
    if (assignOrTransfer === 'assign' || !currentSoE) {
      setSOE(tempSoE)
      setModalAssign(false)
    } else if (currentSoE && previousSoE) {
      // create a transfer form with last year's SoE
      setModalAssign(false)
    }
  }

  const studentAseessOption = (assessment_id) => {
    const studentAsses = studentAssessments.find((ass) => ass.assessmentId == assessment_id)
    if (!studentAsses) {
      return ''
    }
    return studentAsses.optionId
  }

  const handleTestPreferenceChange = (assessId, optionId) => {
    const updatedValue = studentAssessments.map((item) => {
      if (item.assessmentId === assessId) {
        return {
          ...item,
          optionId: optionId,
        }
      } else {
        return item
      }
    })
    setIsChanged(true)
    setStudentAssessments(updatedValue)
    const testString = updatedValue.map((i) => {
      return {
        assessmentOptionId: i.assessmentOptionId,
        optionId: i.optionId,
      }
    })
    setStudentStatus({ ...studentStatus, ...{ testing_preference: JSON.stringify(testString) } })
  }

  const isVisibleTestPreference = (grades: string) => {
    if (!gradeLevel) {
      return false
    }
    const availableGrades = grades.split(',')
    if (availableGrades.indexOf('K') !== -1 || availableGrades.indexOf('k')) {
      availableGrades.push('Kindergarten')
    } else if (availableGrades.indexOf('Kindergarten') !== -1) {
      availableGrades.push('K')
      availableGrades.push('k')
    }
    if (availableGrades.indexOf(gradeLevel) !== -1) {
      return true
    }
    return false
  }

  const visibleAssessmentItems = (list: AssessmentType[]) => {
    const result: AssessmentType[] = []
    list.map((item: AssessmentType) => {
      if (isVisibleTestPreference(item?.grades)) {
        result.push(item)
      }
    })
    return result
  }

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
              alt={preferedFirstName ?? legalFirstName}
              src='image'
              variant='rounded'
              style={{ height: '127px', width: '127px', marginRight: '12px', fontSize: '3rem' }}
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
                value={String(gradeLevel).includes('K') ? 'Kindergarten' : gradeLevel}
                sx={{ color: '#cccccc', fontWeight: '700' }}
                onChange={(e) => {
                  setGradeLevel(e.target.value)
                  setIsChanged(true)
                  setStudentStatus({ ...studentStatus, ...{ grade_level: e.target.value } })
                }}
              >
                <MenuItem value='Kindergarten'>Kindergarten</MenuItem>
                {[...Array(12).keys()].map((item, idx) => (
                  <MenuItem key={idx} value={item + 1}>
                    {ordinal(item + 1)} Grade
                  </MenuItem>
                ))}
              </Select>
              {/* <Subtitle textAlign='left'>Unassigned</Subtitle> */}
              <Select
                IconComponent={KeyboardArrowDown}
                className={classes.select}
                sx={{ color: '#cccccc', fontWeight: '700' }}
                value={schoolPartnerId}
                onChange={handleChangeSoE}
              >
                {SoEitems.map((el) => (
                  <MenuItem value={el.value} key={el.value}>
                    {el.label}
                  </MenuItem>
                ))}
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
              onClick={handlePacket}
            >
              {packets.length ? `${packets[0].status}` : ''}
              {packets.length && packets[0].status === 'Accepted'
                ? ` ${moment(packets[0].date_accepted).format('MM/DD/YY')}`
                : ''}
              {packets.length && packets[0].status === 'Submitted'
                ? ` ${moment(packets[0].date_submitted).format('MM/DD/YY')}`
                : ''}
              {packets.length && packets[0].status === 'Resubmitted'
                ? ` ${moment(packets[0].date_submitted).format('MM/DD/YY')}`
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
            <Subtitle textAlign='left' fontWeight='700' color={'#CCCCCC'} sx={{ marginLeft: 3 }}>
              {`${MthTitle.FIRST_SEMESTER} # of Zeros`}
            </Subtitle>
          </Grid>
          <Grid item xs={12} sx={{ alignItems: 'center', display: 'flex' }}>
            <Subtitle textAlign='left' fontWeight='700' color={'#CCCCCC'} sx={{ marginLeft: 3 }}>
              {`${MthTitle.SECOND_SEMESTER} # of Zeros`}
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
            originStudentStatus={originStudentStatus}
            withdrawalStatus={withdrawalStatus}
            setWithdrawalStatus={setWithdrawalStatus}
            setIsChanged={setIsChanged}
            specialEdOptions={specialEdOptions}
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
            value={preferedFirstName || legalFirstName}
            // onChange={(e) => {
            //   setPreferredFirstName(e.target.value)
            //   setUserInfo({ ...userInfo, ...{ preferred_first_name: e.target.value } })
            // }}
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
            value={preferedLastName || legalLastName}
            // onChange={(e) => {
            //   setPreferredLastName(e.target.value)
            //   setUserInfo({ ...userInfo, ...{ preferred_last_name: e.target.value } })
            // }}
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
          <Paragraph size='medium' textAlign='left' fontWeight='700' color='#0E0E0E'>
            Testing Preference
          </Paragraph>
          {visibleAssessmentItems(assessmentItems).map((assess: AssessmentType) => (
            <Grid item container key={assess.assessment_id}>
              <Grid item xs={3} sx={{ alignItems: 'center', display: 'flex', fontWeight: '700' }}>
                <Subtitle sx={{ fontWeight: '700', fontSize: '12px', color: '#0E0E0E' }}>{assess.test_name}</Subtitle>
              </Grid>
              <Grid item xs={9} sx={{ alignItems: 'center', display: 'flex' }}>
                <Select
                  value={studentAseessOption(assess.assessment_id)}
                  IconComponent={KeyboardArrowDown}
                  className={classes.select}
                  sx={{ fontWeight: '700', fontSize: '12px', color: '#0E0E0E' }}
                  onChange={(e) => handleTestPreferenceChange(assess.assessment_id, e.target.value)}
                >
                  {assess.Options.map((el) => (
                    <MenuItem value={el.option_id} key={el.option_id}>
                      {el.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          ))}
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
              value={phoneFormat(phoneInfo?.number + '')}
              onChange={(e) => {
                setPhoneInfo({ ...phoneInfo, number: phoneFormat(e.target.value + '') })
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
      {showPacketModal && (
        <ProfilePacketModal
          handleModem={() => setShowPacketModal(false)}
          packet_id={packetID}
          refetch={() => refetch()}
        />
      )}
      {modalAssign && (
        <WarningModal
          handleModem={() => setModalAssign(false)}
          title={'School of Enrollment'}
          subtitle=''
          btntitle='Assign'
          canceltitle='Cancel'
          handleSubmit={() => handleAssignOrTransfer()}
        >
          {tempSoE === 'unassigned' ? (
            <Typography
              sx={{
                marginBottom: '10px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              Are you sure you want to change this student to Unassigned?
            </Typography>
          ) : (
            <>
              {currentSoE && previousSoE && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <Typography sx={{ marginBottom: '10px' }}>
                    How would you like to proceed with the SoE change?
                  </Typography>
                  <RadioGroup
                    name='assignOrTransfer'
                    value={assignOrTransfer}
                    onChange={(e) => setAssignOrTransfer(e.target.value)}
                  >
                    <FormControlLabel value='assign' control={<Radio />} label=' Assign new SoE' />
                    <FormControlLabel
                      value='transfer'
                      control={<Radio />}
                      label=' Create a transfer form from previous SoE'
                    />
                  </RadioGroup>
                </Box>
              )}
              {!previousSoE && (
                <Typography
                  sx={{
                    marginBottom: '10px',
                    width: '100%',
                  }}
                >
                  Are you sure you want to assign this student to an SoE?
                </Typography>
              )}
            </>
          )}
        </WarningModal>
      )}
    </Box>
  )
}
