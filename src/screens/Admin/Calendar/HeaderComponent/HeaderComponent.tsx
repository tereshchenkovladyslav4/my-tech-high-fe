import { Box, Button, InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CALENDAR } from '../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { useStyles } from '../MainComponent/styles'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import AddIcon from '@mui/icons-material/Add'
import { DropDown } from '../../../../components/DropDown/DropDown'
import SearchIcon from '@mui/icons-material/Search'

type HeaderComponentProps = {
  searchField: string | undefined
  setSearchField?: (value: string | undefined) => void
}

const HeaderComponent = ({ searchField }: HeaderComponentProps) => {
  const classes = useStyles
  const history = useHistory()
  return (
    <Box sx={classes.pageTop}>
      <Box sx={classes.pageTitle}>
        <Subtitle size='medium' fontWeight='700'>
          Calendar
        </Subtitle>
      </Box>
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
        <DropDown
          dropDownItems={[]}
          placeholder={'Select Filter'}
          defaultValue={null}
          size='small'
          sx={{ width: '200px' }}
          setParentValue={() => {}}
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
    </Box>
  )
}

export default HeaderComponent
