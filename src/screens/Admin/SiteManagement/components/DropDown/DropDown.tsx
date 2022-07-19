import { FormControl, Select, MenuItem, TextField, FormHelperText, Divider } from '@mui/material'
import { Box, styled } from '@mui/system'
import { map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { DropDownTemplateType } from './types'
import { useStyles } from './styles'
import { SYSTEM_05 } from '../../../../../utils/constants'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { makeStyles } from '@material-ui/styles'

const CssTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== 'focusColor',
})((p) => ({
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

const selectStyles = makeStyles({
  select: {
    '& .MuiSvgIcon-root': {
      color: 'blue',
    },
  },
})

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
  borderNone = false,
  auto = true
}) => {
  const [value, setValue] = useState(defaultValue)
  const selectClasses = selectStyles()
  const handleChange = (val: string) => {
    if (auto)
      setValue(val)    
    setParentValue(val, idx)
  }

  let renderDropDownItem = map(dropDownItems, (dropDownItem, index) => (
    <MenuItem key={index} value={dropDownItem.value}>
      {dropDownItem.label}
    </MenuItem>
  ))

  if (isAddable) {
    renderDropDownItem.push(<Divider />)
    renderDropDownItem.push(<MenuItem value={0}>Add...</MenuItem>)
  }

  const classes = useStyles

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
                className={selectClasses.select}
                sx={{ color: 'blue', border: 'none', width: '55%' }}
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
                IconComponent={ExpandMoreIcon}
                onChange={(e) => handleChange(e.target?.value)}
                displayEmpty
                renderValue={value ? undefined : () => <span style={{ color: 'gray' }}>{placeholder}</span>}
                sx={{
                  ...sx,
                  borderRadius: 1,
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
            focused
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            InputLabelProps={{
              style: { color: alternate ? SYSTEM_05 : '' },
            }}
            select // tell TextField to render select
            label={placeholder}
            sx={alternate ? { ...sx, ...classes.alternate } : { ...sx, ...classes.textfield }}
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
