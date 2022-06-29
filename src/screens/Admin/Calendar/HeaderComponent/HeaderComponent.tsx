import { Box, Button, Grid, InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CALENDAR } from '../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { useStyles } from '../MainComponent/styles'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { MultiSelectDropDown } from '../components/MultiSelectDropDown'
import { MultiSelectDropDownListType } from '../components/MultiSelectDropDown/MultiSelectDropDown'

type HeaderComponentProps = {
  searchField: string | undefined
  eventTypeLists: MultiSelectDropDownListType[]
  selectedEventTypes: string[]
  setSelectedEventTypes: (value: string[]) => void
  setSearchField?: (value: string | undefined) => void
}

const HeaderComponent = ({
  searchField,
  eventTypeLists,
  selectedEventTypes,
  setSelectedEventTypes,
}: HeaderComponentProps) => {
  const classes = useStyles
  const history = useHistory()
  return (
    <Box sx={classes.pageTop}>
      <Grid container justifyContent='space-between'>
        <Grid item xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
          <Box sx={classes.pageTitle}>
            <Subtitle size='medium' fontWeight='700'>
              Calendar
            </Subtitle>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={8}>
          <Box sx={classes.pageTopRight}>
            <Button
              disableElevation
              variant='contained'
              sx={classes.editButton}
              startIcon={<ModeEditIcon />}
              onClick={() => history.push(`${CALENDAR}/editType`)}
            >
              <Subtitle sx={{ whiteSpace: 'nowrap' }}>Edit Type</Subtitle>
            </Button>
            <Button
              disableElevation
              variant='contained'
              sx={classes.addButton}
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
            <Box marginLeft={4} sx={classes.search}>
              <OutlinedInput
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'Search Event')}
                size='small'
                fullWidth
                value={searchField ? searchField : ''}
                placeholder='Search Event'
                onChange={(e) => {}}
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
