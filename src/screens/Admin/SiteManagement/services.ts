import { gql } from '@apollo/client'

export const getEmailTemplateQuery = gql`
  query EmailTemplateName($template: String!) {
    emailTemplateName(template: $template) {
      id
      template_name
      title
      subject
      body
      from
      bcc
      standard_responses
    }
  }
`

export const getEmailRemindersQuery = gql`
  query RemindersByTemplateId($templateId: ID!) {
    remindersByTemplateId(templateId: $templateId) {
      reminder_id
      title
      subject
      body
      deadline
      email_template_id
    }
  }
`

export const createEmailTemplateMutation = gql`
  mutation CreateEmailTemplate($createEmailTemplateInput: CreateEmailTemplateInput!) {
    createEmailTemplate(createEmailTemplateInput: $createEmailTemplateInput) {
      id
      template_name
    }
  }
`

export const updateEmailTemplateMutation = gql`
  mutation UpdateEmailTemplate($createEmailTemplateInput: CreateEmailTemplateInput!) {
    updateEmailTemplate(createEmailTemplateInput: $createEmailTemplateInput) {
      id
      template_name
    }
  }
`
