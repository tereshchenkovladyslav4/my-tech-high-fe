import React, { useState } from 'react'
import { Box } from '@mui/system'
import { Resources } from './Resources'
import { Student } from './Student'
import { StudentNav } from './StudentNav'
import { StudentProfilePage } from './types'

export const HomeroomStudentProfile: React.FC = () => {
  const [nav, setNav] = useState<StudentProfilePage>(StudentProfilePage.STUDENT)

  return (
    <Box display='flex' flexDirection='column'>
      <StudentNav nav={nav} setNav={(value) => setNav(value)}></StudentNav>

      {nav === StudentProfilePage.STUDENT && <Student />}
      {nav === StudentProfilePage.HOMEROOM && <h1> Coming Soon </h1>}
      {nav === StudentProfilePage.RESOURCES && <Resources />}
    </Box>
  )
}
