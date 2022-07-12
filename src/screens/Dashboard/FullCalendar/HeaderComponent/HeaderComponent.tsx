import { Box, Button, Grid, InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SearchIcon from '@mui/icons-material/Search'
import { useStyles } from './styles'
import MultiSelectDropDown, {
  MultiSelectDropDownListType,
} from '../../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'

type HeaderComponentProps = {
  searchField: string | undefined
  eventTypeLists: MultiSelectDropDownListType[]
  selectedEventTypes: string[]
  setSelectedEventTypes: (value: string[]) => void
  setSearchField?: (value: string | undefined) => void
  setSectionName: (value: string) => void
}

const HeaderComponent = ({
  searchField,
  eventTypeLists,
  selectedEventTypes,
  setSelectedEventTypes,
  setSectionName,
}: HeaderComponentProps) => {
  const classes = useStyles
  return (
    <Box sx={classes.pageTop}>
      <Grid container justifyContent='space-between'>
        <Grid item xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
          <Box sx={classes.pageTitle}>
            <Button onClick={() => setSectionName('root')}>
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
          <Box sx={classes.pageTopRight}>
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
