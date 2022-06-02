import { PRIMARY_SMALL_DEFAULT } from '../../utils/constants'
import { outlinedInputClasses } from '@mui/material'
import { SYSTEM_07 } from '../../utils/constants'

export const useStyles = {
  textField: {
    marginY: 2,
    width: '451.53px',
    marginBottom: 3,
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: SYSTEM_07,
      borderWidth: '1px',
    },
  },
  button: {
    borderRadius: 8,
    fontSize: 12,
    background: PRIMARY_SMALL_DEFAULT,
    width: '451.53px',
    height: 40,
    marginTop: 20,
  },
}
