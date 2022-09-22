import React from 'react'
import { Box } from '@mui/system'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { StudentInfoProps } from '../types'
import { studentInfoClassess } from './styles'

const StudentInfo: React.FC<StudentInfoProps> = ({ studentInfo }) => {
  return (
    <Box sx={studentInfoClassess.main}>
      <Subtitle sx={{ ...studentInfoClassess.text, fontWeight: 700 }}>{studentInfo?.name}</Subtitle>
      <Box sx={{ display: 'flex', justifyContent: 'start' }}>
        <Paragraph size={'large'} sx={{ ...studentInfoClassess.text, paddingY: 1 }}>
          {studentInfo?.grade}
        </Paragraph>
        {studentInfo?.specialEd && (
          <Paragraph size={'large'} sx={{ ...studentInfoClassess.text, paddingY: 1, marginLeft: 13 }}>
            {`Special Education: ${studentInfo?.specialEd}`}
          </Paragraph>
        )}
      </Box>
      <Paragraph size={'large'} sx={studentInfoClassess.text}>
        {studentInfo?.schoolDistrict}
      </Paragraph>
    </Box>
  )
}

export default StudentInfo
