import { gql } from '@apollo/client'

export const getEmailRecordsQuery = gql`
  query EmailRecords($skip: Int, $take: Int, $search: String, $regionId: Int, $sort: String, $filters: [String!]) {
    emailRecords(skip: $skip, take: $take, search: $search, region_id: $regionId, sort: $sort, filters: $filters) {
      total
      results {
        id
        from_email
        to_email
        subject
        template_name
        status
        body
        bcc
        region_id
        created_at
      }
    }
  }
`
export const recordsCountQuery = gql`
  query EmailRecordsCountByRegionId($regionId: ID!) {
    emailRecordsCountByRegionId(region_id: $regionId) {
      error
      message
      results
    }
  }
`

export const deleteRecordsMutation = gql`
  mutation DeleteRecords($deleteRecordInput: DeleteRecordInput!) {
    deleteRecords(deleteRecordInput: $deleteRecordInput) {
      id
      status
    }
  }
`

export const resendRecordsMutation = gql`
  mutation ResendRecords($deleteRecordInput: DeleteRecordInput!) {
    resendRecords(deleteRecordInput: $deleteRecordInput)
  }
`

export const resendEmailMutation = gql`
  mutation ResendEmail($resendEmailInput: UpdateEmailRecordInput!) {
    resendEmail(resendEmailInput: $resendEmailInput)
  }
`
