import React from 'react'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, Typography, IconButton } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { PageHeaderProps } from './PageHeaderProps'
import { useStyles } from './styles'

const PageHeader: React.FC<PageHeaderProps> = ({ title, to, onBack, children }) => {
  const history = useHistory()
  const classes = useStyles

  const handleBackClick = () => {
    if (to) history.push(to)
    if (onBack) onBack()
  }

  return (
    <Box sx={classes.pageHeader}>
      <Box sx={classes.backTitle}>
        <IconButton onClick={handleBackClick} data-testid='pageHeaderBack'>
          <ArrowBackIosOutlinedIcon sx={classes.arrowIcon} />
        </IconButton>
        <Typography sx={classes.title} component='span' data-testid='pageHeaderTitle'>
          {title}
        </Typography>
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

export default PageHeader
