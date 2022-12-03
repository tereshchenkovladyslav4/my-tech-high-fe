import React, { useContext, useEffect, useState } from 'react'
import { Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { useEmailTemplateByNameAndRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ScheduleData } from '@mth/screens/Homeroom/Schedule/types'
import { extractContent } from '@mth/utils'
import { scheduleBuilderClass } from '../styles'
import { UpdatesRequiredPeriods } from './UpdatesRequiredPeroids'
import { UpdatesRequiredEmail } from './UpdatesRequriedEmail'

type UpdatesRequiredProps = {
  scheduleData: ScheduleData[]
  requireUpdatePeriods: string[]
  setScheduleData: (value: ScheduleData[]) => void
  handleCancelUpdates: () => void
  handleEmailSend: (from: string, subject: string, body: string) => void
  setRequireUpdatePeriods: (value: string[]) => void
}

const UpdatesRequired: React.FC<UpdatesRequiredProps> = ({
  scheduleData,
  requireUpdatePeriods,
  setScheduleData,
  handleCancelUpdates,
  handleEmailSend,
  setRequireUpdatePeriods,
}) => {
  const { me } = useContext(UserContext)
  const [standardResponseOptions, setStandardResponseOptions] = useState<CheckBoxListVM[]>([])
  const [emailBody, setEmailBody] = useState<string>('')
  const { from, body, subject, setFrom, setSubject, standardResponse } = useEmailTemplateByNameAndRegionId(
    me?.selectedRegionId || 0,
    'Updates Required',
  )

  useEffect(() => {
    if (body && scheduleData?.length && standardResponse) {
      const options = JSON.parse(standardResponse)
      let newBody = body
      scheduleData.map((schedule) => {
        if (schedule.standardResponseOptions) {
          newBody += `\n<p><strong>Period ${schedule.period}</strong></p>`
        }
        options?.map((option: { title: string; text: string }) => {
          if (schedule.standardResponseOptions && schedule.standardResponseOptions.split(',').includes(option.title)) {
            newBody += `<ul><li>${extractContent(option.text)}</li></ul>`
          }
        })
      })
      setStandardResponseOptions(
        options?.map((option: { title: string }) => ({
          label: option.title,
          value: option.title,
        })),
      )
      setEmailBody(newBody)
    }
  }, [scheduleData, body, standardResponse])
  return (
    <Card sx={{ ...scheduleBuilderClass.main, paddingLeft: '30px' }}>
      <Subtitle size='medium' textAlign='left' fontWeight='700'>
        Updates Required
      </Subtitle>
      <Box sx={{ width: '100%' }}>
        <Grid container justifyContent='start'>
          <Grid item xs={7} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <UpdatesRequiredEmail
              emailFrom={from}
              emailBody={emailBody}
              emailSubject={subject}
              setEmailFrom={setFrom}
              setEmailSubject={setSubject}
              setEmailBody={setEmailBody}
              handleCancelAction={handleCancelUpdates}
              handleSendAction={handleEmailSend}
            />
          </Grid>
          <Grid item xs={5}>
            <UpdatesRequiredPeriods
              standardResponseOptions={standardResponseOptions}
              scheduleData={scheduleData}
              requireUpdatePeriods={requireUpdatePeriods}
              setScheduleData={setScheduleData}
              setRequiredUpdatePeriods={setRequireUpdatePeriods}
            />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default UpdatesRequired
