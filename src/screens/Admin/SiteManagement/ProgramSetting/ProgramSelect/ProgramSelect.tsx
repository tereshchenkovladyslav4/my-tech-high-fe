import React, { useState } from 'react'
import { DropDown } from '../../components/DropDown/DropDown'

type ProgramSelectProps = {
  program: string
  setProgram: (value: string) => void
  setIsChanged: (value: boolean) => void
  isChanged: any
}

export default function ProgramSelect({ program, setProgram, setIsChanged, isChanged }: ProgramSelectProps) {
  const oldProgram = program;
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

    if(program != event ){
      setIsChanged({
        ...isChanged,
        program: true
      })
    }else{
      setIsChanged({
        ...isChanged,
        program: false
      })
    }    
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
