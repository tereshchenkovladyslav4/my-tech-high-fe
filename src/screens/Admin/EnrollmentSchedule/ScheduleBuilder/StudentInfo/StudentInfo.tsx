import React from 'react'
import { Box } from '@mui/system'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { SCHEDULE_STATUS_OPTIONS } from '@mth/constants'
import { studentInfoClass } from './styles'
import { StudentInfoProps } from './types'

const StudentInfo: React.FC<StudentInfoProps> = ({ studentInfo, scheduleStatus, onUpdateScheduleStatus }) => {
  return (
    <Box sx={studentInfoClass.main}>
      <Box sx={studentInfoClass.info}>
        <Subtitle sx={studentInfoClass.info_name}>{studentInfo?.name}</Subtitle>
        <Box sx={studentInfoClass.info_box}>
          <Paragraph size={'large'}>{studentInfo?.grade}</Paragraph>
          <Paragraph size={'large'}>{`Special Education: ${studentInfo?.specialEd}`}</Paragraph>
        </Box>
        <Paragraph size={'large'}>{studentInfo?.schoolDistrict}</Paragraph>
      </Box>
      <DropDown
        sx={studentInfoClass.select}
        dropDownItems={SCHEDULE_STATUS_OPTIONS}
        defaultValue={scheduleStatus?.value}
        borderNone={true}
        setParentValue={(val) => {
          onUpdateScheduleStatus(`${val}`)
        }}
      />
    </Box>
  )
}

export default StudentInfo
