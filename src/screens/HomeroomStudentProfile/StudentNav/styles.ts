import { MthColor } from '@mth/enums'

export const studentNavClasses = {
  tabWrap: {
    backgroundColor: MthColor.SYSTEM_09,
  },
  tabItem: {
    textTransform: 'none',
    '&.Mui-selected': {
      color: MthColor.MTHBLUE,
    },
  },
  tabLabel: {
    textDecoration: 'none',
    paddingY: 2,
    paddingX: 8,
    fontWeight: 700,
  },
}
