import React, { useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 0
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export type MultiSelectDropDownListType = {
  name: string
  color: string
}

type MultiSelectDropDownProps = {
  checkBoxLists: MultiSelectDropDownListType[]
  selectedLists: string[]
  setSelectedLists: (value: string[]) => void
}

const MultiSelectDropDown = ({ checkBoxLists = [], selectedLists, setSelectedLists }: MultiSelectDropDownProps) => {
  const [focus, setFocus] = useState<boolean>(false)
  const handleChange = (event: SelectChangeEvent<typeof selectedLists>) => {
    const {
      target: { value },
    } = event
    setSelectedLists(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    )
  }

  return (
    <div>
      <FormControl sx={{ width: 200, m: 1 }} size='small'>
        <InputLabel id='multiple-checkbox-label'>Select Filter</InputLabel>
        <Select
          labelId='multiple-checkbox-label'
          id='multiple-checkbox'
          multiple
          value={focus ? selectedLists : []}
          onChange={handleChange}
          input={<OutlinedInput label='Select Filter' />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          onOpen={() => setFocus(true)}
          onClose={() => setFocus(false)}
        >
          {checkBoxLists.map((list) => (
            <MenuItem key={list?.name} value={list?.name}>
              <Checkbox checked={selectedLists.indexOf(list?.name) > -1} />
              <ListItemText primary={list?.name} sx={{ color: list?.color || '#000' }} color={list?.color} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default MultiSelectDropDown
