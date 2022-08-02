import React, { FunctionComponent } from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Button, Typography, IconButton } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useStyles } from '../../styles'
import { PageHeaderProps } from './PageHeaderProps'

export const PageHeader: FunctionComponent<PageHeaderProps> = ({ title, handleClickSave }) => {
  const history = useHistory()
  const classes = useStyles
  const handleBackClick = () => {
    history.push('/site-management/')
  }
  return (
    <Box sx={classes.programSettingHeader}>
      <Box>
        <IconButton onClick={handleBackClick} sx={classes.iconButton}>
          <ArrowBackIosRoundedIcon sx={classes.arrowIcon} />
        </IconButton>
        <Typography sx={classes.title} component='span'>
          {title}
        </Typography>
      </Box>
      <Box>
        <Button variant='contained' onClick={handleClickSave} disableElevation sx={classes.submitButton}>
          Save
        </Button>
      </Box>
    </Box>
  )
}
