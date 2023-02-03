import { MthColor } from '@mth/enums'

export const useStyles = {
  baseSettings: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    px: 3,
    py: 4,
    margin: 3,
    background: MthColor.WHITE,
    minHeight: '100%',
    borderRadius: '4px',
    '& ul': {
      listStyle: 'none !important',
      marginLeft: '0 !important',
    },
    '& li': {
      listStyle: 'none !important',
      marginLeft: '0 !important',
    },
  },
}
