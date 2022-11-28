import React from 'react'
import { Box } from '@mui/material'
import { PageBlock } from '@mth/components/PageBlock'
import PageHeader from '@mth/components/PageHeader'
import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { ReimbursementFormType } from '@mth/enums'

export type ReimbursementFormEditProps = {
  formType: ReimbursementFormType
  setFormType: (value: ReimbursementFormType | undefined) => void
}

export const ReimbursementFormEdit: React.FC<ReimbursementFormEditProps> = ({ formType, setFormType }) => {
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <PageHeader
          title={`${REIMBURSEMENT_FORM_TYPE_ITEMS.find((x) => x.value === formType)?.label} Form`}
          onBack={() => setFormType(undefined)}
        ></PageHeader>
      </Box>
      <PageBlock>
        <h1> Coming Soon </h1>
      </PageBlock>
    </>
  )
}
