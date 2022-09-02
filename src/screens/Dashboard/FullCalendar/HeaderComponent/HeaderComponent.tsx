import React, { useCallback } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Grid, InputAdornment, OutlinedInput } from '@mui/material'
import { debounce } from 'lodash'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import MultiSelectDropDown from '../../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { HeaderComponentProps } from '../types'
import { headerClasses } from './styles'

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  searchField,
  eventTypeLists,
  selectedEventTypes,
  setSelectedEventTypes,
  setSectionName,
  setSearchField,
}) => {
  const changeHandler = (event = '') => {
    setSearchField(event)
  }
  const debouncedChangeHandler = useCallback(debounce(changeHandler, 50), [])
  return (
    <Box sx={headerClasses.pageTop}>
      <Grid container justifyContent='space-between'>
        <Grid item xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
          <Box sx={headerClasses.pageTitle}>
            <Button
              onClick={() => {
                setSearchField('')
                setSectionName('root')
              }}
            >
              <ChevronLeftIcon sx={{ marginRight: 0.5, marginLeft: -2.5 }} />
            </Button>
            <Box sx={{ marginRight: 10 }}>
              <Subtitle size='medium' fontWeight='700'>
                Calendar
              </Subtitle>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={5}>
          <Box sx={headerClasses.pageTopRight}>
            <MultiSelectDropDown
              checkBoxLists={eventTypeLists}
              selectedLists={selectedEventTypes}
              setSelectedLists={setSelectedEventTypes}
            />
            <Box marginLeft={4} sx={headerClasses.search}>
              <OutlinedInput
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'Search Event')}
                size='small'
                fullWidth
                value={searchField ? searchField : ''}
                placeholder='Search Event'
                onChange={(e) => debouncedChangeHandler(e.target.value)}
                startAdornment={
                  <InputAdornment position='start'>
                    <SearchIcon style={{ color: 'black' }} />
                  </InputAdornment>
                }
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HeaderComponent
