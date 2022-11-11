import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Button, IconButton } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { mthButtonClasses } from '@mth/styles/button.style'
import { HeaderComponentProps } from '../types'
import { headerComponentClasses } from './styles'

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title, isSubmitted, handleBack, handleCancel }) => {
  return (
    <Box sx={headerComponentClasses.pageTop}>
      <Box sx={headerComponentClasses.pageTitle}>
        <IconButton
          onClick={() => handleBack()}
          sx={{
            position: 'relative',
          }}
        >
          <ArrowBackIosRoundedIcon sx={headerComponentClasses.arrowButton} />
        </IconButton>
        <Subtitle size='medium' sx={{ fontSize: '20px', marginLeft: '16px' }} fontWeight='700'>
          {title}
        </Subtitle>
      </Box>
      <Box sx={headerComponentClasses.pageTopRight}>
        <Button sx={mthButtonClasses.roundXsRed} onClick={() => handleCancel()}>
          Cancel
        </Button>
        <Button sx={{ ...mthButtonClasses.roundXsPrimary, ml: 4 }} type='submit' disabled={isSubmitted}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default HeaderComponent
