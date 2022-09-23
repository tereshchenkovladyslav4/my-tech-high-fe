import React from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthTitle } from '@mth/enums'
import { ProgramSettingChanged } from '../types'

type SchedulesProps = {
  schedule: boolean
  diplomaSeeking: boolean
  testingPreference: boolean
  setSchedule: (value: boolean) => void
  setDiplomaSeeking: (value: boolean) => void
  setTestingPreference: (value: boolean) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

const Schedules: React.FC<SchedulesProps> = ({
  schedule,
  diplomaSeeking,
  testingPreference,
  setSchedule,
  setDiplomaSeeking,
  setTestingPreference,
  setIsChanged,
  isChanged,
}) => {
  const items = [
    {
      label: 'Enabled',
      value: 'true',
    },
    {
      label: 'Disabled',
      value: 'false',
    },
  ]
  const handleScheduleChange = (value: string) => {
    setSchedule(value == 'true' ? true : false)
    setTestingPreference(value == 'true' ? true : false)
    setDiplomaSeeking(value == 'true' ? true : false)
    setIsChanged({
      ...isChanged,
      schedule: true,
    })
  }

  return (
    <Box sx={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }} style={{ display: 'flex' }}>
      <Box>
        <DropDown
          dropDownItems={items}
          placeholder={'Select status'}
          defaultValue={schedule ? 'true' : 'false'}
          sx={{ width: '160px', marginLeft: '13px' }}
          borderNone={false}
          setParentValue={handleScheduleChange}
        />
      </Box>
      {schedule && (
        <>
          <MthCheckbox
            label={MthTitle.DIPLOMA_SEEKING}
            labelSx={{ fontWeight: 700 }}
            checked={diplomaSeeking}
            onChange={() => {
              setDiplomaSeeking(!diplomaSeeking)
              setIsChanged({ ...isChanged, diplomaSeeking: true })
            }}
          />
          <MthCheckbox
            label={MthTitle.TESTING_PREFERENCE}
            labelSx={{ fontWeight: 700 }}
            checked={testingPreference}
            onChange={() => {
              setTestingPreference(!testingPreference)
              setIsChanged({ ...isChanged, testingPreference: true })
            }}
          />
        </>
      )}
    </Box>
  )
}

export default Schedules
