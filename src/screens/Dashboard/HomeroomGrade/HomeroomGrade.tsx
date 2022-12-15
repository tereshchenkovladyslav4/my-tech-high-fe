import React, { useContext, useEffect, useRef, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Card, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import { find, forEach, map } from 'lodash'
import Slider from 'react-slick'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { StudentStatus } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { getWindowDimension } from '@mth/utils'
import { ToDoItem } from '../ToDoList/components/ToDoListItem/types'
import { StudentGrade } from './components/StudentGrade/StudentGrade'

type HomeroomGradeProps = {
  schoolYears: SchoolYear[]
  mainTodoList: ToDoItem[]
}

export const HomeroomGrade: React.FC<HomeroomGradeProps> = ({ schoolYears, mainTodoList }) => {
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo

  const [filteredStudents, setFilteredStudents] = useState<StudentType[]>([])
  const [studentsCnt, setStudentsCnt] = useState<number>(0)
  const [mappedTodoList, setMappedTodoList] = useState<Map<number, ToDoItem[]>>(new Map())

  const sliderRef = useRef()

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const mapStudentsToTodoList = () => {
    const mappedStudents = new Map<number, ToDoItem[]>()
    forEach(filteredStudents, (student) => {
      if (!mappedStudents.has(student.student_id)) {
        mappedStudents.set(student.student_id, [])
        forEach(mainTodoList, (todoListItem) => {
          if (find(todoListItem.students, { student_id: student.student_id }) !== undefined) {
            mappedStudents.get(student.student_id)?.push(todoListItem)
          }
        })
      }
    })
    setMappedTodoList(mappedStudents)
  }

  function SampleNextArrow(props) {
    const { style } = props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          right: '-142px',
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
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    variableWidth: true,
    rows: 1,
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 812,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  })

  const renderStudents = () =>
    map(filteredStudents, (student, index) => {
      return (
        <StudentGrade
          schoolYears={schoolYears}
          student={student}
          key={index}
          notifications={mappedTodoList.get(student.student_id) || []}
        />
      )
    })

  useEffect(() => {
    setFilteredStudents(
      (students || []).filter(
        (x) => x.status.at(-1)?.status !== StudentStatus.WITHDRAWN && x.status.at(-1)?.status !== StudentStatus.DELETED,
      ),
    )
  }, [students])

  useEffect(() => {
    setStudentsCnt(filteredStudents.length)
  }, [filteredStudents])

  useEffect(() => {
    if (filteredStudents.length > 0) {
      mapStudentsToTodoList()
    }
  }, [filteredStudents, mainTodoList])
  const sliderWidth = Math.max(studentsCnt, 1) * 100 > 600 ? 600 : Math.max(studentsCnt, 1) * 100
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
          <Stack
            display='flex'
            justifyContent='flex-end'
            alignSelf='center'
            marginY={1}
            direction='row'
            spacing={2}
            width='100%'
          >
            <Box
              className='dynamic-box'
              sx={{
                width: windowDimensions.width > 792 ? sliderWidth + 'px' : Math.min(studentsCnt, 4.5) * 100 + 'px',
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: '.slick-track {display: flex;}' }} />
              <Slider {...settings()} ref={sliderRef}>
                {renderStudents()}
              </Slider>
            </Box>
          </Stack>
        )}
      </Box>
    </Card>
  )
}
