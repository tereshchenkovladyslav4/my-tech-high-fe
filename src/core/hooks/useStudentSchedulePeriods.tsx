import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { groupBy, keyBy } from 'lodash'
import { COURSE_TYPE_ITEMS } from '@mth/constants'
import { CourseType, DiplomaSeekingPath, ScheduleStatus } from '@mth/enums'
import { SchedulePeriod } from '@mth/graphql/models/schedule-period'
import { getStudentSchedulePeriodsQuery } from '@mth/graphql/queries/schedule-period'
import { getStudentPeriodsQuery, getStudentProvidersQuery } from '@mth/screens/Homeroom/Schedule/services'
import { Course, Period, Provider, ScheduleData } from '@mth/screens/Homeroom/Schedule/types'

export const makeProviderData = (courses: Course[], altCourses: Course[]): Provider[] => {
  const providers: Provider[] = []
  const providersData = groupBy(courses, 'provider_id')
  for (const key in providersData) {
    providers.push({
      ...providersData[key]?.[0].Provider,
      Courses: providersData[key],
    })
  }
  const altProvidersData = groupBy(altCourses, 'provider_id')
  for (const key in altProvidersData) {
    const index = providers.findIndex((item) => item.id === +key)
    if (index > -1) {
      providers[index].AltCourses = altProvidersData[key]
    } else {
      providers.push({
        ...altProvidersData[key]?.[0].Provider,
        Courses: [],
        AltCourses: altProvidersData[key],
      })
    }
  }
  return providers
}

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
  refetch: () => void
} => {
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [studentScheduleId, setStudentScheduleId] = useState<number>(0)
  const [studentScheduleStatus, setStudentScheduleStatus] = useState<ScheduleStatus>(ScheduleStatus.SUBMITTED)

  // Have to call Providers API individually instead of JOIN in Periods API(For the performance)
  const { loading: loadingProviders, data: providersData } = useQuery(getStudentProvidersQuery, {
    variables: { schoolYearId: school_year_id },
    skip: !school_year_id,
    fetchPolicy: 'network-only',
  })

  const { loading, data: periodsData } = useQuery(getStudentPeriodsQuery, {
    variables: { studentId: student_id, schoolYearId: school_year_id, diplomaSeekingPath: diplomaSeekingPath },
    skip: !student_id || !school_year_id,
    fetchPolicy: 'network-only',
  })

  const {
    loading: studentSchedulePeriodsLoading,
    data: studentSchedulePeriodsData,
    refetch,
  } = useQuery(getStudentSchedulePeriodsQuery, {
    variables: {
      schoolYearId: school_year_id,
      studentId: student_id,
    },
    skip: !student_id || !school_year_id,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && periodsData?.studentPeriods && !loadingProviders && providersData.studentProviders) {
      const studentProviders: { [key: string]: Provider } = keyBy(providersData.studentProviders, 'id')

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

            title.Courses.concat(title.AltCourses).map(
              (course) => (course.Provider = studentProviders[course.provider_id]),
            )
            title.Providers = makeProviderData(title.Courses, title.AltCourses)
          })
          subject.Courses.concat(subject.AltCourses).map(
            (course) => (course.Provider = studentProviders[course.provider_id]),
          )
          subject.Providers = makeProviderData(subject.Courses, subject.AltCourses)
        })
      })

      const scheduleData = groupBy(studentPeriods, 'period')
      const scheduleDataArray: ScheduleData[] = []
      for (const key in scheduleData) {
        scheduleDataArray.push({
          period: +key,
          Periods: scheduleData[key],
          filteredPeriods: scheduleData[key],
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
              item.updateRequired = schedulePeriod.update_required
              if (schedulePeriod.SubjectId)
                item.Subject = period.Subjects?.find((subject) => subject?.subject_id === schedulePeriod.SubjectId)
              if (schedulePeriod.TitleId)
                period.Subjects?.forEach((subject) => {
                  subject.Titles.concat(subject.AltTitles)?.map((title) => {
                    if (title.title_id === schedulePeriod.TitleId) item.Title = title
                  })
                })
              if (schedulePeriod.CourseId)
                period.Subjects?.forEach((subject) => {
                  subject.Courses.concat(subject.AltCourses)?.forEach((course) => {
                    if (course.id === schedulePeriod.CourseId) item.Course = course
                  })
                  subject.Titles.concat(subject.AltTitles)?.forEach((title) => {
                    title.Courses.concat(title.AltCourses)?.forEach((course) => {
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
  }, [loading, periodsData, studentSchedulePeriodsLoading, studentSchedulePeriodsData, loadingProviders, providersData])

  return {
    scheduleData: scheduleData,
    studentScheduleId: studentScheduleId,
    studentScheduleStatus: studentScheduleStatus,
    setScheduleData: setScheduleData,
    setStudentScheduleId: setStudentScheduleId,
    refetch,
  }
}
