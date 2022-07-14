import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { EmailRecordsTable } from './EmailRecordsTable/EmailRecordsTable'

export const EmailRecords = () => {
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          {/* <EnrollmentPacketFilters filters={filters} setFilters={setFilters} /> */}
        </Grid>
        <Grid item xs={12}>
          <EmailRecordsTable />
        </Grid>
      </Grid>
    </Box>
  )
}
