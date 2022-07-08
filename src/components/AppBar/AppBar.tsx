import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BackupTableIcon from '@mui/icons-material/BackupTable'
import {
  AppBar as MUIAppBar, Avatar, Box, Button, Divider, Grid, Toolbar, IconButton, Drawer, MenuItem, Menu, ListItemText
  , ListItemIcon, Typography, Tooltip
} from '@mui/material'
import { filter, map } from 'lodash'
import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Slider from 'react-slick'
import { UserContext } from '../../providers/UserContext/UserProvider'
import { StudentType, Person } from '../../screens/HomeroomStudentProfile/Student/types'
import { APPLICATIONS, HOMEROOM, MTHBLUE } from '../../utils/constants'
import { toOrdinalSuffix } from '../../utils/stringHelpers'
import { Metadata } from '../Metadata/Metadata'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { MobileSideMenu } from '../SideMenu/MobileSideMenu';

import DescriptionIcon from '@mui/icons-material/Description'
import SettingsIcon from '@mui/icons-material/Settings';
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined'
import DatRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import { checkEnrollPacketStatus } from '../../utils/utils';
import { useQuery } from '@apollo/client'
import { SchoolYearType } from '../../utils/utils.types'
import { getSchoolYearsByRegionId } from '../../screens/Admin/Dashboard/SchoolYear/SchoolYear';
import ScheduleIcon from '@mui/icons-material/Schedule'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'


const drawerWidth = '100%';

