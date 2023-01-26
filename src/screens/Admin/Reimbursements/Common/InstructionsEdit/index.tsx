import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { DEFAULT_REIMBURSEMENT_INSTRUCTIONS } from '@mth/constants'
import { MthColor, ReimbursementFormType } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { updateSchoolYearMutation } from '@mth/screens/Admin/SiteManagement/services'
import { extractContent } from '@mth/utils'
import InstructionsEditModal from './InstructionsEditModal'

export type InstructionsEditProps = {
  formType: ReimbursementFormType | undefined
  isDirectOrder?: boolean
  selectedYear: SchoolYear | undefined
  editable: boolean
  refetch: () => void
}

export const InstructionsEdit: React.FC<InstructionsEditProps> = ({
  formType,
  isDirectOrder,
  selectedYear,
  editable,
  refetch,
}) => {
  const [expand, setExpand] = useState<boolean>(true)
  const [description, setDescription] = useState<string>('')
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [submitSave] = useMutation(updateSchoolYearMutation)

  const chevron = () =>
    !expand ? (
      <ExpandMoreIcon
        sx={{
          color: MthColor.MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
        onClick={() => setExpand(!expand)}
      />
    ) : (
      <ExpandLessIcon
        sx={{
          color: MthColor.MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
        onClick={() => setExpand(!expand)}
      />
    )

  const handleSave = async (value: string) => {
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
      const submitedResponse = await submitSave({
        variables: {
          updateSchoolYearInput: updateItem,
        },
      })

      if (submitedResponse) {
        setDescription(value)
        refetch()
      }
    }

    setShowEditModal(false)
  }

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
      <Box display='flex' flexDirection='row' justifyContent={'space-between'} alignItems={'center'}>
        <Box sx={{ display: 'flex', justifyContent: 'start' }}>
          <Subtitle
            fontWeight='700'
            color={MthColor.MTHBLUE}
            sx={{ cursor: 'pointer', fontSize: '20px' }}
            onClick={() => setExpand(!expand)}
          >
            Instructions
          </Subtitle>
          {editable && (
            <Tooltip title='Edit' placement='top'>
              <IconButton
                sx={{
                  position: 'relative',
                  marginTop: -0.7,
                  marginLeft: 3,
                  zIndex: 900,
                }}
                onClick={() => setShowEditModal(true)}
              >
                <ModeEditIcon sx={{ fontSize: '25px', fontWeight: 700, color: MthColor.GRAY }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {chevron()}
      </Box>
      {expand && (
        <Box sx={{ paddingTop: 3 }}>
          <Typography fontSize='14px' fontWeight={500} color={MthColor.SYSTEM_02} component='span'>
            {extractContent(description)}
          </Typography>
        </Box>
      )}
      {showEditModal && (
        <InstructionsEditModal
          description={description}
          handleClose={() => setShowEditModal(false)}
          handleSave={handleSave}
        />
      )}
    </>
  )
}
