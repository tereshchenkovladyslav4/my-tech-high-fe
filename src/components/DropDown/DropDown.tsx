import React, { useEffect, useState } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FormControl, Select, MenuItem, FormHelperText, Divider, IconButton, Tooltip, InputLabel } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { MthColor, QUESTION_TYPE } from '@mth/enums'
import { dropdownClasses } from './styles'
import { DropDownProps } from './types'

export const DropDown: React.FC<DropDownProps> = ({
  testId,
  dropDownItems,
  placeholder,
  placeholderColor,
  setParentValue,
  labelTop,
  disabled,
  size,
  defaultValue,
  sx,
  error,
  dropdownColor,
  isAddable,
  auto = true,
  borderNone = false,
  color,
  id,
  labelTopBgColor,
  labelTopColor,
}) => {
  const convertDefaultValue = (val: string | number | undefined): string | number => {
    return !!val || val === 0 ? val : ''
  }

  const [value, setValue] = useState(convertDefaultValue(defaultValue))
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
    setValue(convertDefaultValue(defaultValue))
  }, [defaultValue])

  return (
    <Box sx={{ minWidth: 120, zIndex: 1, ...sx }} data-testid={testId} id={id}>
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
                    : () => <span style={{ color: MthColor.BLUE_GRADIENT, marginRight: '15px' }}>{placeholder}</span>
                }
                sx={{ ...dropdownClasses.borderNone }}
              >
                {renderDropDownItem}
              </Select>
              {error?.error && <FormHelperText sx={{ color: MthColor.RED }}>{error?.errorMsg}</FormHelperText>}
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
                    : () => <span style={{ color: placeholderColor ?? 'gray' }}>{placeholder}</span>
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
              {error?.error && <FormHelperText sx={{ color: MthColor.RED }}>{error?.errorMsg}</FormHelperText>}
            </FormControl>
          )}
        </>
      ) : (
        <FormControl fullWidth className='MthFormField' focused error={error?.error}>
          <InputLabel
            sx={{
              backgroundColor: labelTopBgColor ? labelTopBgColor : '#FFF',
              color: labelTopColor ? `${labelTopColor} !important` : MthColor.BLACK,
              paddingX: 1,
            }}
          >
            {placeholder}
          </InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={value}
            onChange={(e) => handleChange(e.target?.value)}
            displayEmpty
            renderValue={
              !!value || value === 0
                ? () => <span>{dropDownItems?.find((item) => item.value == value)?.label}</span>
                : () => <span style={{ color: 'gray' }}>{'Select'}</span>
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
          {error?.error && <FormHelperText sx={{ color: MthColor.RED }}>{error?.errorMsg}</FormHelperText>}
        </FormControl>
      )}
    </Box>
  )
}
