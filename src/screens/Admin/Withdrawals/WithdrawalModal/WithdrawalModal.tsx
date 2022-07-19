import React, { useEffect, useState } from 'react'
import { Box, Grid, Modal } from '@mui/material'
import { useQuery } from '@apollo/client'
import { EmailTemplateResponseVM, StudentInfo, WithdrawalResponseVM } from '../type'
import { withdrawalModalClasses } from './styles'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import LeftComponent from './LeftComponent'
import RightComponent from './RightComponent'
import { getStudentInfoByWithdrawalId } from '../service'

type WithdrawalModalProps = {
  withdrawal: WithdrawalResponseVM
  emailTemplate: EmailTemplateResponseVM | undefined
  handleModem: () => void
}
export default function WithdrawalModal({ handleModem, emailTemplate, withdrawal }: WithdrawalModalProps) {
  const { withdrawal_id } = withdrawal
  const [studentInfo, setStudentInfo] = useState<StudentInfo>()
  const { loading, data } = useQuery(getStudentInfoByWithdrawalId, {
    variables: {
      withdrawId: Number(withdrawal_id),
    },
    skip: withdrawal_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.getStudentInfoByWithdrawalId) {
      setStudentInfo({
        withdrawalId: data?.getStudentInfoByWithdrawalId?.withdrawal_id,
        studentId: data?.getStudentInfoByWithdrawalId?.student_id,
        parentId: data?.getStudentInfoByWithdrawalId?.parent_id,
        firstName: data?.getStudentInfoByWithdrawalId?.first_name,
        lastName: data?.getStudentInfoByWithdrawalId?.last_name,
        grade: data?.getStudentInfoByWithdrawalId?.grade,
        schoolOfEnrollment: 'SoE',
      })
    }
  }, [data])
  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={withdrawalModalClasses.modalCard}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Subtitle size='medium' fontWeight='700' sx={{ fontSize: '24px' }}>
            Withdrawal
          </Subtitle>
        </Box>
        <Box sx={withdrawalModalClasses.content}>
          <Grid container sx={{ padding: '10px 0px' }}>
            <Grid item md={5} sm={5} xs={12}>
              <LeftComponent studentInfo={studentInfo} />
            </Grid>
            <Grid item md={7} sm={7} xs={12}>
              <RightComponent
                withdrawalId={withdrawal?.withdrawal_id}
                emailTemplate={emailTemplate}
                handleModem={handleModem}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  )
}
