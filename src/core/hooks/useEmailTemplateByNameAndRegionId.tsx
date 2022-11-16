import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { getEmailTemplateQuery } from '@mth/graphql/queries/email-template'

export const useEmailTemplateByNameAndRegionId = (
  regionId: number,
  templateName: string,
): {
  loading: boolean
  from: string
  body: string
  subject: string
  standardResponse: string
  setFrom: (value: string) => void
  setBody: (value: string) => void
  setSubject: (value: string) => void
  error: ApolloError | undefined
} => {
  const [emailSubject, setEmailSubject] = useState<string>('')
  const [emailFrom, setEmailFrom] = useState<string>('')
  const [emailBody, setEmailBody] = useState<string>('')
  const [standardResponse, setStandardResponse] = useState<string>('')

  const {
    data: emailTemplateData,
    loading,
    error,
  } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: templateName,
      regionId: regionId,
    },
    skip: !templateName || !regionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (emailTemplateData) {
      const { emailTemplateName } = emailTemplateData
      const { subject, from, body, standard_responses } = emailTemplateName
      setEmailSubject(subject)
      setEmailFrom(from)
      setEmailBody(body)
      setStandardResponse(standard_responses)
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
    error: error,
  }
}
