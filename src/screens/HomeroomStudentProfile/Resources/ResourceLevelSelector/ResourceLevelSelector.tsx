import React, { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogActions } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Resource } from '@mth/screens/HomeroomStudentProfile/Resources/types'
import { resourceLevelsClasses } from './styles'

export interface ResourceLevelSelectorProps {
  resource: Resource
  handleCancel: () => void
  handleSelect: (resourceLevelId: number) => void
}

export const ResourceLevelSelector: React.FC<ResourceLevelSelectorProps> = ({
  resource,
  handleCancel,
  handleSelect,
}) => {
  const [resourceLevelId, setResourceLevelId] = useState<number | undefined>(undefined)
  const [showError, setShowError] = useState<boolean>(false)
  const resourceLevelOptions = resource?.ResourceLevels.map((item) => {
    return {
      value: item.resource_level_id,
      label: item.name,
    }
  })
  const handleSave = () => {
    if (!resourceLevelId) {
      setShowError(true)
      return
    }
    handleSelect(resourceLevelId)
  }

  return (
    <Dialog open={true} onClose={handleCancel}>
      <Box sx={resourceLevelsClasses.dialog}>
        <DialogTitle sx={resourceLevelsClasses.dialogTitle}>Please specify a selection for this Resource</DialogTitle>
        <Box sx={{ width: '100%', maxWidth: '210px', textAlign: 'left', mt: '40px', mb: '70px' }}>
          <Subtitle sx={resourceLevelsClasses.formError}>{showError && !resourceLevelId && 'Required'}</Subtitle>
          <DropDown
            dropDownItems={resourceLevelOptions}
            placeholder='Select'
            setParentValue={(value) => {
              setResourceLevelId(+value)
            }}
            size='small'
            sx={{ m: 0 }}
            defaultValue={resourceLevelId}
            error={{ error: showError && !resourceLevelId, errorMsg: '' }}
          />
        </Box>
        <DialogActions sx={resourceLevelsClasses.dialogAction}>
          <Button variant='contained' sx={resourceLevelsClasses.cancelButton} onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='contained' sx={resourceLevelsClasses.submitButton} onClick={() => handleSave()}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default ResourceLevelSelector
