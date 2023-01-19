import React, { ReactNode } from 'react'
import { Box } from '@mui/material'
import { PageBlock } from '@mth/components/PageBlock'
import PageHeader from '@mth/components/PageHeader'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { MthColor, ReimbursementFormType } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { InstructionsEdit } from '../InstructionsEdit'
import { requestComponentClasses } from '../styles'

export type RequestComponentProps = {
  formType: ReimbursementFormType
  isDirectOrder?: boolean
  selectedYear: SchoolYear | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  children?: ReactNode
  refetch: () => void
}

export const RequestComponent: React.FC<RequestComponentProps> = ({
  formType,
  setFormType,
  isDirectOrder,
  selectedYear,
  children,
  refetch,
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
          <InstructionsEdit
            formType={formType}
            isDirectOrder={isDirectOrder}
            selectedYear={selectedYear}
            refetch={refetch}
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
