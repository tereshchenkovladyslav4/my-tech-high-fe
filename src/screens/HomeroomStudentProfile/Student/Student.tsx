import React, { FunctionComponent } from 'react'
import { Grid } from '@mui/material'
import { ToDo } from '../../Dashboard/ToDoList/ToDo'
import { StudentProfile } from './StudentProfile/StudentProfile'
import { StudentSchedule } from './StudentSchedule/StudentSchedule'
import { StudentType } from './types'

type StudentProps = {
  student?: StudentType | undefined
}

export const Student: FunctionComponent<StudentProps> = () => {
  return (
    <Grid container padding={4} rowSpacing={4}>
      <Grid item xs={12} sm={9}>
        <StudentProfile />
      </Grid>
      <Grid item xs={12} sm={3}>
        <StudentSchedule />
      </Grid>
      <Grid item xs={12} sm={9}>
        <ToDo />
      </Grid>
    </Grid>
  )
}

export default Student
