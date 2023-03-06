import React, { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { useFlag } from '@unleash/proxy-client-react'
import { useHistory } from 'react-router-dom'
import { EPIC_1182 } from '@mth/constants'
import { MthRoute } from '@mth/enums'
import { s3URL } from '@mth/envs'
import { Person, Student } from '@mth/models'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { Resources } from './Resources'
import { StudentPage } from './Student'
import { StudentHomeroom } from './StudentHomeroom'
import { StudentNav } from './StudentNav'
import { StudentProfilePage } from './types'

export const HomeroomStudentProfile: React.FC = () => {
  const epic1182 = useFlag(EPIC_1182)
  const [nav, setNav] = useState<StudentProfilePage>(StudentProfilePage.STUDENT)
  const history = useHistory()
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo
  const studentId = location.pathname.split('/').at(-1)
  const [student, setStudent] = useState<Student>()
  const [person, setPerson] = useState<Person>()
  const [avatar, setAvatar] = useState<string | undefined>()

  useEffect(() => {
    if (!studentId) {
      history.push(MthRoute.HOMEROOM)
      return
    }

    const currStudent: Student | undefined = students?.find((item) => String(item.student_id) === String(studentId))
    if (!currStudent) {
      history.push(MthRoute.HOMEROOM)
      return
    }
    setStudent(currStudent)
    setPerson(currStudent?.person)
  }, [studentId])

  useEffect(() => {
    if (person && person.photo) setAvatar(person?.photo)
  }, [person])

  const getProfilePhoto = avatar ? s3URL + person?.photo : undefined

  return (
    <Box display='flex' flexDirection='column'>
      <StudentNav nav={nav} setNav={(value) => setNav(value)} student={student} avatar={getProfilePhoto} />
      {nav === StudentProfilePage.STUDENT && <StudentPage />}
      {nav === StudentProfilePage.HOMEROOM && (epic1182 ? <StudentHomeroom /> : 'Coming soon')}
      {nav === StudentProfilePage.RESOURCES && <Resources />}
    </Box>
  )
}
