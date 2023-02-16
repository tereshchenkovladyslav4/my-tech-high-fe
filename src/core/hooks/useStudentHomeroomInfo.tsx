import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getStudentHomeroomInfoQuery } from '@mth/graphql/queries/student-homeroom'
import { ClassInfo } from '../models/class-info.model'

export const useStudentHomeroomInfo = (
  student_id: number,
  school_year_id: number,
): {
  className: string
  teacherName: string
} => {
  const [className, setClassName] = useState<string>('')
  const [teacherName, setTeacherName] = useState<string>('')

  const [getStudentHomeroomInfo, { loading: studentInfoLoading, data: studentInfoData }] = useLazyQuery(
    getStudentHomeroomInfoQuery,
    {
      fetchPolicy: 'network-only',
    },
  )

  useEffect(() => {
    if (student_id && school_year_id) {
      getStudentHomeroomInfo({
        variables: {
          schoolYearId: school_year_id,
          studentId: student_id,
        },
      })
    }
  }, [student_id, school_year_id])

  useEffect(() => {
    if (!studentInfoLoading && studentInfoData?.studentHomeroomInfo) {
      const classInfo: ClassInfo = studentInfoData?.studentHomeroomInfo.Class
      if (classInfo) {
        setClassName(classInfo.class_name)
        setTeacherName(`${classInfo.PrimaryTeacher?.first_name || ''} ${classInfo.PrimaryTeacher?.last_name || ''}`)
      }
    }
  }, [studentInfoLoading, studentInfoData])

  return {
    className: className,
    teacherName: teacherName,
  }
}
