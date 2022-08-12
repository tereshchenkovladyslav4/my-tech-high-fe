import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { getEmailTemplateQuery } from '@mth/graphql/queries/email-template'
import { getWithdrawalsCountByStatusQuery } from '@mth/graphql/queries/withdrawal'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { EmailTemplateResponseVM, WithdrawalCount } from './type'
import { WithdrawalPage } from './WithdrawalPage'

const Withdrawals: React.FC = () => {
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string | number>('1')
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplateResponseVM>()
  const [withdrawalCounts, setWithdrawalCounts] = useState<WithdrawalCount>({
    Notified: 0,
    Requested: 0,
    Withdrawn: 0,
  })
  const { data: withdrawalsCountData, refetch: refetchWithdrawalsCount } = useQuery(getWithdrawalsCountByStatusQuery, {
    variables: {
      filter: {
        region_id: me?.selectedRegionId,
        keyword: searchField,
        selectedYear: selectedYear,
      },
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const { data: emailTemplateData, refetch: refetchEmailTemplate } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Withdraw Page',
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])

  useEffect(() => {
    if (withdrawalsCountData && withdrawalsCountData.withdrawalCountsByStatus.error === false) {
      setWithdrawalCounts(withdrawalsCountData.withdrawalCountsByStatus.results)
    }
  }, [withdrawalsCountData])

  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} />
        <Grid item xs={12}>
          <WithdrawalPage
            searchField={searchField}
            selectedYear={selectedYear}
            withdrawalCounts={withdrawalCounts}
            emailTemplate={emailTemplate}
            setSearchField={setSearchField}
            setWithdrawalCounts={setWithdrawalCounts}
            setSelectedYear={setSelectedYear}
            refetchWithdrawalsCount={refetchWithdrawalsCount}
            refetchEmailTemplate={refetchEmailTemplate}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Withdrawals
