import React from 'react'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { MthColor } from '@mth/enums'
import { TestingPreferenceInformationProps } from './types'

const TestingPreferenceInformation: React.FC<TestingPreferenceInformationProps> = ({ title, description }) => {
  return (
    <Box>
      <Typography fontSize='16px' fontWeight={500} component='span'>
        {title}
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
          {description}
        </Typography>
        <Tooltip title='Edit' placement='top'>
          <IconButton
            sx={{
              position: 'relative',
              bottom: '2px',
              width: '50px',
              height: '50px',
              marginY: 'auto',
            }}
          >
            <ModeEditIcon sx={{ fontSize: '25px', fontWeight: 700, color: MthColor.MTHBLUE }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default TestingPreferenceInformation
