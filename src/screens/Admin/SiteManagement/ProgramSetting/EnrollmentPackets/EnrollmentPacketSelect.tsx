import React from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { ProgramSettingChanged } from '../types'

type EnrollPacketSelectProps = {
  enroll: boolean
  setEnroll: (value: boolean) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

export const EnrollPacketSelect: React.FC<EnrollPacketSelectProps> = ({
  enroll,
  setEnroll,
  setIsChanged,
  isChanged,
}) => {
  const items = [
    {
      label: 'Enabled',
      value: 'true',
    },
    {
      label: 'Disabled',
      value: 'false',
    },
  ]
  const handleChange = (value: string | number | boolean) => {
    setEnroll(value == 'true' ? true : false)
    setIsChanged({
      ...isChanged,
      enrollment: true,
    })
  }

  return (
    <Box sx={{ marginLeft: '25px' }}>
      <DropDown
        dropDownItems={items}
        placeholder={'Select status'}
        defaultValue={enroll ? 'true' : 'false'}
        sx={{ width: '160px', zIndex: 1 }}
        borderNone={false}
        setParentValue={handleChange}
      />
    </Box>
  )
}
