import {Box, Divider, TextField} from "../../../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import React, {useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {DropDown} from "../../../../components/DropDown/DropDown.js";
import {GRADES, SYSTEM_05} from "../../../../utils/constants.js";
import {useStyles} from "./styles.js";
import DeleteForeverOutlinedIcon from "../../../../../_snowpack/pkg/@mui/icons-material/DeleteForeverOutlined.js";
import {useFormik} from "../../../../../_snowpack/pkg/formik.js";
import * as yup from "../../../../../_snowpack/pkg/yup.js";
export const AddStudent = ({idx, onFieldChange, handleRemoveStudent, yearLabel}) => {
  const classes = useStyles;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [year, setYear] = useState(yearLabel);
  const setFormikFirstName = (e) => {
    formik.handleChange(e);
    setFirstName(e.target.value);
  };
  const setFormikLastName = (e) => {
    formik.handleChange(e);
    setLastName(e.target.value);
  };
  const setFormikGradeLevel = (id) => {
    formik.values.gradeLevel = id;
    setGradeLevel(formik.values.gradeLevel);
  };
  const validationSchema = yup.object({
    gradeLevel: yup.string().required("Program Year is required"),
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required")
  });
  const formik = useFormik({
    initialValues: {
      firstName: void 0,
      gradeLevel: void 0,
      lastName: void 0
    },
    validationSchema,
    onSubmit: () => {
    }
  });
  useEffect(() => {
    if (firstName !== "") {
      onFieldChange(idx, "first_name", firstName);
    }
  }, [firstName]);
  useEffect(() => {
    if (gradeLevel !== "") {
      onFieldChange(idx, "grade_level", gradeLevel);
    }
  }, [gradeLevel]);
  useEffect(() => {
    if (lastName !== "") {
      onFieldChange(idx, "last_name", lastName);
    }
  }, [lastName]);
  const parseGrades = map(GRADES, (grade) => {
    return {
      label: grade,
      value: grade.toString()
    };
  });
  document.addEventListener("checkStudents", () => {
    formik.handleSubmit();
    let response;
    if (JSON.stringify(formik.errors) === JSON.stringify({})) {
      response = new CustomEvent("studentResponse", {detail: {error: true}});
    } else {
      response = new CustomEvent("studentResponse", {detail: {error: false}});
    }
    document.dispatchEvent(response);
  });
  document.addEventListener("yearChanged", (e) => setYear(e.detail.yearLabel));
  return /* @__PURE__ */ React.createElement("form", null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, {
    width: idx === 0 ? "100%" : "103.9%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    name: "firstName",
    label: "Student First Name",
    focused: true,
    variant: "outlined",
    sx: !!(formik.touched.firstName && Boolean(formik.errors.firstName)) ? classes.textFieldError : classes.textfield,
    inputProps: {
      style: {color: "black"}
    },
    value: formik.values.firstName,
    onChange: setFormikFirstName,
    InputLabelProps: {
      style: {color: SYSTEM_05}
    },
    error: formik.touched.firstName && Boolean(formik.errors.firstName),
    helperText: formik.touched.firstName && formik.errors.firstName
  }), idx !== 0 && /* @__PURE__ */ React.createElement(DeleteForeverOutlinedIcon, {
    sx: {left: 12, position: "relative", color: "darkgray"},
    onClick: () => handleRemoveStudent(idx)
  })), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    name: "lastName",
    label: "Student Last Name",
    focused: true,
    variant: "outlined",
    sx: !!(formik.touched.lastName && Boolean(formik.errors.lastName)) ? classes.textFieldError : classes.textfield,
    inputProps: {
      style: {color: "black"}
    },
    value: formik.values.lastName,
    onChange: setFormikLastName,
    InputLabelProps: {
      style: {color: SYSTEM_05}
    },
    error: formik.touched.lastName && Boolean(formik.errors.lastName),
    helperText: formik.touched.lastName && formik.errors.lastName
  }), /* @__PURE__ */ React.createElement(DropDown, {
    name: "gradeLevel",
    labelTop: true,
    placeholder: `Student Grade Level (age) as of September 1, ${year ?? 2022}`,
    dropDownItems: parseGrades,
    setParentValue: setFormikGradeLevel,
    alternate: true,
    sx: !!(formik.touched.gradeLevel && Boolean(formik.errors.gradeLevel)) ? classes.textFieldError : classes.dropdown,
    size: "small",
    error: {
      error: !!(formik.touched.gradeLevel && Boolean(formik.errors.gradeLevel)),
      errorMsg: formik.touched.gradeLevel && formik.errors.gradeLevel
    }
  }), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "center"
  }, idx !== 0 && /* @__PURE__ */ React.createElement(Divider, {
    sx: {
      marginY: 1,
      width: "80%",
      alignSelf: "center"
    }
  }))));
};
