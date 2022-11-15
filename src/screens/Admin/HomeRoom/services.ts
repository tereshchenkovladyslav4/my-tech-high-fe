import { gql } from '@apollo/client'

export const GetMastersBySchoolYearIDGql = gql`
  query GetMastersBySchoolId($schoolYearId: Int!) {
    getMastersBySchoolId(schoolYearId: $schoolYearId) {
      master_id
      master_name
      school_year_id
    }
  }
`

export const CreateNewMasterGql = gql`
  mutation CreateNewMaster($createNewMasterInput: CreateNewMasterInput!) {
    createNewMaster(createNewMasterInput: $createNewMasterInput)
  }
`
