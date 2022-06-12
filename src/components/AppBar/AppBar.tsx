import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { AppBar as MUIAppBar, Avatar, Box, Button, Divider, Grid } from '@mui/material'
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

export const AppBar: FunctionComponent = () => {
  const classes = useStyles
  const sliderRef = useRef()

  const { me } = useContext(UserContext)

  //const { students } = me
  const [students, setStudents] = useState<StudentType[]>([])

  const [activeStudents, setActiveStudents] = useState<StudentType[]>([])

  const location = useLocation()

  const isActive = (id) => location.pathname.includes(`/${id}`)

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
          top: '31%',
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
    slidesToShow: Math.min(5, activeStudents.length),
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
		variableWidth: true,
		rows: 1,
		responsive: [
			{
				breakpoint: 1920,
				settings: {
					slidesToShow: Math.min(5, activeStudents.length),
				}
			},
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: Math.min(4, activeStudents.length)
				}
			},
			{
				breakpoint: 1368,
				settings: {
					slidesToShow: Math.min(3, activeStudents.length)
				}
			},
      {
        breakpoint: 1135,
        settings: {
          slidesToShow: Math.min(2, activeStudents.length)
        }
      },
			{
				breakpoint: 960,
				settings: {
					slidesToShow: Math.min(1, activeStudents.length),
          variableWidth: false
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

  return (
    <MUIAppBar position='static' sx={classes.appBar} elevation={0}>
      <div style={classes.toolbar}>
        <Grid container justifyContent='flex' alignItems='center'>
          <Grid item xs={12} display='flex' justifyContent={'flex-end'} alignItems='center'>
            <Box width={'calc(100vw - 600px)'} sx={{marginRight: '50px'}}>
                <Slider {...settings} ref={sliderRef}>
                  {renderStudentHeader()}
                </Slider>
            </Box>
            <AddStudentButton />
          </Grid>
        </Grid>
      </div>
    </MUIAppBar>
  )
}
