import React from 'react'
import { Box } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { ProgramSettingChanged } from '../types'

type ProgramSelectProps = {
  program: string
  setProgram: (value: string) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

export const ProgramSelect: React.FC<ProgramSelectProps> = ({ program, setProgram, setIsChanged, isChanged }) => {
  const items: DropDownItem[] = [
    {
      label: `${(<em>None</em>)}`,
      value: '',
    },
    {
      label: 'MTH',
      value: 'MTH',
    },
    {
      label: 'TTA',
      value: 'TTA',
    },
  ]
  const handleChange = (event: string | number | boolean) => {
    setProgram(`${event}`)

    if (program != event) {
      setIsChanged({
        ...isChanged,
        program: true,
      })
    } else {
      setIsChanged({
        ...isChanged,
        program: false,
      })
    }
  }

  return (
    <Box sx={{ marginLeft: '25px' }}>
      <DropDown
        dropDownItems={items}
        placeholder={'Select Year'}
        defaultValue={program ? program : ''}
        sx={{ width: '160px' }}
        borderNone={false}
        setParentValue={handleChange}
      />
    </Box>
  )
}
