import { MthColor } from '@mth/enums'

export const saveCancelClasses = {
  align: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    width: '160px',
    height: '36px',
    borderRadius: '40px',
    background: MthColor.LIGHTGRAY,
    color: MthColor.SYSTEM_01,
  },
  saveBtn: {
    width: '160px',
    height: '36px',
    borderRadius: '40px',
    background: 'linear-gradient(90deg, #0E0E0E 0%, #666666 99.68%), #0E0E0E;',
    color: MthColor.WHITE,
    marginLeft: 5,
  },
}
