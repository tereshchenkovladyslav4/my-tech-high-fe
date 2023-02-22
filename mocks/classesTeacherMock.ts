import { GetTeachersByUserIdQuery } from '@mth/screens/Teacher/services/teachers'
export const classesTeacherMock = {
  request: {
    query: GetTeachersByUserIdQuery,
    variables: { userId: 8788 },
  },
  data: {
    results: {
      getTeachersByUserId: {
        results: [
          {
            class_id: 10,
            master_id: 18,
            class_name: 'Test123',
            primary_id: 8788,
            addition_id: null,
            created_at: '2022-12-08T20:58:50.000Z',
            PrimaryTeacher: {
              user_id: 8788,
              email: 'charisseaj+azteacher1@codev.com',
              password: '6e20e934de1237a3ea91523fd7468342',
              first_name: 'Teacher1',
              last_name: 'Arizona',
              level: 16,
              created_at: '2022-12-08T20:27:53.155Z',
              updated_at: '2023-02-21T11:58:41.000Z',
            },
            HomeroomStudents: [
              {
                id: 28,
                student_id: 2613,
                school_year_id: 13,
                class_id: 2,
                auto_grade: '',
              },
            ],
            ungraded: 0,
          },
          {
            class_id: 8,
            master_id: 18,
            class_name: 'Arcadia',
            primary_id: 8148,
            addition_id:
              '[{"first_name":"Teacher1","last_name":"Arizona","user_id":"8788"},{"first_name":"Janet","last_name":"Cox","user_id":"8790"}]',
            created_at: '2022-12-08T20:32:31.000Z',
            PrimaryTeacher: {
              user_id: 8148,
              email: 'nairan+237t4t@codev.com',
              password: '7d73217f4bb81f2e22699667159b8c5d',
              first_name: 'nairan',
              last_name: '237t4t',
              level: 16,
              created_at: '2022-04-20T18:33:35.326Z',
              updated_at: '2022-04-20T18:34:38.000Z',
            },
            HomeroomStudents: [
              {
                id: 11,
                student_id: 2955,
                school_year_id: 19,
                class_id: 8,
                auto_grade: '',
              },
              {
                id: 12,
                student_id: 2954,
                school_year_id: 19,
                class_id: 8,
                auto_grade: '',
              },
              {
                id: 13,
                student_id: 3038,
                school_year_id: 19,
                class_id: 8,
                auto_grade: '',
              },
              {
                id: 30,
                student_id: 3254,
                school_year_id: 19,
                class_id: 8,
                auto_grade: '',
              },
              {
                id: 31,
                student_id: 3385,
                school_year_id: 19,
                class_id: 8,
                auto_grade: '',
              },
              {
                id: 34,
                student_id: 3382,
                school_year_id: 19,
                class_id: 8,
                auto_grade: '',
              },
              {
                id: 39,
                student_id: 2964,
                school_year_id: 19,
                class_id: 8,
                auto_grade: '0',
              },
              {
                id: 40,
                student_id: 3387,
                school_year_id: 19,
                class_id: 8,
                auto_grade: '',
              },
            ],
            ungraded: 0,
          },
        ],
      },
    },
  },
}
