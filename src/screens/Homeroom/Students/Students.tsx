import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Box, Button, Card, Divider } from '@mui/material'
import { filter, map } from 'lodash'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../components/Typography/Title/Title'
import { StudentStatus } from '../../../core/enums'
import { UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { SchoolYearType } from '../../../utils/utils.types'
import { StudentType } from '../../HomeroomStudentProfile/Student/types'
import { Student } from './Student/Student'

type StudentsProps = {
  schoolYears: SchoolYearType[]
}
export const Students: FunctionComponent<StudentsProps> = ({ schoolYears }) => {
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo

  const [showInactiveButton, setShowInactiveButton] = useState<boolean>(false)
  const [showInactiveStudents, setShowInactiveStudents] = useState(false)
  const [availableStudents, setAvailableStudents] = useState<StudentType[]>([])
  const [inactiveStudents, setInactiveStudents] = useState<StudentType[]>([])

  const renderStudents = () =>
    map(availableStudents, (student) => {
      return <Student schoolYears={schoolYears} student={student} key={student?.student_id} />
    })

  const renderInactiveStudents = () =>
    map(inactiveStudents, (student) => {
      return <Student schoolYears={schoolYears} student={student} key={student?.student_id} />
    })

  useEffect(() => {
    const availableStudents = filter(students, (student) => student.status.at(-1)?.status !== StudentStatus.WITHDRAWN)
    setAvailableStudents(availableStudents)
    const inactiveStudents = filter(students, (student) => student.status.at(-1)?.status === StudentStatus.WITHDRAWN)
    setInactiveStudents(inactiveStudents)
    setShowInactiveButton(Boolean(inactiveStudents?.length))
  }, [students])

  return (
    <Card sx={{ paddingY: 4, paddingX: 8 }}>
      <Box display='flex' flexDirection='column'>
        <Title textAlign='left'>Students</Title>
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='center'
          sx={{ paddingY: 10, paddingX: 8 }}
          flexWrap='wrap'
        >
          {renderStudents()}
        </Box>
        {showInactiveStudents && (
          <>
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
          </>
        )}
        {showInactiveButton && (
          <Box width='100%' display='flex' justifyContent='end'>
            <Button onClick={() => setShowInactiveStudents(!showInactiveStudents)}>
              <Paragraph size='medium'>
                {showInactiveStudents ? 'Hide Inactive Students' : 'Show Inactive Students'}
              </Paragraph>
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  )
}
