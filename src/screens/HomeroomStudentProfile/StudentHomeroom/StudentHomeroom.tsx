import React, { useMemo, useState } from 'react'
import { Grid } from '@mui/material'
import { Instructions } from '@mth/components/Instructions'
import PageHeader from '@mth/components/PageHeader'
import { useActiveHomeroomSchoolYears } from '@mth/hooks'
import { Assignment } from '@mth/models'
import { StudentSchedule } from '../Student/StudentSchedule/StudentSchedule'
import { Feedback } from './Feedback'
import { HomeroomInfo } from './HomeroomInfo'
import { LearningLogEdit, LearningLogs } from './LearningLogs'

const StudentHomeroom: React.FC = () => {
  const currentStudentId = Number(location.pathname.split('/').at(-1))
  const [selectedLearningLog, setSelectedLearningLog] = useState<Assignment>()
  const instructions = useMemo(() => {
    return selectedLearningLog?.Master?.instructions || ''
  }, [selectedLearningLog])

  const { dropdownItems, selectedYearId, setSelectedYearId, selectedYear } =
    useActiveHomeroomSchoolYears(currentStudentId)

  return (
    <Grid container padding={3}>
      {!selectedLearningLog ? (
        <>
          <Grid item xs={12} sm={7}>
            <Grid container padding={1} rowSpacing={1}>
              <Grid item xs={12} sm={12}>
                <HomeroomInfo
                  studentId={currentStudentId}
                  schoolYearItems={dropdownItems}
                  selectedYearId={selectedYearId || 0}
                  setSelectedYearId={setSelectedYearId}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <LearningLogs
                  studentId={currentStudentId}
                  schoolYearId={selectedYearId || 0}
                  selectedYear={selectedYear}
                  setSelectedLearningLog={setSelectedLearningLog}
                />
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} sm={12}>
            <PageHeader
              title={selectedLearningLog?.title}
              onBack={() => setSelectedLearningLog(undefined)}
            ></PageHeader>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Grid container padding={1} rowSpacing={1}>
              <Grid item xs={12} sm={12}>
                <Instructions description={instructions} />
              </Grid>
              <Grid item xs={12} sm={12}>
                <LearningLogEdit
                  learningLog={selectedLearningLog}
                  setSelectedLearningLog={setSelectedLearningLog}
                  schoolYearId={selectedYearId || 0}
                />
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      <Grid item xs={12} sm={5}>
        <Grid container padding={1} rowSpacing={1}>
          <Grid item xs={12} sm={12}>
            <Feedback />
          </Grid>
          <Grid item xs={12} sm={12}>
            <StudentSchedule />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default StudentHomeroom
