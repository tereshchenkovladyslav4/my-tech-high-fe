import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FormControl, Select, MenuItem, TextField, FormHelperText, Divider } from '@mui/material'
import { Box, styled } from '@mui/system'
import { map } from 'lodash'
import { MthColor } from '@mth/enums'
import { dropdownClasses } from './styles'
import { DropDownProps } from './types'

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

export const DropDown: React.FC<DropDownProps> = ({
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
  const [value, setValue] = useState(defaultValue || '')
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
    setValue(defaultValue || '')
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
                displayEmpty
                renderValue={
                  !!value || value === 0
                    ? undefined
                    : () => <span style={{ color: MthColor.BLUE_GRDIENT }}>{placeholder}</span>
                }
                sx={{ ...dropdownClasses.borderNone }}
              >
                {renderDropDownItem}
              </Select>
              <FormHelperText sx={{ color: MthColor.ERROR_RED }}>{error?.errorMsg}</FormHelperText>
            </FormControl>
          ) : (
            <FormControl fullWidth>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={value}
                onChange={(e) => handleChange(e.target?.value)}
                displayEmpty
                renderValue={
                  !!value || value === 0 ? undefined : () => <span style={{ color: 'gray' }}>{placeholder}</span>
                }
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
              <FormHelperText sx={{ color: MthColor.ERROR_RED }}>{error?.errorMsg}</FormHelperText>
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
              style: { color: alternate && MthColor.SYSTEM_05 },
              shrink: true,
            }}
            FormHelperTextProps={{
              style: { color: MthColor.ERROR_RED },
            }}
            focused
            select // tell TextField to render select
            label={placeholder}
            sx={
              alternate
                ? {
                    ...dropdownClasses.alternate,
                    ...sx,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: error?.error ? MthColor.ERROR_RED : '',
                        borderWidth: '1px',
                      },
                    },
                  }
                : {
                    ...dropdownClasses.textField,
                    ...sx,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: error?.error ? MthColor.ERROR_RED : '',
                        borderWidth: '1px',
                      },
                    },
                  }
            }
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
