import { SchoolYearType } from './utils.types'
import moment from 'moment'

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
