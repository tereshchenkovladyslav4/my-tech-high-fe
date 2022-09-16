import React from 'react'
import { Box } from '@mui/material'
import { SingleCheckbox } from '@mth/components/SingleCheckbox'
import { MthTitle } from '@mth/enums'
import { DropDown } from '../../components/DropDown/DropDown'
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
          <SingleCheckbox
            title={MthTitle.DIPLOMA_SEEKING}
            defaultValue={diplomaSeeking}
            titleBold={true}
            handleChangeValue={() => {
              setDiplomaSeeking(!diplomaSeeking)
              setIsChanged({ ...isChanged, diplomaSeeking: true })
            }}
          />
          <SingleCheckbox
            title={MthTitle.TESTING_PREFERENCE}
            defaultValue={testingPreference}
            titleBold={true}
            handleChangeValue={() => {
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
