import React, { useEffect, useState } from 'react'
import { Button, Grid } from '@mui/material'
import { SchoolYear } from '@mth/models'
import { buttonGroupClasses } from './styles'

type ButtonGroupProps = {
  schoolYear: SchoolYear | undefined
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ schoolYear }) => {
  const [disabledReimbursement, setDisabledReimbursement] = useState<boolean>(true)
  const [disabledDirectOrder, setDisabledDirectOrder] = useState<boolean>(true)

  useEffect(() => {
    if (schoolYear) {
      if (
        (new Date(schoolYear.direct_order_open) <= new Date() &&
          new Date(schoolYear.direct_order_close) >= new Date()) ||
        (new Date(schoolYear.mid_direct_order_open) <= new Date() &&
          new Date(schoolYear.mid_direct_order_close) >= new Date())
      ) {
        setDisabledDirectOrder(false)
      }

      if (
        (new Date(schoolYear.reimbursement_open) <= new Date() &&
          new Date(schoolYear.reimbursement_close) >= new Date()) ||
        (new Date(schoolYear.mid_reimbursement_open) <= new Date() &&
          new Date(schoolYear.mid_reimbursement_close) >= new Date())
      ) {
        setDisabledReimbursement(false)
      }
    }
  }, [schoolYear])

  return (
    <Grid container>
      <Grid item xs={6} sx={{ paddingX: 2 }}>
        <Button sx={buttonGroupClasses.button} disabled={disabledReimbursement}>
          Request for Reimbursement
        </Button>
      </Grid>
      <Grid item xs={6} sx={{ paddingX: 2 }}>
        <Button sx={buttonGroupClasses.button} disabled={disabledDirectOrder}>
          Direct Order Request
        </Button>
      </Grid>
    </Grid>
  )
}

export default ButtonGroup
