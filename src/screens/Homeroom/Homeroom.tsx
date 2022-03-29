import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { FunctionComponent, useContext } from 'react'
import { ToDo } from '../Dashboard/ToDoList/ToDo'
import { Students } from './Students/Students'

export const Homeroom: FunctionComponent = () => (
  <Grid container padding={4} rowSpacing={4}>
    <Grid item xs={12}>
      <Students />
    </Grid>
    <Grid item xs={12}>
      <ToDo />
    </Grid>
  </Grid>
)
