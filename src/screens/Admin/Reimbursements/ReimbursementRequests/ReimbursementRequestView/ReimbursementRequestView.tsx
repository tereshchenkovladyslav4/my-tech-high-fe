import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box } from '@mui/material'
import { Prompt } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { Layout } from '@mth/components/Layout'
import { PageBlock } from '@mth/components/PageBlock'
import PageHeader from '@mth/components/PageHeader'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, MthTitle, ReimbursementFormType, ReimbursementRequestStatus } from '@mth/enums'
import { getReimbursementRequestQuery } from '@mth/graphql/queries/reimbursement-request'
import { ReimbursementRequest } from '@mth/models'
import { RequestForm } from '@mth/screens/Admin/Reimbursements/Common/RequestForm'
import { StudentInfo } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView/StudentInfo'
import { ReimbursementRequestViewProps } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView/type'

export const ReimbursementRequestView: React.FC<ReimbursementRequestViewProps> = ({
  reimbursementRequestId,
  onBack,
}) => {
  const [request, setRequest] = useState<ReimbursementRequest | undefined>()
  const [formType, setFormType] = useState<ReimbursementFormType | undefined>()
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false)
  const [requestStatus, setRequestStatus] = useState<ReimbursementRequestStatus | undefined>()

  const { loading, data, refetch } = useQuery(getReimbursementRequestQuery, {
    variables: {
      reimbursementRequestId: reimbursementRequestId,
    },
    skip: !reimbursementRequestId,
    fetchPolicy: 'network-only',
  })

  const handleOnBack = () => {
    if (!isChanged) {
      onBack()
    } else {
      setShowLeaveModal(true)
    }
  }

  useEffect(() => {
    if (!loading && data?.reimbursementRequest) {
      const { reimbursementRequest } = data
      setRequest(reimbursementRequest)
      setRequestStatus(reimbursementRequest?.status)
      setIsChanged(false)
    }
  }, [loading, data])

  return (
    <Layout>
      <PageHeader title='Requests' onBack={handleOnBack} />
      <Box sx={{ mt: 3, maxWidth: '764px' }}>
        {!!request && (
          <PageBlock>
            <StudentInfo
              request={request}
              requestStatus={requestStatus}
              handleChangeRequestStatus={(value) => setRequestStatus(value)}
              setIsChanged={setIsChanged}
            ></StudentInfo>

            <Box sx={{ mt: 2, px: 4, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <Subtitle
                testId='requestFormTitle'
                color={MthColor.SYSTEM_01}
                sx={{ textAlign: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}
              >
                {request.is_direct_order ? 'Direct Order Request' : 'Request for Reimbursement'}
              </Subtitle>
              <RequestForm
                isToBuildForm={false}
                selectedYearId={request.SchoolYearId}
                selectedYear={request.SchoolYear}
                formType={formType}
                isDirectOrder={request.is_direct_order}
                setFormType={setFormType}
                selectedReimbursementRequest={request}
                requestStatus={requestStatus}
                setIsChanged={setIsChanged}
                refetchReimbursementRequest={refetch}
                onBack={handleOnBack}
              />

              <Prompt
                when={isChanged}
                message={JSON.stringify({
                  header: MthTitle.UNSAVED_TITLE,
                  content: MthTitle.UNSAVED_DESCRIPTION,
                })}
              />
              {showLeaveModal && (
                <CustomModal
                  title={MthTitle.UNSAVED_TITLE}
                  description={MthTitle.UNSAVED_DESCRIPTION}
                  cancelStr='Cancel'
                  confirmStr='Yes'
                  backgroundColor={MthColor.WHITE}
                  onClose={() => {
                    setShowLeaveModal(false)
                  }}
                  onConfirm={() => {
                    setShowLeaveModal(false)
                    setIsChanged(false)
                    onBack()
                  }}
                />
              )}
            </Box>
          </PageBlock>
        )}
      </Box>
    </Layout>
  )
}
