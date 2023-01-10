import { gql } from '@apollo/client'

export const getSubjectsQuery = gql`
  query Subjects($findSubjectsInput: FindSubjectsInput!) {
    subjects(findSubjectsInput: $findSubjectsInput) {
      subject_id
      SchoolYearId
      name
      allow_request
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
        allow_request
        is_active
        is_active
        StateCodes {
          state_codes_id
          TitleId
          title_name
          state_code
          grade
          teacher
          subject
        }
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

export const createOrUpdateProviderMutation = gql`
  mutation CreateOrUpdateProvider($createProviderInput: CreateOrUpdateProviderInput!) {
    createOrUpdateProvider(createProviderInput: $createProviderInput) {
      id
    }
  }
`

export const getProvidersQuery = gql`
  query Providers($findProvidersInput: FindProvidersInput!) {
    providers(findProvidersInput: $findProvidersInput) {
      id
      school_year_id
      name
      is_display
      reduce_funds
      price
      reduce_funds_notification
      multiple_periods
      multi_periods_notification
      allow_request
      is_active
      Periods {
        id
        period
        category
      }
      SchedulePeriods {
        schedule_period_id
      }
      Courses {
        id
        provider_id
        name
        min_grade
        max_grade
        min_alt_grade
        max_alt_grade
        always_unlock
        software_reimbursement
        display_notification
        course_notification
        launchpad_course
        course_id
        website
        diploma_seeking_path
        limit
        reduce_funds
        price
        reduce_funds_notification
        Titles {
          title_id
          subject_id
          name
        }
        allow_request
        is_active
      }
    }
  }
`

export const deleteProviderMutation = gql`
  mutation DeleteProvider($providerId: Float!) {
    deleteProvider(providerId: $providerId)
  }
`

export const createOrUpdateCourseMutation = gql`
  mutation CreateOrUpdateCourse($createCourseInput: CreateOrUpdateCourseInput!) {
    createOrUpdateCourse(createCourseInput: $createCourseInput) {
      id
    }
  }
`

export const deleteCourseMutation = gql`
  mutation DeleteCourse($courseId: Float!) {
    deleteCourse(courseId: $courseId)
  }
`

export const cloneCourseMutation = gql`
  mutation CloneCourse($courseId: Float!) {
    cloneCourse(courseId: $courseId)
  }
`

export const getStateCodesQuery = gql`
  query StateCodes($skip: Int, $take: Int, $filter: StateCodesFilters, $regionId: Int, $sort: String, $search: String) {
    stateCodes(skip: $skip, take: $take, filter: $filter, region_id: $regionId, sort: $sort, search: $search) {
      total
      results {
        state_codes_id
        TitleId
        title_name
        state_code
        grade
        teacher
        subject
      }
    }
  }
`

export const CreateNewStateCodesMutation = gql`
  mutation Mutation($createNewStateCodesInput: [StateCodesInput!]!) {
    createNewStateCodesInput(createNewStateCodesInput: $createNewStateCodesInput)
  }
`

export const createStateCodesMutation = gql`
  mutation CreateStateCodes($createStateCodesInput: [StateCodesInput!]!) {
    createStateCodes(createStateCodesInput: $createStateCodesInput)
  }
`
export const UpdateStateCodesMutation = gql`
  mutation UpdateStateCodesById($updateStateCodesInput: StateCodesInput!) {
    updateStateCodesById(updateStateCodesInput: $updateStateCodesInput)
  }
`
