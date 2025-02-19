import { gql } from '@apollo/client'

export const getEmailTemplateQuery = gql`
  query EmailTemplateName($regionId: ID!, $schoolYearId: Float, $template: String!, $midYear: Boolean) {
    emailTemplateName(regionId: $regionId, schoolYearId: $schoolYearId, template: $template, midYear: $midYear) {
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

export const getEmailTemplateByNameAndSchoolYearQuery = gql`
  query GetEmailTemplateByNameAndSchoolYearId($midYear: Boolean!, $schoolYearId: Int!, $templateName: String!) {
    getEmailTemplateByNameAndSchoolYearId(
      mid_year: $midYear
      school_year_id: $schoolYearId
      template_name: $templateName
    ) {
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

export const getEmailTemplateByIdQuery = gql`
  query EmailTemplate($templateId: ID!) {
    emailTemplate(templateId: $templateId) {
      id
      template_name
      title
      subject
      body
      from
      bcc
      standard_responses
      template
      inserts
      category_id
      category {
        category_name
      }
      region_id
      region {
        id
        application_deadline_num_days
        enrollment_packet_deadline_num_days
        withdraw_deadline_num_days
      }
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
      reminder
      email_template_id
    }
  }
`

export const getEmailTemplatesByRegionQuery = gql`
  query EmailTemplatesByRegion($midYear: Boolean, $schoolYearId: Float, $regionId: ID!) {
    emailTemplatesByRegion(mid_year: $midYear, school_year_id: $schoolYearId, regionId: $regionId) {
      id
      template_name
      title
      subject
      body
      from
      bcc
      standard_responses
      priority
      category_id
      category {
        category_name
      }
      template
      inserts
      region_id
      region {
        id
        application_deadline_num_days
        enrollment_packet_deadline_num_days
        withdraw_deadline_num_days
      }
      school_year_id
      mid_year
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

export const checkEmailQuery = gql`
  query CheckEmail($email: String!) {
    emailTaken(email: $email)
  }
`

export const studentEmailTaken = gql`
  query Query($email: String!) {
    studentEmailTaken(email: $email)
  }
`
