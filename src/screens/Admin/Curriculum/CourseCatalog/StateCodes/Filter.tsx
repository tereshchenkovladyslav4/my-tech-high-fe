import React, { FunctionComponent } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, OutlinedInput, InputAdornment } from '@mui/material'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { useStyles } from '../../styles'

type FilterProps = {
  query: {
    keyword?: string
    limit: number
    page: number
  }
  total: number
  setValue: (field: string, value: string | boolean | number) => void
}

const Periods: FunctionComponent<FilterProps> = ({ query, setValue, total }) => {
  const classes = useStyles
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
        <Pagination
          defaultValue={query.limit}
          numPages={Math.ceil(total / query.limit) || 0}
          currentPage={query.page}
          setParentLimit={(value) => setValue('limit', value)}
          handlePageChange={(vv) => setValue('page', vv)}
        />
      </Box>
    </Box>
  )
}

export default Periods
