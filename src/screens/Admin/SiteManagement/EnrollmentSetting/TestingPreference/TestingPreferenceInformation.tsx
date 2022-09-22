import React, { useState } from 'react'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { MthColor } from '@mth/enums'
import { extractContent } from '@mth/utils'
import CustomizableDetailModal from './CustomizableDetailModal'
import { TestingPreferenceInformationProps } from './types'

const TestingPreferenceInformation: React.FC<TestingPreferenceInformationProps> = ({
  information,
  editable,
  refetch,
}) => {
  const [showCustomizableModal, setShowCustomizableModal] = useState<boolean>(false)
  return (
    <Box>
      <Typography fontSize='16px' fontWeight={500} component='span'>
        {information.title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 10,
          marginTop: 3,
        }}
      >
        <Typography fontSize='12px' fontWeight={500} component='span'>
          {extractContent(information.description)}
        </Typography>
        {editable && (
          <Tooltip title='Edit' placement='top'>
            <IconButton
              sx={{
                position: 'relative',
                bottom: '2px',
                width: '50px',
                height: '50px',
                marginY: 'auto',
              }}
              onClick={() => setShowCustomizableModal(true)}
            >
              <ModeEditIcon sx={{ fontSize: '25px', fontWeight: 700, color: MthColor.MTHBLUE }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {showCustomizableModal && (
        <CustomizableDetailModal
          information={information}
          handleClose={() => setShowCustomizableModal(false)}
          refetch={refetch}
        />
      )}
    </Box>
  )
}

export default TestingPreferenceInformation
