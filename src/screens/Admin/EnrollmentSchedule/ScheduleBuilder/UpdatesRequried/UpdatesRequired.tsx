import React, { useEffect, useState } from 'react'
import { Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { useFlag } from '@unleash/proxy-client-react'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { EPIC_276_STORY_1284 } from '@mth/constants'
import { EmailTemplateEnum, MthRoute } from '@mth/enums'
import { useEmailTemplateByNameAndSchoolYearId, useStudentInfo } from '@mth/hooks'
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
  const [standardResponseOptions, setStandardResponseOptions] = useState<CheckBoxListVM[]>([])
  const [emailBody, setEmailBody] = useState<string>('')
  const [isEditedByExternal, setIsEditedByExternal] = useState<boolean>(false)
  const { studentInfo } = useStudentInfo(studentId)
  const { from, body, subject, setFrom, setSubject, standardResponse } = useEmailTemplateByNameAndSchoolYearId(
    EmailTemplateEnum.UPDATES_REQUIRED,
    studentInfo?.current_school_year_status?.school_year_id || 0,
    studentInfo?.current_school_year_status?.midyear_application,
  )

  const epic1396story1568 = useFlag(EPIC_276_STORY_1284)

  useEffect(() => {
    if (body && scheduleData?.length && standardResponse) {
      const options = JSON.parse(standardResponse)
      let newBody = body
      let periodTxt = ''

      if (epic1396story1568) {
        scheduleData
          ?.filter((item) => requireUpdatePeriods?.includes(`${item?.Period?.id}`))
          .map((schedule) => {
            if (schedule.standardResponseOptions) {
              periodTxt += `\n<p><strong>Period ${schedule.period}</strong></p><ul>`
            }
            options?.map((option: { title: string; text: string }, index: number) => {
              if (
                schedule.standardResponseOptions &&
                schedule.standardResponseOptions.split(',').includes(`${index}_${option.title.replaceAll(',', '-')}`)
              ) {
                const txt = extractContent(option.text)
                periodTxt += `<li>${txt.substring(0, txt.length - 1)}</li>`
              }
            })
            periodTxt += '</ul>'
          })

        let scheduleLink = window.location.href
        scheduleLink = scheduleLink.substring(0, scheduleLink.indexOf('/', scheduleLink.indexOf('//') + 2))
        scheduleLink += `${MthRoute.HOMEROOM}${MthRoute.SUBMIT_SCHEDULE}/${studentInfo?.student_id}`
        newBody = newBody
          .replace(/\[LINK\]/g, `<a href="${scheduleLink}">${scheduleLink}</a>`)
          .replace(/\[INSTRUCTIONS\]/g, periodTxt)
      } else {
        scheduleData
          ?.filter((item) => requireUpdatePeriods?.includes(`${item?.Period?.id}`))
          .map((schedule) => {
            if (schedule.standardResponseOptions) {
              newBody += `\n<p><strong>Period ${schedule.period}</strong></p>`
            }
            options?.map((option: { title: string; text: string }, index: number) => {
              if (
                schedule.standardResponseOptions &&
                schedule.standardResponseOptions.split(',').includes(`${index}_${option.title.replaceAll(',', '-')}`)
              ) {
                newBody += `<ul><li>${extractContent(option.text)}</li></ul>`
              }
            })
          })
      }

      setStandardResponseOptions(
        options?.map((option: { title: string }, index: number) => ({
          label: option.title,
          value: `${index}_${option.title.replaceAll(',', '-')}`,
        })),
      )
      setEmailBody(newBody)
      setIsEditedByExternal(!isEditedByExternal)
    }
  }, [scheduleData, body, standardResponse, requireUpdatePeriods, studentInfo])

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
