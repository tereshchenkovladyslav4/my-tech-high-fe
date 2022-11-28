import React, { useCallback, useContext, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, InputAdornment, OutlinedInput, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { debounce } from 'lodash'
import { DropDown } from '@mth/components/DropDown/DropDown'
import PageHeader from '@mth/components/PageHeader'
import { MthRoute } from '@mth/enums'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { courseCatalogHeaderClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Components/CourseCatalogHeader/styles'
import { CourseCatalogHeaderProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Components/CourseCatalogHeader/types'

const CourseCatalogHeader: React.FC<CourseCatalogHeaderProps> = ({
  title,
  selectedYear,
  setSelectedYear,
  setSelectedYearData,
  showArchived,
  setShowArchived,
  setSearchField,
}) => {
  const { me } = useContext(UserContext)
  const [localSearchField, setLocalSearchField] = useState<string>('')

  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )

  const changeHandler = (event = '') => {
    setSearchField(event)
  }
  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

  useEffect(() => {
    setLocalSearchField(localSearchField)
    debouncedChangeHandler(localSearchField)
  }, [localSearchField])

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
    <>
      <Box sx={{ mb: 4 }}>
        <PageHeader title={title} to={MthRoute.CURRICULUM_COURSE_CATALOG}>
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Box sx={{ width: { xs: '100%', md: '280px' } }}>
          <OutlinedInput
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'Search...')}
            size='small'
            fullWidth
            value={localSearchField || ''}
            placeholder='Search...'
            onChange={(e) => setLocalSearchField(e.target.value)}
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon style={{ color: 'black' }} />
              </InputAdornment>
            }
          />
        </Box>
        <ToggleButtonGroup
          color='primary'
          value={showArchived}
          exclusive
          onChange={(_event, newValue) => {
            if (newValue !== null) setShowArchived(newValue)
          }}
          sx={courseCatalogHeaderClasses.toggleButtonGroup}
        >
          <ToggleButton value={true}>Show Archived</ToggleButton>
          <ToggleButton value={false}>Hide Archived</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </>
  )
}

export default CourseCatalogHeader
