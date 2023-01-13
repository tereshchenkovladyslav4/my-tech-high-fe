import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getStudentDetail } from '@mth/screens/Admin/UserProfile/services'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'

export const useStudentInfo = (
  student_id: number,
): {
  studentInfo: StudentType | undefined
  refetch: () => void
} => {
  const [studentInfo, setStudentInfo] = useState<StudentType>()

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
      setStudentInfo(studentInfoData?.student as StudentType)
    }
  }, [studentInfoLoading, studentInfoData])

  return {
    studentInfo: studentInfo,
    refetch,
  }
}
