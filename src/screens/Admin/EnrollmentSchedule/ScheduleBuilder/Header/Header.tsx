import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { IconButton, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ScheduleStatus } from '@mth/enums'
import { SchoolYearDropDown } from '../../SchoolYearDropDown/SchoolYearDropDown'
import { headerClass } from './styles'
import { HeaderProps } from './types'

const Header: React.FC<HeaderProps> = ({ title, selectedYear, scheduleStatus, onSelectYear, handleBack }) => {
  return (
    <Box sx={headerClass.headerMain}>
      <IconButton sx={{ backgroundColor: MthColor.LIGHTGRAY, borderRadius: '5px' }} onClick={() => handleBack()}>
        <ArrowBackIosRoundedIcon />
      </IconButton>
      <Subtitle size='medium' fontWeight='700'>
        {title}
      </Subtitle>
      {scheduleStatus?.value == ScheduleStatus.ACCEPTED && (
        <Tooltip title='Download' placement='top'>
          <img src={DownloadFileIcon} alt='Download Icon' />
        </Tooltip>
      )}
      <SchoolYearDropDown selectedYearId={selectedYear} setSelectedYearId={onSelectYear} />
    </Box>
  )
}

export default Header
