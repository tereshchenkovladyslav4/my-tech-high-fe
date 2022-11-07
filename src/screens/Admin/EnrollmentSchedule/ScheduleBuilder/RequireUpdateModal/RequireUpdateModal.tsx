import React, { useState } from 'react'
import { Box, Button, Modal, Typography } from '@mui/material'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { requireUpdateModalClasses } from './styles'
import { RequireUpdateModalProps } from './types'

const RequireUpdateModal: React.FC<RequireUpdateModalProps> = ({
  periodItems,
  handleCancelAction,
  handleRequireUpdates,
}) => {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box sx={requireUpdateModalClasses.container}>
        <Box sx={{ width: '100%', textAlign: 'left', mb: '70px' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: '700', lineHeight: '20px', mb: 3 }}>
            Require Updates
          </Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: '600', lineHeight: '20px', mb: 2 }}>
            Please select the Periods that need to be updated:
          </Typography>
          <MthCheckboxList
            checkboxLists={periodItems}
            haveSelectAll={false}
            values={selectedPeriods}
            setValues={(value) => {
              setSelectedPeriods(value)
            }}
          />
        </Box>
        <Box sx={requireUpdateModalClasses.btnGroup}>
          <Button sx={requireUpdateModalClasses.cancelBtn} onClick={() => handleCancelAction()}>
            Cancel
          </Button>
          <Button sx={requireUpdateModalClasses.reqireUpdateBtn} onClick={() => handleRequireUpdates(selectedPeriods)}>
            Require Updates
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default RequireUpdateModal
