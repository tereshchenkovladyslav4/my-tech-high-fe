import { gql } from '@apollo/client'
import { SNOWPACK_PUBLIC_S3_URL } from '../../../../utils/constants'

export const updateStateNameMutation = gql`
  mutation UpdateRegion($updateRegionInput: UpdateRegionInput!) {
    updateRegion(updateRegionInput: $updateRegionInput) {
      id
      name
      program
      state_logo
    }
  }
`

export const updateSchoolYearMutation = gql`
  mutation UpdateSchoolYear($updateSchoolYearInput: UpdateSchoolYearInput!) {
    updateSchoolYear(updateSchoolYearInput: $updateSchoolYearInput) {
      school_year_id
    }
  }
`

export const getSchoolYearsByRegionId = gql`
  query Region($regionId: ID!) {
    region(id: $regionId) {
      SchoolYears {
        school_year_id
        date_begin
        date_end
        grades
        birth_date_cut
        special_ed
        special_ed_options
        enrollment_packet
      }
      county_file_name
      county_file_path
      school_district_file_name
      school_district_file_path
    }
  }
`

export const removeCountyInfoByRegionId = gql`
  mutation RemoveCountyInfoByRegionId($regionId: ID!) {
    removeCountyInfoByRegionId(region_id: $regionId)
  }
`

export const removeFileByFileId = gql`
  mutation DeletePacketDocumentFile($fileId: String!) {
    deletePacketDocumentFile(fileId: $fileId) {
      error
      message
      results
    }
  }
`

export const removeSchoolDistrictInfoByRegionId = gql`
  mutation RemoveSchoolDistrictInfoByRegionId($regionId: ID!) {
    removeSchoolDistrictInfoByRegionId(region_id: $regionId)
  }
`

export const uploadImage = async (file, stateName) => {
  const bodyFormData = new FormData()
  if (file) {
    bodyFormData.append('file', file)
    bodyFormData.append('region', stateName)
    bodyFormData.append('directory', 'stateLogo')

    const response = await fetch(SNOWPACK_PUBLIC_S3_URL, {
      method: 'POST',
      body: bodyFormData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
    })
    const {
      data: { s3 },
    } = await response.json()
    return s3.Location
  }
}

export const uploadFile = async (file, type, stateName) => {
  const bodyFormData = new FormData()
  if (file) {
    bodyFormData.append('file', file)
    bodyFormData.append('region', stateName)
    bodyFormData.append('directory', type)

    const response = await fetch(SNOWPACK_PUBLIC_S3_URL, {
      method: 'POST',
      body: bodyFormData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
    })
    const {
      data: { s3 },
    } = await response.json()
    return s3.Location
  }
}
