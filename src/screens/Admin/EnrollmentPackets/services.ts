import { gql } from '@apollo/client'

export const getEnrollmentPacketsQuery = gql`
  query EnrollmentPackets($skip: Int, $take: Int, $search: String, $regionId: Int, $sort: String, $filters: [String!]) {
    packets(skip: $skip, take: $take, search: $search, region_id: $regionId, sort: $sort, filters: $filters) {
      total
      results {
        packet_id
        status
        exemption_form_date
        medical_exemption
        date_last_submitted
        date_submitted
        deadline
        admin_notes
        birth_place
        birth_country
        secondary_email
        secondary_phone
        signature_file_id
        signature_name
        race
        language
        photo_permission
        language_friends
        language_home
        language_home_child
        language_home_preferred
        dir_permission
        household_size
        household_income
        ferpa_agreement
        school_district
        last_school_address
        last_school
        reupload_files
        last_school_type
        worked_in_agriculture
        military
        hispanic
        secondary_contact_first
        secondary_contact_last
        is_age_issue
        missing_files
        special_ed
        packet_emails {
          subject
          created_at
          body
          from_email
        }
        meta
        student {
          status {
            status
          }
          reenrolled
          grade_level
          student_id
          special_ed
          grade_levels {
            grade_level
            school_year {
              date_begin
              date_end
            }
          }
          current_school_year_status {
            school_year_id
          }
          applications {
            midyear_application
            school_year {
              school_year_id
              schedule
              date_begin
              date_end
            }
          }
          parent {
            parent_id
            person {
              person_id
              preferred_first_name
              preferred_last_name
              first_name
              last_name
              middle_name
              email
              address {
                street
                street2
                city
                zip
                state
                county_id
                country_id
              }
              user {
                user_id
                userRegions {
                  regionDetail {
                    name
                  }
                }
              }
            }
            phone {
              number
            }
          }
          person {
            person_id
            preferred_first_name
            preferred_last_name
            first_name
            last_name
            middle_name
            email
            date_of_birth
            gender
            address {
              street
              street2
              city
              zip
              state
              county_id
            }
          }
        }
        files {
          kind
          mth_file_id
        }
      }
    }
  }
`

export const getEnrollmentPacketQuery = gql`
  query EnrollmentPacket($packet_id: ID!) {
    packet(packet_id: $packet_id) {
      packet_id
      status
      exemption_form_date
      medical_exemption
      date_last_submitted
      date_submitted
      deadline
      admin_notes
      birth_place
      birth_country
      secondary_email
      secondary_phone
      signature_file_id
      signature_name
      race
      language
      photo_permission
      language_friends
      language_home
      language_home_child
      language_home_preferred
      dir_permission
      household_size
      household_income
      ferpa_agreement
      school_district
      last_school_address
      last_school
      reupload_files
      last_school_type
      worked_in_agriculture
      military
      hispanic
      secondary_contact_first
      secondary_contact_last
      is_age_issue
      missing_files
      special_ed
      packet_emails {
        subject
        created_at
        body
        from_email
      }
      meta
      student {
        status {
          status
        }
        reenrolled
        grade_level
        student_id
        grade_levels {
          grade_level
          school_year {
            date_begin
            date_end
          }
        }
        current_school_year_status {
          school_year_id
        }
        parent {
          parent_id
          person {
            person_id
            preferred_first_name
            preferred_last_name
            first_name
            last_name
            middle_name
            email
            address {
              street
              city
              zip
              state
            }
          }
          phone {
            number
          }
        }
        person {
          person_id
          preferred_first_name
          preferred_last_name
          first_name
          last_name
          middle_name
          email
          date_of_birth
          gender
          address {
            street
            street2
            city
            zip
            state
            county_id
          }
        }
      }
      files {
        kind
        mth_file_id
      }
    }
  }
`

export const getPacket = gql`
  query Packet($packetID: ID!) {
    packet(packet_id: $packetID) {
      packet_id
      student {
        status {
          status
        }
        reenrolled
        grade_level
        student_id
        special_ed
        grade_levels {
          grade_level
          school_year {
            date_begin
            date_end
          }
        }
        current_school_year_status {
          school_year_id
        }
        applications {
          midyear_application
          school_year {
            school_year_id
            schedule
            date_begin
            date_end
          }
        }
        parent {
          parent_id
          person {
            person_id
            preferred_first_name
            preferred_last_name
            first_name
            last_name
            middle_name
            email
            address {
              street
              street2
              city
              zip
              state
              county_id
              country_id
            }
            user {
              user_id
              userRegions {
                regionDetail {
                  name
                }
              }
            }
          }
          phone {
            number
          }
        }
        person {
          person_id
          preferred_first_name
          preferred_last_name
          first_name
          last_name
          middle_name
          email
          date_of_birth
          gender
          address {
            street
            street2
            city
            zip
            state
            county_id
          }
        }
      }
    }
  }
`

