export const toOrdinalSuffix = (num: number) => {
  const digits = [num % 10, num % 100],
    ordinals = ['st', 'nd', 'rd', 'th'],
    oPattern = [1, 2, 3, 4],
    tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
    ? num + ordinals[digits[0] - 1]
    : num + ordinals[3];
};

// export const isPhoneNumber = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
export const isPhoneNumber = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/

export const isNumber = /^[0-9\b]+$/


export function parseGradeLevel(value?: string | number) {
  if (!value) return ''
  if (value === 'OR-K') return 'OR - Kindergarten (5)'
  if (value === 'K') return 'Kindergarten (5)'
  const numberValue = parseInt(value + '')
  if (numberValue === 1) return '1st Grade (6)'
  if (numberValue === 2) return '2nd Grade (7)'
  if (numberValue === 3) return '3rd Grade (8)'

  return `${value}th Grade (${value !== '12' ? numberValue + 5 : `${numberValue + 5}/${numberValue + 6}`})`
}