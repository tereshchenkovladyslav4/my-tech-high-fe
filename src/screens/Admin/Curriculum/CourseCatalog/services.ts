import { gql } from '@apollo/client'

export const getSubjectsQuery = gql`
  query Subjects($findSubjectsInput: FindSubjectsInput!) {
    subjects(findSubjectsInput: $findSubjectsInput) {
      subject_id
      SchoolYearId
      name
      is_active
      priority
      Periods {
        id
        period
        category
      }
      Titles {
        title_id
        subject_id
        name
        min_grade
        max_grade
        min_alt_grade
        max_alt_grade
        diploma_seeking_path
        reduce_funds
        price
        always_unlock
        custom_built
        third_party_provider
        split_enrollment
        software_reimbursement
        display_notification
        launchpad_course
        course_id
        reduce_funds_notification
        custom_built_description
        subject_notification
        state_course_codes
        is_active
      }
    }
  }
`

export const createOrUpdateSubjectMutation = gql`
  mutation CreateOrUpdateSubject($createSubjectInput: CreateOrUpdateSubjectInput!) {
    createOrUpdateSubject(createSubjectInput: $createSubjectInput) {
      subject_id
    }
  }
`

export const deleteSubjectMutation = gql`
  mutation DeleteSubject($subjectId: Float!) {
    deleteSubject(subjectId: $subjectId)
  }
`

export const createOrUpdateTitleMutation = gql`
  mutation CreateOrUpdateTitle($createTitleInput: CreateOrUpdateTitleInput!) {
    createOrUpdateTitle(createTitleInput: $createTitleInput) {
      title_id
    }
  }
`

export const deleteTitleMutation = gql`
  mutation DeleteTitle($titleId: Float!) {
    deleteTitle(titleId: $titleId)
  }
`

export const cloneTitleMutation = gql`
  mutation CloneTitle($titleId: Float!) {
    cloneTitle(titleId: $titleId)
  }
`
