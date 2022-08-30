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
    fontWeight: '600',
    border: 'none',
    '& .MuiSelect-select': {
      padding: '4px 28px 4px 16px',
    },
    '& .MuiSvgIcon-root': {
      color: 'blue',
    },
  },
}
