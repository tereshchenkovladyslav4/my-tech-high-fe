import { SchoolYearType } from './utils.types'
import moment from 'moment'
import { EventVM } from '../screens/Admin/Calendar/types'
import { GRADES } from './constants'

export const checkEnrollPacketStatus = (schoolYears: SchoolYearType[], student: any): boolean => {
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

export const convertDateToUTCDate = (date: Date | string | undefined, time: string = '00:00') => {
  return new Date(`${moment(new Date(date || '')).format('yyyy-MM-DD')} ${time}`).toISOString()
}

export const getFirstDayAndLastDayOfMonth = (date: Date = new Date()) => {
  const calendarDays: Date[] = []
  let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  let weekdayOfFirstDay = firstDayOfMonth.getDay()
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

export const hexToRgbA = (hexColor: string) => {
  let c: any
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)) {
    c = hexColor.substring(1).split('')
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.4)'
  }
  throw new Error('Bad Hex')
}

export const extractContent = (s: string) => {
  let span = document.createElement('span')
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
    let grades: any[] = []
    grades = GRADES.map((item) => {
      if (
        JSON.parse(selectedEvent?.filters?.grades)
          .filter((item: string) => item != 'all')
          .includes(`${item}`)
      ) {
        return item
      } else return null
    }).filter((item) => item)

    let kIndex = grades.indexOf('Kindergarten')
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
      .filter(({ length }: { length: any }) => length > 0)

    for (let i = 0; i < res.length; i++) {
      let reverkIndex = res[i].indexOf(0)
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
