import { useMutation, useQuery } from '@apollo/client'
import React, { useState, useEffect, useContext } from 'react'
import { EmailModal } from '../../../../../components/EmailModal/EmailModal'
import { StandardResponseOption } from '../../../../../components/EmailModal/StandardReponses/types'
import { AGE_ISSUE_OPTIONS, MISSING_INFO_OPTIONS } from '../../../../../utils/constants'
import { sendEmailMutation } from '../../services'
import EnrollmentWarnSaveModal from './ConfirmSaveModal'
import { EnrollmentPacketFormType } from '../types'
import { Alert } from '@mui/material'
import { getEmailTemplateQuery } from '../../../../../graphql/queries/email-template'
import { useFormContext } from 'react-hook-form'
import { studentContext } from '../providers'

export default function PacketConfirmModals({ packet, refetch, submitForm }) {
  const student = useContext(studentContext)
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

  const setEmailBodyInfo = (email: string, student) => {
    const yearbegin = new Date(student.grade_levels[0].school_year.date_begin).getFullYear().toString()
    const yearend = new Date(student.grade_levels[0].school_year.date_end).getFullYear().toString()

    return email.toString()
      .replace(/\[STUDENT_ID\]/g, student.student_id + '')
      .replace(/\[FILES\]/g, packet.missing_files)
      .replace(/\[LINK\]/g, `[HOST]/homeroom/enrollment/${student.student_id}`) //adding host detail from backend
      .replace(/\[STUDENT\]/g, student.person.first_name)
      .replace(/\[PARENT\]/g, student.parent.person.first_name)
      .replace(/<STUDENT GRADE>/g, student.grade_level)
      .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
  }

  const handleEmailSend = (subject: string, body: string, options: StandardResponseOption) => {
    try {
      const bodyData = setEmailBodyInfo(body, student)
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
          },
        },
      })
      refetch()
      setValue('notes', constructPacketNotes(notes || '', options, options.type, body))
      if (options.type === 'AGE_ISSUE') {
        setValue('showAgeIssueModal', false)
        onSubmit()
        setValue('age_issue', true)
      } else if (options.type === 'MISSING_INFO') {
        setValue('showMissingInfoModal', false)
        setValue('missingInfoAlert', true)
        setTimeout(() => setValue('missingInfoAlert', false), 5000)
        setValue('preSaveStatus', 'Missing Info')
        setValue(
          'missing_files',
          options.values.filter((v) => v.checked).map((v) => v.abbr),
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
  ) => {
    const date = new Date().toLocaleDateString()
    let newNotes = `${date} - ${type === 'AGE_ISSUE' ? 'Age Issue' : 'Missing Info'}\n`
    const newNotesLines: Array<string> = ['<SEP>']

    const setEmailBodyInfo = (email: string, student) => {
      const yearbegin = new Date(student.grade_levels[0].school_year.date_begin).getFullYear().toString()
      const yearend = new Date(student.grade_levels[0].school_year.date_end).getFullYear().toString()

      return email.toString()
        .replace(/<STUDENT NAME>/g, student.person.first_name)
        .replace(/<PARENT>/g, student.parent.person.first_name)
        .replace(/<STUDENT GRADE>/g, student.grade_level)
        .replace(/<SCHOOL YEAR>/g, `${yearbegin}-${yearend.substring(2, 4)}`)
    }

    const replaceBlank = (text: string, body: string): string => {
      const startIdx = body.indexOf('but age-wise they could be in')
      const endIdx = body.indexOf('\n', startIdx)
      if (startIdx < 0 || endIdx < 0 || text.indexOf('[BLANK]') < 0) return text

      const skipStart = 'but age-wise they could be in '.length
      const skipEnd = body[endIdx - 1] === '.' ? 1 : 0

      const newBlank = body
        .substring(startIdx + skipStart, endIdx - skipEnd)
        .replace('.</p>', '')
        .replace('</p>', '')

      return text.replace('[BLANK]', newBlank)
    }

    options.values
      .slice()
      .reverse()
      .forEach((option) => {
        const indexOfSeparator = newNotesLines.indexOf('<SEP>')
        newNotesLines.splice(0, 0, `- ${option.title}`)
        if (option.extraText) {
          newNotesLines.splice(indexOfSeparator + 1, 0, replaceBlank(option.extraText.replace('\n\n', '\n'), body))
        }
      })

    newNotesLines.splice(newNotesLines.indexOf('<SEP>'), 1)
    newNotes += newNotesLines.join('\n')

    if (oldNotes.length) return setEmailBodyInfo(newNotes, student) + '\n\n' + oldNotes
    return setEmailBodyInfo(newNotes, student) + '\n'
  }

  if (showMissingInfoModal)
    return (
      <EmailModal
        handleModem={() => setValue('showMissingInfoModal', false)}
        title={`Missing Information on ${student.person.first_name}’s Enrollment Packet`}
        options={MISSING_INFO_OPTIONS}
        handleSubmit={handleEmailSend}
        setEmailTemplate={setEmailTemplate}
        type='missingInfo'
        setEmailFrom={setEmailFrom}
        emailFrom={emailFrom}
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
  if (saveAlert.length) {
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
