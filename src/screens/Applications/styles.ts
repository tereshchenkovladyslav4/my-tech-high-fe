import { outlinedInputClasses, inputLabelClasses } from "@mui/material";
import { SYSTEM_07 } from "../../utils/constants";

export const useStyles = {
  textField: {
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: SYSTEM_07,
      borderWidth: '2px'
    },
    width: '100%',
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)'
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16
    },
    marginY: 2,
  },
  textFieldError:{
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: '#BD0043',
    },
    marginY: 2,
    width: '100%',
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)'
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16
    }
  },
  addStudentButton: {
    borderRadius: 8,
    border: '1px solid black',
    fontSize: 12,
    width:'451.53px',
    height: '37.14px',
    marginTop: 12,
  },
  submitButton: {
    borderRadius: 8,
    fontSize: 12,
    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    width:'451.53px',
    height: '37.14px',
    marginTop: 50,
  },
  dropdown:{
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: SYSTEM_07,
      borderWidth: '2px'
    },
    [`& .${inputLabelClasses.root}.${inputLabelClasses.focused}`]: {
      transform: 'translate(14px, -11px) scale(1)'
    },
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline} span`]: {
      fontSize: 16
    }
  }
}
