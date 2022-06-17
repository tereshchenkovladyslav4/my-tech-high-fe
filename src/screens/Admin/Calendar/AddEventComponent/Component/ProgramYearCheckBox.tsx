import { Box, Card, Checkbox, FormControlLabel } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { useQuery } from '@apollo/client'
import { GetCurrentSchoolYearByRegionId } from '../../../Announcements/services'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { DropDownItem } from '../../../SiteManagement/components/DropDown/types'
import moment from 'moment'

type ProgramYearProps = {
  programYears: string[]
  setProgramYears: (value: string[]) => void
}
const ProgramYearCheckBox = ({ programYears, setProgramYears }: ProgramYearProps) => {
  const { me } = useContext(UserContext)
  const [programYearList, setProgramYearList] = useState<DropDownItem[]>([])
  const schoolYearData = useQuery(GetCurrentSchoolYearByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const handleChangeProgramYears = (e: any) => {
    if (programYears.includes(e.target.value)) {
      setProgramYears(programYears.filter((item) => item !== e.target.value && !!item))
    } else {
      setProgramYears([...programYears, e.target.value].filter((item) => !!item))
    }
  }
  const renderProgramYear = () =>
    map(programYearList, (programYear, index) => (
      <FormControlLabel
        key={index}
        sx={{ height: 30 }}
        control={
          <Checkbox
            checked={programYears.includes(programYear.value.toString())}
            value={programYear.value}
            onChange={handleChangeProgramYears}
          />
        }
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
            {programYear.label}
          </Paragraph>
        }
      />
    ))

  useEffect(() => {
    if (schoolYearData?.data?.schoolyear_getcurrent?.midyear_application) {
      const schoolYear_date_begin = moment(
        schoolYearData?.data?.schoolyear_getcurrent.date_begin?.substring(0, 10),
      ).toISOString()
      const schoolYear_date_end = moment(
        schoolYearData?.data?.schoolyear_getcurrent.date_end?.substring(0, 10),
      ).toISOString()
      const schoolYear_midyear_application_open = moment(
        schoolYearData?.data?.schoolyear_getcurrent.midyear_application_open?.substring(0, 10),
      ).toISOString()
      const schoolYear_midyear_application_close = moment(
        schoolYearData?.data?.schoolyear_getcurrent.midyear_application_close?.substring(0, 10),
      ).toISOString()

      setProgramYearList([
        {
          label: `${moment(schoolYear_date_begin).format('YYYY')} - ${moment(schoolYear_date_end).format('YY')}`,
          value: 'schoolYear',
        },
        {
          label: `${moment(schoolYear_midyear_application_open).format('YYYY')} - ${moment(
            schoolYear_midyear_application_close,
          ).format('YY')} Mid-year`,
          value: 'midYear',
        },
      ])
    } else {
      setProgramYearList([])
    }
  }, [me?.selectedRegionId, schoolYearData])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {programYearList.length > 0 && (
        <>
          <Paragraph size='large' fontWeight='700'>
            Program Year
          </Paragraph>
          {renderProgramYear()}
        </>
      )}
    </Box>
  )
}

export default ProgramYearCheckBox
