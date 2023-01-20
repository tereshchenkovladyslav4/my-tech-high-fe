import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box } from '@mui/material'
import { Layout } from '@mth/components/Layout'
import { PageBlock } from '@mth/components/PageBlock'
import { useReimbursementRequestSchoolYears } from '@mth/hooks'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYear } from '../Admin/Reimbursements/services'
import { ReimbursementSetting } from '../Admin/Reimbursements/Settings/types'
import { ButtonGroup } from './ButtonGroup'
import { ReimbursementInformation } from './Information'
import { ReimbursementRequestsTable } from './ReimbursementRequestsTable'

const Reimbursements: React.FC = () => {
  const { me } = useContext(UserContext)
  const [reimbursementSetting, setReimbursementSetting] = useState<ReimbursementSetting>()
  const [schoolYear, setSchoolYear] = useState<SchoolYear | undefined>(undefined)

  const { reimbursementSchoolYears, selectedYearId, setSelectedYearId } = useReimbursementRequestSchoolYears(
    +(me?.userRegion?.at(0)?.region_id || 0),
  )

  const { data: schoolYearData } = useQuery(getSchoolYear, {
    variables: {
      school_year_id: selectedYearId,
    },
    skip: !selectedYearId,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (selectedYearId && schoolYearData) {
      setReimbursementSetting(schoolYearData.getSchoolYear?.ReimbursementSetting)
      setSchoolYear(schoolYearData.getSchoolYear)
    }
  }, [selectedYearId, schoolYearData])

  return (
    <Layout>
      <PageBlock>
        <ReimbursementInformation information={reimbursementSetting?.information || ''} />
      </PageBlock>
      <Box sx={{ marginTop: 2 }}>
        <PageBlock>
          <ButtonGroup schoolYear={schoolYear} />
        </PageBlock>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <PageBlock>
          <ReimbursementRequestsTable
            reimbursementSchoolYears={reimbursementSchoolYears}
            selectedYearId={selectedYearId}
            setSelectedYearId={setSelectedYearId}
          />
        </PageBlock>
      </Box>
    </Layout>
  )
}

export default Reimbursements
