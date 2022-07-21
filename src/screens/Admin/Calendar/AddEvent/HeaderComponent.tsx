import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Button, IconButton } from '@mui/material'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { addEventClassess } from './styles'
import { HeaderComponentProps } from '../types'

const HeaderComponent = ({ title, handleCancelClick, setShowCancelModal }: HeaderComponentProps) => {
  return (
    <Box sx={addEventClassess.pageTop}>
      <Box sx={addEventClassess.pageTitle}>
        <IconButton
          onClick={() => handleCancelClick()}
          sx={{
            position: 'relative',
          }}
        >
          <ArrowBackIosRoundedIcon sx={addEventClassess.arrowButton} />
        </IconButton>
        <Subtitle size='medium' sx={{ fontSize: '20px' }} fontWeight='700'>
          {title}
        </Subtitle>
      </Box>
      <Box sx={addEventClassess.pageTopRight}>
        <Button sx={addEventClassess.cancelBtn} onClick={() => setShowCancelModal(true)}>
          Cancel
        </Button>
        <Button sx={addEventClassess.saveBtn} type='submit'>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default HeaderComponent
