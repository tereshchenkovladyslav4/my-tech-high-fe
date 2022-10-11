import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, OutlinedInput, InputAdornment, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { courseCatalogHeaderClasses } from '../Components/CourseCatalogHeader/styles'

type FilterProps = {
  query: {
    keyword?: string
    archived?: boolean
  }
  setValue: (field: string, value: string | boolean) => void
}

const Periods: React.FC<FilterProps> = ({ query, setValue }) => {
  const setArchived = (vv: boolean) => {
    if (vv !== query.archived) {
      setValue('archived', vv)
    }
  }

  return (
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
      </Box>
      <ToggleButtonGroup
        color='primary'
        value={query.archived}
        exclusive
        onChange={(_event, newValue) => {
          if (newValue !== null) setArchived(!query.archived)
        }}
        sx={courseCatalogHeaderClasses.toggleButtonGroup}
      >
        <ToggleButton value={true}>Show Archived</ToggleButton>
        <ToggleButton value={false}>Hide Archived</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default Periods
