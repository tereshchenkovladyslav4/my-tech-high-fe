import { outlinedInputClasses } from '@mui/material'
import { MthColor } from '@mth/enums'

export const useStyles = {
  textField: {
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.SYSTEM_07,
    },
  },
  addStudentButton: {
    marginTop: 2,
    borderRadius: 2,
    border: '1px solid black',
    fontSize: 15,
    width: '451.53px',
    height: '37.14px',
  },
  submitButton: {
    borderRadius: 2,
    fontSize: 15,
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    width: '451.53px',
    height: '37.14px',
    marginTop: 10,
    color: 'white',
  },
}
