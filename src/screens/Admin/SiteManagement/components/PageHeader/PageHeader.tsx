import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Button, Typography, IconButton } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { siteManagementClassess } from '../../styles'
import { PageHeaderProps } from './PageHeaderProps'

export const PageHeader: React.FC<PageHeaderProps> = ({ title, back, handleClickSave }) => {
  const history = useHistory()
  const handleBackClick = () => {
    history.push(back || '/site-management/')
  }
  return (
    <Box sx={siteManagementClassess.programSettingHeader}>
      <Box>
        <IconButton onClick={handleBackClick} sx={siteManagementClassess.iconButton}>
          <ArrowBackIosRoundedIcon sx={siteManagementClassess.arrowIcon} />
        </IconButton>
        <Typography sx={siteManagementClassess.title} component='span'>
          {title}
        </Typography>
      </Box>
      <Box>
        <Button variant='contained' onClick={handleClickSave} disableElevation sx={siteManagementClassess.submitButton}>
          Save
        </Button>
      </Box>
    </Box>
  )
}
