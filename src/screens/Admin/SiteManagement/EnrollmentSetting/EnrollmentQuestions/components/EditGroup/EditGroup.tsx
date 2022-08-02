import React, { FunctionComponent, useContext, useState } from 'react'
import { Box, Button, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { SYSTEM_07 } from '../../../../../../../utils/constants'
import { TabContext } from '../../TabContextProvider'
import { EnrollmentQuestionTab } from '../../types'

export const EditGroup: FunctionComponent<{ onClose: () => void; group?: string }> = ({ onClose, group }) => {
  const tabName = useContext(TabContext)
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const [groupName, setGroupName] = useState(group || '')
  const [error, setError] = useState('')
  function onSave() {
    if (groupName === '') {
      setError('Group name is required')
      return
    }
    const doubleGroup = values.filter((v) => v.tab_name === tabName)[0].groups.filter((g) => g.group_name === groupName)
    if (doubleGroup.length > 0) {
      setError('Group name is already exist')
      return
    }
    const currentTabData = values.filter((v) => v.tab_name === tabName)[0]
    const updatedGroups = currentTabData.groups.map((v) =>
      v.group_name === group ? { ...v, group_name: groupName } : v,
    )

    const updatedTab = { ...currentTabData, groups: updatedGroups }
    setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
    onClose()
  }
  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          bgcolor: '#fff',
          borderRadius: 8,
          p: 4,
        }}
      >
        <TextField
          size='small'
          sx={{
            minWidth: '100%',
            [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: SYSTEM_07,
              },
          }}
          label='Group Name'
          variant='outlined'
          value={groupName}
          onChange={(v) => setGroupName(v.currentTarget.value)}
          focused
        />
        {error && <Typography color='red'>{error}</Typography>}
        <Box
          sx={{
            display: 'flex',
            height: '40px',
            width: '100%',
            marginTop: '20px',
            justifyContent: 'center',
          }}
        >
          <Button sx={styles.cancelButton} onClick={() => onClose()}>
            Cancel
          </Button>
          <Button sx={styles.actionButtons} onClick={() => onSave()}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

const styles = {
  actionButtons: {
    borderRadius: 4,

    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    fontWeight: 'bold',
    padding: '11px 60px',
    color: 'white',
  },
  cancelButton: {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #D23C33 0%, rgba(62, 39, 131, 0) 100%) #D23C33',
    fontWeight: 'bold',
    mr: 2,
    color: 'white',
    padding: '11px 60px',
  },
}
