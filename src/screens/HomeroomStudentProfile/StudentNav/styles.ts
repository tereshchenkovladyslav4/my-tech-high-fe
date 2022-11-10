import { MthColor } from '@mth/enums'

export const studentNavClasses = {
  tabWrap: {
    backgroundColor: MthColor.SYSTEM_09,
    display: { xs: 'none', sm: 'initial' },
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
  mobileNav: {
    backgroundColor: MthColor.SYSTEM_09,
    alignItems: 'center',
  },
}
