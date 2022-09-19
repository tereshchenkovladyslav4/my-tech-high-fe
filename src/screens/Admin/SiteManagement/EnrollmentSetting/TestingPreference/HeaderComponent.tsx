import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, IconButton, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthColor } from '@mth/enums'
import { HeaderComponentProps } from './types'

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  dropDownItems,
  selectedSchoolYear,
  setSelectedSchoolYear,
}) => {
  const history = useHistory()

  return (
    <Box paddingY='13px' paddingX='20px' display='flex' justifyContent='space-between'>
      <Box>
        <IconButton
          onClick={() => history.push('/site-management/enrollment/')}
          sx={{
            position: 'relative',
            bottom: '2px',
          }}
        >
          <ArrowBackIosRoundedIcon sx={{ fontSize: '20px', fontWeight: 700, color: MthColor.BLACK }} />
        </IconButton>
        <Typography paddingLeft='20px' fontSize='20px' fontWeight={700} component='span'>
          Testing Preference
        </Typography>
      </Box>
      <Box display='flex' flexDirection='row' justifyContent='flex-end' alignItems='center'>
        <DropDown
          dropDownItems={dropDownItems}
          placeholder={'Select Year'}
          defaultValue={selectedSchoolYear}
          borderNone={true}
          setParentValue={(val) => {
            setSelectedSchoolYear(Number(val))
          }}
        />
      </Box>
    </Box>
  )
}

export default HeaderComponent
