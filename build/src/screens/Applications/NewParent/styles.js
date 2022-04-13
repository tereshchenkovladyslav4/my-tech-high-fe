import {outlinedInputClasses} from "../../../../_snowpack/pkg/@mui/material.js";
import {SYSTEM_07} from "../../../utils/constants.js";
export const useStyles = {
  textField: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: SYSTEM_07
    },
    marginY: 2,
    width: "100%"
  },
  textFieldError: {
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: "#BD0043"
    },
    marginY: 2,
    width: "100%"
  }
};
