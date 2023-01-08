import { extractAllNumFromStr } from './string.util'

export const convertWidth = (str: string | number, total: number): number => {
  let returnVal = 0
  if (typeof str === 'string') {
    // calc(25% -48px)
    if (str.includes('calc')) {
      const nums: Array<number> = extractAllNumFromStr(str)
      returnVal = (nums[0] * total) / 100 - nums[1]
    } else if (str.includes('%')) {
      returnVal = (Number(str.replace('%', '')) * total) / 100
    } else if (str.includes('px')) {
      returnVal = Number(str.replace('px', ''))
    }
  }
  return returnVal
}
