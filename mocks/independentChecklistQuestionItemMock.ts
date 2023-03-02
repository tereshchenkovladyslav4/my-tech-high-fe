import { ChecklistEnum } from '@mth/enums'
import { LearningLogQuestion } from '@mth/models'
import { getChecklistQuery } from '@mth/screens/Admin/HomeRoom/services'

export const checkListQueryMock = [
  {
    request: {
      query: getChecklistQuery,
      variables: {
        take: -1,
        regionId: 1,
        filter: {
          status: ChecklistEnum.INDEPENDENT,
          selectedYearId: 19,
        },
      },
    },
    result: {
      data: {
        checklist: {
          total: 11,
          results: [
            {
              id: 454,
              region_id: 1,
              checklist_id: '2021-110',
              school_year_id: 19,
              grade: 0,
              goal: 'test',
              subject: null,
              status: 'Independent Checklist',
              file_name: 'independent_checklist.xlsx',
            },
            {
              id: 456,
              region_id: 1,
              checklist_id: '2021-111',
              school_year_id: 19,
              grade: 0,
              goal: 'Depth of knowledge across multiple subject areas',
              subject: null,
              status: 'Independent Checklist',
              file_name: 'independent_checklist.xlsx',
            },
            {
              id: 455,
              region_id: 1,
              checklist_id: '2021-112',
              school_year_id: 19,
              grade: 0,
              goal: 'Physical, social, mental, and emotional well-being',
              subject: null,
              status: 'Independent Checklist',
              file_name: 'independent_checklist.xlsx',
            },
            {
              id: 457,
              region_id: 1,
              checklist_id: '2021-113',
              school_year_id: 19,
              grade: 0,
              goal: 'Civic responsibility, integrity, and community service',
              subject: null,
              status: 'Independent Checklist',
              file_name: 'independent_checklist.xlsx',
            },
          ],
        },
      },
    },
  },
]
export const checkListQueryWrongMock = [
  {
    request: {
      query: getChecklistQuery,
      variables: {
        take: -1,
        regionId: 1,
        filter: {
          status: 'Independent Checklist',
          selectedYearId: 19,
        },
      },
    },
    result: {
      data: {
        checklist: {
          total: 0,
          results: [],
        },
      },
    },
  },
]

export const questionMock: LearningLogQuestion = {
  id: 635,
  assignment_id: 7,
  slug: 'meta_1677614797245',
  parent_slug: '',
  question: 'Independent Question Test',
  type: 'INDEPENDENT_QUESTION',
  options: 'null',
  default_question: false,
  grades: '',
  order: 1,
  page: 1,
  validations: '["required"]',
  required: true,
  Validations: ['required'],
  Options: [],
  Grades: [],
  active: true,
}
