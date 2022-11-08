import React from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { EnrollmentPacketTable } from './EnrollmentPacketTable/EnrollmentPacketTable'

export const EnrollmentPackets: React.FC = () => {
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          {/* <EnrollmentPacketFilters filters={filters} setFilters={setFilters} /> */}
        </Grid>
        <Grid item xs={12}>
          <EnrollmentPacketTable />
        </Grid>
      </Grid>
    </Box>
  )
}
