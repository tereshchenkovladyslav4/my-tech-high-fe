import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Alert } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { EmailModal } from '@mth/components/EmailModal/EmailModal'
import { StandardResponseOption } from '@mth/components/EmailModal/StandardReponses/types'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { sendEmailMutation } from '../../services'
import { studentContext } from '../providers'
import { EnrollmentPacketFormType } from '../types'
import EnrollmentWarnSaveModal from './ConfirmSaveModal'

type PacketConfirmModalsProps = {
  packet: unknown
  refetch: () => void
  submitForm: () => void
}
export const PacketConfirmModals: React.FC<PacketConfirmModalsProps> = ({ packet, refetch, submitForm }) => {
  const student = useContext(studentContext)
  const { me } = useContext(UserContext)
  const { watch, setValue } = useFormContext<EnrollmentPacketFormType>()
  const [emailTemplate, setEmailTemplate] = useState(null)
  const [sendPacketEmail] = useMutation(sendEmailMutation)
  const [emailFrom, setEmailFrom] = useState('')

  const [
    notes,
    showMissingInfoModal,
    showAgeIssueModal,
    showSaveWarnModal,
    missingInfoAlert,
    saveAlert,
    preSaveStatus,
  ] = watch([
    'notes',
    'showMissingInfoModal',
    'showAgeIssueModal',
    'showSaveWarnModal',
    'missingInfoAlert',
    'saveAlert',
    'preSaveStatus',
  ])

  function onSubmit(status?: string) {
    setValue('status', status || preSaveStatus)
    submitForm()
  }

  const setEmailBodyInfo = (body: string) => {
    const yearbegin = new Date(student.applications[0].school_year.date_begin).getFullYear().toString()
    const yearend = new Date(student.applications[0].school_year.date_end).getFullYear().toString()

    const yearText = student?.applications[0].midyear_application
      ? `${yearbegin}-${yearend.substring(2, 4)}` + ' Mid-year'
      : `${yearbegin}-${yearend.substring(2, 4)}`

    let url = window.location.href
    url = url.substring(0, url.indexOf('/', url.indexOf('//') + 2))
    const garde_level =
      student.grade_levels?.[0]?.grade_level.toLowerCase() === 'k'
        ? 'Kindergarten'
        : student.grade_levels?.[0]?.grade_level
    return body
      .toString()
      .replace(/\[STUDENT_ID\]/g, student.student_id + '')
      .replace(/\[FILES\]/g, packet.missing_files)
      .replace(
        /\[LINK\]/g,
        `<a href="${url}/homeroom/enrollment/${student.student_id}">${url}/homeroom/enrollment/${student.student_id}</a>`,
      ) //adding host detail from backend
      .replace(/\[STUDENT\]/g, student.person.first_name)
      .replace(/\[PARENT\]/g, student.parent.person.first_name)
      .replace(/\[STUDENT_GRADE_LEVEL\]/g, garde_level || ' ')
      .replace(/\[YEAR\]/g, yearText)
      .replace(/\[APPLICATION_YEAR\]/g, yearText)
  }

  const handleEmailSend = (
    subject: string,
    body: string,
    options: StandardResponseOption,
    emailBody = '',
    keyText = '',
  ) => {
    try {
      const bodyData = setEmailBodyInfo(body)
      sendPacketEmail({
        variables: {
          emailInput: {
            content: bodyData,
            email: student?.parent.person.email,
            subject: subject,
            recipients: null,
            from:
              emailFrom !== emailTemplate?.from
                ? emailFrom
                : emailTemplate && emailTemplate?.from
                ? emailTemplate?.from
                : null,
            bcc: emailTemplate && emailTemplate?.bcc ? emailTemplate?.bcc : null,
            template_name: options.type === 'AGE_ISSUE' ? 'Age Issue' : 'Missing Information',
            region_id: me?.selectedRegionId,
          },
        },
      })
      refetch()
      setValue('notes', constructPacketNotes(notes || '', options, options.type, body, emailBody, keyText))
      if (options.type === 'AGE_ISSUE') {
        setValue('showAgeIssueModal', false)
        onSubmit()
        setValue('age_issue', true)
      } else if (options.type === 'MISSING_INFO') {
        setValue('showMissingInfoModal', false)
        //setValue('missingInfoAlert', true)
        //setTimeout(() => setValue('missingInfoAlert', false), 5000)
        setValue('preSaveStatus', 'Missing Info')
        setValue(
          'missing_files',
          // options.values.filter((v) => v.checked).map((v) => v.abbr),
          options.values.map((v) => v.title),
        )
        onSubmit('Missing Info')
      }
    } catch (e) {
      console.error('handleEmailSend', e)
    }
  }

  const constructPacketNotes = (
    oldNotes: string,
    options: StandardResponseOption,
    type: 'MISSING_INFO' | 'AGE_ISSUE',
    body: string,
    emailBody: string,
    keyText: string,
  ) => {
    const date = new Date().toLocaleDateString()
    let newNotes = `${date} - ${type === 'AGE_ISSUE' ? 'Age Issue' : 'Missing Info'}\n`

    let writingBody = ''
    let firstIndex = -1
    let endIndex = -1
    let result = ''

    if (type === 'AGE_ISSUE') {
      const secondPinex = body.indexOf('</p>', body.indexOf('</p>') + 1) + 4
      const startIndex = body.indexOf('<p>', secondPinex + 1)

      endIndex = body.indexOf(keyText)
      // firstIndex = addIndex - 2
      result = body
        .slice(startIndex, endIndex)
        .replace(/(<([^>]+)>)/gi, '')
        .replaceAll('\n\n', '\n')
    } else {
      if (options.values.length > 0) {
        const firstOptionTitle = options.values[0]?.title

        firstIndex = body.indexOf(`<ul>\n<li>${firstOptionTitle}`)

        const filesIndex = emailBody.indexOf('<p>[INSTRUCTIONS]</p>\n')
        const endEmailBody = emailBody.slice(filesIndex + 22, filesIndex + 32)

        endIndex = body.indexOf(endEmailBody)
      }
      result = body
        .slice(firstIndex, endIndex)
        .replace(/(<([^>]+)>)/gi, '')
        .replaceAll('\n\n', '\n')
        .replaceAll('\n\n', '\n')
    }

    options.values.map((option) => {
      if (writingBody) {
        writingBody = writingBody.replace(option.title, `- ${option.title}`)
      } else {
        writingBody = result.replace(option.title, `- ${option.title}`)
      }
    })

    if (writingBody) {
      newNotes += writingBody
    }

    if (oldNotes.length) return newNotes + '\n\n' + oldNotes

    return newNotes + '\n'
  }

  if (showMissingInfoModal)
    return (
      <EmailModal
        handleModem={() => setValue('showMissingInfoModal', false)}
        title={`Missing Information on ${student.person.first_name}’s Enrollment Packet`}
        options={emailTemplate && emailTemplate.standard_responses && JSON.parse(emailTemplate?.standard_responses)}
        handleSubmit={handleEmailSend}
        setEmailTemplate={setEmailTemplate}
        type='missingInfo'
        setEmailFrom={setEmailFrom}
        emailFrom={emailFrom}
        setEmailBodyInfo={setEmailBodyInfo}
        schoolYearId={student?.applications[0].school_year.school_year_id}
        midYear={student?.applications[0].midyear_application}
      />
    )
  if (showAgeIssueModal) {
    return (
      <EmailModal
        handleModem={() => setValue('showAgeIssueModal', false)}
        title={`Age Issue on ${student.person.first_name}’s Enrollment Packet`}
        options={emailTemplate && emailTemplate.standard_responses && JSON.parse(emailTemplate?.standard_responses)}
        handleSubmit={handleEmailSend}
        setEmailTemplate={setEmailTemplate}
        type='ageIssue'
        setEmailFrom={setEmailFrom}
        emailFrom={emailFrom}
        setEmailBodyInfo={setEmailBodyInfo}
        schoolYearId={student?.applications[0].school_year.school_year_id}
        midYear={student?.applications[0].midyear_application}
      />
    )
  }

  if (showSaveWarnModal)
    return (
      <EnrollmentWarnSaveModal
        onClose={() => {
          setValue('showValidationErrors', true)
          setValue('showSaveWarnModal', false)
        }}
        onSave={() => {
          onSubmit()
          setValue('showSaveWarnModal', false)
          setValue('showValidationErrors', false)
        }}
      />
    )

  if (missingInfoAlert) {
    return (
      <Alert
        sx={{
          position: 'relative',
          bottom: '25px',
          marginBottom: '15px',
        }}
        onClose={() => {
          setValue('missingInfoAlert', false)
        }}
        severity='error'
      >
        This packet has not yet been submitted
      </Alert>
    )
  }
  if (saveAlert && saveAlert.length) {
    return (
      <Alert
        sx={{
          position: 'relative',
          bottom: '25px',
          marginBottom: '15px',
        }}
        onClose={() => {
          setValue('saveAlert', '')
        }}
        severity='success'
      >
        {saveAlert}
      </Alert>
    )
  }
  return <div />
}
