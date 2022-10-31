import React, { useEffect, useState } from 'react'
import { InputAdornment, TextField } from '@mui/material'
import { TextFieldProps } from '@mui/material/TextField/TextField'
import { isDecimal, isNumber, isPrice } from '@mth/constants'

export type MthNumberInputProps = TextFieldProps & {
  numberType: 'price' | 'numeric' | 'decimal'
  value: number | null | undefined
  onChangeValue: (value: number | null) => void
}

export const MthNumberInput = (props: MthNumberInputProps): React.ReactElement => {
  const { numberType, InputProps, value: defaultValue, onChangeValue, ...otherProps } = props
  const [value, setValue] = useState<string>((defaultValue || '').toString())

  const handleChange = (newValue: string) => {
    switch (numberType) {
      case 'price': {
        if (!newValue || isPrice.test(newValue)) {
          if (newValue.endsWith('.') && Number(newValue) === defaultValue) {
            setValue(newValue)
          } else {
            onChangeValue(Number(newValue) || null)
          }
        }
        break
      }
      case 'numeric': {
        if (!newValue || isNumber.test(newValue)) {
          onChangeValue(Number(newValue) || null)
        }
        break
      }
      case 'decimal': {
        if (!newValue || isDecimal.test(newValue)) {
          if (newValue.endsWith('.') && Number(newValue) === defaultValue) {
            setValue(newValue)
          } else {
            onChangeValue(Number(newValue) || null)
          }
        }
        break
      }
    }
  }

  useEffect(() => {
    setValue((defaultValue || '').toString())
  }, [defaultValue])

  return (
    <TextField
      InputProps={{
        startAdornment: numberType === 'price' ? <InputAdornment position='start'>$</InputAdornment> : '',
        ...InputProps,
      }}
      value={value || ''}
      onChange={(event: { target: { value: string } }) => {
        handleChange(event?.target?.value)
      }}
      {...otherProps}
      type='text'
    />
  )
}

export default MthNumberInput