export const getEnrollmentPacketStatusesQuery = gql`
  query packetStatuses {
    packetStatuses {
      error
      results
    }
  }
`

// export const deletePacketMutation = gql`
//   mutation deletePacket($packetIds: String!) {
//     deletePacket(packetIds: $packetIds) {
//       error
//       message
//     }
//   }
// `
export const getImmunizationSettings = gql`
  query ImmunizationSettings($where: FindImunizationSettingsInput) {
    immunizationSettings(where: $where) {
      results {
        id
        title
        date_created
        immunity_allowed
        consecutive_vaccine
      }
    }
  }
`

export const getPacketFiles = gql`
  query PacketFiles($fileIds: String!) {
    packetFiles(file_ids: $fileIds) {
      results {
        file_id
        type
        name
        item1
        item2
        item3
        signedUrl
        is_new_upload_type
        year
      }
    }
  }
`

export const getSignatureFile = gql`
  query getSignatureFile($fileId: ID!) {
    signatureFile(file_id: $fileId) {
      file_id
      is_new_upload_type
      item1
      item2
      item3
      signedUrl
      name
      type
      year
    }
  }
`

export const deletePacketDocumentFileMutation = gql`
  mutation deletePacketDocumentFile($fileId: String!) {
    deletePacketDocumentFile(fileId: $fileId) {
      error
      message
    }
  }
`

export const savePacketMutation = gql`
  mutation savePacket($enrollmentPacketInput: EnrollmentPacketInput!) {
    saveEnrollmentPacket(enrollmentPacketInput: $enrollmentPacketInput) {
      packet {
        admin_notes
        packet_id
        student {
          parent {
            person {
              address {
                city
                address_id
                name
                state
                street
                street2
                zip
                county_id
              }
              date_of_birth
              email
              first_name
              last_name
              phone {
                number
                name
                phone_id
              }
            }
          }
        }
      }
    }
  }
`

export const sendEmailMutation = gql`
  mutation SendEmail($emailInput: EmailInput!) {
    sendEmail(emailInput: $emailInput) {
      error
      message
    }
  }
`

export const emailPacketMutation = gql`
  mutation EmailPacket($emailApplicationInput: EmailApplicationInput!) {
    emailPacket(emailApplicationInput: $emailApplicationInput) {
      packet_id
    }
  }
`

export const deletePacketMutation = gql`
  mutation DeletePacket($deleteApplicationInput: DeleteApplicationInput!) {
    deletePacket(deleteApplicationInput: $deleteApplicationInput) {
      packet_id
      status
    }
  }
`

export const moveThisYearPacketMutation = gql`
  mutation MoveThisYearPacket($deleteApplicationInput: DeleteApplicationInput!) {
    moveThisYearPacket(deleteApplicationInput: $deleteApplicationInput)
  }
`

export const moveNextYearPacketMutation = gql`
  mutation MoveNextYearPacket($deleteApplicationInput: DeleteApplicationInput!) {
    moveNextYearPacket(deleteApplicationInput: $deleteApplicationInput)
  }
`

export const updateStudentStatusMutation = gql`
  mutation updateStudentStudent($input: ChangeStatusInput!) {
    changeStatus(changeStatusInput: $input)
  }
`
export const StudentImmunizatiosnQuery = gql`
  query Query($student_id: Int!) {
    StudentImmunizations(student_id: $student_id) {
      student_id
      value
      immunization_id
      immunization {
        id
        title
        consecutive_vaccine
        consecutives
        immunity_allowed
        min_grade_level
        max_grade_level
        tooltip
        min_spacing_interval
        min_spacing_date
        max_spacing_interval
        max_spacing_date
        is_deleted
      }
    }
  }
`

export const updateCreateStudentImmunizationMutation = gql`
  mutation Mutation($input: [StudentImmunizationInput!]!) {
    updateCreateStudentImmunization(data: $input)
  }
`

export const getSettingsQuery = gql`
  query getSettings {
    settings {
      enable_immunizations
    }
  }
`
export const updateSettingsMutation = gql`
  mutation updateSettings($input: UpdateSettingsInput!) {
    updateSettings(input: $input) {
      enable_immunizations
    }
  }
`

export const packetCountQuery = gql`
  query PacketCountByRegionId($regionId: ID!) {
    packetCountByRegionId(region_id: $regionId) {
      error
      message
      results
    }
  }
`

export const updateEnrollmentSchoolYearByIds = gql`
  mutation UpdateEnrollmentSchoolYearByIds($updateEnrollmentSchoolYearByIdsInput: UpdateSchoolYearIdsInput!) {
    updateEnrollmentSchoolYearByIds(updateEnrollmentSchoolYearByIdsInput: $updateEnrollmentSchoolYearByIdsInput)
  }
`
