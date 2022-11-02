import { MthColor } from '@mth/enums'

export const studentScheduleClasses = {
  customTable: {
    '& thead th': {
      p: 0,
      fontSize: '13px',
      fontWeight: '600',
      color: MthColor.SYSTEM_03,
      border: 'none !important',
    },
    '& tbody td .cell-item': {
      pl: 0,
    },
  },
}
