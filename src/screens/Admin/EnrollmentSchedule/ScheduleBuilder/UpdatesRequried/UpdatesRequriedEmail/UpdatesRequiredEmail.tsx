import React from 'react'
import { Button, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { updatesRequiredEmailClasses } from './styles'
import { UpdatesRequiredEmailProps } from './types'

const UpdatesRequiredEmail: React.FC<UpdatesRequiredEmailProps> = ({
  emailFrom,
  emailSubject,
  emailBody,
  isEditedByExternal,
  setEmailFrom,
  setEmailSubject,
  setEmailBody,
  handleCancelAction,
  handleSendAction,
}) => {
  return (
    <Box sx={{ marginTop: 3 }}>
      <OutlinedInput
        value={emailFrom}
        size='small'
        fullWidth
        placeholder='From: email in template'
        onChange={(e) => setEmailFrom(e.target.value)}
      />
      <OutlinedInput
        value={emailSubject}
        size='small'
        fullWidth
        placeholder='Subject'
        onChange={(e) => setEmailSubject(e.target.value)}
      />
      <MthBulletEditor
        value={emailBody}
        isEditedByExternal={isEditedByExternal}
        setValue={(value) => {
          setEmailBody(value)
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 5 }}>
        <Button
          variant='contained'
          color='secondary'
          disableElevation
          sx={updatesRequiredEmailClasses.cancelButton}
          onClick={() => handleCancelAction()}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          disableElevation
          sx={updatesRequiredEmailClasses.submitButton}
          onClick={() => handleSendAction(emailFrom, emailSubject, emailBody)}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default UpdatesRequiredEmail
