import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom'
import { Layout } from '@mth/components/Layout'
import { MthRoute } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { defaultStatusFilter } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/defaultValues'
import { Filters } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/Filters'
import { ReimbursementRequestTable } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestTable'
import { ReimbursementRequestView } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView'
import { FilterVM } from '@mth/screens/Admin/ResourceRequests/Filters/type'

export const ReimbursementRequests: React.FC = () => {
  const history = useHistory()
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const id = Number(queryParams.get('id') || undefined)
  const [schoolYearId, setSchoolYearId] = useState<number>(0)
  const [schoolYear, setSchoolYear] = useState<SchoolYear | undefined>()
  const [filter, setFilter] = useState<FilterVM | undefined>({
    statuses: defaultStatusFilter,
  })
  const [reimbursementRequestId, setReimbursementRequestId] = useState<number | undefined>(id)

  useEffect(() => {
    history.push(`${MthRoute.REIMBURSEMENTS_REQUESTS}${reimbursementRequestId ? '?id=' + reimbursementRequestId : ''}`)
  }, [reimbursementRequestId])

  return (
    <>
      <Box sx={{ overflow: 'hidden', maxHeight: reimbursementRequestId ? 0 : 'unset' }}>
        <Layout>
          <Box sx={{ mb: 4 }}>
            <Filters schoolYearId={schoolYearId} schoolYear={schoolYear} setFilter={setFilter} />
          </Box>
          <ReimbursementRequestTable
            schoolYearId={schoolYearId}
            setSchoolYearId={setSchoolYearId}
            setSchoolYear={setSchoolYear}
            filter={filter}
            setReimbursementRequestId={setReimbursementRequestId}
          />
        </Layout>
      </Box>
      {!!reimbursementRequestId && (
        <ReimbursementRequestView
          reimbursementRequestId={reimbursementRequestId}
          onBack={() => {
            setReimbursementRequestId(undefined)
            // Trigger refetch
            setFilter({ ...filter })
          }}
        />
      )}
    </>
  )
}
