import { outlinedInputClasses } from '@mui/material'
import { MthColor } from '@mth/enums'

export const useStyles = {
  textField: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
    },
    marginY: 2,
    width: '100%',
  },
  textFieldError: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: '#BD0043',
    },
    marginY: 2,
    width: '100%',
  },
}
