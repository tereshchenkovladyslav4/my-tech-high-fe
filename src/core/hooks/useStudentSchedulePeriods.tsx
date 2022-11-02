import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { groupBy } from 'lodash'
import { SchedulePeriod } from '@mth/graphql/models/schedule-period'
import { getStudentSchedulePeriodsQuery } from '@mth/graphql/queries/schedule-period'
import { getStudentPeriodsQuery } from '@mth/screens/Homeroom/Schedule/services'
import { Period, ScheduleData } from '@mth/screens/Homeroom/Schedule/types'
import { COURSE_TYPE_ITEMS } from '../constants/course-types.constant'
import { CourseType } from '../enums/course-type.enum'
import { DiplomaSeekingPath } from '../enums/diploma-seeking-path.enum'
import { ScheduleStatus } from '../enums/schedule-status.enums'

export const useStudentSchedulePeriods = (
  student_id: number,
  school_year_id: number | undefined,
  diplomaSeekingPath: DiplomaSeekingPath | null = null,
): {
  scheduleData: ScheduleData[]
  studentScheduleId: number
  studentScheduleStatus: ScheduleStatus
  setScheduleData: (value: ScheduleData[]) => void
  setStudentScheduleId: (value: number) => void
} => {
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [studentScheduleId, setStudentScheduleId] = useState<number>(0)
  const [studentScheduleStatus, setStudentScheduleStatus] = useState<ScheduleStatus>(ScheduleStatus.SUBMITTED)

  const { loading, data: periodsData } = useQuery(getStudentPeriodsQuery, {
    variables: { studentId: student_id, schoolYearId: school_year_id, diplomaSeekingPath: diplomaSeekingPath },
    skip: !student_id || !school_year_id,
    fetchPolicy: 'network-only',
  })

  const { loading: studentSchedulePeriodsLoading, data: studentSchedulePeriodsData } = useQuery(
    getStudentSchedulePeriodsQuery,
    {
      variables: {
        schoolYearId: school_year_id,
        studentId: student_id,
      },
      skip: !student_id || !school_year_id,
      fetchPolicy: 'network-only',
    },
  )

  useEffect(() => {
    if (!loading && periodsData?.studentPeriods) {
      const { studentPeriods } = periodsData
      studentPeriods.map((period: Period) => {
        period.Subjects.map((subject) => {
          subject.Titles.concat(subject.AltTitles || []).map((title) => {
            title.CourseTypes = COURSE_TYPE_ITEMS.filter(
              (item) =>
                (item.value === CourseType.CUSTOM_BUILT && title.custom_built) ||
                item.value === CourseType.MTH_DIRECT ||
                (item.value === CourseType.THIRD_PARTY_PROVIDER && title.third_party_provider),
            )

            title.Providers = []
            const providersData = groupBy(title.Courses, 'provider_id')
            for (const key in providersData) {
              title.Providers.push({
                id: +key,
                name: providersData[key]?.[0].Provider?.name,
                reduce_funds: providersData[key]?.[0].Provider?.reduce_funds,
                reduce_funds_notification: providersData[key]?.[0].Provider?.reduce_funds_notification,
                Courses: providersData[key],
              })
            }
            const altProvidersData = groupBy(title.AltCourses, 'provider_id')
            for (const key in altProvidersData) {
              const index = title.Providers.findIndex((item) => item.id === +key)
              if (index > -1) {
                title.Providers[index].AltCourses = altProvidersData[key]
              } else {
                title.Providers.push({
                  id: +key,
                  name: altProvidersData[key]?.[0].Provider?.name,
                  reduce_funds: providersData[key]?.[0].Provider?.reduce_funds,
                  reduce_funds_notification: providersData[key]?.[0].Provider?.reduce_funds_notification,
                  Courses: [],
                  AltCourses: altProvidersData[key],
                })
              }
            }
          })
        })
      })

      const scheduleData = groupBy(studentPeriods, 'period')
      const scheduleDataArray: ScheduleData[] = []
      for (const key in scheduleData) {
        scheduleDataArray.push({
          period: +key,
          Periods: scheduleData[key],
        })
      }

      if (!studentSchedulePeriodsLoading && studentSchedulePeriodsData?.schedulePeriods) {
        const { schedulePeriods } = studentSchedulePeriodsData
        schedulePeriods.map((schedulePeriod: SchedulePeriod) => {
          scheduleDataArray.map((item) => {
            const period = item?.Periods?.find((periodItem) => periodItem?.id === schedulePeriod?.PeriodId)
            if (period) {
              item.Period = period
              item.schedulePeriodId = schedulePeriod.schedule_period_id
              if (schedulePeriod.SubjectId)
                item.Subject = period.Subjects?.find((subject) => subject?.subject_id === schedulePeriod.SubjectId)
              if (schedulePeriod.TitleId)
                period.Subjects?.map((subject) => {
                  subject.Titles?.map((title) => {
                    if (title.title_id === schedulePeriod.TitleId) item.Title = title
                  })
                })
              if (schedulePeriod.CourseId)
                period.Subjects?.map((subject) => {
                  subject.Titles?.map((title) => {
                    title.Courses?.map((course) => {
                      if (course.id === schedulePeriod.CourseId) item.Course = course
                    })
                  })
                })
              if (schedulePeriod.course_type) item.CourseType = schedulePeriod.course_type as CourseType
              if (schedulePeriod.course_type === CourseType.CUSTOM_BUILT)
                item.CustomBuiltDescription = schedulePeriod.custom_build_description
              if (schedulePeriod.course_type === CourseType.MTH_DIRECT && schedulePeriod.osse_coures_name)
                item.OnSiteSplitEnrollment = {
                  courseName: schedulePeriod.osse_coures_name,
                  districtSchool: schedulePeriod.osse_district_school,
                  schoolDistrictName: schedulePeriod.osse_school_district_name,
                }
              if (schedulePeriod.course_type === CourseType.THIRD_PARTY_PROVIDER)
                item.ThirdParty = {
                  providerName: schedulePeriod.tp_provider_name,
                  courseName: schedulePeriod.tp_course_name,
                  phoneNumber: schedulePeriod.tp_phone_number,
                  specificCourseWebsite: schedulePeriod.tp_specific_course_website,
                  additionalWebsite: schedulePeriod.tp_addtional_specific_course_website
                    ? JSON.parse(schedulePeriod.tp_addtional_specific_course_website)
                    : '',
                }
            }
          })
        })
        setStudentScheduleId(schedulePeriods[0]?.ScheduleId)
        setStudentScheduleStatus(schedulePeriods[0]?.Schedule?.status)
      }

      setScheduleData(scheduleDataArray)
    }
  }, [loading, periodsData, studentSchedulePeriodsLoading, studentSchedulePeriodsData])

  return {
    scheduleData: scheduleData,
    studentScheduleId: studentScheduleId,
    studentScheduleStatus: studentScheduleStatus,
    setScheduleData: setScheduleData,
    setStudentScheduleId: setStudentScheduleId,
  }
}
