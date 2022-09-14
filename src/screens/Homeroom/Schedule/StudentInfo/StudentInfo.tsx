import React from 'react'
import { Box } from '@mui/system'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { StudentInfoProps } from '../types'
import { studentInfoClassess } from './styles'

const StudentInfo: React.FC<StudentInfoProps> = ({ name, grade, schoolDistrict, specialEd }) => {
  return (
    <Box sx={studentInfoClassess.main}>
      <Subtitle sx={{ ...studentInfoClassess.text, fontWeight: 700 }}>{name}</Subtitle>
      <Box sx={{ display: 'flex', justifyContent: 'start' }}>
        <Paragraph size={'large'} sx={{ ...studentInfoClassess.text, paddingY: 1 }}>
          {grade}
        </Paragraph>
        {specialEd && (
          <Paragraph size={'large'} sx={{ ...studentInfoClassess.text, paddingY: 1, marginLeft: 13 }}>
            {`Special Education: ${specialEd}`}
          </Paragraph>
        )}
      </Box>
      <Paragraph size={'large'} sx={studentInfoClassess.text}>
        {schoolDistrict}
      </Paragraph>
    </Box>
  )
}

export default StudentInfo
