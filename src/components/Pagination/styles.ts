import { MthColor } from '@mth/enums'

export const useStyles = {
  root: {
    flexGrow: 1,
  },
  pageNumber: {
    '& .MuiButtonBase-root': {
      color: MthColor.MTHBLUE,
      fontWeight: 700,
    },
    '& .MuiPaginationItem-previousNext': {
      color: MthColor.BLACK,
    },
  },
}
