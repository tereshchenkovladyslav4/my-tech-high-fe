import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { IconButton, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ScheduleStatus } from '@mth/enums'
import { headerClass } from './styles'
import { HeaderProps } from './types'

const Header: React.FC<HeaderProps> = ({
  title,
  schoolYearItems,
  scheduleStatus,
  selectedYearId,
  setSelectedYearId,
  handleBack,
  viewonly,
}) => {
  return (
    <Box sx={headerClass.headerMain}>
      {!viewonly && (
        <IconButton
          sx={{ backgroundColor: MthColor.BG_MAIN, borderRadius: '5px', width: '44px', height: '44px', mr: 3 }}
          onClick={() => handleBack()}
        >
          <ArrowBackIosRoundedIcon sx={{ fontSize: '18px !important' }} />
        </IconButton>
      )}

      <Subtitle size='medium' fontWeight='700'>
        {title}
      </Subtitle>
      {!viewonly && scheduleStatus?.value == ScheduleStatus.ACCEPTED && (
        <Tooltip title='Download' placement='top'>
          <img src={DownloadFileIcon} alt='Download Icon' style={{ marginLeft: '12px' }} />
        </Tooltip>
      )}
      <DropDown
        dropDownItems={schoolYearItems}
        placeholder={'Select Year'}
        defaultValue={selectedYearId}
        borderNone={true}
        setParentValue={(val) => {
          setSelectedYearId(Number(val))
        }}
      />
    </Box>
  )
}

export default Header
