import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Layout } from '@mth/components/Layout'
import { defaultStatusFilter } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/defaultValues'
import { Filters } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/Filters'
import { ReimbursementRequestTable } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestTable'
import { FilterVM } from '@mth/screens/Admin/ResourceRequests/Filters/type'

export const ReimbursementRequests: React.FC = () => {
  const [schoolYearId, setSchoolYearId] = useState<number>(0)
  const [filter, setFilter] = useState<FilterVM | undefined>({
    statuses: defaultStatusFilter,
  })

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Filters schoolYearId={schoolYearId} setFilter={setFilter} />
      </Box>
      <ReimbursementRequestTable schoolYearId={schoolYearId} setSchoolYearId={setSchoolYearId} filter={filter} />
    </Layout>
  )
}
