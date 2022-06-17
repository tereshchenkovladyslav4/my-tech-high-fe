import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { DropDownItem } from '../../../SiteManagement/components/DropDown/types'
import { useQuery } from '@apollo/client'
import { GetSchoolsOfEnrollment } from '../../../SiteManagement/SchoolPartner/services'

type SchoolofEnrollmentProps = {
  schoolofEnrollments: string[]
  setSchoolofEnrollment: (value: string[]) => void
}
const SchoolofEnrollmentCheckBox = ({ schoolofEnrollments, setSchoolofEnrollment }: SchoolofEnrollmentProps) => {
  const { loading, data } = useQuery(GetSchoolsOfEnrollment, {
    fetchPolicy: 'network-only',
  })
  const [schoolofEnrollmentList, setSchoolofEnrollmentList] = useState<DropDownItem[]>([])

  useEffect(() => {
    if (!loading && data?.getSchoolsOfEnrollment) {
      setSchoolofEnrollmentList(
        data?.getSchoolsOfEnrollment
          ?.filter((item: any) => !!item.active)
          .map((schoolOfEnroll: any) => ({
            label: schoolOfEnroll?.name,
            value: schoolOfEnroll?.abbreviation,
          })),
      )
    }
  }, [data])

  const handleChangeSchoolYearEnrollment = (e: any) => {
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
