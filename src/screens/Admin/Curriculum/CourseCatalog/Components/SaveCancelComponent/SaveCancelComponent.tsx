import React from 'react'
import { Box, Button } from '@mui/material'
import { saveCancelClasses } from './styles'

type SaveCancelComponentProps = {
  isSubmitted: boolean
  handleCancel: () => void
}

const SaveCancelComponent: React.FC<SaveCancelComponentProps> = ({ isSubmitted, handleCancel }) => {
  return (
    <Box sx={saveCancelClasses.align}>
      <Button sx={saveCancelClasses.cancelBtn} onClick={() => handleCancel()}>
        Cancel
      </Button>
      <Button sx={saveCancelClasses.saveBtn} type='submit' disabled={isSubmitted}>
        Save
      </Button>
    </Box>
  )
}

export default SaveCancelComponent
