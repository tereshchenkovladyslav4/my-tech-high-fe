import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React, { useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { DropDownItem } from '../../../SiteManagement/components/DropDown/types'

type SchoolofEnrollmentProps = {
  schoolofEnrollments: string[]
  setSchoolofEnrollment: (value: string[]) => void
}
const SchoolofEnrollmentCheckBox = ({ schoolofEnrollments, setSchoolofEnrollment }: SchoolofEnrollmentProps) => {
  const [schoolofEnrollmentList, setSchoolofEnrollmentList] = useState<DropDownItem[]>([
    {
      label: 'Toole',
      value: 'toole',
    },
    {
      label: 'Nebo',
      value: 'nebo',
    },
    {
      label: 'Other',
      value: 'other',
    },
    {
      label: 'Providers',
      value: 'providers',
    },
  ])

  const handleChangeSchoolYearEnrollment = (e) => {
    if (schoolofEnrollments.includes(e.target.value)) {
      setSchoolofEnrollment(schoolofEnrollments.filter((item) => item !== e.target.value && !!item))
    } else {
      setSchoolofEnrollment([...schoolofEnrollments, e.target.value].filter((item) => !!item))
    }
  }

  const renderSchoolofEnrollment = () =>
    map(schoolofEnrollmentList, (school, index) => (
      <FormControlLabel
        key={index}
        sx={{ height: 30 }}
        control={
          <Checkbox
            checked={schoolofEnrollments.includes(school.value.toString())}
            value={school.value}
            onChange={handleChangeSchoolYearEnrollment}
          />
        }
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
            {school.label}
          </Paragraph>
        }
      />
    ))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paragraph size='large' fontWeight='700'>
        School of Enrollment
      </Paragraph>
      {renderSchoolofEnrollment()}
    </Box>
  )
}

export default SchoolofEnrollmentCheckBox
