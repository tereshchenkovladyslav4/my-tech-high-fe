import {outlinedInputClasses} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {SYSTEM_07} from "../../../../../utils/constants.js";
export const useStyles = {
  textField: {
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: SYSTEM_07
    }
  },
  addStudentButton: {
    borderRadius: 2,
    border: "1px solid black",
    fontSize: 15,
    width: "451.53px",
    height: "37.14px",
    marginTop: 10
  },
  submitButton: {
    borderRadius: 2,
    fontSize: 15,
    background: "linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF",
    width: "451.53px",
    height: "37.14px",
    marginTop: 10,
    color: "white"
  }
};
