import React, { useEffect, useState } from 'react'
import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { Paragraph } from '../Typography/Paragraph/Paragraph'

type SingleCheckboxProps = {
  title: string
  defaultValue: boolean
  titleBold?: boolean
  handleChangeValue: () => void
}

const SingleCheckbox: React.FC<SingleCheckboxProps> = ({ title, titleBold, defaultValue, handleChangeValue }) => {
  const [value, setValue] = useState<boolean>(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Box sx={{ display: 'grid', my: 1.5, mx: 1 }}>
      <FormControlLabel
        sx={{ height: 30 }}
        control={<Checkbox checked={value} value={value} onChange={handleChangeValue} />}
        label={
          <Paragraph size='large' sx={{ marginLeft: '12px', fontSize: '16px', fontWeight: titleBold ? '700' : '500' }}>
            {title}
          </Paragraph>
        }
      />
    </Box>
  )
}

export default SingleCheckbox
