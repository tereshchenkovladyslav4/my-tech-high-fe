import React, { useEffect, useState } from 'react'
import { FormControl, Select, MenuItem, Checkbox, ListItemText, InputLabel, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { multiSelectClasses } from '@mth/components/MultiSelect/styles'
import { MthColor } from '@mth/enums'
import { MultiSelectProps } from './types'

const ITEM_HEIGHT = 54
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  label,
  placeholder,
  borderNone = false,
  renderValue,
  disabled,
  defaultValue,
  error,
  onChange,
  allSelect = false,
}) => {
  const [value, setValue] = useState<(string | number)[]>(defaultValue || [])

  const handleChange = (val: string | (string | number)[]) => {
    if (allSelect) {
      const fullList = options.map((item) => item.value)
      if (val[val.length - 1] === 'all') {
        onChange(fullList.length === value.length && fullList.length > 0 ? [] : fullList)
        return
      }
    }
    onChange(typeof val === 'string' ? [val] : val)
  }

  const renderSelectedItems = () =>
    value?.length ? (
      renderValue || (
        <span>
          {options
            .filter((option) => value?.findIndex((item) => item === option.value) > -1)
            .map((option) => option.label)
            .join(', ')}
        </span>
      )
    ) : (
      <span style={{ color: borderNone ? MthColor.MTHBLUE : MthColor.SYSTEM_12 }}>{placeholder}</span>
    )

  const isAllSelected = () => {
    return options.length === value.length && options.length > 0
  }

  const renderDropDownItem = map(options, (dropDownItem, index) => (
    <MenuItem key={index} value={dropDownItem.value}>
      <Checkbox checked={value?.findIndex((item) => item === dropDownItem.value) >= 0} />
      <ListItemText primary={dropDownItem.label} />
    </MenuItem>
  ))

  useEffect(() => {
    setValue(defaultValue || [])
  }, [defaultValue])

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl variant={borderNone ? 'standard' : 'outlined'} fullWidth size='medium' className='MthFormField'>
        <InputLabel id='multiple-checkbox-label'>{label}</InputLabel>
        <Select
          labelId='multiple-checkbox-label'
          id='multiple-checkbox'
          multiple={true}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          {...(borderNone ? { disableUnderline: true } : {})}
          displayEmpty
          input={borderNone ? undefined : <OutlinedInput label={label} />}
          sx={borderNone ? multiSelectClasses.borderNone : {}}
          renderValue={renderSelectedItems}
          MenuProps={MenuProps}
          error={error?.error}
          disabled={disabled || false}
        >
          {allSelect && (
            <MenuItem value='all'>
              <Checkbox checked={isAllSelected()} />
              <ListItemText primary='Select All' />
            </MenuItem>
          )}
          {renderDropDownItem}
        </Select>
      </FormControl>
    </Box>
  )
}
