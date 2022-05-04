import { Box, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { Subtitle } from '../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../utils/constants'
import { Account } from './Account/Account'
import { Profile } from './Profile/Profile'
import { useStyles } from './styles'
import { Prompt } from 'react-router-dom'
import CustomConfirmModal from '../../components/CustomConfirmModal/CustomConfirmModal'

export const Settings = () => {

  const classes = useStyles
  const [value, setValue] = React.useState(0)
  const [isFormChange, setIsFormChange] = useState<Boolean>(false)
  const [showConfirmModalOpen, setShowConfirmModalOpen] = useState<Boolean>(false)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if(isFormChange) {
      setShowConfirmModalOpen(true)
    } else {
      setValue(newValue)
    }
  }

  const onChangeConfirmModal = (val: boolean, isOk: boolean) => {console.log(val, isOk);
    if(isFormChange) setShowConfirmModalOpen(val)
    if(isOk) {
      setValue(value === 0 ? 1 : 0)
      setIsFormChange(false)
    }
  }
  
  const tabTextColor = (tab: number) => (value === tab ? MTHBLUE : '')

  return (
    <Box display='flex' flexDirection='column' height={'100%'}>
      {showConfirmModalOpen && (
        <CustomConfirmModal
          header="Unsaved Work" 
          content="Changes you made will not be saved"
          handleConfirmModalChange={onChangeConfirmModal}
        />
      )}
      <Prompt
        when={isFormChange ? true : false}
        message={JSON.stringify({
          header: "Unsaved Work",
          content: "Changes you made will not be saved",
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
        { value === 0
          ? <Profile handleIsFormChange={setIsFormChange}/>
          : <Account handleIsFormChange={setIsFormChange}/>
        }
      </Box>
    </Box>
  )
}
