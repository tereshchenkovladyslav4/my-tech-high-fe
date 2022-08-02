import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@mui/material'
import { isValidVaccInput } from '../helpers'

type CustomDateInputProps = {
  initVal: string
  onChange: (val: string) => void
  disabled?: boolean
  showError?: boolean
  allowIM?: boolean
  endAdornment?: ReactNode
}
const useStyles = makeStyles(() => ({
  textInput: {
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '1px solid black',
    },
  },
}))
export const CustomDateInput: FunctionComponent<CustomDateInputProps> = ({
  initVal = '',
  onChange,
  disabled = false,
  showError = false,
  allowIM = false,
  endAdornment,
}) => {
  const styles = useStyles()
  const [val, setVal] = useState('')
  useEffect(() => {
    handleDateChange(initVal)
  }, [initVal])

  function changeValue(v: string) {
    if (isValidVaccInput(v) || isValidVaccInput(val) || (!v && val.length !== 0)) {
      onChange(v)
    }
    setVal(v)
  }
  function handleDateChange(value: string) {
    if (value === null) return
    if (value.length > 10) changeValue(value.slice(0, 10))
    const isDelete = value.length <= val.length
    if (isDelete) changeValue(value)

    const v = value.toUpperCase()
    switch (v.length) {
      case 1: {
        if (['N', 'E'].includes(v)) changeValue(value)
        else if (v === 'I' && allowIM) changeValue(value)
        if (value === 'e') changeValue('E')
        else {
          const d = +v[0]
          if (d > 1) changeValue('0' + d + '/')
          else if (d >= 0) changeValue(value)
        }
        break
      }
      case 2: {
        if (['NA', 'EX'].includes(v)) changeValue(value)
        else if (v === 'IM' && allowIM) changeValue(value)
        else if (v[1] === '/') changeValue(0 + v)
        else {
          const d = +v
          if (d > 0 && d <= 12) changeValue(value + '/')
        }
        break
      }
      case 3: {
        if (['EXE', '/'].includes(v)) changeValue(value)
        break
      }
      case 4: {
        if ('EXEM' == v) changeValue(value)
        else if (v[3] === '/') changeValue(0 + value)
        else if (+v.slice(0, 2) > 0) {
          const d = +v[3]
          if (d > 3) changeValue(v.slice(0, 3) + '0' + d + '/')
          else if (d >= 0) changeValue(value)
        }

        break
      }
      case 5: {
        if ('EXEMP' == v) changeValue(value)
        else {
          const d = +v.slice(3)
          if (d > 0 && d <= 31) changeValue(value + '/')
        }

        break
      }
      case 6: {
        if ('EXEMPT' == v || v[5] === '/') changeValue(value)
        break
      }
      case 7: {
        const chunks = v.split('/').slice(0, 2)
        const isValid = chunks.every((v) => v.length === 2 && +v > 0)
        if (chunks.length > 1 && isValid) {
          const d = +v.slice(6)
          if (d >= 0) changeValue(value)
        }
        break
      }
      case 8: {
        const chunks = v.split('/')
        const isValid = chunks.every((v) => v.length === 2 && +v > 0)
        if (chunks.length > 2 && isValid) {
          const d = +v.slice(6)
          if (d > 0) {
            const chunks = v.split('/')
            changeValue(chunks[0] + '/' + chunks[1] + '/20' + chunks[2])
          }
        }
        break
      }
      case 9:
      case 10: {
        const chunks = v.split('/')
        const isValid = chunks.every((v) => +v > 0)
        if (chunks.length > 2 && isValid && parseInt(v.slice(6)) > 0) {
          changeValue(value)
        }
        break
      }
      default:
        break
    }
  }

  return (
    <TextField
      placeholder='MM/DD/YYYY'
      inputProps={{
        classes: { root: styles.textInput },
        style: {
          padding: '4px 0px 4px 10px',
          height: '25px',
          fontSize: '12px',
          fontWeight: '700',
        },
      }}
      sx={{
        width: '130px',
      }}
      error={showError}
      size='small'
      disabled={disabled}
      value={val}
      onChange={(e) => handleDateChange(e.target.value)}
      required
      InputProps={{
        endAdornment: endAdornment,
      }}
    />
  )
}
