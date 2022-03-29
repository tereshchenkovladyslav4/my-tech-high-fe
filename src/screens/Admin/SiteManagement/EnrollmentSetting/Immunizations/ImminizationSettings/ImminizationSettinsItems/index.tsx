import { Box } from '@mui/material'
import React from 'react'
import ConsectuiveVaccine from './ConsectuiveVaccine'
import EmailResponse from './EmailResponse'
import ImmunityAllowed from './ImmunityAllowed'
import MaximumGrade from './MaximumGrade'
// import MaximumSchoolYear from './MaximumSchoolYear'
import MaximumSpacing from './MaximumSpacing'
import MinimumGrade from './MinimumGrade'
// import MinimumSchoolYear from './MinimumSchoolYear'
import MinimumSpacing from './MinimumSpacing'
import Note from './Note'
import RequireUpdate from './RequireUpdate'

const ImminizationSettinsItems: React.FC = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start'
    }}>
      <MinimumGrade />
      <MaximumGrade />
      {/* <MinimumSchoolYear /> */}
      {/* <MaximumSchoolYear /> */}
      <ImmunityAllowed />
      <RequireUpdate />
      <ConsectuiveVaccine />
      <MinimumSpacing />
      <MaximumSpacing />
      <EmailResponse />
      <Note />
    </Box>
  )
}

export { ImminizationSettinsItems as default }
