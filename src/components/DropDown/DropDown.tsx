import React, { useEffect, useState } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FormControl, Select, MenuItem, TextField, FormHelperText, Divider, IconButton, Tooltip } from '@mui/material'
import { Box, styled } from '@mui/system'
import { map } from 'lodash'
import { MthColor, QUESTION_TYPE } from '@mth/enums'
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
  auto = true,
  borderNone = false,
  color,
}) => {
  const [value, setValue] = useState(defaultValue || '')
  const handleChange = (val: string | QUESTION_TYPE) => {
    if (auto) setValue(val)
    setParentValue(val)
  }

  const renderDropDownItem = map(dropDownItems, (dropDownItem, index) => (
    <MenuItem
      key={index}
      sx={{ display: 'flex', justifyContent: 'space-between' }}
      value={dropDownItem.value}
      disabled={dropDownItem.disabled === true}
    >
      {dropDownItem.label}
      {dropDownItem.hasDeleteIcon && (
        <Tooltip title='Delete' placement='top'>
          <IconButton
            onClick={() => {
              if (dropDownItem?.handleDeleteItem) dropDownItem?.handleDeleteItem(dropDownItem.value)
            }}
          >
            <DeleteForeverOutlinedIcon sx={{ cursor: 'pointer', width: '25px', height: '25px' }} fontSize='medium' />
          </IconButton>
        </Tooltip>
      )}
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
    <Box sx={{ minWidth: 120, zIndex: 1, ...sx }}>
      {!labelTop ? (
        <>
          {borderNone ? (
            <FormControl variant='standard' fullWidth>
              <Select
                size='small'
                value={value}
                IconComponent={(props) => <ExpandMoreIcon style={{ color: color ?? 'blue' }} {...props} />}
                disableUnderline
                onChange={(e) => handleChange(e.target?.value)}
                displayEmpty
                renderValue={
                  !!value || value === 0
                    ? () => (
                        <span style={{ color, marginRight: '15px' }}>
                          {dropDownItems?.find((item) => item.value == value)?.label}
                        </span>
                      )
                    : () => <span style={{ color: MthColor.BLUE_GRDIENT, marginRight: '15px' }}>{placeholder}</span>
                }
                sx={{ ...dropdownClasses.borderNone }}
              >
                {renderDropDownItem}
              </Select>
              <FormHelperText sx={{ color: MthColor.ERROR_RED }}>{error?.errorMsg}</FormHelperText>
            </FormControl>
          ) : (
            <FormControl fullWidth className='MthFormField'>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={value}
                onChange={(e) => handleChange(e.target?.value)}
                displayEmpty
                renderValue={
                  !!value || value === 0
                    ? () => <span>{dropDownItems?.find((item) => item.value == value)?.label}</span>
                    : () => <span style={{ color: 'gray' }}>{placeholder}</span>
                }
                sx={{
                  ...sx,
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
            InputLabelProps={{ shrink: true }}
            className='MthFormField'
            FormHelperTextProps={{
              style: { color: MthColor.ERROR_RED },
            }}
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
