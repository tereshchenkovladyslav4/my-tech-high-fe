import { Box, Card, Grid } from '@mui/material'
import React, { useState } from 'react'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../../../utils/constants'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GradeLevelCheckBox from './GradeLevelCheckBox'
import ProgramYearCheckBox from './ProgramYearCheckBox'
import UsersCheckBox from './UsersCheckBox'
import SchoolofEnrollmentCheckBox from './SchoolofEnrollmentCheckBox'
import OtherCheckBox from './OtherCheckbox'
import ProvidersCheckBox from './ProvidersCheckBox'

type FilterComponentProps = {
  grades: string[]
  programYears: string[]
  users: string[]
  schoolofEnrollments: string[]
  others: string[]
  providers: string[]
  setGrades: (value: string[]) => void
  setProgramYears: (value: string[]) => void
  setUsers: (value: string[]) => void
  setSchoolofEnrollment: (value: string[]) => void
  setOthers: (value: string[]) => void
  setProviders: (value: string[]) => void
}
const FilterComponent = ({
  grades,
  programYears,
  users,
  schoolofEnrollments,
  others,
  providers,
  setGrades,
  setProgramYears,
  setUsers,
  setSchoolofEnrollment,
  setOthers,
  setProviders,
}: FilterComponentProps) => {
  const [expand, setExpand] = useState<boolean>(true)

  const chevron = () =>
    !expand ? (
      <ChevronRightIcon
        sx={{
          color: MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
      />
    ) : (
      <ExpandMoreIcon
        sx={{
          color: MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
      />
    )
  const Filters = () => (
    <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <GradeLevelCheckBox grades={grades} setGrades={setGrades} />
            <ProgramYearCheckBox programYears={programYears} setProgramYears={setProgramYears} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <UsersCheckBox users={users} setUsers={setUsers} />
            <SchoolofEnrollmentCheckBox
              schoolofEnrollments={schoolofEnrollments}
              setSchoolofEnrollment={setSchoolofEnrollment}
            />
            <OtherCheckBox others={others} setOthers={setOthers} />
            <ProvidersCheckBox providers={providers} setProviders={setProviders} />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <Card sx={{ marginTop: 2, padding: 2 }}>
      <Box display='flex' flexDirection='row' onClick={() => setExpand(!expand)}>
        <Subtitle fontWeight='700' color={MTHBLUE} sx={{ cursor: 'pointer' }}>
          Filter
        </Subtitle>
        {chevron()}
      </Box>
      {expand && Filters()}
    </Card>
  )
}

export default FilterComponent
