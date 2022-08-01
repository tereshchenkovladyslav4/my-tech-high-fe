import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Card, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import { map } from 'lodash'
import Slider from 'react-slick'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { StudentStatus } from '@mth/enums'
import { SchoolYearType } from '@mth/models'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { StudentGrade } from './components/StudentGrade/StudentGrade'

type HomeroomGradeProps = {
  schoolYears: SchoolYearType[]
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

export const HomeroomGrade: FunctionComponent<HomeroomGradeProps> = ({ schoolYears }) => {
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo

  const [filteredStudents, setFilteredStudents] = useState<StudentType[]>([])
  const [studentsCnt, setStudentsCnt] = useState<number>(0)

  const sliderRef = useRef()

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const settings = () => ({
    className: 'slider variable-width',
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    variableWidth: true,
    rows: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  })

  const renderStudents = () =>
    map(filteredStudents, (student, index) => {
      return <StudentGrade schoolYears={schoolYears} student={student} key={index} />
    })

  useEffect(() => {
    setFilteredStudents((students || []).filter((x) => x.status.at(-1)?.status !== StudentStatus.WITHDRAWN))
  }, [students])

  useEffect(() => {
    setStudentsCnt(filteredStudents.length)
  }, [filteredStudents])

  return (
    <Card style={{ borderRadius: 12 }}>
      <Box
        flexDirection='row'
        textAlign='left'
        paddingY={1.5}
        paddingX={3}
        justifyContent='space-between'
        sx={{
          display: { xs: 'block', sm: 'flex' },
        }}
      >
        <Box display='flex' justifyContent='space-between' flexDirection='column'>
          <Subtitle size='large' fontWeight='bold'>
            Students
          </Subtitle>
        </Box>

        {studentsCnt > 0 && (
          <Stack display='flex' justifyContent='flex-end' alignSelf='center' marginY={1} direction='row' spacing={2}>
            {studentsCnt > 2 && (
              <Box
                sx={{
                  width:
                    windowDimensions.width >= 992
                      ? Math.min(studentsCnt, 6) * 60 + 'px'
                      : windowDimensions.width >= 576
                      ? Math.min(studentsCnt, 3) * 60 + 'px'
                      : '85%',
                  mr: '20px',
                }}
              >
                <style dangerouslySetInnerHTML={{ __html: `.slick-track {display: flex;}` }} />
                <Slider {...settings()} ref={sliderRef}>
                  {renderStudents()}
                </Slider>
              </Box>
            )}
            {studentsCnt <= 2 && <Box sx={{ width: '100%' }}>{renderStudents()}</Box>}
          </Stack>
        )}
      </Box>
    </Card>
  )
}
