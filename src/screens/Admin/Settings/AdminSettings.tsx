import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { Prompt } from 'react-router-dom'
import { CustomConfirmModal } from '../../../components/CustomConfirmModal/CustomConfirmModal'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../utils/constants'
import { Account } from './Account/Account'
import { Profile } from './Profile/Profile'
import { useStyles } from './styles'

const AdminSetting: React.FC = () => {
  const classes = useStyles
  const [value, setValue] = React.useState(0)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)
  const [showConfirmModalOpen, setShowConfirmModalOpen] = useState<boolean>(false)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (isFormChange) {
      setShowConfirmModalOpen(true)
    } else {
      setValue(newValue)
    }
  }

  const onChangeConfirmModal = (isOk: boolean) => {
    if (isFormChange) setShowConfirmModalOpen(false)
    if (isOk) {
      setValue(value === 0 ? 1 : 0)
      setIsFormChange(false)
    }
  }

  const tabTextColor = (tab: number) => (value === tab ? MTHBLUE : '')

  return (
    <Box display='flex' flexDirection='column' height={'100%'}>
      {showConfirmModalOpen && (
        <CustomConfirmModal
          header='Unsaved Changes'
          content='Are you sure you want to leave without saving changes?'
          handleConfirmModalChange={onChangeConfirmModal}
        />
      )}
      <Prompt
        when={isFormChange ? true : false}
        message={JSON.stringify({
          header: 'Unsaved Changes',
          content: 'Are you sure you want to leave without saving changes?',
        })}
      />
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        sx={classes.activeTab}
        TabIndicatorProps={{ style: { background: '#4145FF' } }}
      >
        <Tab label={<Subtitle color={tabTextColor(0)}>Profile</Subtitle>} sx={{ textTransform: 'none' }} />
        <Tab label={<Subtitle color={tabTextColor(1)}>Account</Subtitle>} sx={{ textTransform: 'none' }} />
      </Tabs>
      <Box paddingX={2} height={'100%'} paddingY={2}>
        {value === 0 ? (
          <Profile handleIsFormChange={setIsFormChange} />
        ) : (
          <Account handleIsFormChange={setIsFormChange} />
        )}
      </Box>
    </Box>
  )
}

export { AdminSetting as default }
