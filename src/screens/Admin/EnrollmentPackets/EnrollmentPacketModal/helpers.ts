import moment from 'moment'
import { StudentImmunization } from './VaccineView/types'

export function isValidVaccInput(val: string, allowIM: boolean = true) {
  if (val === null) return false
  if (['EXEMPT', 'NA'].includes(val.toUpperCase())) {
    return true
  } else if (val.toUpperCase() === 'IM' && allowIM) {
    return true
  }
  return isValidDate(val)
}
export function isValidDate(date: string) {
  return moment(date, 'MM/DD/YYYY', true).isValid()
}

export function getValidGrade(v: string) {
  if (!v) return -1
  const g = +v
  if (isNaN(g)) {
    return v === 'K' ? 0 : -1
  }
  return g
}

function getDuration(interval: number, date: number) {
  if (!+interval || !+date) return null
  return moment.duration(interval, date === 1 ? 'days' : date === 2 ? 'weeks' : 'months')
}

export function checkImmmValueWithSpacing(item: StudentImmunization, all: StudentImmunization[]) {
  const itemDate = moment(item.value, 'MM/DD/YYYY')
  if (!itemDate.isValid()) return true
  // If it top Vaccine then no need to check for spacing
  if (item.immunization?.consecutive_vaccine === 0) return true

  // Check the consecutive date value
  const conDate = moment(
    all.find((v) => v.immunization_id === item.immunization.consecutive_vaccine + '').value,
    'MM/DD/YYYY',
  )
  if (!conDate.isValid()) return true

  const minDur = getDuration(item.immunization.min_spacing_interval, item.immunization.min_spacing_date)
  const maxDur = getDuration(item.immunization.max_spacing_interval, item.immunization.max_spacing_date)
  // console.log('MinDur', item.immunization.min_spacing_interval, item.immunization.min_spacing_date, '==>', minDur.asDays());
  // console.log('maxDur', item.immunization.max_spacing_interval, item.immunization.max_spacing_date, '==>', maxDur.asDays());
  if (!minDur || !maxDur) return true

  const dur = moment.duration(itemDate.diff(conDate))
  // console.log('dur', dur.asDays());

  return dur.asDays() >= minDur.asDays() && dur.asDays() <= maxDur.asDays()
}
