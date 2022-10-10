import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, OutlinedInput, InputAdornment, Button } from '@mui/material'
import { useStyles } from '../../styles'

type FilterProps = {
  query: {
    keyword?: string
    archived?: boolean
  }
  setValue: (field: string, value: string | boolean) => void
}

const Periods: React.FC<FilterProps> = ({ query, setValue }) => {
  const classes = useStyles

  const setArchived = (vv: boolean) => {
    if (vv !== query.archived) {
      setValue('archived', vv)
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          sx={classes.filterButton}
          color={query.archived ? 'primary' : 'warning'}
          variant='contained'
          onClick={() => setArchived(true)}
        >
          Show Archived
        </Button>
        <Button
          sx={classes.filterButton}
          color={query.archived ? 'warning' : 'primary'}
          variant='contained'
          onClick={() => setArchived(false)}
        >
          Hide Archived
        </Button>
      </Box>
    </Box>
  )
}

export default Periods
