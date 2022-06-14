import { gql } from '@apollo/client'

export const CreateNewSchoolPartnerMutation = gql`
  mutation CreateNewSchoolPartner($schoolPartnerInput: SchoolPartnerInput!) {
    createSchoolPartner(schoolPartnerInput: $schoolPartnerInput) {
      school_partner_id
      name
      abbreviation
      photo
    }
  }
`

export const GetSchoolsOfEnrollment = gql`
  query{
    getSchoolsOfEnrollment{
      school_partner_id
      name
      abbreviation
      photo
      active
    }
  }
`

export const UpdateSchoolPartnerMutation = gql`
  mutation UpdateSchoolPartner($updateSchoolPartnerInput: UpdateSchoolPartnerInput!) {
    updateSchoolPartner(updateSchoolPartnerInput: $updateSchoolPartnerInput) {
      school_partner_id
      name
      abbreviation
      photo
    }
  }
`

export const ToggleSchoolPartnerMutation = gql`
  mutation ToggleSchoolPartner($schoolPartnerId: Float!) {
    toggleSchoolPartnerArchive(schoolPartnerId: $schoolPartnerId) {
      school_partner_id
    }
  }
`