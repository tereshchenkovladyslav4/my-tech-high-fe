import React from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { ProgramSettingChanged } from '../types'

type LearningLogsSelectProps = {
  learningLogs: boolean | undefined
  learningLogsFirstSecondSemesters: boolean | undefined
  setLearningLogs: (value: boolean) => void
  setLearningLogsFirstSecondSemesters: (value: boolean) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

export const LearningLogsSelect: React.FC<LearningLogsSelectProps> = ({
  learningLogs,
  learningLogsFirstSecondSemesters,
  setLearningLogs,
  setLearningLogsFirstSecondSemesters,
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
  const handleChange = (value: string | number | boolean) => {
    setLearningLogs(value == 'true' ? true : false)
    setLearningLogsFirstSecondSemesters(value == 'true' ? true : false)
    setIsChanged({
      ...isChanged,
      learningLogs: true,
    })
  }

  return (
    <Box sx={{ width: '100%', flexDirection: 'row' }} style={{ display: 'flex' }}>
      <Box>
        <DropDown
          dropDownItems={items}
          placeholder={'Select'}
          defaultValue={learningLogs?.toString()}
          sx={{ width: '160px', marginLeft: '13px' }}
          borderNone={false}
          setParentValue={handleChange}
        />
      </Box>
      <MthCheckbox
        label={'1st and 2nd Semesters'}
        labelSx={{ fontWeight: 700 }}
        wrapSx={{ ml: 6 }}
        checked={!!learningLogsFirstSecondSemesters}
        onChange={() => {
          setLearningLogsFirstSecondSemesters(!learningLogsFirstSecondSemesters)
          setIsChanged({ ...isChanged, learningLogsFirstSecondSemesters: true })
        }}
        disabled={!learningLogs}
      />
    </Box>
  )
}
