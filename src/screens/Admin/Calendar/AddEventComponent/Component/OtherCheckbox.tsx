import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React, { useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { DropDownItem } from '../../../SiteManagement/components/DropDown/types'

type OtherCheckBoxProps = {
  others: string[]
  setOthers: (value: string[]) => void
}
const OtherCheckBox = ({ others, setOthers }: OtherCheckBoxProps) => {
  const [otherList, setOtherList] = useState<DropDownItem[]>([
    {
      label: 'Diploma Seeking',
      value: 'diploma-seeking',
    },
    {
      label: 'Non-diploma Seeking',
      value: 'non-diploma-seeking',
    },
    {
      label: 'Testing Opt-in',
      value: 'testing-opt-in',
    },
    {
      label: 'Testing Opt-out',
      value: 'testing-opt-out',
    },
  ])

  const handleChangeOthers = (e: any) => {
    if (others.includes(e.target.value)) {
      setOthers(others.filter((item) => item !== e.target.value && !!item))
    } else {
      setOthers([...others, e.target.value].filter((item) => !!item))
    }
  }
  const renderOther = () =>
    map(otherList, (other, index) => (
      <FormControlLabel
        key={index}
        sx={{ height: 30 }}
        control={
          <Checkbox
            checked={others.includes(other.value.toString())}
            value={other.value}
            onChange={handleChangeOthers}
          />
        }
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
            {other.label}
          </Paragraph>
        }
      />
    ))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paragraph size='large' fontWeight='700'>
        Other
      </Paragraph>
      {renderOther()}
    </Box>
  )
}

export default OtherCheckBox
