import React, { useState, useEffect } from 'react'
import { Box, TextField, Typography, Stack, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { DropDownItem } from '../../../../../components/DropDown/types'
import { RED } from '../../../../../utils/constants'
import { usStates } from '../../../../../utils/states'

type StateSelectProps = {
  stateName: string
  newStateName: string
  regions: DropDownItem[]
  stateInvalid: boolean
  setNewStateName: (value: string) => void
  setIsChanged: (value: boolean) => void
  setIsInvalidStateName: (value: boolean) => void
  setStateInvalid: (value: boolean) => void
}

export default function StateSelect({
  stateName,
  newStateName,
  regions,
  stateInvalid,
  setNewStateName,
  setIsChanged,
  setIsInvalidStateName,
  setStateInvalid,
}: StateSelectProps) {
  const [stateInvalidMessage, setStateInvalidMessage] = useState<string>('')
  const [selectedRegionName, setSelectedRegionName] = useState<string>('')
  const [showNewRegionName, setShowNewRegionName] = useState<boolean>(false)
  const [allStates, setAllStates] = useState<DropDownItem[]>(usStates)

  useEffect(() => {
    if (stateName) {
      const usState = usStates.find((state) => state.label == stateName)
      if (usState) {
        setAllStates(usStates)
        setSelectedRegionName(usState.value)
        setShowNewRegionName(false)
        setNewStateName('')
        setStateInvalid(false)
      } else {
        setAllStates(
          usStates
            .concat({
              label: stateName,
              value: stateName,
            })
            .sort(function (a, b) {
              if (a.label < b.label) {
                return -1
              }
              if (a.label > b.label) {
                return 1
              }
              return 0
            }),
        )
        setSelectedRegionName(stateName)
        setShowNewRegionName(false)
        setNewStateName('')
        setStateInvalid(false)
      }
    }
  }, [stateName])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewStateName(event?.target?.value)
    if (event?.target?.value?.toLocaleLowerCase() == 'other') {
      setStateInvalidMessage('Other is not available. Please enter a different name.')
      setStateInvalid(true)
      setIsInvalidStateName(true)
    } else if (event?.target?.value != '') {
      const region = regions?.find(
        (region) => region?.label?.toString().toLocaleLowerCase() == event?.target?.value?.toLocaleLowerCase(),
      )
      if (region) {
        setStateInvalidMessage('This state is already being used')
        setStateInvalid(true)
        setIsInvalidStateName(true)
      } else {
        setStateInvalid(false)
        setNewStateName(event.target.value)
        setIsChanged(true)
        setIsInvalidStateName(false)
      }
    } else {
      setStateInvalidMessage('Please enter a new name.')
      setStateInvalid(true)
      setIsInvalidStateName(true)
    }
  }

  const handleChangeValue = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setSelectedRegionName(event.target.value)
      if (event.target.value == 'other') {
        setShowNewRegionName(true)
        setStateInvalid(false)
        if (newStateName != '') {
          setStateInvalid(false)
          setNewStateName(newStateName)
          setIsChanged(true)
          setIsInvalidStateName(false)
        } else {
          setStateInvalidMessage('Please enter a new name.')
          setIsInvalidStateName(true)
        }
      } else {
        setShowNewRegionName(false)
        const selectedRegionFullName = usStates.find((state) => state.value == event.target.value)?.label
        const region = regions?.find((region) => region?.label == selectedRegionFullName)
        if (selectedRegionFullName != stateName && region) {
          setStateInvalidMessage('This state is already being used')
          setStateInvalid(true)
          setIsInvalidStateName(true)
        } else {
          setStateInvalid(false)
          setNewStateName(selectedRegionFullName)
          setIsChanged(true)
          setIsInvalidStateName(false)
        }
      }
    }
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        State
      </Subtitle>
      <Typography>|</Typography>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, minWidth: '600px' },
        }}
        noValidate
        autoComplete='off'
      >
        <Box sx={{ display: 'flex', justifyContent: 'start' }}>
          <FormControl variant='standard' sx={{ m: 1, width: 200, display: 'flex' }}>
            <Select
              labelId='demo-simple-select-standard-label'
              id='demo-simple-select-standard'
              value={selectedRegionName}
              onChange={handleChangeValue}
              label='Program'
            >
              <MenuItem key={0} value={''}>
                {''}
              </MenuItem>
              {allStates.map((region, index) => (
                <MenuItem key={index + 1} value={region.value.toString()}>
                  {region.label}
                </MenuItem>
              ))}
              <MenuItem key={allStates.length + 1} value={'other'}>
                {'Other'}
              </MenuItem>
            </Select>
          </FormControl>
          {showNewRegionName && (
            <TextField id='outlined-name' sx={{ width: '200px' }} value={newStateName} onChange={handleChange} />
          )}
        </Box>
        {stateInvalid && (
          <Subtitle size='small' textAlign='left' color={RED} fontWeight='700'>
            {stateInvalidMessage}
          </Subtitle>
        )}
      </Box>
    </Stack>
  )
}
