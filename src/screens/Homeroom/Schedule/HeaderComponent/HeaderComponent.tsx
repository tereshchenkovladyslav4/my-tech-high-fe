import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthRoute } from '@mth/enums'
import { HeaderComponentProps } from '../types'
import { headerComponentClassess } from './styles'

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title }) => {
  const history = useHistory()
  return (
    <Box sx={headerComponentClassess.main}>
      <Box sx={headerComponentClassess.pageTitle}>
        <IconButton onClick={() => history.push(MthRoute.HOMEROOM)} sx={{ position: 'relative' }}>
          <ArrowBackIosRoundedIcon sx={{ fontSize: '15px', stroke: 'black', strokeWidth: 2 }} />
        </IconButton>
        <Subtitle size='medium' sx={{ fontSize: '20px', marginLeft: 3 }} fontWeight='700'>
          {title}
        </Subtitle>
      </Box>
    </Box>
  )
}

export default HeaderComponent
