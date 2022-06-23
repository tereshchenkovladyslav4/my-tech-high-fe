import { Box, Button, IconButton } from '@mui/material'
import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { HeaderComponentProps } from '../types'

const HeaderComponent = ({ title, handleCancelClick, setShowCancelModal, handleSaveClick }: HeaderComponentProps) => {
  const classes = useStyles

  return (
    <Box sx={classes.pageTop}>
      <Box sx={classes.pageTitle}>
        <IconButton
          onClick={() => handleCancelClick()}
          sx={{
            position: 'relative',
          }}
        >
          <ArrowBackIosRoundedIcon sx={classes.arrowButton} />
        </IconButton>
        <Subtitle size='medium' sx={{ fontSize: '20px' }} fontWeight='700'>
          {title}
        </Subtitle>
      </Box>
      <Box sx={classes.pageTopRight}>
        <Button sx={classes.cancelBtn} onClick={() => setShowCancelModal(true)}>
          Cancel
        </Button>
        <Button sx={classes.saveBtn} onClick={handleSaveClick}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default HeaderComponent
