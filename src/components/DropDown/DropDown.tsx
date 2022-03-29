import { SelectChangeEvent, FormControl, Select, MenuItem, TextField, InputLabel, FormHelperText } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import React, { useState } from 'react'
import { DropDownTemplateType } from './types'
import { useStyles } from './styles'
import { SYSTEM_05 } from '../../utils/constants'

const Placeholder = ({ children }) => {
  return <div>{children}</div>
}

export const DropDown: DropDownTemplateType = ({
  dropDownItems,
  placeholder,
  setParentValue,
  labelTop,
  alternate,
  disabled,
  size,
  defaultValue,
  sx,
  error,
  name,
  dropdownColor
}) => {
  const [value, setValue] = useState(defaultValue)
  const handleChange = (val: string) => {
    setValue(val)
    setParentValue(val)
  }

  const renderDropDownItem = () =>
    map(dropDownItems, (dropDownItem, index) => (
      <MenuItem key={index} value={dropDownItem.value}>
        {dropDownItem.label}
      </MenuItem>
    ))

  const classes = useStyles

  return (
    <Box sx={{ minWidth: 120, ...sx }}>
      {!labelTop ? (
        <FormControl fullWidth>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={value}
            onChange={(e) => handleChange(e.target?.value)}
            displayEmpty
            renderValue={`${value}` ? undefined : () => <Placeholder>{placeholder}</Placeholder>}
            sx={{ ...sx, borderRadius: 2,  '& .MuiSelect-outlined': {
              background: dropdownColor 
            }}}
            size={size || 'medium'}
            error={error?.error}
            disabled={disabled || false}
          >
            {renderDropDownItem()}
          </Select>
          <FormHelperText sx={{ color: '#BD0043' }}>{error?.errorMsg}</FormHelperText>
        </FormControl>
      ) : (
        <Box>
          <TextField
            name={name}
            size={size || 'medium'}
            focused
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            InputLabelProps={{
              style: { color: alternate && SYSTEM_05 },
            }}
            select // tell TextField to render select
            label={placeholder}
            sx={alternate ? classes.alternate : classes.textfield}
            error={error?.error}
            helperText={error?.errorMsg}
          >
            {renderDropDownItem()}
          </TextField>
        </Box>
      )}
    </Box>
  )
}
