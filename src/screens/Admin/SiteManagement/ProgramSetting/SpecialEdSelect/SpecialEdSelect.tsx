import React from 'react'
import { DropDown } from '../../components/DropDown/DropDown'

type SpecialEdSelectProps = {
  specialEd: boolean
  setSpecialEd: (value: boolean) => void
  setIsChanged: (value: boolean) => void
}

export default function SpecialEdSelect({ specialEd, setSpecialEd, setIsChanged }: SpecialEdSelectProps) {
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
  const handleChange = (value: string) => {
    setSpecialEd(value == 'true' ? true : false)
    setIsChanged(true)
  }

  return (
    <DropDown
      dropDownItems={items}
      placeholder={'Select status'}
      defaultValue={specialEd ? 'true' : 'false'}
      sx={{ width: '160px', marginLeft: '25px' }}
      borderNone={false}
      setParentValue={handleChange}
    />
  )
}
