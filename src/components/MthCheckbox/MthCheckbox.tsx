import React, { useEffect, useState } from 'react'
import { Theme } from '@emotion/react'
import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { SxProps } from '@mui/system'
import { Paragraph } from '../Typography/Paragraph/Paragraph'

type MthCheckboxProps = {
  title: string
  defaultValue: boolean
  titleBold?: boolean
  sx?: SxProps<Theme> | undefined
  handleChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MthCheckbox: React.FC<MthCheckboxProps> = ({ title, titleBold, defaultValue, sx, handleChangeValue }) => {
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
          <Paragraph
            size='large'
            sx={sx ? sx : { marginLeft: '12px', fontSize: '16px', fontWeight: titleBold ? '700' : '500' }}
          >
            {title}
          </Paragraph>
        }
      />
    </Box>
  )
}

export default MthCheckbox
