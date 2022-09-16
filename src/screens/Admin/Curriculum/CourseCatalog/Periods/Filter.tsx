import React, { FunctionComponent } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, OutlinedInput, InputAdornment, Button } from '@mui/material'
import { useStyles } from '../../styles'

type FilterProps = {
  query: {
    keyword?: string
    hideArchived?: boolean
  }
  setValue: (field: string, value: string | boolean) => void
}

const Periods: FunctionComponent<FilterProps> = ({ query, setValue }) => {
  const classes = useStyles

  const setHideArchived = (vv: boolean) => {
    if (vv !== query.hideArchived) {
      setValue('hideArchived', vv)
    }
  }

  return (
    <Box sx={classes.filter}>
      <OutlinedInput
        size='small'
        fullWidth
        value={query.keyword}
        placeholder='Search...'
        onChange={(e) => setValue('keyword', e.target.value)}
        startAdornment={
          <InputAdornment position='start'>
            <SearchIcon style={{ color: 'black' }} />
          </InputAdornment>
        }
        sx={{ maxWidth: '280px' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <Button
          sx={classes.filterButton}
          color={query.hideArchived ? 'secondary' : 'primary'}
          variant='contained'
          onClick={() => setHideArchived(false)}
        >
          Show Archived
        </Button>
        <Button
          sx={classes.filterButton}
          color={query.hideArchived ? 'primary' : 'secondary'}
          variant='contained'
          onClick={() => setHideArchived(true)}
        >
          Hide Archived
        </Button>
      </Box>
    </Box>
  )
}

export default Periods
