import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Student } from '@mth/models'
import { getStudentDetail } from '@mth/screens/Admin/UserProfile/services'

export const useStudentInfo = (
  student_id: number,
): {
  studentInfo: Student | undefined
  refetch: () => void
} => {
  const [studentInfo, setStudentInfo] = useState<Student>()

  const [getStudentInfo, { loading: studentInfoLoading, data: studentInfoData, refetch }] = useLazyQuery(
    getStudentDetail,
    {
      fetchPolicy: 'network-only',
    },
  )

  useEffect(() => {
    if (student_id) {
      getStudentInfo({
        variables: {
          student_id: student_id,
        },
      })
    }
  }, [student_id])

  useEffect(() => {
    if (!studentInfoLoading && studentInfoData) {
      setStudentInfo(studentInfoData?.student as Student)
    }
  }, [studentInfoLoading, studentInfoData])

  return {
    studentInfo: studentInfo,
    refetch,
  }
}
