import React, { useState, useEffect } from 'react'
import { Box, Button, OutlinedInput, Stack, Dialog, DialogTitle, DialogActions, Tooltip } from '@mui/material'
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { siteManagementClassess } from '../../styles'
import { ProgramSettingChanged } from '../types'

type SpecialEdSelectProps = {
  specialEd: boolean
  setSpecialEd: (value: boolean) => void
  specialEdOptions: Array<{ option_value: string }>
  setSpecialEdOptions: (value: Array<{ option_value: string }>) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

export const SpecialEdSelect: React.FC<SpecialEdSelectProps> = ({
  specialEd,
  setSpecialEd,
  specialEdOptions,
  setSpecialEdOptions,
  setIsChanged,
  isChanged,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<string>('')
  const [tempOptions, setTempOptions] = useState(specialEdOptions)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingIndex, setDeletingIndex] = useState(0)
  const items = [
    {
      label: 'Enabled',
      value: 'true',
    },
    {
      label: 'Disabled',
      value: 'false',
    },
  ]

  useEffect(() => {
    let optionString = ''
    specialEdOptions?.map((option) => {
      if (option.option_value != '') optionString += option.option_value + ', '
    })
    optionString = optionString.slice(0, -2)
    setOptions(optionString)
  }, [specialEdOptions])

  const handleChange = (value: string) => {
    setSpecialEd(value == 'true' ? true : false)
    setSpecialEdOptions([])
    if (isChanged)
      setIsChanged({
        ...isChanged,
        specialEd: true,
      })
  }

  const handleClickOpen = () => {
    if (specialEdOptions?.length == 0)
      setTempOptions([
        {
          option_value: 'None',
        },
      ])
    else setTempOptions(specialEdOptions)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setSpecialEdOptions(tempOptions)
    setOpen(false)
  }

  const handleChangeOption = (value: string, i: number) => {
    const temp = tempOptions.slice()
    temp[i]['option_value'] = value
    setTempOptions(temp)
  }

  const handleDeleteOption = (i: number) => {
    setDeletingIndex(i)
    setShowDeleteDialog(true)
  }

  const deleteSpecialOption = () => {
    const temp = [...tempOptions]
    temp.splice(deletingIndex, 1)
    setTempOptions(temp)
  }

  const handleAddOption = () => {
    setTempOptions([
      ...tempOptions,
      ...[
        {
          option_value: '',
        },
      ],
    ])
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '25px' }}>
      <DropDown
        dropDownItems={items}
        placeholder={'Select status'}
        defaultValue={specialEd ? 'true' : 'false'}
        sx={{ width: '160px', zIndex: 1 }}
        borderNone={false}
        setParentValue={handleChange}
      />
      {specialEd && (
        <Box sx={siteManagementClassess.gradeBox}>
          <Stack direction='row' sx={{ ml: 1.5, cursor: 'pointer' }} alignItems='center' onClick={handleClickOpen}>
            <Subtitle size={12} color={MthColor.MTHBLUE} fontWeight='500'>
              {options != '' ? options : 'Select'}
            </Subtitle>
          </Stack>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose} sx={siteManagementClassess.gradesDialog}>
        <DialogTitle sx={siteManagementClassess.dialogTitle}>{'Type of Speical Education Services'}</DialogTitle>
        <Box sx={{ padding: '26px' }}>
          {tempOptions?.map((options, i) => (
            <Box key={i}>
              {options.option_value == 'None' && (
                <Box sx={{ width: '100%', textAlign: 'left', marginBottom: '16px' }}>{'None'}</Box>
              )}
              {options.option_value != 'None' && (
                <Box sx={{ width: '100%', marginBottom: '16px' }} display={'flex'} justifyContent={'space-between'}>
                  <OutlinedInput
                    sx={{ flex: 1 }}
                    size='small'
                    fullWidth
                    placeholder=''
                    value={options.option_value}
                    onChange={(e) => handleChangeOption(e.target.value, i)}
                  />

                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    className='delete-row'
                    onClick={() => handleDeleteOption(i)}
                    sx={{
                      borderRadius: 1,
                      cursor: 'pointer',
                      marginLeft: '8px',
                    }}
                  >
                    <Tooltip title='Delete' arrow>
                      <svg width='14' height='18' viewBox='0 0 14 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z'
                          fill='#323232'
                        />
                      </svg>
                    </Tooltip>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
          <Box
            sx={{ width: '100%', textAlign: 'left', marginTop: '50px', cursor: 'pointer' }}
            onClick={handleAddOption}
          >
            <Subtitle size={12} color={MthColor.MTHBLUE} fontWeight='500'>
              + Add Option
            </Subtitle>
          </Box>
        </Box>
        <DialogActions sx={siteManagementClassess.dialogAction}>
          <Button variant='contained' sx={siteManagementClassess.cancelButton} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' sx={siteManagementClassess.submitButton} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {showDeleteDialog && (
        <CustomConfirmModal
          header='Delete Services'
          content='Deleting this option will remove it from any student who currently has this as a status.'
          confirmBtnTitle='Delete'
          handleConfirmModalChange={(isOk: boolean) => {
            setShowDeleteDialog(false)
            if (isOk) {
              deleteSpecialOption()
            }
          }}
        />
      )}
    </Box>
  )
}
