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
