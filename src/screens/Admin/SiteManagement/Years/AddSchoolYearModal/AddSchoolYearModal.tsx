import React, { useState, useEffect } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogActions } from '@mui/material'
import { useStyles } from '../../styles'
import { DropDownItem } from '../../components/DropDown/types'
import { DropDown } from '../../components/DropDown/DropDown'

type AddSchoolYearModalProps = {
  addSchoolYears: DropDownItem[]
  addSchoolYearDialogOpen: boolean
  handleParentClose: () => void
  handleParentSave: (value: string) => void
}

export default function AddSchoolYearModal({
  addSchoolYears,
  addSchoolYearDialogOpen,
  handleParentClose,
  handleParentSave,
}: AddSchoolYearModalProps) {
  const classes = useStyles
  const [open, setOpen] = useState<boolean>(false)
  const [selectedSchoolYearId, setSelectedSchoolYearId] = useState<string>('none')

  const handleClose = () => {
    setOpen(false)
    handleParentClose()
    setSelectedSchoolYearId('none')
  }

  const handleSave = () => {
    if (selectedSchoolYearId) {
      setOpen(false)
      handleParentSave(selectedSchoolYearId)
      setSelectedSchoolYearId('none')
    }
  }

  useEffect(() => {
    if (addSchoolYearDialogOpen) {
      setOpen(true)
    }
  }, [addSchoolYearDialogOpen])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        marginX: 'auto',
        paddingY: '10px',
        borderRadius: 10,
        textAlign: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          marginTop: '10px',
          textAlign: 'center',
        }}
      >
        {'New School Year'}
      </DialogTitle>
      <Box sx={{ minWidth: '400px', marginBottom: 5, paddingX: 10 }}>
        <DropDown
          labelTop={true}
          dropDownItems={addSchoolYears}
          defaultValue={'none'}
          placeholder={'Clone from'}
          setParentValue={(val) => {
            setSelectedSchoolYearId(val)
          }}
        />
      </Box>
      <DialogActions
        sx={{
          justifyContent: 'center',
          marginBottom: 2,
        }}
      >
        <Button variant='contained' sx={classes.cancelButton} onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' sx={classes.submitButton} onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
