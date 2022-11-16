import { gql } from '@apollo/client'

export const createOrUpdateResourceMutation = gql`
  mutation CreateOrUpdateResource($createResourceInput: CreateOrUpdateResourceInput!) {
    createOrUpdateResource(createResourceInput: $createResourceInput) {
      resource_id
    }
  }
`

export const deleteResourceMutation = gql`
  mutation DeleteResource($resourceId: Float!) {
    deleteResource(resource_id: $resourceId)
  }
`

export const createOrUpdateScheduleBuilder = gql`
  mutation CreateOrUpdateScheduleBuilder($scheduleBuilderInput: CreateScheduleBuilderInput!) {
    createOrUpdateScheduleBuilder(scheduleBuilderInput: $scheduleBuilderInput) {
      id
      max_num_periods
      custom_built
      split_enrollment
      always_unlock
      parent_tooltip
      school_year_id
      third_party_provider
    }
  }
`

export const getScheduleBuilder = gql`
  query Schoolyear_getcurrent($regionId: Int!) {
    schoolyear_getcurrent(region_id: $regionId) {
      ScheduleBuilder {
        id
        max_num_periods
        custom_built
        split_enrollment
        always_unlock
        parent_tooltip
        school_year_id
        third_party_provider
      }
    }
  }
`

export const getSchoolYear = gql`
  query GetSchoolYear($school_year_id: ID!) {
    getSchoolYear(school_year_id: $school_year_id) {
      school_year_id
      ScheduleBuilder {
        id
        max_num_periods
        custom_built
        split_enrollment
        always_unlock
        parent_tooltip
        school_year_id
        third_party_provider
      }
    }
  }
`
// =============================================================
//                  Period
// =============================================================

export const getPeriods = gql`
  query Periods($school_year_id: ID!, $archived: Boolean, $keyword: String) {
    periods(school_year_id: $school_year_id, archived: $archived, keyword: $keyword) {
      id
      period
      reduce_funds
      price
      min_grade
      max_grade
      notify_period
      notify_semester
      message_period
      message_semester
      semester
      category
      archived
    }
    periodIds(school_year_id: $school_year_id)
  }
`
export const upsertPeriod = gql`
  mutation periodUpsert($PeriodInput: PeriodInput!) {
    periodUpsert(PeriodInput: $PeriodInput) {
      id
      period
      reduce_funds
      price
      min_grade
      max_grade
      notify_period
      notify_semester
      message_period
      message_semester
      semester
      category
      archived
    }
  }
`
export const periodArchive = gql`
  mutation periodArchive($id: Int!, $archived: Boolean!) {
    periodArchive(id: $id, archived: $archived) {
      id
      archived
    }
  }
`
export const deletePeriodsByIds = gql`
  mutation periodDeleteByIds($ids: [ID!]!) {
    periodDeleteByIds(ids: $ids) {
      affected
    }
  }
`
