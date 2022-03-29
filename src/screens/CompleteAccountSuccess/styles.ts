import { outlinedInputClasses } from '@mui/material'
import { SYSTEM_07 } from '../../utils/constants'


export const useStyles = {
  textField: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: SYSTEM_07,
    },
    marginY: 2,
    width: '100%',
  },
  textFieldError:{
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: '#BD0043',
    },
    marginY: 2,
    width: '100%',
  }
}
