import React from 'react'
import { Button, Grid } from '@mui/material'
import { MthRoute } from '@mth/enums'
import { buttonGroupClasses } from './styles'

type ButtonGroupProps = {
  disabledReimbursement: boolean
  disabledDirectOrder: boolean
  setPage: (value: MthRoute) => void
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ disabledReimbursement, disabledDirectOrder, setPage }) => {
  return (
    <Grid container>
      <Grid item xs={6} sx={{ paddingX: 2 }}>
        <Button
          sx={buttonGroupClasses.button}
          disabled={disabledReimbursement}
          onClick={() => setPage(MthRoute.REIMBURSEMENTS_REIMBURSEMENT_FORM)}
        >
          Request for Reimbursement
        </Button>
      </Grid>
      <Grid item xs={6} sx={{ paddingX: 2 }}>
        <Button
          sx={buttonGroupClasses.button}
          disabled={disabledDirectOrder}
          onClick={() => setPage(MthRoute.REIMBURSEMENTS_DIRECT_ORDER_FORM)}
        >
          Direct Order Request
        </Button>
      </Grid>
    </Grid>
  )
}

export default ButtonGroup
