import React, { useEffect, useState } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ReimbursementFormType } from '@mth/enums'
import { extractContent } from '@mth/utils'

export type InstructionsEditProps = {
  formType: ReimbursementFormType
  isDirectOrder?: boolean
  selectedYearId: number | undefined
}

export const InstructionsEdit: React.FC<InstructionsEditProps> = ({ formType, isDirectOrder, selectedYearId }) => {
  const [expand, setExpand] = useState<boolean>(true)
  const [description, setDescription] = useState<string>('')

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

  useEffect(() => {
    setDescription(
      'Parents purchase approved educational resources for Custom-built courses and Technology Allowance, pay tuition for 3rd party Provider courses, and seek reimbursement for their purchases.',
    )
  }, [formType, isDirectOrder, selectedYearId])

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
          <Tooltip title='Edit' placement='top'>
            <IconButton
              sx={{
                position: 'relative',
                marginTop: -0.7,
                marginLeft: 3,
                zIndex: 900,
              }}
            >
              <ModeEditIcon sx={{ fontSize: '25px', fontWeight: 700, color: MthColor.GRAY }} />
            </IconButton>
          </Tooltip>
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
    </>
  )
}
