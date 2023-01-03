import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Layout } from '@mth/components/Layout'
import { SchoolYear } from '@mth/models'
import { Filters } from '@mth/screens/Admin/ResourceRequests/Filters'
import { FilterVM } from '@mth/screens/Admin/ResourceRequests/Filters/type'
import { ResourceRequestsTable } from '@mth/screens/Admin/ResourceRequests/ResourceRequestsTable'

export const ResourceRequests: React.FC = () => {
  const [schoolYearId, setSchoolYearId] = useState<number>(0)
  const [schoolYear, setSchoolYear] = useState<SchoolYear | undefined>()
  const [filter, setFilter] = useState<FilterVM | undefined>()

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Filters schoolYearId={schoolYearId} schoolYear={schoolYear} setFilter={setFilter} />
      </Box>
      <ResourceRequestsTable
        schoolYearId={schoolYearId}
        setSchoolYearId={setSchoolYearId}
        schoolYear={schoolYear}
        setSchoolYear={setSchoolYear}
        filter={filter}
      />
    </Layout>
  )
}
