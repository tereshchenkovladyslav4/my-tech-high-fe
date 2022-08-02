/**
 * @param {hexColor} string
 * @description convert to hex color to RGBA
 * @return converted string
 */
export const hexToRgbA = (hexColor: string): string => {
  let c: string | string[] | number
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)) {
    c = hexColor.substring(1).split('')
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return (
      'rgba(' +
      [
        ((c as unknown as number) >> 16) & 255,
        ((c as unknown as number) >> 8) & 255,
        (c as unknown as number) & 255,
      ].join(',') +
      ',0.4)'
    )
  }
  throw new Error('Bad Hex')
}
