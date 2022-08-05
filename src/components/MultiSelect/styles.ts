import { MTHBLUE } from '../../utils/constants'

export const dropdownClassess = {
  textfield: {
    width: '100%',
    margin: '16px 0',
  },
  alternate: {
    width: '100%',
    margin: '16px 0',
    '& .MuiSvgIcon-root': {
      color: MTHBLUE,
      alignSelf: 'center',
      justifyContent: 'center',
    },
  },
  borderNone: {
    color: 'blue',
    border: 'none',
    '& .MuiSvgIcon-root': {
      color: 'blue',
    },
  },
}
