import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Button, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { getEmailTemplateQuery } from '@mth/graphql/queries/email-template'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { updatesRequiredEmailClasses } from './styles'
import { ScheduleUpdatesRequiredEmailProps } from './types'

const ScheduleUpdatesRequiredEmail: React.FC<ScheduleUpdatesRequiredEmailProps> = ({
  handleCancelAction,
  handleSendAction,
}) => {
  const { me } = useContext(UserContext)
  const [emailSubject, setEmailSubject] = useState<string>('')
  const [emailFrom, setEmailFrom] = useState<string>('')
  const [emailBody, setEmailBody] = useState<string>('')

  const { data: emailTemplateData } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Updates Required',
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (emailTemplateData) {
      const { emailTemplateName } = emailTemplateData
      const { subject, from, body } = emailTemplateName
      setEmailSubject(subject)
      setEmailFrom(from)
      setEmailBody(body)
    }
  }, [emailTemplateData])
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

export default ScheduleUpdatesRequiredEmail
