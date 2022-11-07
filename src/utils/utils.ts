import moment from 'moment'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { EventVM } from '../screens/Admin/Calendar/types'
import { GRADES } from './constants'
import { SchoolYearType } from './utils.types'

export const checkEnrollPacketStatus = (schoolYears: SchoolYearType[], student: StudentType): boolean => {
  if (student?.status && student?.status?.at(-1)?.status != 0) return true
  if (schoolYears.length > 0) {
    const studentSchoolYear: SchoolYearType[] = schoolYears?.filter(
      (item) => item.school_year_id == student?.current_school_year_status?.school_year_id,
    )

    return (studentSchoolYear?.length > 0 && studentSchoolYear?.at(-1)?.enrollment_packet) || false
  } else {
    return false
  }
}

export const convertDateToUTCDate = (date: Date | string | undefined, time = '00:00'): string => {
  return new Date(`${moment(new Date(date || '')).format('yyyy-MM-DD')} ${time}`).toISOString()
}

export const getFirstDayAndLastDayOfMonth = (date: Date = new Date()): { firstDay?: Date; lastDay?: Date } => {
  const calendarDays: Date[] = []
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const weekdayOfFirstDay = firstDayOfMonth.getDay()
  for (let cell = 1; cell < 43; cell++) {
    if (cell === 1 && weekdayOfFirstDay === 0) {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 6)
    } else if (cell === 1) {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (cell - weekdayOfFirstDay))
    } else {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1)
    }
    if (cell === 7 && !(firstDayOfMonth.getMonth() === date.getMonth())) {
      calendarDays.splice(0)
      continue
    }

    if (cell === 36 && !(firstDayOfMonth.getMonth() === date.getMonth())) {
      break
    }

    calendarDays.push(new Date(firstDayOfMonth))
  }

  return { firstDay: calendarDays?.at(0), lastDay: calendarDays?.at(-1) }
}

export const hexToRgbA = (hexColor: string): string => {
  let c: string[] | string | number
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)) {
    c = hexColor.substring(1).split('')
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return (
      'rgba(' +
      [
        ((c as unknown as number) >> 16) & 255,
        ((c as unknown as number) >> 8) & 255,
        (c as unknown as number) & 255,
      ].join(',') +
      ',0.4)'
    )
  }
  throw new Error('Bad Hex')
}

export const extractContent = (s: string): string | null => {
  const span = document.createElement('span')
  span.innerHTML = s
  return span.textContent || span.innerText
}

export const renderDate = (selectedEvent: EventVM | undefined): string => {
  const startTime = moment(selectedEvent?.startDate).format('hh:mm A')
  const startDate = moment(selectedEvent?.startDate).format('MMMM DD')
  const endDate = moment(selectedEvent?.endDate).format('MMMM DD')

  if (!selectedEvent?.allDay) {
    if (startDate === endDate) return `${startTime}, ${startDate}`
    else return `${startTime}, ${startDate} - ${endDate}`
  } else {
    if (startDate === endDate) return `${endDate}`
    else return `${startDate} - ${endDate}`
  }
}

/**
 * @param {(string | number)[]} GRADES
 * @param {EventVM} selectedEvent
 * @description convert 'Kindergarten' to 'K', set dash if the sequence value length > 3
 * @logic divide array into sub arrays with same sub lengths, and set the dash values
 * @example ['kindergarten',1,2,4,7,9,10,11,12] => ['kindergarten,1,2],[4],[7],[9,10,11,12] => k-2,4,7,9-12
 * @return converted string from array
 */
export const renderFilter = (selectedEvent: EventVM | undefined): string => {
  let result = ''
  if (selectedEvent?.filters?.grades) {
    let grades: (string | number | null)[] = []
    grades = GRADES.map((item) => {
      if (
        JSON.parse(selectedEvent?.filters?.grades)
          .filter((item: string) => item != 'all')
          .includes(`${item}`)
      ) {
        return item
      } else return null
    }).filter((item) => item)

    const kIndex = grades.indexOf('Kindergarten')
    if (~kIndex) grades[kIndex] = 0

    const res = grades
      ?.reduce(
        (seq, v, i, a) => {
          if (i && a[i - 1] !== v - 1) {
            seq.push([])
          }
          seq[seq.length - 1].push(v)
          return seq
        },
        [[]],
      )
      .filter(({ length }: { length: number }) => length > 0)

    for (let i = 0; i < res.length; i++) {
      const reverkIndex = res[i].indexOf(0)
      if (~reverkIndex) res[i][reverkIndex] = 'K'

      if (res[i].length > 2) {
        res[i] = res[i][0] + '-' + res[i][res[i].length - 1]
      }
    }

    result = res.join(',')
    return result.replaceAll(',', ', ')
  }
  return ''
}

export const getPreviousSchoolYearId = (
  currentYearId: string | number,
  schoolYears: SchoolYearType[],
): string | number | undefined => {
  const currentShoolYear = schoolYears.find((year: SchoolYearType) => year.school_year_id == currentYearId)
  let previousYearId
  if (currentShoolYear) {
    const year = currentShoolYear.date_begin?.split('-')?.[0]
    if (year) {
      const previousYear = parseInt(year) - 1
      previousYearId = schoolYears.find((year: SchoolYearType) =>
        year.date_begin?.includes(`${previousYear}-`),
      )?.school_year_id
    }
  }
  return previousYearId
}

export const extractAllNumFromStr = (str: string): Array<number> => {
  const nums = str.match(/\d+/g)
  if (nums) return nums.map(Number)
  else return []
}

export const phoneFormat = (phone: string): string => {
  phone = phone.replaceAll('-', '')
  return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
}
