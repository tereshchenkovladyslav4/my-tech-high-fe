import { gql } from '@apollo/client'

export const getSchoolDistrictsByRegionId = gql`
  query SchoolDistrict($regionId: ID!) {
    schoolDistrict(id: $regionId) {
      id
      school_district_name
      Region_id
    }
  }
`
