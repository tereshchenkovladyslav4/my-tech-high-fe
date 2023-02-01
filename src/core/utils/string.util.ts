import moment from 'moment'
import { EventVM } from '@mth/screens/Admin/Calendar/types'
/**
 * @param {number} number
 * @description convert to ordinal number
 * @return converted string
 */
export const toOrdinalSuffix = (number: number): string => {
  const digits = [number % 10, number % 100],
    ordinals = ['st', 'nd', 'rd', 'th'],
    oPattern = [1, 2, 3, 4],
    tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19]
  return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
    ? number + ordinals[digits[0] - 1]
    : number + ordinals[3]
}

export const extractAllNumFromStr = (str: string): Array<number> => {
  const nums = str.match(/\d+/g)
  if (nums) return nums.map(Number)
  else return []
}

export const ordinalSuffixOf = (num: number | string): string => {
  const i: number = +num
  if (!i) return num as string
  const j = i % 10
  const k = i % 100
  if (j == 1 && k != 11) return i + 'st'
  if (j == 2 && k != 12) return i + 'nd'
  if (j == 3 && k != 13) return i + 'rd'
  return i + 'th'
}

export const extractContent = (s: string): string => {
  const span = document.createElement('span')
  span.innerHTML = s
  return span.textContent || span.innerText || ''
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

export const phoneFormat = (phone: string): string => {
  if (!phone) {
    return ''
  }
  phone = phone.replaceAll('-', '')
  return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
}

export const arrayToString = (value: string[] | number[]): string => {
  let str = ''
  if (value?.length) {
    value?.map((item, index) => {
      if (index < value?.length - 1) {
        if (index == 0) {
          str = `${item}`
        } else {
          str = str + `, ${item}`
        }
      } else {
        str = str + ` and ${item}`
      }
    })
  }
  return str
}

export const renderCommaString = (str: string | undefined | null): string => {
  const list = str?.split(',') || []
  return list.map((x, i) => (list.length > 1 && i === list.length - 1 ? `& ${x}` : x)).join(', ')
}
