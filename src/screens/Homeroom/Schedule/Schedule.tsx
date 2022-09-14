import React, { useState } from 'react'
import { Button, Card } from '@mui/material'
import { Box } from '@mui/system'
import { MthTitle } from '@mth/enums'
import { DiplomaSeeking } from './DiplomaSeeking'
import { HeaderComponent } from './HeaderComponent'
import { StudentInfo } from './StudentInfo'
import { scheduleClassess } from './styles'
import { TestingPreference } from './TestingPreference'
import { DiplomaOption } from './types'

const Schedule: React.FC = () => {
  const [step, setStep] = useState<string>(MthTitle.STEP_TESTING_PREFERENCE)
  const diplomaTitle = 'Diploma-seeking'
  const diplomaDescription =
    'Does this student plan to complete the requirements to earn a Utah high school diploma(schedule flexibility is limited)?'

  const [diplomaOptions, setDiplomaOptions] = useState<DiplomaOption[]>([
    {
      label: 'Yes',
      value: false,
    },
    {
      label: 'No',
      value: false,
    },
  ])
  const handleNextStep = () => {
    ///////////////////////////////////////////////////////////////////
    // Every step is followed by validation and writes to the database.
    // 1. validation
    // 2. Register data into db
    ///////////////////////////////////////////////////////////////////
    if (step == MthTitle.STEP_TESTING_PREFERENCE) {
      // To Do
      setStep(MthTitle.STEP_DIPLOMA_SEEKING)
    } else if (step == MthTitle.STEP_DIPLOMA_SEEKING) {
      // To Do
      setStep('')
    }
  }
  return (
    <Card sx={{ margin: 4, padding: 4 }}>
      <Box sx={scheduleClassess.container}>
        <HeaderComponent title={MthTitle.SCHEDULE} />
        <StudentInfo
          name={'Hunter Smith'}
          grade={'11th Grade'}
          schoolDistrict={'Nebo School District'}
          specialEd={'IEP'}
        />
        {step == MthTitle.STEP_TESTING_PREFERENCE && <TestingPreference />}
        {step == MthTitle.STEP_DIPLOMA_SEEKING && (
          <DiplomaSeeking
            title={diplomaTitle}
            description={diplomaDescription}
            options={diplomaOptions}
            setOptions={setDiplomaOptions}
          />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button onClick={() => handleNextStep()} variant='contained' sx={scheduleClassess.button}>
            {'Next'}
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default Schedule
