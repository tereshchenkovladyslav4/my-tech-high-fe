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
