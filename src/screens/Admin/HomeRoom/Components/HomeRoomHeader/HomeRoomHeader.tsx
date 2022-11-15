import React from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import PageHeader from '@mth/components/PageHeader'
import { HomeRoomHeraderProps } from './types'

const HomeRoomHeader: React.FC<HomeRoomHeraderProps> = ({
  title,
  selectedYear,
  setSelectedYear,
  schoolYearDropdownItems,
}) => {
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
