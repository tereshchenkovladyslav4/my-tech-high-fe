import { outlinedInputClasses } from '@mui/material'
import { MthColor } from '@mth/enums'

export const useStyles = {
  textField: {
    marginY: 2,
    width: '451.53px',
    marginBottom: 3,
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
      borderWidth: '1px',
    },
  },
  button: {
    borderRadius: 8,
    fontSize: 12,
    background: MthColor.PRIMARY_SMALL_DEFAULT,
    width: '451.53px',
    height: 40,
    marginTop: 50,
  },
}
