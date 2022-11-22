import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { groupBy, keyBy } from 'lodash'
import { COURSE_TYPE_ITEMS } from '@mth/constants'
import { CourseType, DiplomaSeekingPath } from '@mth/enums'
import { SchedulePeriodHistory } from '@mth/graphql/models/schedule-period'
import { getStudentSchedulePeriodHistoriesQuery } from '@mth/graphql/queries/schedule-period'
import { ScheduleHistoryData } from '@mth/screens/Admin/EnrollmentSchedule/ScheduleBuilder/ScheduleHistory/types'
import { getStudentPeriodsQuery, getStudentProvidersQuery } from '@mth/screens/Homeroom/Schedule/services'
import { Period, Provider, ScheduleData } from '@mth/screens/Homeroom/Schedule/types'
import { makeProviderData } from './useStudentSchedulePeriods'

export const useStudentSchedulePeriodHistories = (
  student_id: number,
  school_year_id: number | undefined,
  diplomaSeekingPath: DiplomaSeekingPath | null = null,
): {
  scheduleDataHistory: ScheduleHistoryData[]
  setScheduleDataHistory: (value: ScheduleHistoryData[]) => void
  refetch: () => void
} => {
  const [scheduleDataHistory, setScheduleDataHistory] = useState<ScheduleHistoryData[]>([])

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
    loading: studentSchedulePeriodHistoryLoading,
    data: studentSchedulePeriodHistoryData,
    refetch,
  } = useQuery(getStudentSchedulePeriodHistoriesQuery, {
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
      const scheduleDataHistoryDataArray: ScheduleHistoryData[] = []
      for (const key in scheduleData) {
        scheduleDataArray.push({
          period: +key,
          Periods: scheduleData[key],
          filteredPeriods: scheduleData[key],
        })
      }

      if (!studentSchedulePeriodHistoryLoading && studentSchedulePeriodHistoryData?.schedulePeriodHistories) {
        const { schedulePeriodHistories } = studentSchedulePeriodHistoryData
        schedulePeriodHistories.map((schedulePeriodHistory: SchedulePeriodHistory) => {
          if (
            scheduleDataHistoryDataArray.find(
              (item) => item.scheduleHistoryId == schedulePeriodHistory.ScheduleHistoryId,
            )
          ) {
            scheduleDataHistoryDataArray.map((historyData) => {
              if (historyData.scheduleHistoryId == schedulePeriodHistory.ScheduleHistoryId) {
                historyData.schedulePeriodHistory?.push(schedulePeriodHistory)
              }
            })
          } else {
            scheduleDataHistoryDataArray.push({
              scheduleHistoryId: schedulePeriodHistory.ScheduleHistoryId,
              acceptedDate: schedulePeriodHistory.ScheduleHistory.date_accepted,
              scheduleData: scheduleDataArray,
              schedulePeriodHistory: [schedulePeriodHistory],
              isExpand: false,
            })
          }
        })

        scheduleDataHistoryDataArray.map((historyData) => {
          historyData.schedulePeriodHistory?.map((schedulePeriodHistory: SchedulePeriodHistory) => {
            historyData.scheduleData.map((item) => {
              const period = item?.Periods?.find((periodItem) => periodItem?.id === schedulePeriodHistory?.PeriodId)
              if (period) {
                item.Period = period
                item.schedulePeriodId = schedulePeriodHistory.schedule_period_history_id
                item.updateRequired = schedulePeriodHistory.update_required
                if (schedulePeriodHistory.SubjectId)
                  item.Subject = period.Subjects?.find(
                    (subject) => subject?.subject_id === schedulePeriodHistory.SubjectId,
                  )
                if (schedulePeriodHistory.TitleId)
                  period.Subjects?.forEach((subject) => {
                    subject.Titles.concat(subject.AltTitles)?.map((title) => {
                      if (title.title_id === schedulePeriodHistory.TitleId) item.Title = title
                    })
                  })
                if (schedulePeriodHistory.CourseId)
                  period.Subjects?.forEach((subject) => {
                    subject.Courses.concat(subject.AltCourses)?.forEach((course) => {
                      if (course.id === schedulePeriodHistory.CourseId) item.Course = course
                    })
                    subject.Titles.concat(subject.AltTitles)?.forEach((title) => {
                      title.Courses.concat(title.AltCourses)?.forEach((course) => {
                        if (course.id === schedulePeriodHistory.CourseId) item.Course = course
                      })
                    })
                  })
                if (schedulePeriodHistory.course_type) item.CourseType = schedulePeriodHistory.course_type as CourseType
                if (schedulePeriodHistory.course_type === CourseType.CUSTOM_BUILT)
                  item.CustomBuiltDescription = schedulePeriodHistory.custom_build_description
                if (
                  schedulePeriodHistory.course_type === CourseType.MTH_DIRECT &&
                  schedulePeriodHistory.osse_course_name
                )
                  item.OnSiteSplitEnrollment = {
                    courseName: schedulePeriodHistory.osse_course_name,
                    districtSchool: schedulePeriodHistory.osse_district_school,
                    schoolDistrictName: schedulePeriodHistory.osse_school_district_name,
                  }
                if (schedulePeriodHistory.course_type === CourseType.THIRD_PARTY_PROVIDER)
                  item.ThirdParty = {
                    providerName: schedulePeriodHistory.tp_provider_name,
                    courseName: schedulePeriodHistory.tp_course_name,
                    phoneNumber: schedulePeriodHistory.tp_phone_number,
                    specificCourseWebsite: schedulePeriodHistory.tp_specific_course_website,
                    additionalWebsite: schedulePeriodHistory.tp_additional_specific_course_website
                      ? JSON.parse(schedulePeriodHistory.tp_additional_specific_course_website)
                      : '',
                  }
              }
            })
          })
        })
      }

      setScheduleDataHistory(
        scheduleDataHistoryDataArray?.sort((a, b) => {
          return b.scheduleHistoryId - a.scheduleHistoryId
        }),
      )
    }
  }, [
    loading,
    periodsData,
    studentSchedulePeriodHistoryLoading,
    studentSchedulePeriodHistoryData,
    loadingProviders,
    providersData,
  ])

  return {
    scheduleDataHistory: scheduleDataHistory,
    setScheduleDataHistory: setScheduleDataHistory,
    refetch,
  }
}
