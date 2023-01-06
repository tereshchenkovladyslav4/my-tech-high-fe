import { gql } from '@apollo/client'
import { MthRoute } from '@mth/enums'

export const createSchoolYearMutation = gql`
  mutation CreateSchoolYear($createSchoolYearInput: CreateSchoolYearInput!, $previousYearId: Float!) {
    createSchoolYear(createSchoolYearInput: $createSchoolYearInput, previousYearId: $previousYearId) {
      school_year_id
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
        diploma_seeking
        birth_date_cut
        special_ed
        special_ed_options
        enrollment_packet
        date_reg_close
        date_reg_open
        midyear_application
        midyear_application_close
        midyear_application_open
        testing_preference_title
        testing_preference_description
        opt_out_form_title
        opt_out_form_description
        ScheduleBuilder {
          max_num_periods
          custom_built
          third_party_provider
        }
        schedule
        diploma_seeking
        testing_preference
        schedule_builder_open
        schedule_builder_close
        second_semester_open
        second_semester_close
        midyear_schedule_open
        midyear_schedule_close
        homeroom_resource_open
        homeroom_resource_close
        learning_logs
        learning_logs_first_second_semesters
        reimbursements
        require_software
        direct_orders
        direct_order_open
        direct_order_close
        reimbursement_open
        reimbursement_close
        custom_built_open
        custom_built_close
        require_software_open
        require_software_close
        third_party_open
        third_party_close
        mid_direct_order_open
        mid_direct_order_close
        mid_reimbursement_open
        mid_reimbursement_close
        mid_custom_built_open
        mid_custom_built_close
        mid_require_software_open
        mid_require_software_close
        mid_third_party_open
        mid_third_party_close
        IsCurrentYear
      }
      county_file_name
      county_file_path
      school_district_file_name
      school_district_file_path
    }
  }
`

export const assignStudentToSOEGql = gql`
  mutation AssignStudentToSOE($assignStudentToSoeInput: assignStudentToSOEInput!) {
    assignStudentToSOE(assignStudentToSOEInput: $assignStudentToSoeInput)
  }
`

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

export const diplomaQuestionDataBySchoolYearGql = gql`
  query GetDiplomaQuestion($diplomaQuestionInput: DiplomaQuestionInput!) {
    getDiplomaQuestion(diplomaQuestionInput: $diplomaQuestionInput) {
      school_year_id
      id
      grades
      description
      title
    }
  }
`

export const diplomaQuestionSaveGql = gql`
  mutation SaveDiplomaQuestion($diplomaQuestionInput: DiplomaQuestionInput!) {
    saveDiplomaQuestion(diplomaQuestionInput: $diplomaQuestionInput) {
      school_year_id
      title
      description
      grades
      id
    }
  }
`

export const diplomaQuestionGradeSaveGql = gql`
  mutation SaveDiplomaQuestionGrade($diplomaQuestionInput: DiplomaQuestionInput!) {
    saveDiplomaQuestionGrade(diplomaQuestionInput: $diplomaQuestionInput)
  }
`

export const uploadImage = async (file: File | undefined, stateName: string): Promise<string> => {
  const bodyFormData = new FormData()
  if (file) {
    bodyFormData.append('file', file)
    bodyFormData.append('region', stateName)
    bodyFormData.append('directory', 'stateLogo')

    const response = await fetch(MthRoute.SNOWPACK_PUBLIC_S3_URL.toString(), {
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
  } else {
    return ''
  }
}

export const uploadFile = async (file: File, type: string, stateName: string): Promise<string> => {
  const bodyFormData = new FormData()
  if (file) {
    bodyFormData.append('file', file)
    bodyFormData.append('region', stateName)
    bodyFormData.append('directory', type)

    const response = await fetch(MthRoute.SNOWPACK_PUBLIC_S3_URL.toString(), {
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
  } else {
    return ''
  }
}
