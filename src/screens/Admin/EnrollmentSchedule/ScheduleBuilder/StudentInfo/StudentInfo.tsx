import React from 'react'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { SCHEDULE_STATUS_OPTIONS } from '@mth/constants'
import { mthButtonClasses } from '@mth/styles/button.style'
import { studentInfoClass } from './styles'
import { StudentInfoProps } from './types'

const StudentInfo: React.FC<StudentInfoProps> = ({ viewonly, studentInfo, scheduleStatus, onUpdateScheduleStatus }) => {
  return (
    <Box sx={studentInfoClass.main}>
      <Box sx={studentInfoClass.info}>
        <Subtitle sx={studentInfoClass.info_name}>{studentInfo?.name}</Subtitle>
        <Box sx={studentInfoClass.info_box}>
          <Paragraph size={'large'}>{studentInfo?.grade}</Paragraph>
          {studentInfo?.specialEd && studentInfo?.specialEd?.indexOf('No') == -1 && (
            <Paragraph
              size={'large'}
              sx={{ marginLeft: '100px', fontWeight: 600 }}
            >{`Special Education: ${studentInfo?.specialEd}`}</Paragraph>
          )}
        </Box>
        <Paragraph size={'large'}> {studentInfo?.schoolOfEnrollment || 'Unassigned'}</Paragraph>
      </Box>
      {viewonly ? (
        <Button sx={{ ...mthButtonClasses.smallPrimary, width: '160px' }}>{scheduleStatus?.label}</Button>
      ) : (
        <DropDown
          sx={studentInfoClass.select}
          dropDownItems={SCHEDULE_STATUS_OPTIONS}
          defaultValue={scheduleStatus?.value}
          borderNone={true}
          setParentValue={(val) => {
            onUpdateScheduleStatus(`${val}`)
          }}
        />
      )}
    </Box>
  )
}

export default StudentInfo
