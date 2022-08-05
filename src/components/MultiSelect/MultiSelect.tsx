import React, { useEffect, useState } from 'react'
import { FormControl, Select, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { MultiSelectTemplateType } from './types'

export const MultiSelect: MultiSelectTemplateType = ({
  options,
  renderValue,
  placeholder,
  disabled,
  defaultValue,
  error,
  onChange,
}) => {
  const [value, setValue] = useState<unknown[]>(defaultValue || [])

  const handleChange = (val: string | unknown[]) => {
    onChange(typeof val === 'string' ? [val] : val)
  }

  const renderSelectedItems = () =>
    renderValue || (
      <span>
        {options
          .filter((option) => value?.findIndex((item) => item === option.value) > -1)
          .map((option) => option.label)
          .join(', ')}
      </span>
    )

  const renderDropDownItem = map(options, (dropDownItem, index) => (
    <MenuItem key={index} value={dropDownItem.value}>
      <Checkbox checked={!!(value?.findIndex((item) => item === dropDownItem.value) >= 0)} />
      <ListItemText primary={dropDownItem.label} />
    </MenuItem>
  ))

  useEffect(() => {
    setValue(defaultValue || [])
  }, [defaultValue])

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          multiple={true}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          displayEmpty
          renderValue={value?.length ? renderSelectedItems : () => <span style={{ color: 'gray' }}>{placeholder}</span>}
          size='medium'
          error={error?.error}
          disabled={disabled || false}
        >
          {renderDropDownItem}
        </Select>
      </FormControl>
    </Box>
  )
}
