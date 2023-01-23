import React, { ReactNode, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { PageBlock } from '@mth/components/PageBlock'
import PageHeader from '@mth/components/PageHeader'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { MthColor, MthRoute, MthTitle, ReimbursementFormType } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { InstructionsEdit } from '../InstructionsEdit'
import { requestComponentClasses } from '../styles'

export type RequestComponentProps = {
  formType: ReimbursementFormType | undefined
  isDirectOrder?: boolean
  selectedYear: SchoolYear | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  children?: ReactNode
  refetch: () => void
  isParent?: boolean
  setPage?: (value: MthRoute) => void
  disabledReimbursement?: boolean
  disabledDirectOrder?: boolean
}

export const RequestComponent: React.FC<RequestComponentProps> = ({
  formType,
  setFormType,
  isDirectOrder,
  selectedYear,
  children,
  refetch,
  isParent,
  setPage,
  disabledReimbursement,
  disabledDirectOrder,
}) => {
  const [pageTitle, setPageTitle] = useState<string>('')

  const handleBackAction = () => {
    if (isParent && setPage) setPage(MthRoute.DASHBOARD)
    else setFormType(undefined)
  }

  useEffect(() => {
    if (isParent) {
      setPageTitle(
        !disabledReimbursement && !disabledDirectOrder
          ? MthTitle.DIRECT_ORDERS_REIMBURSEMENTS
          : !disabledDirectOrder
          ? MthTitle.DIRECT_ORDERS
          : MthTitle.REIMBURSEMENTS,
      )
    } else {
      setPageTitle(
        `${REIMBURSEMENT_FORM_TYPE_ITEMS.find((x) => x.value === formType)?.label} ${
          isDirectOrder ? 'Direct Order' : ''
        } Form`,
      )
    }
  }, [formType, isParent, disabledReimbursement, disabledDirectOrder])

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <PageHeader title={pageTitle} onBack={handleBackAction}></PageHeader>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <PageBlock>
          <InstructionsEdit
            formType={formType}
            isDirectOrder={isDirectOrder}
            selectedYear={selectedYear}
            refetch={refetch}
            editable={isParent ? false : true}
          />
        </PageBlock>
      </Box>

      <PageBlock>
        <Box sx={requestComponentClasses.container}>
          <Subtitle fontWeight='700' color={MthColor.SYSTEM_01} sx={{ cursor: 'pointer', fontSize: '18px' }}>
            {`Request for ${isDirectOrder ? 'Direct Order' : 'Reimbursement'}`}
          </Subtitle>
          {children}
        </Box>
      </PageBlock>
    </>
  )
}
