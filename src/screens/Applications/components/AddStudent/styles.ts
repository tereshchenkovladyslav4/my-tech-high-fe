import { outlinedInputClasses } from '@mui/material'
import { MthColor } from '@mth/enums'

export const useStyles = {
  textfield: {
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
      borderWidth: '1px',
    },
    marginY: 2,
    width: '100%',
  },
  textFieldError: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: '#BD0043',
      borderWidth: '1px',
    },
    marginY: 2,
    width: '100%',
  },
  dropdown: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
    },
    marginY: 2,
    width: '100%',
  },
}
