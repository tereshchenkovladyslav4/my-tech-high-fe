import { Grid } from '@mui/material'
import React from 'react'
import { ExistingParent } from './ExistingParent/ExistingParent'

export const Applications = () => (
  <Grid container padding={1} rowSpacing={4}>
    <Grid item xs={12}>
      <ExistingParent />
    </Grid>
  </Grid>
)
