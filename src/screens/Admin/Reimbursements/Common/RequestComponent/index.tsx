import React, { ReactNode, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box } from '@mui/material'
import { Instructions } from '@mth/components/Instructions'
import { PageBlock } from '@mth/components/PageBlock'
import PageHeader from '@mth/components/PageHeader'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { DEFAULT_REIMBURSEMENT_INSTRUCTIONS, REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { MthColor, MthRoute, MthTitle, ReimbursementFormType } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { updateSchoolYearMutation } from '@mth/screens/Admin/SiteManagement/services'
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
  const [description, setDescription] = useState<string>('')

  const [submitInstructionsSave] = useMutation(updateSchoolYearMutation)

  const handleBackAction = () => {
    if (isParent && setPage) setPage(MthRoute.DASHBOARD)
    else setFormType(undefined)
  }

  const handleInstructionsSave = async (value: string) => {
    let updateItem
    if (selectedYear) {
      switch (formType) {
        case ReimbursementFormType.CUSTOM_BUILT:
          updateItem = isDirectOrder
            ? {
                school_year_id: +selectedYear.school_year_id,
                direct_orders_custom_built_instructions: value,
              }
            : {
                school_year_id: +selectedYear.school_year_id,
                reimbursements_custom_built_instructions: value,
              }
          break
        case ReimbursementFormType.TECHNOLOGY:
          updateItem = isDirectOrder
            ? {
                school_year_id: +selectedYear.school_year_id,
                direct_orders_technology_instructions: value,
              }
            : {
                school_year_id: +selectedYear.school_year_id,
                reimbursements_technology_instructions: value,
              }
          break
        case ReimbursementFormType.SUPPLEMENTAL:
          updateItem = isDirectOrder
            ? {
                school_year_id: +selectedYear.school_year_id,
                direct_orders_supplement_instructions: value,
              }
            : {
                school_year_id: +selectedYear.school_year_id,
                reimbursements_supplement_instructions: value,
              }
          break
        case ReimbursementFormType.THIRD_PARTY_PROVIDER:
          updateItem = {
            school_year_id: +selectedYear.school_year_id,
            reimbursements_third_party_instructions: value,
          }
          break
        case ReimbursementFormType.REQUIRED_SOFTWARE:
          updateItem = {
            school_year_id: +selectedYear.school_year_id,
            reimbursements_required_software_instructions: value,
          }
          break
      }
    }
    if (updateItem) {
      const submitedResponse = await submitInstructionsSave({
        variables: {
          updateSchoolYearInput: updateItem,
        },
      })

      if (submitedResponse) {
        setDescription(value)
        refetch()
      }
    }
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

  useEffect(() => {
    switch (formType) {
      case ReimbursementFormType.CUSTOM_BUILT:
        setDescription(
          (isDirectOrder
            ? selectedYear?.direct_orders_custom_built_instructions
            : selectedYear?.reimbursements_custom_built_instructions) || DEFAULT_REIMBURSEMENT_INSTRUCTIONS,
        )
        break
      case ReimbursementFormType.TECHNOLOGY:
        setDescription(
          (isDirectOrder
            ? selectedYear?.direct_orders_technology_instructions
            : selectedYear?.reimbursements_technology_instructions) || DEFAULT_REIMBURSEMENT_INSTRUCTIONS,
        )
        break
      case ReimbursementFormType.SUPPLEMENTAL:
        setDescription(
          (isDirectOrder
            ? selectedYear?.direct_orders_supplement_instructions
            : selectedYear?.reimbursements_supplement_instructions) || DEFAULT_REIMBURSEMENT_INSTRUCTIONS,
        )
        break
      case ReimbursementFormType.THIRD_PARTY_PROVIDER:
        setDescription(selectedYear?.reimbursements_third_party_instructions || DEFAULT_REIMBURSEMENT_INSTRUCTIONS)
        break
      case ReimbursementFormType.REQUIRED_SOFTWARE:
        setDescription(
          selectedYear?.reimbursements_required_software_instructions || DEFAULT_REIMBURSEMENT_INSTRUCTIONS,
        )
        break
      default:
        setDescription('')
        break
    }
  }, [formType, isDirectOrder, selectedYear])

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <PageHeader title={pageTitle} onBack={handleBackAction}></PageHeader>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Instructions
          description={description}
          setDescription={setDescription}
          isEditable={isParent ? false : true}
          handleSaveAction={handleInstructionsSave}
        />
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
