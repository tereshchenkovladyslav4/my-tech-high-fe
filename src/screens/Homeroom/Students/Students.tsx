import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Button, Card, CircularProgress, Divider } from '@mui/material'
import { filter, map, orderBy } from 'lodash'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Title } from '@mth/components/Typography/Title/Title'
import { MthColor, StudentStatus } from '@mth/enums'
import { SchoolYear, Student } from '@mth/models'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { ToDoItem } from '@mth/screens/Dashboard/ToDoList/components/ToDoListItem/types'
import { getTodoList } from '@mth/screens/Dashboard/ToDoList/service'
import { StudentCard } from '@mth/screens/Homeroom/Students/Student/Student'

type StudentsProps = {
  schoolYears: SchoolYear[]
  isLoading: boolean
  schoolYearsDropdown: DropDownItem[]
}
export const Students: React.FC<StudentsProps> = ({ schoolYears, isLoading, schoolYearsDropdown }) => {
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo

  const [showInactiveButton, setShowInactiveButton] = useState<boolean>(false)
  const [showInactiveStudents, setShowInactiveStudents] = useState(false)
  const [availableStudents, setAvailableStudents] = useState<Student[]>([])
  const [inactiveStudents, setInactiveStudents] = useState<Student[]>([])
  const [toDoList, setToDoList] = useState<ToDoItem[]>()

  const findStudent = (studentId: number) => {
    return map(toDoList, (todoListItem) => {
      if (todoListItem.students.some((student) => student.student_id === studentId)) {
        return todoListItem
      } else {
        return false
      }
    })
  }

  const renderStudents = () =>
    map(
      orderBy(
        availableStudents,
        [
          (student) =>
            student.person.preferred_first_name ? student.person.preferred_first_name : student.person.first_name,
        ],
        ['asc'],
      ),
      (student) => {
        const showNotification = findStudent(student.student_id)
          .filter((item) => item !== false)
          .at(0) as ToDoItem
        return (
          <StudentCard
            schoolYears={schoolYears}
            student={student}
            key={student?.student_id}
            schoolYearsDropdown={schoolYearsDropdown}
            showNotification={showNotification}
          />
        )
      },
    )

  const renderInactiveStudents = () =>
    map(inactiveStudents, (student) => {
      const showNotification = findStudent(student.student_id)
        .filter((item) => item !== false)
        .at(0) as ToDoItem
      return (
        <StudentCard
          withdrawn={true}
          schoolYears={schoolYears}
          schoolYearsDropdown={schoolYearsDropdown}
          student={student}
          key={student?.student_id}
          showNotification={showNotification}
        />
      )
    })

  useEffect(() => {
    const availableStudents = filter(
      students,
      (student) =>
        student.status.at(-1)?.status !== StudentStatus.WITHDRAWN &&
        student.status.at(-1)?.status !== StudentStatus.DELETED,
    )
    setAvailableStudents(availableStudents)
    const inactiveStudents = filter(
      students,
      (student) =>
        student.status.at(-1)?.status === StudentStatus.WITHDRAWN ||
        student.status.at(-1)?.status === StudentStatus.DELETED,
    )
    setInactiveStudents(inactiveStudents)
    setShowInactiveButton(Boolean(inactiveStudents?.length))
  }, [students])

  const { loading, data } = useQuery(getTodoList, {
    variables: {
      sort: 'status|ASC',
      take: 25,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.parent_todos) {
      setToDoList(data?.parent_todos)
    }
  }, [loading, data])

  return !isLoading ? (
    <>
      <Card sx={{ paddingY: { xs: 0, sm: 4 }, paddingX: { xs: 0, sm: 8 } }}>
        <Box display='flex' flexDirection='column'>
          <Title textAlign='left' sx={{ marginLeft: { xs: 2, sm: 0 }, marginTop: { xs: 2, sm: 0 } }}>
            Students
          </Title>
          <Box
            display='flex'
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent='center'
            sx={{
              paddingY: { xs: 2, md: 10 },
              paddingX: { xs: 2, md: 8 },
            }}
            flexWrap='wrap'
          >
            {renderStudents()}
          </Box>
          {showInactiveStudents && (
            <Box sx={{ display: { xs: 'none', md: 'inline' } }}>
              <Divider />
              <Box
                display='flex'
                flexDirection='row'
                justifyContent='center'
                sx={{ paddingY: 10, paddingX: 8 }}
                flexWrap='wrap'
              >
                {renderInactiveStudents()}
              </Box>
            </Box>
          )}
          {showInactiveButton && (
            <Box width='100%' justifyContent='end' sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button onClick={() => setShowInactiveStudents(!showInactiveStudents)}>
                <Paragraph size='medium'>
                  {showInactiveStudents ? 'Hide Inactive Students' : 'Show Inactive Students'}
                </Paragraph>
              </Button>
            </Box>
          )}
        </Box>
      </Card>
      {showInactiveButton && (
        <Box display={{ xs: 'flex', sm: 'none' }} flexDirection='column' justifyContent='center' marginY={4}>
          <Divider />
          <Button onClick={() => setShowInactiveStudents(!showInactiveStudents)}>
            <Paragraph size='medium' sx={{ textDecoration: 'underline', color: MthColor.MTHBLUE }}>
              {showInactiveStudents ? 'Hide Inactive Students' : 'Show / Hide Inactive Students'}
            </Paragraph>
          </Button>
        </Box>
      )}
      {showInactiveStudents && (
        <Box sx={{ display: { xs: 'inline', md: 'none' } }}>
          <Card
            sx={{
              paddingY: { xs: 0, sm: 4 },
              paddingX: { xs: 0, sm: 8 },
            }}
          >
            <Box display='flex' flexDirection='column'>
              <Title textAlign='left' sx={{ marginLeft: { xs: 2, sm: 0 }, marginTop: { xs: 2, sm: 0 } }}>
                Students
              </Title>
              <Box
                display='flex'
                flexDirection={{ xs: 'column', md: 'row' }}
                justifyContent='center'
                sx={{
                  paddingY: { xs: 4, md: 10 },
                  paddingX: { xs: 4, md: 8 },
                }}
                flexWrap='wrap'
              >
                {renderInactiveStudents()}
              </Box>
            </Box>
          </Card>
        </Box>
      )}
    </>
  ) : (
    <Card sx={{ paddingY: { xs: 0, sm: 4 }, paddingX: { xs: 0, sm: 8 } }}>
      <Box display='flex' flexDirection='column'>
        <Title textAlign='left' sx={{ marginLeft: { xs: 2, sm: 0 }, marginTop: { xs: 2, sm: 0 } }}>
          Students
        </Title>
        <Box
          display='flex'
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent='center'
          sx={{
            paddingY: { xs: 2, md: 10 },
            paddingX: { xs: 2, md: 8 },
          }}
          flexWrap='wrap'
        >
          <CircularProgress color='inherit' />
        </Box>
      </Box>
    </Card>
  )
}
