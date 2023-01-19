import moment from 'moment'
import { SchoolYear } from '@mth/models'
import { SchoolYearType } from '../models/school-year-type.model'

export const getPreviousSchoolYearId = (
  currentYearId: string | number,
  schoolYears: SchoolYearType[],
): string | number | undefined => {
  const currentSchoolYear = schoolYears.find((year: SchoolYearType) => year.school_year_id == currentYearId)
  let previousYearId
  if (currentSchoolYear) {
    const year = currentSchoolYear.date_begin?.split('-')?.[0]
    if (year) {
      const previousYear = parseInt(year) - 1
      previousYearId = schoolYears.find((year: SchoolYearType) =>
        year.date_begin?.includes(`${previousYear}-`),
      )?.school_year_id
    }
  }
  return previousYearId
}

export const schoolYearLabel = (schoolYear: SchoolYear | undefined): string => {
  if (schoolYear && schoolYear.date_begin && schoolYear.date_end) {
    return `${moment(schoolYear?.date_begin).format('YYYY')}-${moment(schoolYear?.date_end).format('YY')}`
  }
  return ''
}
