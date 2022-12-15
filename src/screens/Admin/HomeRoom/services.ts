import { gql } from '@apollo/client'

export const GetMastersBySchoolYearIDGql = gql`
  query GetMastersBySchoolId($schoolYearId: Int!) {
    getMastersBySchoolId(schoolYearId: $schoolYearId) {
      created_at
      master_id
      master_name
      school_year_id
      masterClasses {
        class_id
        class_name
        addition_id
        primaryTeacher {
          firstName
          lastName
          user_id
        }
      }
    }
  }
`

export const GetMastersByIDGql = gql`
  query GetMastersById($masterId: Int!) {
    getMastersById(masterId: $masterId) {
      created_at
      master_id
      master_name
      school_year_id
      instructions
    }
  }
`

export const CreateNewMasterGql = gql`
  mutation CreateNewMaster($createNewMasterInput: CreateNewMasterInput!) {
    createNewMaster(createNewMasterInput: $createNewMasterInput)
  }
`

export const searchTeacher = gql`
  query GetTeacherListBySearchField($searchPrimaryTeacher: GetPersonInfoArgs!) {
    getTeacherListBySearchField(searchPrimaryTeacher: $searchPrimaryTeacher) {
      first_name
      last_name
      user_id
    }
  }
`

export const CreateNewClassesGql = gql`
  mutation CreateNewClass($createNewClassInput: CreateNewClassInput!) {
    createNewClass(createNewClassInput: $createNewClassInput)
  }
`
export const CreateNewChecklistMutation = gql`
  mutation Mutation($createNewChecklistInput: [ChecklistInput!]!) {
    createNewChecklist(createNewChecklistInput: $createNewChecklistInput)
  }
`

export const UpdateChecklistMutation = gql`
  mutation UpdateChecklistById($updateChecklistInput: ChecklistInput!) {
    updateChecklistById(updateChecklistInput: $updateChecklistInput)
  }
`

export const getChecklistQuery = gql`
  query Checklist($skip: Int, $take: Int, $filter: ChecklistFilters, $regionId: Int, $sort: String, $search: String) {
    checklist(skip: $skip, take: $take, filter: $filter, region_id: $regionId, sort: $sort, search: $search) {
      total
      results {
        id
        region_id
        checklist_id
        school_year_id
        grade
        goal
        subject
        status
      }
    }
  }
`
export const createAssignmentMutation = gql`
  mutation CreateNewAssignment($createNewAssignmentInput: CreateNewAssignmentInput!) {
    createNewAssignment(createNewAssignmentInput: $createNewAssignmentInput)
  }
`

export const getAssignmentsByMasterIdgql = gql`
  query GetAssignmentsByMasterId($masterId: Int!, $take: Int, $sort: String, $skip: Int, $search: String) {
    getAssignmentsByMasterId(masterId: $masterId, take: $take, sort: $sort, skip: $skip, search: $search) {
      total
      page_total
      results {
        title
        reminder_date
        master_id
        id
        auto_grade_email
        auto_grade
        due_date
        teacher_deadline
      }
    }
  }
`

export const updateMasterById = gql`
  mutation UpdateMaster($updateMaster: CreateNewMasterInput!) {
    updateMaster(updateMaster: $updateMaster)
  }
`

export const createOrUpdateInstruction = gql`
  mutation CreateOrUpdateInstructions($createOrUpdateInstructions: CreateOrUpdateInstructions!) {
    createOrUpdateInstructions(createOrUpdateInstructions: $createOrUpdateInstructions)
  }
`

export const createOrUpdateLearningLogQuestionMutation = gql`
  mutation CreateOrUpdateLearningLogQuestion(
    $createOrUpdateLearningLogQuestionInput: CreateOrUpdateLearningLogQuestionInput!
  ) {
    createOrUpdateLearningLogQuestion(createOrUpdateLearningLogQuestionInput: $createOrUpdateLearningLogQuestionInput)
  }
`
export const GetLearningLogQuestionByMasterIdQuery = gql`
  query GetLearningLogQuestionByMasterId($masterId: Int!) {
    getLearningLogQuestionByMasterId(masterId: $masterId) {
      id
      master_id
      type
      question
      options
      default_question
      custom_question
      required
      can_upload
    }
  }
`
