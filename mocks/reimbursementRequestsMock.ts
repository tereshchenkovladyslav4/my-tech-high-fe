import { getReimbursementRequestsQuery } from '@mth/graphql/queries/reimbursement-request'
import { ReimbursementRequest } from '@mth/models'

export const reimbursementRequests: ReimbursementRequest[] = [
  {
    reimbursement_request_id: 3,
    form_type: 'TECHNOLOGY',
    periods: null,
    is_direct_order: false,
    date_submitted: '2023-02-21T18:17:01.000Z',
    date_paid: null,
    date_ordered: null,
    total_amount: 3526.26,
    status: 'Submitted',
    Student: {
      student_id: '3690',
      person: {
        first_name: 'StudentFirstname',
        last_name: 'StudentLastname',
        email: 'student@test.com',
        date_of_birth: '2016-02-10T00:00:00.000Z',
      },
      parent: {
        person: {
          first_name: 'ParentFirstname',
          last_name: 'ParentLastname',
          email: 'parent@test.com',
        },
      },
      grade_levels: [
        {
          school_year_id: '19',
          grade_level: 'Kindergarten',
        },
      ],
    },
  },
]

export const reimbursementRequestsMock = {
  request: {
    query: getReimbursementRequestsQuery,
    variables: {
      schoolYearId: 19,
      filter: {},
      skip: 0,
      take: 25,
      sort: 'date_submitted|asc',
      search: '',
    },
  },
  result: {
    data: {
      reimbursementRequests: {
        results: reimbursementRequests,
        total: 1,
      },
    },
  },
}
