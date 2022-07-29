import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FormControl, Select, MenuItem, TextField, FormHelperText, Divider } from '@mui/material'
import { Box, styled } from '@mui/system'
import { map } from 'lodash'
import { DropDownTemplateType } from './types'
import { dropdownClassess } from './styles'
import { ERROR_RED, SYSTEM_05 } from '../../utils/constants'

const CssTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== 'focusColor',
})(() => ({
  // focused color for input with variant='standard'
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ccc',
    borderWidth: '1px',
  },
  // focused color for input with variant='filled'
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: '#ccc',
    borderWidth: '1px',
  },
  // focused color for input with variant='outlined'
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#ccc',
      borderWidth: '1px',
    },
  },
}))

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
  dropdownColor,
  isAddable,
  idx,
  auto = true,
  borderNone = false,
}) => {
  const [value, setValue] = useState(defaultValue)
  const handleChange = (val: string) => {
    if (auto) setValue(val)
    setParentValue(val, idx)
  }

  const renderDropDownItem = map(dropDownItems, (dropDownItem, index) => (
    <MenuItem key={index} value={dropDownItem.value}>
      {dropDownItem.label}
    </MenuItem>
  ))

  if (isAddable) {
    renderDropDownItem.push(<Divider key={-1} />)
    renderDropDownItem.push(
      <MenuItem key={-2} value={0}>
        Add...
      </MenuItem>,
    )
  }

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Box sx={{ minWidth: 120, ...sx }}>
      {!labelTop ? (
        <>
          {borderNone ? (
            <FormControl variant='standard' fullWidth>
              <Select
                size='small'
                value={value}
                IconComponent={ExpandMoreIcon}
                disableUnderline
                onChange={(e) => handleChange(e.target?.value)}
                label='Select Year'
                sx={{ ...dropdownClassess.borderNone }}
              >
                {renderDropDownItem}
              </Select>
              <FormHelperText sx={{ color: '#BD0043' }}>{error?.errorMsg}</FormHelperText>
            </FormControl>
          ) : (
            <FormControl fullWidth>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={value}
                onChange={(e) => handleChange(e.target?.value)}
                displayEmpty
                renderValue={(value || value == 0) ? undefined : () => <span style={{ color: 'gray' }}>{placeholder}</span>}
                sx={{
                  ...sx,
                  borderRadius: 2,
                  '& .MuiSelect-outlined': {
                    background: dropdownColor,
                  },
                }}
                size={size || 'medium'}
                error={error?.error}
                disabled={disabled || false}
              >
                {renderDropDownItem}
              </Select>
              <FormHelperText sx={{ color: '#BD0043' }}>{error?.errorMsg}</FormHelperText>
            </FormControl>
          )}
        </>
      ) : (
        <Box>
          <CssTextField
            name={name}
            size={size || 'medium'}
            value={value || value == 0 ? value : ''}
            onChange={(e) => handleChange(e.target.value)}
            InputLabelProps={{
              style: { color: alternate && SYSTEM_05 },
            }}
            FormHelperTextProps={{
              style: { color: ERROR_RED },
            }}
            select // tell TextField to render select
            label={placeholder}
            sx={alternate ? { ...dropdownClassess.alternate, ...sx } : { ...dropdownClassess.textfield, ...sx }}
            error={error?.error}
            helperText={error?.errorMsg}
            disabled={disabled || false}
          >
            {renderDropDownItem}
          </CssTextField>
        </Box>
      )}
    </Box>
  )
}
