import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box } from '@mui/material'
import { Layout } from '@mth/components/Layout'
import { PageBlock } from '@mth/components/PageBlock'
import { MthRoute, ReimbursementFormType } from '@mth/enums'
import { useReimbursementRequestSchoolYears } from '@mth/hooks'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { RequestComponent } from '../Admin/Reimbursements/Common/RequestComponent'
import { RequestForm } from '../Admin/Reimbursements/Common/RequestForm'
import { getSchoolYear } from '../Admin/Reimbursements/services'
import { ReimbursementSetting } from '../Admin/Reimbursements/Settings/types'
import { ButtonGroup } from './ButtonGroup'
import { ReimbursementInformation } from './Information'
import { ReimbursementRequestsTable } from './ReimbursementRequestsTable'

const Reimbursements: React.FC = () => {
  const { me } = useContext(UserContext)
  const [reimbursementSetting, setReimbursementSetting] = useState<ReimbursementSetting>()
  const [schoolYear, setSchoolYear] = useState<SchoolYear | undefined>(undefined)
  const [formType, setFormType] = useState<ReimbursementFormType | undefined>()
  const [page, setPage] = useState<MthRoute>(MthRoute.DASHBOARD)
  const [disabledReimbursement, setDisabledReimbursement] = useState<boolean>(true)
  const [disabledDirectOrder, setDisabledDirectOrder] = useState<boolean>(true)

  const { reimbursementSchoolYears, selectedYearId, setSelectedYearId } = useReimbursementRequestSchoolYears(
    +(me?.userRegion?.at(0)?.region_id || 0),
  )

  const { data: schoolYearData, refetch } = useQuery(getSchoolYear, {
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

  useEffect(() => {
    if (schoolYear) {
      const { direct_order_close, direct_order_open, reimbursement_open, reimbursement_close } = schoolYear
      if (direct_order_open && direct_order_close) {
        if (new Date(direct_order_open) <= new Date() && new Date(direct_order_close) >= new Date()) {
          setDisabledDirectOrder(false)
        }
      } else {
        setDisabledDirectOrder(true)
      }

      if (reimbursement_open && reimbursement_close) {
        if (new Date(reimbursement_open) <= new Date() && new Date(reimbursement_close) >= new Date()) {
          setDisabledReimbursement(false)
        }
      } else {
        setDisabledReimbursement(true)
      }
    }
  }, [schoolYear])

  return (
    <Layout>
      {page === MthRoute.DASHBOARD ? (
        <>
          <PageBlock>
            <ReimbursementInformation information={reimbursementSetting?.information || ''} />
          </PageBlock>
          <Box sx={{ marginTop: 2 }}>
            <PageBlock>
              <ButtonGroup
                disabledReimbursement={disabledReimbursement}
                disabledDirectOrder={disabledDirectOrder}
                setPage={setPage}
              />
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
        </>
      ) : (
        <RequestComponent
          selectedYear={schoolYear}
          formType={formType}
          isDirectOrder={page === MthRoute.REIMBURSEMENTS_REIMBURSEMENT_FORM ? false : true}
          setFormType={setFormType}
          refetch={refetch}
          isParent={true}
          setPage={setPage}
          disabledReimbursement={disabledReimbursement}
          disabledDirectOrder={disabledDirectOrder}
        >
          <RequestForm
            selectedYearId={selectedYearId}
            selectedYear={schoolYear}
            formType={formType}
            isDirectOrder={page === MthRoute.REIMBURSEMENTS_REIMBURSEMENT_FORM ? false : true}
            setFormType={setFormType}
            setIsChanged={() => {}}
          />
        </RequestComponent>
      )}
    </Layout>
  )
}

export default Reimbursements
