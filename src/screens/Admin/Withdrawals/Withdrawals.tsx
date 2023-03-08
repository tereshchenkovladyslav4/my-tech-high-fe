import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { EmailTemplateEnum } from '@mth/enums'
import { EmailTemplateResponseVM } from '@mth/graphql/models/email-template'
import { getWithdrawalsCountByStatusQuery } from '@mth/graphql/queries/withdrawal'
import { useEmailTemplateByNameAndSchoolYearId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { WithdrawalCount } from './type'
import { WithdrawalPage } from './WithdrawalPage'

const Withdrawals: React.FC = () => {
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplateResponseVM>()
  const [withdrawalCounts, setWithdrawalCounts] = useState<WithdrawalCount>({
    Notified: 0,
    Requested: 0,
    Withdrawn: 0,
  })
  const [emailMidTemplate, setEmailMidTemplate] = useState<boolean>(false)
  const { data: withdrawalsCountData, refetch: refetchWithdrawalsCount } = useQuery(getWithdrawalsCountByStatusQuery, {
    variables: {
      filter: {
        region_id: me?.selectedRegionId,
        keyword: searchField,
        selectedYear: selectedYear,
      },
    },
    skip: !me?.selectedRegionId || !selectedYear ? true : false,
    fetchPolicy: 'network-only',
  })

  const { emailTemplate: emailTemplateData, refetch: refetchEmailTemplate } = useEmailTemplateByNameAndSchoolYearId(
    EmailTemplateEnum.WITHDRAW_PAGE,
    selectedYear,
    emailMidTemplate,
  )

  useEffect(() => {
    if (emailTemplateData) {
      setEmailTemplate(emailTemplateData)
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
            setEmailMidTemplate={setEmailMidTemplate}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Withdrawals
