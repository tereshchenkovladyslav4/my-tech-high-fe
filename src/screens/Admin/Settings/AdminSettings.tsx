import { Grid } from '@mui/material'
import React from 'react'
import { ItemCard } from '../../../components/ItemCard/ItemCard'
import EnrollmentImg from '../../../assets/enrollment.png'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

const AdminSetting: React.FC = () => {
  const { path, isExact } = useRouteMatch('/settings')

  return (
    <>
      {isExact && (
        <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4 }}>

        </Grid>
      )}

    </>
  )
}

export { AdminSetting as default }
