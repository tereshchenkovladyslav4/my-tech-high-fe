import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Grid } from '@mui/material'
import { MthTitle } from '@mth/enums'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import AssessmentTable from './AssessmentTable'
import HeaderComponent from './HeaderComponent'
import { testingPreferenceClassess } from './styles'
import TestingPreferenceInformation from './TestingPreferenceInformation'
import { AssessmentType } from './types'

const TestingPreference: React.FC = () => {
  const { me } = useContext(UserContext)
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<number>(0)
  const [showArchived, setShowArchived] = useState<boolean>(false)
  const [assessmentItems, setAssessmentItems] = useState<AssessmentType[]>([
    {
      id: 1,
      title: 'KEEP',
      value: 'K',
      isArchived: false,
    },
    {
      id: 2,
      title: 'Acadience',
      value: '1-3',
      isArchived: false,
    },
    {
      id: 3,
      title: 'RISE',
      value: '3-8',
      isArchived: false,
    },
    {
      id: 4,
      title: 'Aspire Plus',
      value: '9-12',
      isArchived: false,
    },
    {
      id: 5,
      title: 'SAT',
      value: '10-12',
      isArchived: true,
    },
  ])
  const tesingPreferenceLabels = [
    {
      title: 'Testing Preference',
      description: ` One of the requirements of our personalized, distance education program is to participate in all
          mandatory State tests (hosted on a local computer proctored by a school representative). All students
          will be required to take the corresponding tests listed below, All State tests are administered by
          Tooele - Blue Peak Online, Nebo - ALC, Iron County - SEA or Gateway Preparatory Academy.`,
    },
    {
      title: 'Opt-Out Form',
      description: `All State tests are administered by Tooele - Blue Peak Online, Nebo - ALC, Iron County
       - SEA or Gateway Preparatory Academy. Also, as required by State Law, an opt-out form for each School of Enrollment`,
    },
  ]
  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )

  useEffect(() => {
    if (schoolYears?.length) setSelectedSchoolYear(Number(schoolYears[0].school_year_id))
  }, [schoolYears])

  return (
    <Box sx={testingPreferenceClassess.container}>
      <HeaderComponent
        dropDownItems={schoolYearDropdownItems}
        selectedSchoolYear={selectedSchoolYear}
        setSelectedSchoolYear={setSelectedSchoolYear}
      />
      <Box sx={{ paddingX: 8, marginTop: 5 }}>
        <Grid container sx={{ textAlign: 'left' }}>
          {tesingPreferenceLabels?.map((label, index) => (
            <Grid key={index} item xs={6}>
              <TestingPreferenceInformation title={label.title} description={label.description} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={testingPreferenceClassess.buttonGroup}>
        <Button
          variant='contained'
          disableElevation
          sx={showArchived ? testingPreferenceClassess.activeButton : testingPreferenceClassess.inactiveButton}
          onClick={() => setShowArchived(true)}
        >
          {MthTitle.SHOW_ARCHIVED}
        </Button>
        <Button
          variant='contained'
          disableElevation
          sx={showArchived ? testingPreferenceClassess.inactiveButton : testingPreferenceClassess.activeButton}
          onClick={() => setShowArchived(false)}
        >
          {MthTitle.HIDE_ARCHIVED}
        </Button>
      </Box>
      <AssessmentTable
        assessmentItems={assessmentItems.filter((item) => item.isArchived == showArchived)}
        setAssessmentItems={setAssessmentItems}
      />
      <Button sx={testingPreferenceClassess.addBtn}>{MthTitle.ADD_ASSESSMENT}</Button>
    </Box>
  )
}

export default TestingPreference
