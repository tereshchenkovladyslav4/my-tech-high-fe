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
