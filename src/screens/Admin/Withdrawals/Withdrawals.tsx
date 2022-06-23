import React from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { WithdrawalPage } from './WithdrawalPage'

const Withdrawals = () => {
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} />
        <Grid item xs={12}>
          <WithdrawalPage />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Withdrawals
