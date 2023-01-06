import React, { FunctionComponent, ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import AddIcon from '@mui/icons-material/Add'
import AddCircleIcon from '@mui/icons-material/AddCircle'
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
  Button,
  Divider,
  Grid,
  Toolbar,
  IconButton,
  Drawer,
  MenuItem,
  Menu,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import { filter, map } from 'lodash'
import { NavLink, useLocation } from 'react-router-dom'
import Slider from 'react-slick'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { MobileSideMenu } from '@mth/components/SideMenu/MobileSideMenu'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import {
  ApplicationStatus,
  MthColor,
  MthRoute,
  MthTitle,
  PacketStatus,
  StudentNotification,
  StudentStatus,
} from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/Dashboard/SchoolYear/SchoolYear'
import { StudentType, Person } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { checkEnrollPacketStatus, getWindowDimension, gradeText } from '@mth/utils'
import { useStyles } from './styles'

const drawerWidth = '100%'

export const AppBar: FunctionComponent = () => {
  const classes = useStyles
  const sliderRef = useRef()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [theIcon, setTheIcon] = useState({
    type: '',
    name: '',
  })
  const openStudentList = Boolean(anchorEl)

  const { me } = useContext(UserContext)
  const [openMobileSide, setOpenMobileSide] = useState(false)

  //const { students } = me
  const [, setStudents] = useState<StudentType[]>([])

  const [activeStudents, setActiveStudents] = useState<StudentType[]>([])

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
    student: StudentType,
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

  const AddStudentButton = () => (
    <Button
      disableElevation
      href={`${MthRoute.APPLICATIONS}`}
      variant='contained'
      sx={{
        background: '#FAFAFA',
        color: 'black',
        width: '200px',
        height: '44px',
        alignItems: 'center',
        '&:hover': {
          background: '#F5F5F5',
          color: '#000',
        },
      }}
      startIcon={<AddIcon />}
    >
      <Subtitle sx={{ whiteSpace: 'nowrap' }}>Add Student</Subtitle>
    </Button>
  )

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

  const renderStudentHeader = () =>
    map(activeStudents, (student, idx) => {
      const link =
        student?.applications?.at(-1)?.status === ApplicationStatus.SUBMITTED ||
        student?.status?.at(-1)?.status === StudentStatus.WITHDRAWN ||
        student?.packets?.at(-1)?.status === PacketStatus.STARTED ||
        student?.packets?.at(-1)?.status === PacketStatus.NOT_STARTED
          ? `${MthRoute.HOMEROOM}`
          : `${MthRoute.HOMEROOM}/${student.student_id}`
      return (
        <Box key={idx} sx={{ textDecoration: 'none', marginTop: 1 }}>
          {link ? (
            <NavLink to={link} style={{ textDecoration: 'none' }}>
              <Metadata
                divider={true}
                title={
                  <Subtitle
                    color={isActive(student.student_id) ? MthColor.MTHBLUE : '#A1A1A1'}
                    sx={classes.studentItemText}
                  >
                    {student.person.preferred_first_name
                      ? student.person.preferred_first_name
                      : student.person.first_name}
                  </Subtitle>
                }
                subtitle={
                  <Paragraph color='#cccccc' size={'large'} sx={classes.studentItemText}>
                    {gradeText(student)}
                  </Paragraph>
                }
                image={
                  <Avatar
                    alt={student.person.preferred_first_name}
                    src={getProfilePhoto(student.person)}
                    variant='rounded'
                    style={{ marginRight: 24 }}
                  />
                }
              />
            </NavLink>
          ) : (
            <Metadata
              divider={true}
              title={
                <Subtitle color={isActive(student.student_id) ? MthColor.MTHBLUE : '#A1A1A1'}>
                  {student.person.first_name}
                </Subtitle>
              }
              subtitle={
                <Paragraph color='#cccccc' size={'large'}>
                  {gradeText(student)}
                </Paragraph>
              }
              image={
                <Avatar
                  alt={student.person.first_name}
                  src={getProfilePhoto(student.person)}
                  variant='rounded'
                  style={{ marginRight: 24 }}
                />
              }
            />
          )}
        </Box>
      )
    })

  const handleAnchorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleAnchorClose = () => {
    setAnchorEl(null)
  }

  const getAvatar = (student: StudentType) => {
    if (getProfilePhoto(student.person) !== 'image') {
      return { type: 'img', link: getProfilePhoto(student.person) }
    }
    return {
      type: 'avatar',
      link: student.person.preferred_first_name ? student.person.preferred_first_name : student.person.first_name,
    }
  }

  const mobileStudentHeader = (handleDrawerCloseAndTheIcon) => (
    <Menu
      id='basic-menu'
      open={openStudentList}
      anchorEl={anchorEl}
      onClose={handleAnchorClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {map(activeStudents, (student, idx) => {
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
      })}
      <NavLink to={`${MthRoute.APPLICATIONS}`} style={{ textDecoration: 'none' }}>
        <MenuItem onClick={() => handleDrawerCloseAndTheIcon('header', 'addStudent')}>
          <ListItemIcon sx={{ marginRight: '24px' }}>
            <AddCircleIcon sx={{ fontSize: '2.5rem' }} />
          </ListItemIcon>
          <ListItemText sx={{ color: 'black' }}>Add Student</ListItemText>
        </MenuItem>
      </NavLink>
    </Menu>
  )

  useEffect(() => {
    if (me?.students) {
      setStudents(me?.students)
      setActiveStudents(
        filter(me?.students, (student) => {
          return (
            student?.status?.at(-1)?.status !== StudentStatus.WITHDRAWN &&
            student?.status?.at(-1)?.status !== StudentStatus.DELETED
          )
        }),
      )
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
    }

    if (theIcon.type === 'side') {
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
    } else if (theIcon.type === 'avatar') {
      return (
        <Avatar
          alt={theIcon.name}
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
                {activeStudents.length > 3 ? (
                  <Slider {...settings} ref={sliderRef}>
                    {renderStudentHeader()}
                  </Slider>
                ) : (
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='end'
                  >
                    {renderStudentHeader()}
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
              <Box sx={{ paddingTop: activeStudents.length === 0 ? '20px' : '' }}>
                <AddStudentButton />
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
              aria-controls={openStudentList ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={openStudentList ? 'true' : undefined}
              onClick={handleAnchorClick}
            >
              {!openStudentList ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
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
        {mobileStudentHeader(handleDrawerCloseAndTheIcon)}
        <MobileSideMenu handleDrawerClose={handleDrawerCloseAndTheIcon} />
      </Drawer>
    </>
  )
}
