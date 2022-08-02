import React, { FunctionComponent } from 'react'
import { Grid } from '@mui/material'
import { ExistingParent } from './ExistingParent/ExistingParent'

export const Applications: FunctionComponent = () => (
  <Grid container padding={1} rowSpacing={4}>
    <Grid item xs={12}>
      <ExistingParent />
    </Grid>
  </Grid>
)
