import React, { FunctionComponent } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Card } from '@mui/material'
import { BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'

export const EnrollmentPacketView: FunctionComponent = () => {
  return (
    <Card
      sx={{
        padding: 2,
        margin: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          sx={{
            background: BUTTON_LINEAR_GRADIENT,
            textTransform: 'none',
            color: 'white',
            marginRight: 2,
            width: '92px',
          }}
        >
          Save
        </Button>
        <CloseIcon />
      </Box>
    </Card>
  )
}
