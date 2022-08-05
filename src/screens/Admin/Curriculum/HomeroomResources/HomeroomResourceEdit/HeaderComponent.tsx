import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Button, IconButton } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { HeaderComponentProps } from '../types'
import { editHomeroomResourceClassess } from './styles'

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title, isSubmitted, handleBack, setShowCancelModal }) => {
  return (
    <Box sx={editHomeroomResourceClassess.pageTop}>
      <Box sx={editHomeroomResourceClassess.pageTitle}>
        <IconButton
          onClick={() => handleBack()}
          sx={{
            position: 'relative',
          }}
        >
          <ArrowBackIosRoundedIcon sx={editHomeroomResourceClassess.arrowButton} />
        </IconButton>
        <Subtitle size='medium' sx={{ fontSize: '20px', marginLeft: '16px' }} fontWeight='700'>
          {title}
        </Subtitle>
      </Box>
      <Box sx={editHomeroomResourceClassess.pageTopRight}>
        <Button sx={editHomeroomResourceClassess.cancelBtn} onClick={() => setShowCancelModal(true)}>
          Cancel
        </Button>
        <Button sx={editHomeroomResourceClassess.saveBtn} type='submit' disabled={isSubmitted}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default HeaderComponent
