import React, { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { FilterComponent } from './FilterComponent'
import { StudentFilesFolder } from './StudentFilesFolder'
import { FilterVM } from './types'

const Records: React.FC = () => {
  const [filter, setFilter] = useState<FilterVM>()
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <FilterComponent setFilter={setFilter} />
        </Grid>
        <Grid item xs={12}>
          <StudentFilesFolder filter={filter} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Records
