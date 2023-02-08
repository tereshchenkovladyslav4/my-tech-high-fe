import { outlinedInputClasses, inputLabelClasses } from '@mui/material'
import { MthColor } from '@mth/enums'

export const useStyles = {
  textField: {
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderWidth: '1px',
      borderColor: MthColor.GRAY,
    },
    width: '100%',
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16,
    },
    marginY: 2,
    ['& label']: {
      maxWidth: '95%',
      top: 'auto',
      bottom: '19px',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
      color: `${MthColor.SYSTEM_07}!important`,
    },
  },
  textFieldError: {
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: MthColor.ERROR_RED,
    },
    width: '100%',
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.shrink}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16,
    },
    ['& label']: {
      maxWidth: '95%',
      top: 'auto',
      bottom: '40px',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
    },
  },
  addStudentButton: {
    borderRadius: 8,
    border: '1px solid black',
    fontSize: 15,
    maxWidth: '451.53px',
    width: '100%',
    height: '37.14px',
    marginTop: 30,
  },
  submitButton: {
    borderRadius: 8,
    fontSize: 15,
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    maxWidth: '451.53px',
    width: '100%',
    height: '37.14px',
    marginTop: 30,
  },
  dropdown: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: `${MthColor.SYSTEM_07}!important`,
      borderWidth: '2px',
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: `${MthColor.SYSTEM_07}!important`,
      borderWidth: '2px',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.shrink}`]: {
      transform: 'translate(14px, -11px) scale(1)',
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16,
    },
    ['& label']: {
      maxWidth: '95%',
      top: 'auto',
      bottom: '19px',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
      color: `${MthColor.SYSTEM_07}!important`,
    },
  },
}
