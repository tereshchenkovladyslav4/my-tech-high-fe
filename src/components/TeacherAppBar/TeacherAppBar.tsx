import React, { FunctionComponent, ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import DatRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  AppBar as MUIAppBar,
  Avatar,
  Box,
  Divider,
  Toolbar,
  IconButton,
  Drawer,
  MenuItem,
  Menu,
  Grid,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import { map, orderBy } from 'lodash'
import { NavLink, useLocation } from 'react-router-dom'
import Slider from 'react-slick'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { MobileSideMenu } from '@mth/components/SideMenu/MobileSideMenu'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { ApplicationStatus, MthColor, MthRoute, MthTitle, PacketStatus, StudentNotification } from '@mth/enums'
import { SchoolYear, Student } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/Dashboard/SchoolYear/SchoolYear'
import { Person } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { checkEnrollPacketStatus, getWindowDimension, gradeText } from '@mth/utils'
import { useStyles } from './styles'

const drawerWidth = '100%'
const exampleTeacherData = [
  {
    applications: [{ status: 'Accepted', application_id: '3397' }],
    person: {
      address: {
        address_id: '1212',
        city: null,
        country_id: 'Botswana',
        county_id: 1044,
        school_district: 'Alamosa RE-11J',
        state: 'LA',
        street: 'StreetSam',
        street2: '',
        zip: '111',
      },
      phone: { ext: null, name: null, number: null, person_id: 4212, phone_id: '5869' },
      date_of_birth: '2017-07-19T00:00:00.000Z',
      email: 'nairan+1189JON@codev.com',
      first_name: 'Acacdia',
      gender: 'Male',
      last_name: 'test',
      middle_name: null,
      person_id: '4063',
      photo: 'profile/8003/b9fc14b4267887a912010b4b27b81bd9.png',
      preferred_first_name: null,
      preferred_last_name: null,
    },
    student_id: '3490',
  },
  {
    applications: [{ status: 'Accepted', application_id: '3397' }],
    person: {
      address: {
        address_id: '1212',
        city: null,
        country_id: 'Botswana',
        county_id: 1044,
        school_district: 'Alamosa RE-11J',
        state: 'LA',
        street: 'StreetSam',
        street2: '',
        zip: '111',
      },
      phone: { ext: null, name: null, number: null, person_id: 4212, phone_id: '5869' },
      date_of_birth: '2017-07-19T00:00:00.000Z',
      email: 'nairan+1189JON@codev.com',
      first_name: '1189JON',
      gender: 'Male',
      last_name: 'test',
      middle_name: null,
      person_id: '4063',
      photo: null,
      preferred_first_name: null,
      preferred_last_name: null,
    },
    student_id: '3491',
  },
  {
    applications: [{ status: 'Accepted', application_id: '3397' }],
    person: {
      address: {
        address_id: '1212',
        city: null,
        country_id: 'Botswana',
        county_id: 1044,
        school_district: 'Alamosa RE-11J',
        state: 'LA',
        street: 'StreetSam',
        street2: '',
        zip: '111',
      },
      phone: { ext: null, name: null, number: null, person_id: 4212, phone_id: '5869' },
      date_of_birth: '2017-07-19T00:00:00.000Z',
      email: 'nairan+1189JON@codev.com',
      first_name: '1189JON',
      gender: 'Male',
      last_name: 'test',
      middle_name: null,
      person_id: '4063',
      photo: null,
      preferred_first_name: null,
      preferred_last_name: null,
    },
    student_id: '3492',
  },
  {
    applications: [{ status: 'Accepted', application_id: '3397' }],
    person: {
      address: {
        address_id: '1212',
        city: null,
        country_id: 'Botswana',
        county_id: 1044,
        school_district: 'Alamosa RE-11J',
        state: 'LA',
        street: 'StreetSam',
        street2: '',
        zip: '111',
      },
      phone: { ext: null, name: null, number: null, person_id: 4212, phone_id: '5869' },
      date_of_birth: '2017-07-19T00:00:00.000Z',
      email: 'nairan+1189JON@codev.com',
      first_name: '1189JON',
      gender: 'Male',
      last_name: 'test',
      middle_name: null,
      person_id: '4063',
      photo: null,
      preferred_first_name: null,
      preferred_last_name: null,
    },
    student_id: '3493',
  },
]
export const TeacherAppBar: FunctionComponent = () => {
  const classes = useStyles
  const sliderRef = useRef()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [theIcon, setTheIcon] = useState({
    type: '',
    name: '',
  })
  const openTeacherList = Boolean(anchorEl)

  const { me } = useContext(UserContext)
  const [openMobileSide, setOpenMobileSide] = useState(false)

  const [activeTeachers, setActiveTeachers] = useState<Student[]>([])

  const location = useLocation()

  const [windowDimensions] = useState(getWindowDimension())

  const isActive = (id: number) => location.pathname.includes(`/${id}`)

  // get student status
  const region_id = me?.userRegion?.at(-1)?.region_id
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: !region_id,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears.map((item: SchoolYear) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
        })),
      )
    }
  }, [region_id, schoolYearData?.data?.region?.SchoolYears])

  const circleData = (
    student: Student,
  ): { progress: number; color: string; message: string; icon: ReactElement } | undefined => {
    const { applications, packets } = student
    const currApplication = applications?.at(0)
    const currPacket = packets?.at(0)
    if (currApplication && currApplication?.status === ApplicationStatus.SUBMITTED) {
      return {
        progress: 25,
        color: MthColor.MTHGREEN,
        message: StudentNotification.APPLICATION_PENDING_APPROVAL,
        icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, cursor: 'pointer' }} />,
      }
    } else if (
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      packets &&
      (currPacket?.status === PacketStatus.NOT_STARTED || currPacket?.status === PacketStatus.MISSING_INFO)
    ) {
      if (currPacket?.status === PacketStatus.NOT_STARTED) {
        return {
          progress: 50,
          color: MthColor.RED,
          message: StudentNotification.PLEASE_SUBMIT_ENROLLMENT_PACKET,
          icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
        }
      } else {
        return {
          progress: 50,
          color: MthColor.RED,
          message: StudentNotification.PLEASE_RESUBMIT_ENROLLMENT_PACKET,
          icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
        }
      }
    } else if (
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.STARTED
    ) {
      return {
        progress: 50,
        color: MthColor.RED,
        message: StudentNotification.PLEASE_SUBMIT_ENROLLMENT_PACKET,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
      }
    } else if (
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      currPacket &&
      (currPacket?.status === PacketStatus.SUBMITTED || currPacket?.status === PacketStatus.RESUBMITTED)
    ) {
      return {
        progress: 50,
        color: MthColor.MTHGREEN,
        message: StudentNotification.ENROLLMENT_PACKET_PENDING_APPROVAL,
        icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, cursor: 'pointer' }} />,
      }
    }
    return undefined
  }

  function SampleNextArrow(props) {
    const { style } = props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          right: '-160px',
          top: 'calc(50% - 15px)',
          width: '150px',
          height: '30px',
          marginLeft: 2,
          position: 'absolute',
          alignItems: 'center',
        }}
      >
        <ChevronRightIcon
          style={{ ...style, display: 'block', color: 'black', background: '#FAFAFA', cursor: 'pointer' }}
          onClick={() => sliderRef.current.slickNext()}
        />
      </div>
    )
  }

  function SamplePrevArrow(props) {
    const { className, style } = props
    return (
      <ChevronLeftIcon
        className={className}
        style={{ ...style, display: 'block', color: 'black', background: '#FAFAFA' }}
        onClick={() => sliderRef.current.slickPrev()}
      />
    )
  }

  const settings = {
    className: 'slider variable-width',
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    rows: 1,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const renderTeacherHeader = () =>
    map(
      orderBy(
        activeTeachers,
        [
          (teacher) =>
            teacher.person.preferred_first_name ? teacher.person.preferred_first_name : teacher.person.first_name,
        ],
        ['asc'],
      ),
      (teacher, idx) => {
        const link = `${MthRoute.HOMEROOM}/${teacher.student_id}`
        return (
          <Box key={idx} sx={{ textDecoration: 'none', marginTop: 1 }}>
            {link ? (
              <NavLink to={link} style={{ textDecoration: 'none' }}>
                <Metadata
                  divider={true}
                  title={
                    <Subtitle
                      color={isActive(teacher.student_id) ? MthColor.MTHBLUE : MthColor.SYSTEM_01}
                      sx={classes.studentItemText}
                      fontWeight='600'
                    >
                      {teacher.person.preferred_first_name
                        ? teacher.person.preferred_first_name
                        : teacher.person.first_name}
                    </Subtitle>
                  }
                  subtitle={
                    <Paragraph fontWeight='600' color={MthColor.SYSTEM_11} size={'large'} sx={classes.studentItemText}>
                      245
                    </Paragraph>
                  }
                  image={
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        alt={
                          teacher.person.preferred_first_name
                            ? teacher.person.preferred_first_name
                            : teacher.person.first_name
                        }
                        src={getProfilePhoto(teacher.person)}
                        variant='rounded'
                        style={{ marginRight: 24, width: 44, height: 44 }}
                      />
                    </Box>
                  }
                />
                <Box
                  sx={{
                    position: 'relative',
                    bottom: 2,
                    left: '18px',
                    width: '82%',
                    height: 2,
                    margin: '0 auto',
                    borderBottom: isActive(teacher.student_id)
                      ? '5px solid ' + MthColor.MTHBLUE
                      : '5px solid transparent',
                  }}
                />
              </NavLink>
            ) : (
              <Metadata
                divider={true}
                title={
                  <Subtitle fontWeight='600' color={isActive(teacher.student_id) ? MthColor.MTHBLUE : MthColor.BLACK}>
                    {teacher.person.first_name}
                  </Subtitle>
                }
                subtitle={
                  <Paragraph fontWeight='600' color={MthColor.SYSTEM_11} size={'large'}>
                    {gradeText(teacher)}
                  </Paragraph>
                }
                image={
                  <Avatar
                    alt={teacher.person.first_name}
                    src={getProfilePhoto(teacher.person)}
                    variant='rounded'
                    style={{ marginRight: 24 }}
                  />
                }
                borderBottom={isActive(teacher.student_id)}
              />
            )}
          </Box>
        )
      },
    )

  const handleAnchorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleAnchorClose = () => {
    setAnchorEl(null)
  }

  const getAvatar = (teacher: Student) => {
    if (getProfilePhoto(teacher.person) !== 'image') {
      return { type: 'img', link: getProfilePhoto(teacher.person) }
    }
    return {
      type: 'avatar',
      link: teacher.person.preferred_first_name ? teacher.person.preferred_first_name : teacher.person.first_name,
    }
  }

  const mobileTeacherHeader = (handleDrawerCloseAndTheIcon) => (
    <Menu
      id='basic-menu'
      open={openTeacherList}
      anchorEl={anchorEl}
      onClose={handleAnchorClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {map(
        orderBy(
          activeTeachers,
          [
            (student) =>
              student.person.preferred_first_name ? student.person.preferred_first_name : student.person.first_name,
          ],
          ['asc'],
        ),
        (student, idx) => {
          const link =
            student?.applications?.at(-1)?.status === ApplicationStatus.SUBMITTED ||
            student?.status?.at(-1)?.status === 2 ||
            student?.packets?.at(-1)?.status === PacketStatus.STARTED ||
            student?.packets?.at(-1)?.status === PacketStatus.NOT_STARTED
              ? `${MthRoute.HOMEROOM}`
              : `${MthRoute.HOMEROOM}/${student.student_id}`
          return (
            <div key={idx}>
              {link ? (
                <NavLink to={link} style={{ textDecoration: 'none' }}>
                  <MenuItem
                    onClick={() => handleDrawerCloseAndTheIcon(getAvatar(student)['type'], getAvatar(student)['link'])}
                  >
                    <ListItemIcon>
                      <Avatar
                        alt={
                          student.person.preferred_first_name
                            ? student.person.preferred_first_name
                            : student.person.first_name
                        }
                        src={getProfilePhoto(student.person)}
                        style={{ marginRight: 8 }}
                      />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'black', paddingX: '5px', minWidth: '100px' }}>
                      {student.person.preferred_first_name
                        ? student.person.preferred_first_name
                        : student.person.first_name}
                    </ListItemText>
                    <ListItemIcon sx={{ minWidth: '70px' }}>
                      {checkEnrollPacketStatus(schoolYears, student) && (
                        <IconButton>{circleData(student)?.icon}</IconButton>
                      )}
                    </ListItemIcon>
                  </MenuItem>
                </NavLink>
              ) : (
                <MenuItem
                  onClick={() => handleDrawerCloseAndTheIcon(getAvatar(student)['type'], getAvatar(student)['link'])}
                >
                  <ListItemIcon>
                    <Avatar
                      alt={
                        student.person.preferred_first_name
                          ? student.person.preferred_first_name
                          : student.person.first_name
                      }
                      src={getProfilePhoto(student.person)}
                      style={{ marginRight: 8 }}
                    />
                  </ListItemIcon>
                  <ListItemText sx={{ color: 'black', paddingX: '5px', minWidth: '100px' }}>
                    {student.person.preferred_first_name
                      ? student.person.preferred_first_name
                      : student.person.first_name}
                  </ListItemText>
                  <ListItemIcon sx={{ minWidth: '70px' }}>
                    {checkEnrollPacketStatus(schoolYears, student) && (
                      <IconButton>{circleData(student)?.icon}</IconButton>
                    )}
                  </ListItemIcon>
                </MenuItem>
              )}
            </div>
          )
        },
      )}
    </Menu>
  )

  useEffect(() => {
    if (me?.students) {
      setActiveTeachers(exampleTeacherData)
    }
  }, [me?.students])

  // Mobile Drawer
  const handleDrawerOpen = () => {
    setOpenMobileSide(true)
  }

  const handleDrawerClose = () => {
    setOpenMobileSide(false)
  }

  const handleDrawerCloseAndTheIcon = (type: string, name: string) => {
    setOpenMobileSide(false)
    handleAnchorClose()
    setTheIcon({
      type,
      name,
    })
  }

  useEffect(() => {
    window.onpopstate = () => {
      const endpoint = window.location.pathname
      if (endpoint === '') {
        setTheIcon({
          type: 'side',
          name: 'dashboard',
        })
      } else {
        setTheIcon({
          type: 'side',
          name: endpoint.substring(1),
        })
      }
    }
  })

  const getTheIcon = () => {
    if (location.pathname.indexOf('homeroom/enrollment') !== -1) {
      return <PeopleAltOutlinedIcon />
    } else if (theIcon.type === 'side') {
      switch (theIcon.name) {
        case 'dashboard':
          return <BackupTableIcon />
        case 'settings':
          return <SettingsIcon />
        case 'Announcements':
          return <AllInboxOutlinedIcon />
        case 'Calender':
          return <DatRangeOutlinedIcon />
        case 'Curriculum':
          return <AllInboxOutlinedIcon />
        case 'Enrollment':
          return <BackupTableIcon />
        case 'Homeroom':
        case 'homeroom':
          return <PeopleAltOutlinedIcon />
        case 'Quick Links':
        case 'parent-link':
          return <CallMadeRoundedIcon />
        case 'Records':
          return <CallMadeRoundedIcon />
        case MthTitle.DIRECT_ORDERS_REIMBURSEMENTS:
          return <CreditCardRoundedIcon />
        case 'Reports':
          return <CallMadeRoundedIcon />

        case 'Users':
          return <PeopleAltOutlinedIcon />

        default:
          return <BackupTableIcon />
      }
    } else if (theIcon.type === 'header') {
      return <BackupTableIcon />
    } else if (theIcon.type === 'img') {
      return (
        <Avatar
          alt='Avatar'
          src={theIcon.name}
          sx={{ width: 24, height: 24, backgroundColor: 'blue', fontSize: '1rem' }}
        />
      )
    } else if (
      (me && theIcon.type === 'avatar') ||
      (location.pathname.includes('homeroom') &&
        me?.students?.find((student) => student.student_id.toString() === location.pathname.split('/')[2]) !==
          undefined)
    ) {
      const student = me.students?.find((student) => student.student_id.toString() === location.pathname.split('/')[2])
      return (
        <Avatar
          alt={
            theIcon.name
              ? theIcon.name
              : student !== undefined
              ? student.person.preferred_first_name !== undefined
                ? student.person.preferred_first_name
                : student.person.first_name
              : ''
          }
          src='image'
          sx={{ width: 24, height: 24, backgroundColor: 'blue', fontSize: '1rem' }}
        />
      )
    } else {
      return <BackupTableIcon />
    }
  }

  return (
    <>
      <MUIAppBar position='static' sx={{ ...classes.appBar, display: { xs: 'none', sm: 'block' } }} elevation={0}>
        <div style={classes.toolbar}>
          <Grid container justifyContent='flex' alignItems='center'>
            <Grid item xs={4} />
            <Grid item xs={8} display='flex' justifyContent={'flex-end'} alignItems='center'>
              <Box
                width={
                  windowDimensions.width > 639
                    ? 'calc(58vw - 200px)'
                    : windowDimensions.width > 565
                    ? 'calc(58vw - 150px)'
                    : windowDimensions.width > 505
                    ? 'calc(58vw - 105px)'
                    : windowDimensions.width > 400
                    ? 'calc(58vw - 60px)'
                    : windowDimensions.width > 350
                    ? 'calc(58vw - 30px)'
                    : windowDimensions.width > 295
                    ? '58vw'
                    : windowDimensions.width > 230
                    ? '75vw'
                    : windowDimensions.width > 175
                    ? '97vw'
                    : '160vw'
                }
                sx={{ marginRight: '50px' }}
              >
                {activeTeachers.length > 3 ? (
                  <Slider {...settings} ref={sliderRef}>
                    {renderTeacherHeader()}
                  </Slider>
                ) : (
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='end'
                  >
                    {renderTeacherHeader()}
                    <Divider
                      sx={{
                        background: 'black',
                        height: 35,
                        marginX: 3,
                        marginTop: 2,
                      }}
                      variant='middle'
                      orientation='vertical'
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </div>
      </MUIAppBar>
      <MUIAppBar position='fixed' sx={{ ...classes.appMobileBar, display: { xs: 'block', sm: 'none' } }}>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            aria-label='open drawer'
            onClick={openMobileSide ? handleDrawerClose : handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            {!openMobileSide ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton
              size='large'
              aria-label='show 4 new mails'
              id='basic-button'
              aria-controls={openTeacherList ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={openTeacherList ? 'true' : undefined}
              onClick={handleAnchorClick}
            >
              {!openTeacherList ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </IconButton>
            <IconButton
              sx={{
                color: 'blue',
                borderRadius: 'unset',
                borderBottom: 'solid 1.5px blue',
              }}
            >
              {getTheIcon()}
            </IconButton>
          </Box>
        </Toolbar>
      </MUIAppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '58px',
          },
        }}
        variant='persistent'
        anchor='left'
        open={openMobileSide}
      >
        <Divider />
        {mobileTeacherHeader(handleDrawerCloseAndTheIcon)}
        <MobileSideMenu handleDrawerClose={handleDrawerCloseAndTheIcon} />
      </Drawer>
    </>
  )
}
