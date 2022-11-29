import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { IconButton, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { ScheduleStatus } from '@mth/enums'
import { HeaderComponentProps } from '../types'
import { headerComponentClassess } from './styles'

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  scheduleStatus,
  isUpdatePeriodRequested,
  handleBack,
}) => {
  return (
    <Box sx={headerComponentClassess.main}>
      <Box sx={headerComponentClassess.pageTitle}>
        <IconButton onClick={() => handleBack()} sx={{ position: 'relative' }}>
          <ArrowBackIosRoundedIcon sx={{ fontSize: '15px', stroke: 'black', strokeWidth: 2 }} />
        </IconButton>
        <Subtitle size='medium' sx={{ fontSize: '20px', marginLeft: 3 }} fontWeight='700'>
          {title}
        </Subtitle>
        {scheduleStatus &&
          !isUpdatePeriodRequested &&
          (scheduleStatus == ScheduleStatus.ACCEPTED ||
            scheduleStatus == ScheduleStatus.SUBMITTED ||
            scheduleStatus == ScheduleStatus.RESUBMITTED) && (
            <Box sx={{ marginLeft: 4 }}>
              <Tooltip title='Download' placement='top'>
                <img src={DownloadFileIcon} alt='Download Icon' />
              </Tooltip>
            </Box>
          )}
      </Box>
    </Box>
  )
}

export default HeaderComponent
