import { useMutation, useQuery } from '@apollo/client'
import { useFormikContext } from 'formik'
import React, { useState, useEffect } from 'react'
import { EmailModal } from '../../../../../components/EmailModal/EmailModal'
import { StandardResponseOption } from '../../../../../components/EmailModal/StandardReponses/types'
import { AGE_ISSUE_OPTIONS, MISSING_INFO_OPTIONS } from '../../../../../utils/constants'
import { sendEmailMutation } from '../../services'
import EnrollmentWarnSaveModal from './ConfirmSaveModal'
import { EnrollmentPacketFormType } from '../types'
import { Alert } from '@mui/material'
import { getEmailTemplateQuery } from '../../../../../graphql/queries/email-template'
export default function PacketConfirmModals({ refetch }) {
  const [emailTemplate, setEmailTemplate] = useState(null)
  const { values, setFieldValue, submitForm } = useFormikContext<EnrollmentPacketFormType>()
  const [sendPacketEmail] = useMutation(sendEmailMutation)
  const {
    loading: templateLoading,
    data: emailTemplateData,
    refetch: refetchEmailTemplate,
  } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Missing Information',
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])

  function onSubmit(status?: string) {
    setFieldValue('status', status || values.preSaveStatus)
    submitForm()
    values.preSaveStatus === 'Accepted' && setFieldValue('saveAlert', 'The packet has been accepted')
  }

  const handleEmailSend = (subject: string, body: string, options: StandardResponseOption) => {
    try {
      sendPacketEmail({
        variables: {
          emailInput: {
            content: body,
            email: values?.student.parent.person.email,
            subject: subject,
            recipients: null,
            from: emailTemplate && emailTemplate?.from ? emailTemplate?.from : null,
            bcc: emailTemplate && emailTemplate?.bcc ? emailTemplate?.bcc : null,
          },
        },
      })
      refetch()

      setFieldValue('notes', constructPacketNotes(values.notes || '', options, options.type, body))

      if (options.type === 'AGE_ISSUE') {
        setFieldValue('showAgeIssueModal', false)
        onSubmit()
        setFieldValue('age_issue', true)
      } else if (options.type === 'MISSING_INFO') {
        setFieldValue('showMissingInfoModal', false)
        setFieldValue('preSaveStatus', 'Missing Info')

        setFieldValue('missing_files', JSON.stringify(options.values.filter((v) => v.checked).map((v) => v.abbr)))
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

    const setStudentInfo = (email: string, student) => {
      const yearbegin = new Date(student.grade_levels[0].school_year.date_begin).getFullYear().toString()
      const yearend = new Date(student.grade_levels[0].school_year.date_end).getFullYear().toString()

      return email
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

      const newBlank = body.substring(startIdx + skipStart, endIdx - skipEnd)

      return text.replace('[BLANK]', newBlank)
    }

    options.values
      .slice()
      .reverse()
      .forEach((option) => {
        if (!option.checked) return
        const indexOfSeparator = newNotesLines.indexOf('<SEP>')
        newNotesLines.splice(0, 0, `- ${option.title}`)
        if (option.extraText) {
          newNotesLines.splice(indexOfSeparator + 1, 0, replaceBlank(option.extraText.replace('\n\n', '\n'), body))
        }
      })

    newNotesLines.splice(newNotesLines.indexOf('<SEP>'), 1)
    newNotes += newNotesLines.join('\n')

    if (oldNotes.length) return setStudentInfo(newNotes, values.student) + '\n\n' + oldNotes
    return setStudentInfo(newNotes, values.student) + '\n'
  }

  if (values.showMissingInfoModal)
    return (
      <EmailModal
        handleModem={() => setFieldValue('showMissingInfoModal', false)}
        title={`Missing Information on ${values.student.person.first_name}’s Enrollment Packet`}
        options={MISSING_INFO_OPTIONS}
        handleSubmit={handleEmailSend}
        template={emailTemplate}
      />
    )
  if (values.showAgeIssueModal)
    return (
      <EmailModal
        handleModem={() => setFieldValue('showAgeIssueModal', false)}
        title={`Age Issue on ${values.student.person.first_name}’s Enrollment Packet`}
        options={AGE_ISSUE_OPTIONS}
        handleSubmit={handleEmailSend}
      />
    )

  if (values.showSaveWarnModal)
    return (
      <EnrollmentWarnSaveModal
        onClose={() => {
          setFieldValue('showValidationErrors', true)
          setFieldValue('showSaveWarnModal', false)
        }}
        onSave={() => {
          onSubmit()
          setFieldValue('showSaveWarnModal', false)
        }}
      />
    )

  if (values.missingInfoAlert) {
    return (
      <Alert
        sx={{
          position: 'relative',
          bottom: '25px',
          marginBottom: '15px',
        }}
        onClose={() => {
          setFieldValue('missingInfoAlert', false)
        }}
        severity='error'
      >
        This packet has not yet been submitted
      </Alert>
    )
  }
  if (values.saveAlert.length) {
    return (
      <Alert
        sx={{
          position: 'relative',
          bottom: '25px',
          marginBottom: '15px',
        }}
        onClose={() => {
          setFieldValue('saveAlert', '')
        }}
        severity='success'
      >
        {values.saveAlert}
      </Alert>
    )
  }
  return <div />
}
