import { EventVM } from '@mth/screens/Admin/Calendar/types'
import { GRADES } from '../constants/grades.constant'

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
          if (i && a[i - 1] !== (v as number) - 1) {
            seq.push([])
          }
          seq[seq.length - 1].push(v as never)
          return seq
        },
        [[]],
      )
      .filter(({ length }: { length: number }) => length > 0)

    for (let i = 0; i < res.length; i++) {
      const reverkIndex = res[i].indexOf(0 as never)
      if (~reverkIndex) res[i][reverkIndex] = 'K' as never

      if (res[i].length > 2) {
        res[i] = (res[i][0] + '-' + res[i][res[i].length - 1]) as never
      }
    }

    result = res.join(',')
    return result.replaceAll(',', ', ')
  }
  return ''
}
