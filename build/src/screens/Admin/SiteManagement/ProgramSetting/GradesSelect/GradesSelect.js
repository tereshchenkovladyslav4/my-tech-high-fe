import React, {useState, useEffect} from "../../../../../../_snowpack/pkg/react.js";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions
} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../../../../_snowpack/pkg/lodash.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {GRADES} from "../../../../../utils/constants.js";
import {toOrdinalSuffix} from "../../../../../utils/stringHelpers.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {useStyles} from "../../styles.js";
export default function GradesSelect({grades, setGrades, setIsChanged}) {
  const classes = useStyles;
  const [open, setOpen] = useState(false);
  const [gradesArr, setGradesArr] = useState([]);
  useEffect(() => {
    if (grades != void 0 && grades != "") {
      setGradesArr(grades.split(","));
    }
  }, [grades]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    setOpen(false);
    let gradesStr = "";
    gradesArr.forEach((element) => {
      if (gradesStr == "") {
        gradesStr = element;
      } else {
        gradesStr += "," + element;
      }
    });
    setGrades(gradesStr);
    setIsChanged(true);
  };
  const handleChangeGrades = (e) => {
    if (gradesArr.includes(e.target.value)) {
      setGradesArr(gradesArr.filter((item) => item !== e.target.value).filter((item) => item !== "all"));
    } else {
      setGradesArr([...gradesArr, e.target.value]);
    }
  };
  const renderGrades = () => map(GRADES, (grade, index) => {
    if (typeof grade !== "string") {
      return /* @__PURE__ */ React.createElement(FormControlLabel, {
        key: index,
        sx: {height: 40},
        control: /* @__PURE__ */ React.createElement(Checkbox, {
          checked: gradesArr.includes(grade.toString()),
          value: grade,
          onChange: handleChangeGrades
        }),
        label: /* @__PURE__ */ React.createElement(Paragraph, {
          size: "large",
          fontWeight: "500",
          sx: {marginLeft: "12px", fontSize: "19.8627px"}
        }, `${toOrdinalSuffix(grade)} Grade`)
      });
    } else {
      return /* @__PURE__ */ React.createElement(FormControlLabel, {
        key: index,
        sx: {height: 40},
        control: /* @__PURE__ */ React.createElement(Checkbox, {
          checked: gradesArr.includes(grade),
          value: grade,
          onChange: handleChangeGrades
        }),
        label: /* @__PURE__ */ React.createElement(Paragraph, {
          size: "large",
          fontWeight: "500",
          sx: {marginLeft: "12px", fontSize: "19.8627px"}
        }, grade)
      });
    }
  });
  return /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    spacing: 1,
    alignItems: "center",
    sx: {my: 2}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 16,
    fontWeight: "600",
    textAlign: "left",
    sx: {minWidth: 150}
  }, "Grades"), /* @__PURE__ */ React.createElement(Typography, null, "|"), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    sx: {ml: 1.5, cursor: "pointer"},
    alignItems: "center",
    onClick: handleClickOpen
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    fontWeight: "500"
  }, grades ? grades : "Select"))), /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose: handleClose,
    sx: {
      marginX: "auto",
      paddingY: "10px",
      borderRadius: 10,
      textAlign: "center",
      alignItems: "center",
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    sx: {
      fontWeight: "bold",
      marginTop: "10px",
      textAlign: "left"
    }
  }, "Grades"), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(FormGroup, {
    sx: {marginLeft: "24px", marginRight: "150px", marginBottom: "40px"}
  }, renderGrades())), /* @__PURE__ */ React.createElement(DialogActions, {
    sx: {
      justifyContent: "center",
      marginBottom: 2
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.cancelButton,
    onClick: handleClose
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.submitButton,
    onClick: handleSave
  }, "Save"))));
}
