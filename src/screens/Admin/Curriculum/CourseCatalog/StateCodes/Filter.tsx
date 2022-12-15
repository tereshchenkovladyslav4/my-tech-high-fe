import React, { FunctionComponent } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, OutlinedInput, InputAdornment } from '@mui/material'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { useStyles } from '../../styles'

type FilterProps = {
  setSearchField: (value: string) => void
  limit: number
  curPage: number
  onChangePageLimit: (value: number) => void
  total: number
  onPageChange: (value: number) => void
}

const Periods: FunctionComponent<FilterProps> = ({
  setSearchField,
  total,
  curPage,
  limit,
  onChangePageLimit,
  onPageChange,
}) => {
  const classes = useStyles
  return (
    <Box sx={classes.filter}>
      <OutlinedInput
        size='small'
        fullWidth
        placeholder='Search...'
        onChange={(e) => setSearchField(e.target.value)}
        startAdornment={
          <InputAdornment position='start'>
            <SearchIcon style={{ color: 'black' }} />
          </InputAdornment>
        }
        sx={{ maxWidth: '280px' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <Pagination
          defaultValue={limit}
          numPages={Math.ceil(total / limit) || 0}
          currentPage={curPage}
          setParentLimit={(value) => onChangePageLimit(value)}
          handlePageChange={(vv) => onPageChange(vv)}
        />
      </Box>
    </Box>
  )
}

export default Periods
