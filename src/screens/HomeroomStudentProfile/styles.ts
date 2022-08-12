import { MthColor } from '@mth/enums'

export const useStyles = {
  root: {
    flexGrow: 1,
    textTransform: 'none',
  },
  activeTab: {
    backgroundColor: '#EEF4F8',
    color: 'red',
    '&.Mui-selected': {
      color: MthColor.MTHBLUE,
    },
  },
}
