import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Button, IconButton } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { HeaderComponentProps } from '../types'
import { headerComponentClassess } from './styles'

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title, isSubmitted, handleBack, handleCancel }) => {
  return (
    <Box sx={headerComponentClassess.pageTop}>
      <Box sx={headerComponentClassess.pageTitle}>
        <IconButton
          onClick={() => handleBack()}
          sx={{
            position: 'relative',
          }}
        >
          <ArrowBackIosRoundedIcon sx={headerComponentClassess.arrowButton} />
        </IconButton>
        <Subtitle size='medium' sx={{ fontSize: '20px', marginLeft: '16px' }} fontWeight='700'>
          {title}
        </Subtitle>
      </Box>
      <Box sx={headerComponentClassess.pageTopRight}>
        <Button sx={headerComponentClassess.cancelBtn} onClick={() => handleCancel()}>
          Cancel
        </Button>
        <Button sx={headerComponentClassess.saveBtn} type='submit' disabled={isSubmitted}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default HeaderComponent
