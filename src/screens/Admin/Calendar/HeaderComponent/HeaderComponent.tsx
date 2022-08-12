import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Grid, InputAdornment, OutlinedInput } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { CALENDAR } from '../../../../utils/constants'
import { MultiSelectDropDown } from '../components/MultiSelectDropDown'
import { MultiSelectDropDownListType } from '../components/MultiSelectDropDown/MultiSelectDropDown'
import { mainClasses } from '../MainComponent/styles'

type HeaderComponentProps = {
  searchField: string | undefined
  eventTypeLists: MultiSelectDropDownListType[]
  selectedEventTypes: string[]
  setSelectedEventTypes: (value: string[]) => void
  setSearchField?: (value: string | undefined) => void
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  searchField,
  eventTypeLists,
  selectedEventTypes,
  setSelectedEventTypes,
}) => {
  const history = useHistory()
  return (
    <Box sx={mainClasses.pageTop}>
      <Grid container justifyContent='space-between'>
        <Grid item xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
          <Box sx={mainClasses.pageTitle}>
            <Subtitle size='medium' fontWeight='700'>
              Calendar
            </Subtitle>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={8}>
          <Box sx={mainClasses.pageTopRight}>
            <Button
              disableElevation
              variant='contained'
              sx={mainClasses.editButton}
              startIcon={<ModeEditIcon />}
              onClick={() => history.push(`${CALENDAR}/editType`)}
            >
              <Subtitle sx={{ whiteSpace: 'nowrap' }}>Edit Type</Subtitle>
            </Button>
            <Button
              disableElevation
              variant='contained'
              sx={mainClasses.addButton}
              startIcon={<AddIcon />}
              onClick={() => history.push(`${CALENDAR}/addEvent`)}
            >
              <Subtitle sx={{ whiteSpace: 'nowrap' }}>Add Event</Subtitle>
            </Button>
            <MultiSelectDropDown
              checkBoxLists={eventTypeLists}
              selectedLists={selectedEventTypes}
              setSelectedLists={setSelectedEventTypes}
            />
            <Box marginLeft={4} sx={mainClasses.search}>
              <OutlinedInput
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'Search Event')}
                size='small'
                fullWidth
                value={searchField ? searchField : ''}
                placeholder='Search Event'
                onChange={() => {}}
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
