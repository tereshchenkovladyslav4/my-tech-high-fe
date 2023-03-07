import { MthColor } from '@mth/enums'

export const studentScheduleClasses = {
  customTable: {
    '& thead th': {
      p: 0,
      fontSize: '13px',
      fontWeight: '600',
      color: MthColor.SYSTEM_01,
      border: 'none !important',
    },
    '& tbody td .cell-item': {
      pl: 0,
    },
  },
  semesterTitle: {
    fontSize: '12px',
    fontWeight: '700',
    textAlign: 'left',
    color: MthColor.SYSTEM_01,
  },
}
