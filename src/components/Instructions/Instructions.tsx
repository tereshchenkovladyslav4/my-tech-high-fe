import React, { useState } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { extractContent } from '@mth/utils/string.util'
import { PageBlock } from '../PageBlock'
import InstructionsEditModal from './InstructionsEditModal'

export type InstructionsProps = {
  description: string
  setDescription?: (value: string) => void
  isDefaultExpanded?: boolean
  isEditable?: boolean
  handleSaveAction?: (value: string) => void
}

export const Instructions: React.FC<InstructionsProps> = ({
  description,
  setDescription,
  isDefaultExpanded = true,
  isEditable = false,
  handleSaveAction,
}) => {
  const [expand, setExpand] = useState<boolean>(isDefaultExpanded)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

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

  return (
    <PageBlock>
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
          {isEditable && (
            <Tooltip title='Edit' placement='top'>
              <IconButton
                sx={{
                  position: 'relative',
                  marginTop: -0.7,
                  marginLeft: 3,
                  zIndex: 900,
                }}
                name='Edit'
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
        <Box sx={{ paddingTop: 3, textAlign: 'left' }}>
          <Typography fontSize='14px' fontWeight={500} color={MthColor.SYSTEM_02} component='span'>
            {extractContent(description)}
          </Typography>
        </Box>
      )}
      {showEditModal && (
        <InstructionsEditModal
          description={description}
          handleClose={() => setShowEditModal(false)}
          handleSave={(value) => {
            if (setDescription) setDescription(value)
            if (isEditable && handleSaveAction) handleSaveAction(value)
            setShowEditModal(false)
          }}
        />
      )}
    </PageBlock>
  )
}
