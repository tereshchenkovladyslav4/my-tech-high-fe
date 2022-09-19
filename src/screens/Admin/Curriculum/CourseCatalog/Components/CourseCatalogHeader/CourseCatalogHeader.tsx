import React, { useCallback, useContext, useEffect } from 'react'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  ButtonBase,
  Grid,
  InputAdornment,
  OutlinedInput,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { debounce } from 'lodash'
import { useHistory } from 'react-router-dom'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { courseCatalogHeaderClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Components/CourseCatalogHeader/styles'
import { CourseCatalogHeaderProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Components/CourseCatalogHeader/types'

const CourseCatalogHeader: React.FC<CourseCatalogHeaderProps> = ({
  title,
  selectedYear,
  setSelectedYear,
  showArchived,
  setShowArchived,
  searchField,
  setSearchField,
}) => {
  const { me } = useContext(UserContext)
  const history = useHistory()

  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )

  const backAction = () => {
    history.goBack()
  }

  const changeHandler = (event = '') => {
    setSearchField(event)
  }
  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

  useEffect(() => {
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Grid container sx={{ background: 'inherit' }}>
          <ButtonBase onClick={backAction} disableRipple>
            <Grid container justifyContent='flex-start' alignItems='center'>
              <ArrowBackIosOutlinedIcon />
              <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 4 }}>{title}</Typography>
            </Grid>
          </ButtonBase>
        </Grid>
        <Box display='flex' flexDirection='row' justifyContent='flex-end' alignItems='center'>
          <DropDown
            dropDownItems={schoolYearDropdownItems}
            placeholder={'Select Year'}
            defaultValue={selectedYear}
            borderNone={true}
            setParentValue={(val) => {
              setSelectedYear(+val)
            }}
          />
        </Box>
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
            value={searchField ? searchField : ''}
            placeholder='Search...'
            onChange={(e) => debouncedChangeHandler(e.target.value)}
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
