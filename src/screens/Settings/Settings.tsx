import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { Prompt } from 'react-router-dom'
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, MthTitle } from '@mth/enums'
import { settingClasses } from '@mth/screens/Settings/styles'
import { Account } from './Account/Account'
import { Profile } from './Profile/Profile'

export const Settings: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)
  const [showConfirmModalOpen, setShowConfirmModalOpen] = useState<boolean>(false)

  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    if (isFormChange) {
      setShowConfirmModalOpen(true)
    } else {
      setSelectedTab(newValue)
    }
  }

  const onChangeConfirmModal = (isOk: boolean) => {
    if (isFormChange) setShowConfirmModalOpen(false)
    if (isOk) {
      setSelectedTab(selectedTab === 0 ? 1 : 0)
      setIsFormChange(false)
    }
  }

  const tabTextColor = (tab: number) => (selectedTab === tab ? MthColor.MTHBLUE : '')

  return (
    <Box display='flex' flexDirection='column' height={'100%'}>
      {showConfirmModalOpen && (
        <CustomConfirmModal
          header={MthTitle.UNSAVED_TITLE}
          content={MthTitle.UNSAVED_DESCRIPTION}
          handleConfirmModalChange={onChangeConfirmModal}
        />
      )}
      <Prompt
        when={isFormChange}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
      <Tabs
        value={selectedTab}
        onChange={onChangeTab}
        centered
        sx={settingClasses.activeTab}
        TabIndicatorProps={{ style: { background: '#4145FF' } }}
      >
        <Tab label={<Subtitle color={tabTextColor(0)}>Profile</Subtitle>} sx={{ textTransform: 'none' }} />
        <Tab label={<Subtitle color={tabTextColor(1)}>Account</Subtitle>} sx={{ textTransform: 'none' }} />
      </Tabs>
      <Box paddingX={2} height={'100%'} paddingY={2}>
        {selectedTab === 0 ? (
          <Profile handleIsFormChange={setIsFormChange} />
        ) : (
          <Account handleIsFormChange={setIsFormChange} />
        )}
      </Box>
    </Box>
  )
}
