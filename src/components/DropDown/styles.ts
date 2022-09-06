import { MthColor } from '@mth/enums'

export const dropdownClasses = {
  textField: {
    width: '100%',
    margin: '16px 0',
  },
  alternate: {
    width: '100%',
    margin: '16px 0',
    '& .MuiSvgIcon-root': {
      color: MthColor.MTHBLUE,
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
