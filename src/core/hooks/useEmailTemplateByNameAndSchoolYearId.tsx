import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { EmailTemplateResponseVM } from '@mth/graphql/models/email-template'
import { getEmailTemplateByNameAndSchoolYearQuery } from '@mth/graphql/queries/email-template'

export const useEmailTemplateByNameAndSchoolYearId = (
  templateName: string,
  schoolYearId: number,
  mid_year = false,
): {
  loading: boolean
  from: string
  body: string
  subject: string
  standardResponse: string
  setFrom: (value: string) => void
  setBody: (value: string) => void
  setSubject: (value: string) => void
  refetch: () => void
  emailTemplate: EmailTemplateResponseVM | undefined
  error: ApolloError | undefined
} => {
  const [emailSubject, setEmailSubject] = useState<string>('')
  const [emailFrom, setEmailFrom] = useState<string>('')
  const [emailBody, setEmailBody] = useState<string>('')
  const [standardResponse, setStandardResponse] = useState<string>('')
  const [emailTempate, setEmailTemplate] = useState<EmailTemplateResponseVM>()

  const {
    data: emailTemplateData,
    loading,
    error,
    refetch,
  } = useQuery(getEmailTemplateByNameAndSchoolYearQuery, {
    variables: {
      templateName: templateName,
      schoolYearId: schoolYearId,
      midYear: mid_year,
    },
    skip: !templateName || !schoolYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (emailTemplateData) {
      const { getEmailTemplateByNameAndSchoolYearId } = emailTemplateData
      if (getEmailTemplateByNameAndSchoolYearId) {
        const { subject, from, body, standard_responses } = getEmailTemplateByNameAndSchoolYearId
        setEmailSubject(subject)
        setEmailFrom(from)
        setEmailBody(body)
        setStandardResponse(standard_responses)
        setEmailTemplate(getEmailTemplateByNameAndSchoolYearId)
      }
    }
  }, [emailTemplateData])

  return {
    loading: loading,
    from: emailFrom,
    subject: emailSubject,
    body: emailBody,
    standardResponse: standardResponse,
    setFrom: setEmailFrom,
    setBody: setEmailBody,
    setSubject: setEmailSubject,
    emailTemplate: emailTempate,
    refetch,
    error: error,
  }
}
