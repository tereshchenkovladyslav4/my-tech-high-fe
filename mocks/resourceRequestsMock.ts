import { getResourceRequestsQuery } from '@mth/graphql/queries/resource-request'
import { ResourceRequest } from '@mth/models'

export const resourceRequests: ResourceRequest[] = [
  {
    id: 21,
    student_id: 3379,
    resource_id: 335,
    resource_level_id: null,
    status: 'ACCEPTED',
    username: 'demo',
    password: 'demo',
    created_at: '2023-01-09T22:59:13.000Z',
    updated_at: '2023-02-24T01:07:51.726Z',
    Student: {
      student_id: '3379',
      username_first_last: 'agetestdemo1',
      username_last_first: 'demo1agetest',
      username_last_first_year: 'demo1agetest2022',
      username_last_firstinitial: 'demo1a',
      username_last_first_mth: 'demo1agetestmth',
      username_last_first_birth: 'demo1agetest2022',
      username_first_last_domain: 'agetestdemo1@mytechhigh.com',
      username_student_email: 'nairan+agetest@codev.com',
      username_parent_email: 'nairan+12345@codev.com',
      person: {
        first_name: 'agetest',
        last_name: 'demo1',
        email: 'nairan+agetest@codev.com',
        date_of_birth: '2022-11-21T00:00:00.000Z',
      },
      parent: {
        person: {
          first_name: '568ar',
          last_name: 'parent',
          email: 'nairan+12345@codev.com',
        },
      },
      applications: [
        {
          midyear_application: false,
          school_year_id: 19,
        },
      ],
      status: [
        {
          school_year_id: 19,
          status: 1,
        },
      ],
      grade_levels: [
        {
          school_year_id: '19',
          grade_level: '1',
        },
      ],
    },
    Resource: {
      subtitle: 'price',
      price: 10,
      std_username_format: 'GENERIC',
      std_user_name: 'demo',
      std_password: 'demo',
      title: '748 demo',
      ResourceLevels: [],
    },
    ResourceLevel: {
      name: 'demo2',
    },
    ResourceRequestEmails: [],
  },
]

export const resourceRequestsMock = {
  request: {
    query: getResourceRequestsQuery,
    variables: {
      schoolYearId: 19,
      filter: {},
      skip: 0,
      take: 25,
      sort: 'created_at|asc',
      search: '',
    },
  },
  result: {
    data: {
      resourceRequests: {
        results: resourceRequests,
        total: 1,
      },
    },
  },
}
