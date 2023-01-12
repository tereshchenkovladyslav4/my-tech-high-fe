import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { getStudentDetail } from '@mth/screens/Admin/UserProfile/services'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'

export const useStudentInfo = (
  student_id: number,
): {
  studentInfo: StudentType | undefined
  refetch: () => void
} => {
  const [studentInfo, setStudentInfo] = useState<StudentType>()

  const {
    loading: studentInfoLoading,
    data: studentInfoData,
    refetch,
  } = useQuery(getStudentDetail, {
    variables: {
      student_id: student_id,
    },
    skip: !student_id,
    fetchPolicy: 'network-only',
  })

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
