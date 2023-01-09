import React from 'react'
import { Avatar, Grid, Tab, Tabs } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { gradeText } from '@mth/utils'
import { StudentNavProps, StudentProfileItem, StudentProfilePage } from '../types'
import { studentNavClasses } from './styles'

const StudentNav: React.FC<StudentNavProps> = ({ nav, setNav, student, avatar }) => {
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

  const STUDENT_DROPDOWN_PROFILE_ITEMS: DropDownItem[] = [
    {
      value: StudentProfilePage.STUDENT,
      label: 'Student',
    },
    {
      value: StudentProfilePage.HOMEROOM,
      label: 'Homeroom',
    },
    {
      value: StudentProfilePage.RESOURCES,
      label: 'Resources',
    },
  ]

  return (
    <>
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
      <Grid
        container
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        display={{ sx: 'initial', sm: 'none' }}
        paddingX={2}
        sx={studentNavClasses.mobileNav}
      >
        <Grid item xs={6}>
          <Metadata
            title={
              <Subtitle color={MthColor.MTHBLUE}>
                {student?.person.preferred_first_name
                  ? student?.person.preferred_first_name
                  : student?.person.first_name}
              </Subtitle>
            }
            subtitle={
              <Paragraph color='#cccccc' size={'large'}>
                {student && gradeText(student)}
              </Paragraph>
            }
            image={
              <Avatar
                alt={student?.person.preferred_first_name}
                src={avatar}
                variant='rounded'
                style={{ marginRight: 6 }}
              />
            }
          />
        </Grid>
        <Grid item xs={6}>
          <DropDown
            color={MthColor.BLACK}
            dropDownItems={STUDENT_DROPDOWN_PROFILE_ITEMS}
            setParentValue={setNav}
            borderNone={true}
            defaultValue={StudentProfilePage.STUDENT}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default StudentNav
