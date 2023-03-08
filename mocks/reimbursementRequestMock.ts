import { getReimbursementRequestQuery } from '@mth/graphql/queries/reimbursement-request'
import { ReimbursementRequest } from '@mth/models'

export const reimbursementRequest: ReimbursementRequest = {
  reimbursement_request_id: 1,
  SchoolYearId: 19,
  StudentId: 1,
  form_type: 'TECHNOLOGY',
  periods: null,
  is_direct_order: false,
  date_submitted: '2023-02-14T10:55:18.000Z',
  date_paid: null,
  date_ordered: null,
  total_amount: 30.54,
  status: 'Submitted',
  meta: null,
  Student: {
    student_id: '1',
    person: {
      first_name: 'Firstname',
      last_name: 'Lastname',
      email: 'test@test.com',
      date_of_birth: '2009-06-09T00:00:00.000Z',
    },
    parent: {
      notes: 'Family notes entered from profile.',
      person: {
        first_name: 'Firstname',
        last_name: 'Lastname',
        email: 'test@test.com',
      },
      students: [
        {
          student_id: '1',
          person: {
            first_name: 'Firstname',
            last_name: 'Lastname',
          },
        },
      ],
    },
    grade_levels: [
      {
        school_year_id: '19',
        grade_level: '5',
      },
    ],
    applications: [
      {
        application_id: '1',
        school_year_id: 19,
        midyear_application: true,
      },
    ],
  },
  SchoolYear: {
    reimbursements: 'TECHNOLOGY',
    direct_orders: 'TECHNOLOGY',
    ReimbursementSetting: {
      max_receipts: 10,
      is_merged_periods: true,
      merged_periods: '5,1,3,2,4',
      notification_grades: '5',
    },
  },
  ReimbursementReceipts: [
    {
      reimbursement_receipt_id: 4,
      ReimbursementRequestId: 2,
      file_id: 5128,
      file_name: 'profile.jpeg',
      amount: 30.54,
    },
  ],
  SameTypeRequests: [],
  ReimbursementRequestEmails: []
}

export const reimbursementRequestMock = {
  request: {
    query: getReimbursementRequestQuery,
    variables: { reimbursementRequestId: 1 },
  },
  result: {
    data: {
      reimbursementRequest: reimbursementRequest,
    },
  },
}
