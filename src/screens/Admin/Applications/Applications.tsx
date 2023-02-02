import React, { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { ApplicationTable } from './ApplicationTable/ApplicationTable'
import { Filters } from './Filters/Filters'
import { FilterVM } from './type'

export const Applications: React.FC = () => {
  const [filter, setFilter] = useState<FilterVM>()
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Filters filter={filter} setFilter={setFilter} />
        </Grid>
        <Grid item xs={12}>
          <ApplicationTable filter={filter} />
        </Grid>
      </Grid>
    </Box>
  )
}
