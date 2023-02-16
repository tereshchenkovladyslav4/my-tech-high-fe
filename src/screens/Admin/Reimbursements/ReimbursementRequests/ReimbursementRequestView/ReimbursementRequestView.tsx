import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Box } from '@mui/material'
import { Layout } from '@mth/components/Layout'
import { PageBlock } from '@mth/components/PageBlock'
import PageHeader from '@mth/components/PageHeader'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, MthRoute, ReimbursementFormType } from '@mth/enums'
import { getReimbursementRequestQuery } from '@mth/graphql/queries/reimbursement-request'
import { ReimbursementRequest } from '@mth/models'
import { RequestForm } from '@mth/screens/Admin/Reimbursements/Common/RequestForm'
import { StudentInfo } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView/StudentInfo'
import { ReimbursementRequestViewProps } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView/type'

export const ReimbursementRequestView: React.FC<ReimbursementRequestViewProps> = ({ reimbursementRequestId }) => {
  const [request, setRequest] = useState<ReimbursementRequest | undefined>()
  const [formType, setFormType] = useState<ReimbursementFormType | undefined>()

  const [getReimbursementRequest, { loading, data }] = useLazyQuery(getReimbursementRequestQuery, {
    variables: {
      reimbursementRequestId: reimbursementRequestId,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.reimbursementRequest) {
      const { reimbursementRequest } = data
      setRequest(reimbursementRequest)
    }
  }, [loading, data])

  useEffect(() => {
    if (reimbursementRequestId) getReimbursementRequest()
  }, [reimbursementRequestId])

  return (
    <Layout>
      <PageHeader title='Requests' to={MthRoute.REIMBURSEMENTS_REQUESTS} />
      <Box sx={{ mt: 3, maxWidth: '764px' }}>
        {!!request && (
          <PageBlock>
            <StudentInfo request={request}></StudentInfo>

            <Box sx={{ mt: 2, px: 4, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <Subtitle
                testId='requestFormTitle'
                color={MthColor.SYSTEM_01}
                sx={{ textAlign: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}
              >
                {`Request for ${request.is_direct_order ? 'Direct Order' : 'Reimbursement'}`}
              </Subtitle>
              <RequestForm
                isToBuildForm={false}
                selectedYearId={request.SchoolYearId}
                selectedYear={request.SchoolYear}
                formType={formType}
                isDirectOrder={request.is_direct_order}
                setFormType={setFormType}
                selectedReimbursementRequest={request}
                setIsChanged={() => {}}
              />
            </Box>
          </PageBlock>
        )}
      </Box>
    </Layout>
  )
}
