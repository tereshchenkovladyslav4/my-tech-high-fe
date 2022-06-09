import React from 'react'
import { DropDown } from '../../components/DropDown/DropDown'

type ProgramSelectProps = {
  program: string
  setProgram: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function ProgramSelect({ program, setProgram, setIsChanged }: ProgramSelectProps) {
  const items = [
    {
      label: <em>None</em>,
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
  const handleChange = (event: string) => {
    setProgram(event)
    setIsChanged(true)
  }

  return (
    <DropDown
      dropDownItems={items}
      placeholder={'Select Year'}
      defaultValue={program ? program : ''}
      sx={{ width: '160px', marginLeft: '25px' }}
      borderNone={false}
      setParentValue={handleChange}
    />
  )
}