export const AppBar: FunctionComponent = () => {
  const classes = useStyles
  const sliderRef = useRef()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [theIcon, setTheIcon] = React.useState({
    type: '',
    name: ''
  })
  const openStudentList = Boolean(anchorEl);

  const { me } = useContext(UserContext)
  const [openMobileSide, setOpenMobileSide] = React.useState(false);

  //const { students } = me
  const [students, setStudents] = useState<StudentType[]>([])

  const [activeStudents, setActiveStudents] = useState<StudentType[]>([])

  const location = useLocation()

  const isActive = (id) => location.pathname.includes(`/${id}`)

  // get student status
  const region_id = me?.userRegion?.at(-1)?.region_id
  const [schoolYears, setSchoolYears] = useState<SchoolYearType[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears.map((item: SchoolYearType) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
        })),
      )
    }
  }, [region_id, schoolYearData?.data?.region?.SchoolYears])


  const red = '#D23C33'
  const blue = '#2B9EB7'

  const circleData = (student: StudentType) => {
    const { applications, packets } = student;
    const currApplication = applications.at(0)
    const currPacket = packets.at(0)
    if (currApplication && currApplication?.status === 'Submitted') {
      return ({
        progress: 25,
        color: blue,
        message: 'Application Pending Approval',
        icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      packets &&
      (currPacket?.status === 'Not Started' || currPacket?.status === 'Missing Info')
    ) {
      if (currPacket?.status === 'Not Started') {
        return ({
          progress: 50,
          color: red,
          message: 'Please Submit an Enrollment Packet',
          icon: <ErrorOutlineIcon sx={{ color: red, cursor: 'pointer' }} />,
        })
      } else {
        return ({
          progress: 50,
          color: red,
          message: 'Please Resubmit Enrollment Packet',
          icon: <ErrorOutlineIcon sx={{ color: red, cursor: 'pointer' }} />,
        })
      }
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Started'
    ) {
      return ({
        progress: 50,
        color: red,
        message: 'Please Submit Enrollment Packet',
        icon: <ErrorOutlineIcon sx={{ color: red, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Submitted'
    ) {
      return ({
        progress: 50,
        color: blue,
        message: 'Enrollment Packet Pending Approval',
        icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
      })
    }
  }


  const AddStudentButton = () => (
    <Button
      disableElevation
      href={APPLICATIONS}
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
    const { className, style, onClick } = props
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
    const { className, style, onClick } = props
    return (
      <ChevronLeftIcon
        className={className}
        style={{ ...style, display: 'block', color: 'black', background: '#FAFAFA' }}
        onClick={() => sliderRef.current.slickPrev()}
      />
    )
  }

  const settings = {
    className: "slider variable-width",
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
        }
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1368,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1
        }
      },
    ]
  }

  const gradeText = (student: StudentType) =>
    student.grade_levels.at(-1)?.grade_level !== 'Kin'
      ? `${toOrdinalSuffix(student.grade_levels.at(-1)?.grade_level as number)} Grade`
      : 'Kindergarten'

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const renderStudentHeader = () =>
    map(activeStudents, (student, idx) => {
      const link =
        student?.applications?.at(-1)?.status === 'Submitted' ||
          student?.status?.at(-1)?.status === 2 ||
          student?.packets?.at(-1)?.status === 'Started' ||
          student?.packets?.at(-1)?.status === 'Not Started'
          ? HOMEROOM
          : `${HOMEROOM}/${student.student_id}`
      return (
        <Box key={idx} sx={{ textDecoration: 'none', marginTop: 1 }}>
          {link ? (
            <NavLink to={link} style={{ textDecoration: 'none' }}>
              <Metadata
                divider={true}
                title={
                  <Subtitle color={isActive(student.student_id) ? MTHBLUE : '#A1A1A1'}>
                    {student.person.preferred_first_name ?? student.person.first_name}
                  </Subtitle>
                }
                subtitle={
                  <Paragraph color='#cccccc' size={'large'}>
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
                <Subtitle color={isActive(student.student_id) ? MTHBLUE : '#A1A1A1'}>
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
    setAnchorEl(event.currentTarget);
  };
  const handleAnchorClose = () => {
    setAnchorEl(null);
  };

  const getAvatar = (student: StudentType) => {
    if (getProfilePhoto(student.person) !== 'image') {
      return { type: 'img', 'link': getProfilePhoto(student.person) };
    }
    return { type: 'avatar', 'link': student.person.preferred_first_name ?? student.person.first_name };
  }

  const mobileStudentHeader = (handleDrawerCloseAndTheIcon: any) => (
    <Menu
      id="basic-menu"
      open={openStudentList}
      anchorEl={anchorEl}
      onClose={handleAnchorClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}

    >
      {map(activeStudents, (student, idx) => {
        const link =
          student?.applications?.at(-1)?.status === 'Submitted' ||
            student?.status?.at(-1)?.status === 2 ||
            student?.packets?.at(-1)?.status === 'Started' ||
            student?.packets?.at(-1)?.status === 'Not Started'
            ? HOMEROOM
            : `${HOMEROOM}/${student.student_id}`
        return (
          <div key={idx}>
            {
              link ? (
                <NavLink to={link} style={{ textDecoration: 'none' }} >
                  <MenuItem onClick={() => handleDrawerCloseAndTheIcon(getAvatar(student)['type'], getAvatar(student)['link'])}>
                    <ListItemIcon>
                      <Avatar
                        alt={student.person.preferred_first_name ?? student.person.first_name}
                        src={getProfilePhoto(student.person)}
                        style={{ marginRight: 8 }}
                      />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'black', paddingX: '5px', minWidth: '100px' }}>{student.person.preferred_first_name ?? student.person.first_name}</ListItemText>
                    <ListItemIcon sx={{ minWidth: '70px' }}>
                      {checkEnrollPacketStatus(schoolYears, student) && (
                        <IconButton>{circleData(student)?.icon}</IconButton>
                      )}
                    </ListItemIcon>
                  </MenuItem>
                </NavLink >
              ) : (
                <MenuItem onClick={() => handleDrawerCloseAndTheIcon(getAvatar(student)['type'], getAvatar(student)['link'])}>
                  <ListItemIcon>
                    <Avatar
                      alt={student.person.preferred_first_name ?? student.person.first_name}
                      src={getProfilePhoto(student.person)}
                      style={{ marginRight: 8 }}
                    />
                  </ListItemIcon>
                  <ListItemText sx={{ color: 'black', paddingX: '5px', minWidth: '100px' }}>{student.person.preferred_first_name ?? student.person.first_name}</ListItemText>
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
      <NavLink to={APPLICATIONS} style={{ textDecoration: 'none' }} >
        <MenuItem onClick={() => handleDrawerCloseAndTheIcon('header', 'addStudent')}>
          <ListItemIcon sx={{ marginRight: '24px' }}>
            <AddCircleIcon sx={{ fontSize: '2.5rem' }} />
          </ListItemIcon>
          <ListItemText sx={{ color: 'black' }}>Add Student</ListItemText>
        </MenuItem>
      </NavLink >
    </Menu>
  )


  useEffect(() => {
    if (me?.students) {
      setStudents(me?.students)
      setActiveStudents(
        filter(me?.students, (student) => {
          return student?.status?.at(-1)?.status !== 2
        }),
      )
    }
  }, [me?.students])

  // Mobile Drawer
  const handleDrawerOpen = () => {
    setOpenMobileSide(true);
  };

  const handleDrawerClose = () => {
    setOpenMobileSide(false);
  };

  const handleDrawerCloseAndTheIcon = (type: string, name: string) => {
    setOpenMobileSide(false);
    handleAnchorClose();
    setTheIcon({
      type, name
    })
  };

  const getTheIcon = () => {
    if (theIcon.type === 'side') {
      switch (theIcon.name) {
        case 'dashboard':
          return <DescriptionIcon />;

        case 'settings':
          return <SettingsIcon />;
        case 'Announcements':
          return <AllInboxOutlinedIcon />
        case 'Calender':
          return <DatRangeOutlinedIcon />
        case 'Curriculum':
          return <AllInboxOutlinedIcon />
        case 'Enrollment':
          return <BackupTableIcon />
        case 'Homeroom':
          return <PeopleAltOutlinedIcon />
        case 'Quick Links':
          return <CallMadeRoundedIcon />
        case 'Records':
          return <CallMadeRoundedIcon />
        case 'Reimbursements & Direct Orders':
          return <CreditCardRoundedIcon />
        case 'Reports':
          return <CallMadeRoundedIcon />

        case 'Users':
          return <PeopleAltOutlinedIcon />


        default:
          return <BackupTableIcon />;
      }
    } else if (theIcon.type === 'header') {
      return <BackupTableIcon />;
    } else if (theIcon.type === 'img') {
      return <Avatar
        alt="Avatar"
        src={theIcon.name}
        sx={{ width: 24, height: 24, bgcolor: 'blue', fontSize: '1rem' }}
      />
    } else if (theIcon.type === 'avatar') {
      return <Avatar
        alt={theIcon.name}
        src='image'
        sx={{ width: 24, height: 24, bgcolor: 'blue', fontSize: '1rem' }}
      />
    } else {
      return <BackupTableIcon />;
    }
  }

  return (
    <>
      <MUIAppBar position='static' sx={{ ...classes.appBar, display: { xs: 'none', sm: 'block' } }} elevation={0}>
        <div style={classes.toolbar}>
          <Grid container justifyContent='flex' alignItems='center'>
            <Grid item xs={4} />
            <Grid item xs={8} display='flex' justifyContent={'flex-end'} alignItems='center'>
              <Box width={'600px'} sx={{ marginRight: '50px' }}>
                {activeStudents.length > 3
                ? <Slider {...settings} ref={sliderRef}>
                    {renderStudentHeader()}
                  </Slider>
                : <Box display='flex' flexDirection='row' alignContent='center' alignItems='center' justifyContent='end'>
                    { renderStudentHeader() }
                    <Divider
                      sx={{
                        background: 'black',
                        height: 35,
                        marginX: 3,
                        marginTop: 2
                      }}
                      variant='middle'
                      orientation='vertical'
                      
                    />
                  </Box>
                }
              </Box>
              <Box sx={{ paddingTop: activeStudents.length === 0 ? '20px' : '' }}>
                <AddStudentButton />
              </Box>
            </Grid>
          </Grid>
        </div>
      </MUIAppBar>
      <MUIAppBar position='fixed' sx={{ ...classes.appMobileBar, display: { xs: 'block', sm: 'none' } }} >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            onClick={openMobileSide ? handleDrawerClose : handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            {!openMobileSide ? (
              <MenuIcon />
            ) : (
              <CloseIcon />
            )}
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton size="large" aria-label="show 4 new mails"
              id="basic-button"
              aria-controls={openStudentList ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openStudentList ? 'true' : undefined}
              onClick={handleAnchorClick}
            >
              {!openStudentList ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowUpIcon />
              )}
            </IconButton>
            <IconButton
              sx={{
                color: 'blue',
                borderRadius: 'unset',
                borderBottom: 'solid 1.5px blue'
              }}
            // size="large"
            // edge="end"
            // aria-label="account of current user"
            // aria-controls={menuId}
            // aria-haspopup="true"
            // onClick={handleProfileMenuOpen}
            // color="inherit"
            >
              {getTheIcon()}
              {/* <BackupTableIcon /> */}
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
            marginTop: '58px'
          },
        }}
        variant="persistent"
        anchor="left"
        open={openMobileSide}
      >
        <Divider />
        {mobileStudentHeader(handleDrawerCloseAndTheIcon)}
        <MobileSideMenu handleDrawerClose={handleDrawerCloseAndTheIcon} />
      </Drawer>
    </>
  )
}
