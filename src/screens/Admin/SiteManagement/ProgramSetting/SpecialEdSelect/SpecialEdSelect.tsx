import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
  OutlinedInput,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  Tooltip
} from '@mui/material'
import { DropDown } from '../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from '../../styles'
import { MTHBLUE } from '../../../../../utils/constants'
import CustomConfirmModal from '../../../../../components/CustomConfirmModal/CustomConfirmModal';

type SpecialEdSelectProps = {
  specialEd: boolean
  setSpecialEd: (value: boolean) => void
  specialEdOptions: Array<any>
  setSpecialEdOptions: (value: Array<any>) => void
  setIsChanged: (value: boolean) => void
  isChanged: any
}

export default function SpecialEdSelect({ specialEd, setSpecialEd, specialEdOptions, setSpecialEdOptions, setIsChanged, isChanged }: SpecialEdSelectProps) {
  const classes = useStyles
  const [open, setOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<string>('');
  const [tempOptions, setTempOptions] = useState(specialEdOptions);  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(0);
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
    var optionString = '';
    specialEdOptions.map((option) => {
      if (option.option_value != '')
        optionString += option.option_value + ', '
    });
    optionString = optionString.slice(0, -2);
    setOptions(optionString)
  }, [specialEdOptions]);

  const handleChange = (value: string) => {
    setSpecialEd(value == 'true' ? true : false)    
    setSpecialEdOptions([]);      
    setIsChanged({
      ...isChanged,
      specialEd: true
    })
  }

  const handleClickOpen = () => {
    if (specialEdOptions.length == 0)
      setTempOptions([
        { 
          option_value: 'None'
        }
      ]);
    else
      setTempOptions(specialEdOptions);
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setSpecialEdOptions(tempOptions);
    setOpen(false)
  }

  const handleChangeOption = (value, i) => {    
		const temp = tempOptions.slice()
		temp[i]['option_value'] = value	
		setTempOptions(temp)
	}

  const handleDeleteOption = (i) => {
    setDeletingIndex(i);
    setShowDeleteDialog(true);
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
          option_value: ''
        }
      ]
    ])
  }



  return (
    <>
    <DropDown
      dropDownItems={items}
      placeholder={'Select status'}
      defaultValue={specialEd ? 'true' : 'false'}
      sx={{ width: '160px', marginLeft: '25px' }}
      borderNone={false}
      setParentValue={handleChange}
    />
    {specialEd &&
    <Box sx={classes.gradeBox}>
      <Stack direction='row' sx={{ ml: 1.5, cursor: 'pointer' }} alignItems='center' onClick={handleClickOpen}>
        <Subtitle size={12} color={MTHBLUE} fontWeight='500'>
          {options != '' ? options : 'Select'}
        </Subtitle>
      </Stack>
    </Box>
    }
    <Dialog open={open} onClose={handleClose} sx={classes.gradesDialog}>
        <DialogTitle sx={classes.dialogTitle}>{'Type of Speical Education Services'}</DialogTitle>
        <Box sx={{padding: '26px'}}>
         
          {tempOptions.map((options, i) => (
            <Box>
              {options.option_value == 'None' &&
                <Box sx={{width: '100%', textAlign: 'left', marginBottom: '16px' }}>
                  {'None'}
                </Box>
              }
              {options.option_value != 'None' &&
                <Box sx={{width: '100%', marginBottom:'16px' }} display={'flex'} justifyContent={'space-between'}>
                  <OutlinedInput
                      sx={{ flex: 1 }}
                      size='small'
                      fullWidth
                      placeholder=''
                      value={options.option_value}
                      onChange={(e) => handleChangeOption(e.target.value, i)}
                    />
                  
                  <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
                    className='delete-row'
                    onClick={(event) => handleDeleteOption(i)}
                    sx={{
                      borderRadius: 1,
                      cursor: 'pointer',       
                      marginLeft: '8px'             
                    }}
                  >
                    <Tooltip title="Delete" arrow>
                      <svg width='14' height='18' viewBox='0 0 14 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                              d='M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z'
                              fill='#323232'
                            />
                      </svg>
                    </Tooltip>
                  </Box>              
                </Box>
              }
            </Box>
          ))}
          <Box sx={{width: '100%', textAlign:'left', marginTop: '50px', cursor:'pointer'}} 
            onClick={handleAddOption}
          >
            <Subtitle size={12} color={MTHBLUE} fontWeight='500'>
              + Add Option
            </Subtitle>
          </Box>
        </Box>
        <DialogActions sx={classes.dialogAction}>
          <Button variant='contained' sx={classes.cancelButton} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' sx={classes.submitButton} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {showDeleteDialog && (
        <CustomConfirmModal
          header="Delete Services" 
          content="Deleting this option will remove it from any student who currently has this as a status."
          confirmBtnTitle = 'Delete'
          handleConfirmModalChange={(val: boolean, isOk: boolean) => {
            setShowDeleteDialog(false);
            if(isOk) {
              deleteSpecialOption();
            }
          }}
        />
      )}
    </>
  )
}
