/**
 * @param {string} hexColor
 * @description convert to hex color to RGBA
 * @return converted string
 */
export const hexToRgbA = (hexColor: string): string => {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)) {
    let colorArray = hexColor.substring(1).split('')
    if (colorArray.length == 3) {
      colorArray = [colorArray[0], colorArray[0], colorArray[1], colorArray[1], colorArray[2], colorArray[2]]
    }
    const colorHex = Number('0x' + colorArray.join(''))
    return 'rgba(' + [(colorHex >> 16) & 255, (colorHex >> 8) & 255, colorHex & 255].join(',') + ',0.4)'
  }
  throw new Error('Bad Hex')
}
