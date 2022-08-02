import { MTHBLUE, BLACK } from '../../utils/constants'

export const useStyles = {
  root: {
    flexGrow: 1,
  },
  pageNumber: {
    '& .MuiButtonBase-root': {
      color: MTHBLUE,
      fontWeight: 700,
    },
    '& .MuiPaginationItem-previousNext': {
      color: BLACK,
    },
  },
}
