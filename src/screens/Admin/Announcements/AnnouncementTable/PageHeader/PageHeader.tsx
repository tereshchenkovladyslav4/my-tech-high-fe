import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, InputAdornment, OutlinedInput } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { MthTitle } from '@mth/enums'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { ANNOUNCEMENTS } from '../../../../../utils/constants'
import { useStyles } from '../styles'

type PageHeaderProps = {
  totalAnnouncements: number
  showArchivedAnnouncement: boolean
  setShowArchivedAnnouncement: (value: boolean) => void
  searchField: string
  setSearchField: (value: string) => void
}

const PageHeader: React.FC<PageHeaderProps> = ({
  totalAnnouncements,
  showArchivedAnnouncement,
  searchField,
  setSearchField,
  setShowArchivedAnnouncement,
}) => {
  const classes = useStyles
  const history = useHistory()

  return (
    <>
      <Box sx={classes.pageTop}>
        <Box sx={classes.pageTitle}>
          <Subtitle size='medium' fontWeight='700'>
            Announcements
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
            {totalAnnouncements}
          </Subtitle>
        </Box>
        <Box sx={classes.pageTopRight}>
          <Button
            disableElevation
            variant='contained'
            sx={classes.addButton}
            startIcon={<AddIcon />}
            onClick={() => {
              history.push(`${ANNOUNCEMENTS}/new`)
            }}
          >
            <Subtitle sx={{ whiteSpace: 'nowrap' }}>{MthTitle.ADD_ANNOUNCEMENT}</Subtitle>
          </Button>
          <Box marginLeft={4} sx={classes.search}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search title, message, or student')}
              size='small'
              fullWidth
              value={searchField}
              placeholder='Search title, message, or student'
              onChange={() => setSearchField}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Box>
      <Box sx={classes.buttonGroup}>
        <Button
          variant='contained'
          disableElevation
          sx={showArchivedAnnouncement ? classes.activeButton : classes.inactiveButton}
          onClick={() => setShowArchivedAnnouncement(true)}
        >
          {MthTitle.SHOW_ARCHIVED}
        </Button>
        <Button
          variant='contained'
          disableElevation
          sx={showArchivedAnnouncement ? classes.inactiveButton : classes.activeButton}
          onClick={() => setShowArchivedAnnouncement(false)}
        >
          {MthTitle.HIDE_ARCHIVED}
        </Button>
      </Box>
    </>
  )
}

export default PageHeader
