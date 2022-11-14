import React, { useContext, useEffect } from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import PageHeader from '@mth/components/PageHeader'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { HomeRoomHeraderProps } from './types'

const HomeRoomHeader: React.FC<HomeRoomHeraderProps> = ({
  title,
  selectedYear,
  setSelectedYear,
  setSelectedYearData,
  // setSearchField,
}) => {
  const { me } = useContext(UserContext)

  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )

  useEffect(() => {
    if (selectedYear && schoolYears) {
      const schoolYearData = schoolYears.find((item) => item.school_year_id == selectedYear)
      if (schoolYearData && setSelectedYearData) setSelectedYearData(schoolYearData)
    }
  }, [selectedYear])

  useEffect(() => {
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

  return (
    <Box sx={{ mb: 4 }}>
      <PageHeader title={title} to='/homeroom'>
        <DropDown
          dropDownItems={schoolYearDropdownItems}
          placeholder={'Select Year'}
          defaultValue={selectedYear}
          borderNone={true}
          setParentValue={(val) => {
            setSelectedYear(+val)
          }}
        />
      </PageHeader>
    </Box>
  )
}

export default HomeRoomHeader
