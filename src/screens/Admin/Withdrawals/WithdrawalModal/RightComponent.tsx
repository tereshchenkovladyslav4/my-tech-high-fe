import React, { FunctionComponent, useContext, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Button, Grid } from '@mui/material'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { BulletEditor } from '../../Calendar/components/BulletEditor'
import { individualWithdrawalMutation } from '../service'
import { EmailTemplateResponseVM } from '../type'
import { withdrawalModalClasses } from './styles'

type RightComponentProps = {
  withdrawalId: number
  emailTemplate: EmailTemplateResponseVM | undefined
  handleModem: () => void
}

export const RightComponent: FunctionComponent<RightComponentProps> = ({
  withdrawalId,
  emailTemplate,
  handleModem,
}) => {
  const { me } = useContext(UserContext)
  const [individualWithdrawal] = useMutation(individualWithdrawalMutation)
  const [description, setDescription] = useState<string>(emailTemplate?.body ? emailTemplate?.body : '')

  const handleIndividualWithdrawal = async (type = 0) => {
    // type  0 : Email Only, 1: Withdraw & Email
    await individualWithdrawal({
      variables: {
        individualWithdrawalInput: {
          withdrawal_id: Number(withdrawalId),
          region_id: Number(me?.selectedRegionId),
          type: type,
          body: description,
        },
      },
    })
    handleModem()
  }
  return (
    <Box>
      <Grid container columnSpacing={4} marginBottom={14} rowSpacing={3}>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <Button sx={withdrawalModalClasses.reimbursementBtn}>Reimbursements</Button>
          <Subtitle textAlign='center' fontWeight='700' sx={{ fontSize: '18px' }}>
            {'Total: $100.00'}
          </Subtitle>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <Button sx={withdrawalModalClasses.reimbursementBtn}>Homeroom Resources</Button>
          <Subtitle textAlign='center' fontWeight='700' sx={{ fontSize: '18px' }}>
            {'Total: $0.00'}
          </Subtitle>
        </Grid>
      </Grid>
      <Box sx={{ paddingX: '100px' }}>
        <BulletEditor
          value={description}
          setValue={(value) => {
            setDescription(value)
          }}
        />
      </Box>
      <Box sx={withdrawalModalClasses.btnGroup}>
        <Button sx={withdrawalModalClasses.cancelBtn} onClick={() => handleModem()}>
          Cancel
        </Button>
        <Button sx={withdrawalModalClasses.emailBtn} onClick={() => handleIndividualWithdrawal(0)}>
          {'Email Only'}
        </Button>
        <Button sx={withdrawalModalClasses.withdrawBtn} onClick={() => handleIndividualWithdrawal(1)}>
          {'Withdraw & Email'}
        </Button>
      </Box>
    </Box>
  )
}
