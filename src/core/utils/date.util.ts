import moment from 'moment'

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

export const convertDateToUTCDate = (date: Date | string | undefined, time = '00:00'): string => {
  return new Date(`${moment(new Date(date || '')).format('yyyy-MM-DD')} ${time}`).toISOString()
}
