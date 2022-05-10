import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { WithdrawTable } from './WithdrawTable'

const Withdraws = () => {
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} />
        <Grid item xs={12}>
          <WithdrawTable />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Withdraws
