export const toOrdinalSuffix = (num: number) => {
  const digits = [num % 10, num % 100],
	ordinals = ['st', 'nd', 'rd', 'th'],
	oPattern = [1, 2, 3, 4],
	tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
    ? num + ordinals[digits[0] - 1]
    : num + ordinals[3];
};

export const isPhoneNumber = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const isNumber = /^[0-9\b]+$/