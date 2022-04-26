import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { AppBar as MUIAppBar, Avatar, Box, Button, Divider, Grid } from '@mui/material'
import { map } from 'lodash'
import React, { FunctionComponent, useContext, useRef, useState } from 'react'
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

  const { students } = me
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
      <Subtitle sx={{whiteSpace: 'nowrap'}}>Add Student</Subtitle>
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
        <AddStudentButton />
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
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  const gradeText = (student: StudentType) => (
    student.grade_levels.at(-1)?.grade_level !== 'K'
      ? `${toOrdinalSuffix((student.grade_levels.at(-1)?.grade_level as number))} Grade`
      : 'Kindergarten'
  )

  const getProfilePhoto = (person: Person) => {
    if( !person.photo )
      return 'image';

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const renderStudentHeader = () =>
    map(students, (student) => {
      const link = student?.applications?.at(-1)?.status === 'Submitted' || student?.status?.at(-1)?.status === 2 || student?.packets?.at(-1)?.status === 'Started'
        ? undefined
        :`${HOMEROOM}/${student.student_id}`
      return (
        <Box sx={{ textDecoration: 'none', marginTop: 1 }}>
          {
            link ?
            <NavLink to={link} style={{ textDecoration: 'none' }}>
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
              image={<Avatar alt={student.person.first_name} src={getProfilePhoto(student.person)} variant='rounded' style={{ marginRight: 24 }} />}
              />
          </NavLink>
          : <Metadata
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
            image={<Avatar alt={student.person.first_name} src={getProfilePhoto(student.person)} variant='rounded' style={{ marginRight: 24 }} />}
          />
          }
        </Box>
      )
    })

  return (
    <MUIAppBar position='static' sx={classes.appBar} elevation={0}>
      <div style={classes.toolbar}>
        <Grid container justifyContent="flex-end" alignItems="center">
          <Grid item xs={12} display='flex' justifyContent={'center'}>
            <Box width={students.length > 3 ? '50vw' : '100%'} >
            {
              students && students.length > 3
                ? <Slider {...settings} ref={sliderRef}>
                  {renderStudentHeader()}
                </Slider>
                : students && (students.length > 0 && students.length <= 3)
                && 
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end", }}>
                  {renderStudentHeader()}
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
                  <AddStudentButton />
                </Box>
            }
            </Box>
          </Grid>
        </Grid>
      </div>
    </MUIAppBar>
  )
}
