import { gql } from '@apollo/client'

export const getEmailRecordsQuery = gql`
  query EmailRecords($skip: Int, $take: Int, $search: String, $regionId: Int, $sort: String, $filters: [String!]) {
    emailRecords(skip: $skip, take: $take, search: $search, region_id: $regionId, sort: $sort, filters: $filters) {
      total
    }
  }
`
