import { ScheduleStatus } from '@mth/enums'
import { makeScheduleData } from '@mth/hooks/useStudentSchedulePeriods'
import { schedulePeriods } from '@mth/mocks/schedulePeriodsMock'
import { studentPeriods } from '@mth/mocks/studentPeriodsMock'
import { studentProviders } from '@mth/mocks/studentProvidersMock'

describe('makeScheduleData', () => {
  it('should return schedule data', () => {
    const {
      firstScheduleData,
      secondScheduleData,
      hasSecondSemesterSchedule,
      hasUnlockedPeriods,
      studentScheduleId,
      studentScheduleStatus,
      secondSemesterScheduleId,
      firstSemesterScheduleId,
    } = makeScheduleData(studentPeriods, studentProviders, schedulePeriods)
    expect(firstScheduleData).toBeDefined()
    expect(secondScheduleData).toBeDefined()
    expect(hasSecondSemesterSchedule).toBe(true)
    expect(hasUnlockedPeriods).toBe(false)
    expect(studentScheduleId).toBeGreaterThan(0)
    expect(studentScheduleStatus).toBe(ScheduleStatus.SUBMITTED)
    expect(secondSemesterScheduleId).toBeGreaterThan(0)
    expect(firstSemesterScheduleId).toBeGreaterThan(0)

    // Check semester only titles
    secondScheduleData.map((scheduleData) => {
      scheduleData.Subject?.Titles.concat(scheduleData.Subject?.AltTitles || []).map((title) => {
        expect(title.always_unlock || title.title_id == scheduleData.FirstSemesterSchedule?.Title?.title_id).toBe(true)
      })
      scheduleData.Periods.concat(scheduleData.filteredPeriods || [])
        .concat(scheduleData.Period ? [scheduleData.Period] : [])
        .map((period) => {
          period.Subjects?.map((subject) => {
            subject.Titles.concat(subject.AltTitles).map((title) => {
              expect(title.always_unlock || title.title_id == scheduleData.FirstSemesterSchedule?.Title?.title_id).toBe(
                true,
              )
            })
          })
        })
    })
  })
})
