import React, { useContext, useEffect, useState } from 'react'
import { Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { EmailTemplateEnum } from '@mth/enums'
import { useEmailTemplateByNameAndRegionId, useStudentInfo } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ScheduleData } from '@mth/screens/Homeroom/Schedule/types'
import { extractContent, replaceInsertsToValue } from '@mth/utils'
import { scheduleBuilderClass } from '../styles'
import { UpdatesRequiredPeriods } from './UpdatesRequiredPeroids'
import { UpdatesRequiredEmail } from './UpdatesRequriedEmail'

type UpdatesRequiredProps = {
  scheduleData: ScheduleData[]
  requireUpdatePeriods: string[]
  studentId: number
  setScheduleData: (value: ScheduleData[]) => void
  handleCancelUpdates: () => void
  handleEmailSend: (from: string, subject: string, body: string) => void
  setRequireUpdatePeriods: (value: string[]) => void
}

const UpdatesRequired: React.FC<UpdatesRequiredProps> = ({
  scheduleData,
  requireUpdatePeriods,
  studentId,
  setScheduleData,
  handleCancelUpdates,
  handleEmailSend,
  setRequireUpdatePeriods,
}) => {
  const { me } = useContext(UserContext)
  const [standardResponseOptions, setStandardResponseOptions] = useState<CheckBoxListVM[]>([])
  const [emailBody, setEmailBody] = useState<string>('')
  const [isEditedByExternal, setIsEditedByExternal] = useState<boolean>(false)
  const { from, body, subject, setFrom, setSubject, standardResponse } = useEmailTemplateByNameAndRegionId(
    me?.selectedRegionId || 0,
    EmailTemplateEnum.UPDATES_REQUIRED,
  )
  const { studentInfo } = useStudentInfo(studentId)

  useEffect(() => {
    if (body && scheduleData?.length && standardResponse) {
      const options = JSON.parse(standardResponse)
      let newBody = body
      scheduleData
        ?.filter((item) => requireUpdatePeriods?.includes(`${item?.Period?.id}`))
        .map((schedule) => {
          if (schedule.standardResponseOptions) {
            newBody += `\n<p><strong>Period ${schedule.period}</strong></p>`
          }
          options?.map((option: { title: string; text: string }, index: number) => {
            if (
              schedule.standardResponseOptions &&
              schedule.standardResponseOptions.split(',').includes(`${index}_${option.title}`)
            ) {
              newBody += `<ul><li>${extractContent(option.text)}</li></ul>`
            }
          })
        })
      setStandardResponseOptions(
        options?.map((option: { title: string }, index: number) => ({
          label: option.title,
          value: `${index}_${option.title}`,
        })),
      )
      setEmailBody(newBody)
      setIsEditedByExternal(!isEditedByExternal)
    }
  }, [scheduleData, body, standardResponse, requireUpdatePeriods])
  return (
    <Card sx={{ ...scheduleBuilderClass.main, paddingLeft: '30px' }}>
      <Subtitle size='medium' textAlign='left' fontWeight='700'>
        Updates Required
      </Subtitle>
      <Box sx={{ width: '100%' }}>
        <Grid container justifyContent='start'>
          <Grid item xs={7} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <UpdatesRequiredEmail
              emailFrom={replaceInsertsToValue(studentInfo, from)}
              emailBody={replaceInsertsToValue(studentInfo, emailBody)}
              emailSubject={replaceInsertsToValue(studentInfo, subject)}
              isEditedByExternal={isEditedByExternal}
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
