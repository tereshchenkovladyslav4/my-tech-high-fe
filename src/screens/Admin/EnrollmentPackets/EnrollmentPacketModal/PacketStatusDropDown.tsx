import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { PACKET_STATUS_OPTIONS } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { EnrollmentPacketFormType } from './types'

export const EnrollmentPacketDropDownButton: React.FC = () => {
  const { watch, setValue } = useFormContext<EnrollmentPacketFormType>()
  const [status] = watch(['status', 'packetStatuses'])

  const handlePacketStatus = (name: string) => {
    setValue('status', name)
    setValue('preSaveStatus', name)
  }

  useEffect(() => {
    if (PACKET_STATUS_OPTIONS) {
      setValue(
        'packetStatuses',
        PACKET_STATUS_OPTIONS.map((item) => `${item.value}`),
      )
    }
  }, [PACKET_STATUS_OPTIONS])

  return (
    <DropDown
      sx={{
        fontSize: '12px',
        padding: '2px 30px 1px 40px',
        background: MthColor.BUTTON_LINEAR_GRADIENT,
        height: '35px',
        borderRadius: '8px',
        '& .MuiSelect-select': {
          color: 'white',
          fontWeight: 500,
          fontSize: '12px',
        },
        '& .MuiSvgIcon-root': {
          color: 'white !important',
        },
      }}
      dropDownItems={PACKET_STATUS_OPTIONS}
      defaultValue={status}
      borderNone={true}
      setParentValue={(val) => {
        handlePacketStatus(`${val}`)
      }}
    />
  )
}
