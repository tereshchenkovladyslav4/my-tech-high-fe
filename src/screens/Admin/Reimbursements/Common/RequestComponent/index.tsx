import React, { ReactNode } from 'react'
import { Box } from '@mui/material'
import { PageBlock } from '@mth/components/PageBlock'
import PageHeader from '@mth/components/PageHeader'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { MthColor, ReimbursementFormType } from '@mth/enums'
import { InstructionsEdit } from '../InstructionsEdit'
import { requestComponentClasses } from '../styles'

export type RequestComponentProps = {
  formType: ReimbursementFormType
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  children?: ReactNode
}

export const RequestComponent: React.FC<RequestComponentProps> = ({
  formType,
  setFormType,
  isDirectOrder,
  selectedYearId,
  children,
}) => {
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <PageHeader
          title={`${REIMBURSEMENT_FORM_TYPE_ITEMS.find((x) => x.value === formType)?.label} ${
            isDirectOrder ? 'Direct Order' : ''
          } Form`}
          onBack={() => setFormType(undefined)}
        ></PageHeader>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <PageBlock>
          <InstructionsEdit formType={formType} isDirectOrder={isDirectOrder} selectedYearId={selectedYearId} />
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
