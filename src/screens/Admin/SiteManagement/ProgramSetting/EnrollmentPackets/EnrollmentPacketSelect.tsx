import React from 'react'
import { DropDown } from '../../components/DropDown/DropDown'

type EnrollPacketSelectProps = {
  enroll: boolean
  setEnroll: (value: boolean) => void
  setIsChanged: (value: boolean) => void
  isChanged: any
}

export default function EnrollPacketSelect({ enroll, setEnroll, setIsChanged, isChanged }: EnrollPacketSelectProps) {
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
    setEnroll(value == 'true' ? true : false)
    setIsChanged({
      ...isChanged,
      enrollment: true
    })
  }

  return (
    <DropDown
      dropDownItems={items}
      placeholder={'Select status'}
      defaultValue={enroll ? 'true' : 'false'}
      sx={{ width: '160px', marginLeft: '25px' }}
      borderNone={false}
      setParentValue={handleChange}
    />
  )
}
