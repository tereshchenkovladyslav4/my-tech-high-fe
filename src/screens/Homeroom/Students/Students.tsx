import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Box, Button, Card, Divider } from '@mui/material'
import { filter, map } from 'lodash'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../components/Typography/Title/Title'
import { MthColor, StudentStatus } from '../../../core/enums'
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
              paddingY: { xs: 4, md: 10 },
              paddingX: { xs: 4, md: 8 },
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
              {showInactiveStudents ? 'Hide Inactive Students' : 'Show Inactive Students'}
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
  )
}
