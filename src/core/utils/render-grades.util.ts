import { GRADES } from '../constants/grades.constant'

/**
 * @param {(string | number)[]} GRADES
 * @param {string | undefined} gradesStr
 * @description convert 'Kindergarten' to 'K', set dash if the sequence value length > 3
 * @logic divide array into sub arrays with same sub lengths, and set the dash values
 * @example ['kindergarten',1,2,4,7,9,10,11,12] => ['kindergarten,1,2],[4],[7],[9,10,11,12] => k-2,4,7,9-12
 * @return converted string from array
 */
export const renderGrades = (gradesStr: string | undefined): string => {
  if (!gradesStr) return ''

  const decodedGrades: string[] = gradesStr.split(',').filter((item: string) => item != 'all')
  const grades = GRADES.filter((item) => decodedGrades.includes(`${item}`)).map((item) =>
    item == 'Kindergarten' ? 0 : Number(item),
  )

  return grades
    ?.reduce(
      (seq, v, i, a) => {
        if (i && a[i - 1] !== v - 1) {
          seq.push([])
        }
        seq[seq.length - 1].push(v || 'K')
        return seq
      },
      [[]] as (string | number)[][],
    )
    .filter(({ length }: { length: number }) => length > 0)
    .map((item) => (item.length > 2 ? item[0] + '-' + item[item.length - 1] : item))
    .join(', ')
}
