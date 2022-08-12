import React from 'react'
import { Tab, Tabs } from '@mui/material'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { MthColor } from '@mth/enums'
import { StudentNavProps, StudentProfileItem, StudentProfilePage } from '../types'
import { studentNavClasses } from './styles'

const StudentNav: React.FC<StudentNavProps> = ({ nav, setNav }) => {
  const STUDENT_PROFILE_ITEMS: StudentProfileItem[] = [
    {
      type: StudentProfilePage.STUDENT,
      label: 'Student',
    },
    {
      type: StudentProfilePage.HOMEROOM,
      label: 'Homeroom',
    },
    {
      type: StudentProfilePage.RESOURCES,
      label: 'Resources',
    },
  ]

  return (
    <Tabs
      value={nav}
      onChange={(event, value) => {
        setNav(value)
      }}
      centered
      sx={studentNavClasses.tabWrap}
      TabIndicatorProps={{ style: { background: MthColor.MTHBLUE } }}
    >
      {STUDENT_PROFILE_ITEMS.map((item, idx) => (
        <Tab
          key={idx}
          value={item.type}
          label={
            <Paragraph size={'large'} sx={studentNavClasses.tabLabel}>
              {item.label}
            </Paragraph>
          }
          sx={{ ...studentNavClasses.tabItem }}
        />
      ))}
    </Tabs>
  )
}

export default StudentNav
