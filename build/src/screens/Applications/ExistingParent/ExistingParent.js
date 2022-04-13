import {Box, Button, Card, Grid, TextField} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useState} from "../../../../_snowpack/pkg/react.js";
import {AddStudent} from "../components/AddStudent/AddStudent.js";
import {useStyles} from "../styles.js";
import BGSVG from "../../../assets/ApplicationBG.svg.proxy.js";
import {DropDown} from "../../../components/DropDown/DropDown.js";
import {useMutation} from "../../../../_snowpack/pkg/@apollo/client.js";
import {AddApplicationMutation} from "./service.js";
import {UserContext} from "../../../providers/UserContext/UserProvider.js";
import {useFormik} from "../../../../_snowpack/pkg/formik.js";
import * as yup from "../../../../_snowpack/pkg/yup.js";
import {find, map} from "../../../../_snowpack/pkg/lodash.js";
import {GRADES, SYSTEM_05} from "../../../utils/constants.js";
import DeleteForeverOutlinedIcon from "../../../../_snowpack/pkg/@mui/icons-material/DeleteForeverOutlined.js";
export const ExistingParent = () => {
  const [formValues, setFormValues] = useState([{firstName: "", lastName: ""}]);
  const studentHandleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };
  const studentAddFormFields = () => {
    setFormValues([...formValues, {firstName: "", lastName: ""}]);
  };
  const studentRemoveFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };
  const studentHandleSubmit = (event) => {
    event.preventDefault();
    alert(JSON.stringify(formValues));
  };
  const onStudentFieldChanged = (idx, fieldName, value) => {
    setStudentData((prev) => {
      if (prev[idx] === void 0) {
        return [
          ...prev,
          {
            [fieldName]: value
          }
        ];
      } else {
        const data2 = [...prev];
        const element = data2[idx];
        element[fieldName] = value;
        setStudentData(data2);
      }
    });
  };
  const {me, setMe} = useContext(UserContext);
  const submitPressed = new CustomEvent("checkStudents");
  const programYearItems = [
    {
      label: "2021-2022",
      value: "1"
    },
    {
      label: "2023-2024",
      value: "2"
    },
    {
      label: "2024-2025",
      value: "3"
    }
  ];
  const validationSchema = yup.object().shape({
    programYear: yup.string().required("Grade Level is required")
  });
  const formik = useFormik({
    initialValues: {
      programYear: void 0
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: () => {
      submitApplication();
    }
  });
  const AddNewStudent = (idx) => /* @__PURE__ */ React.createElement(AddStudent, {
    idx,
    onFieldChange: onStudentFieldChanged
  });
  const [studentData, setStudentData] = useState([]);
  const [students, setStudents] = useState([AddNewStudent(0)]);
  const classes = useStyles;
  const [submitApplicationAction, {data}] = useMutation(AddApplicationMutation);
  const submitApplication = async () => {
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          state: "UT",
          program_year: parseInt(formik.values.programYear),
          students: studentData
        }
      }
    }).then((res) => {
      setMe((prev) => {
        return {
          ...prev,
          students: prev?.students?.concat(res.data.createNewStudentApplication.students)
        };
      });
    });
  };
  const setProgramYear = (id) => {
    formik.values.programYear = id;
    const currProgramYear = find(programYearItems, {value: id});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    document.dispatchEvent(submitPressed);
  };
  document.addEventListener("studentResponse", (e) => {
    formik.setFieldTouched("programYear", true, true);
    setTimeout(() => {
      if (!e.detail.error) {
        formik.handleSubmit();
      }
    }, 500);
  });
  const parseGrades = map(GRADES, (grade) => {
    return {
      label: grade,
      value: grade.toString()
    };
  });
  const appendAddStudentList = () => setStudents(() => {
  });
  const addStudent2 = () => {
  };
  const removeStudent2 = () => {
  };
  const setFormikGradeLevel = (id) => {
    console.log(id);
  };
  return /* @__PURE__ */ React.createElement("form", {
    onSubmit: handleSubmit
  }, /* @__PURE__ */ React.createElement(Card, {
    sx: {paddingTop: 8, margin: 4}
  }, /* @__PURE__ */ React.createElement(Box, {
    paddingX: 36,
    paddingTop: 18,
    paddingBottom: 10,
    sx: {
      backgroundImage: `url(${BGSVG})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top",
      alignItems: "center",
      display: "flex",
      flexDirection: "column"
    },
    style: classes.containerHeight
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    display: "flex",
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "406.73px"
  }, /* @__PURE__ */ React.createElement(DropDown, {
    name: "programYear",
    labelTop: true,
    dropDownItems: programYearItems,
    placeholder: "Program Year",
    setParentValue: setProgramYear,
    alternate: true,
    sx: !!(formik.touched.programYear && Boolean(formik.errors.programYear)) ? classes.textFieldError : classes.textField,
    size: "small",
    error: {
      error: Boolean(formik.errors.programYear),
      errorMsg: formik.errors.programYear
    }
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    display: "flex",
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "451.53px"
  }, formValues.map((element, index) => /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    key: index
  }, /* @__PURE__ */ React.createElement(Box, {
    width: index === 0 ? "100%" : "103.9%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(TextField, {
    type: "text",
    value: element.firstName || "",
    onChange: (e) => studentHandleChange(index, e),
    size: "small",
    name: "firstName",
    label: "Student First Name",
    focused: true,
    variant: "outlined",
    sx: classes.textFieldError,
    inputProps: {
      style: {color: "black"}
    },
    InputLabelProps: {
      style: {color: SYSTEM_05}
    }
  }), index ? /* @__PURE__ */ React.createElement(DeleteForeverOutlinedIcon, {
    sx: {left: 12, position: "relative", color: "darkgray"},
    onClick: () => studentRemoveFormFields(index)
  }) : null), /* @__PURE__ */ React.createElement(TextField, {
    type: "text",
    value: element.lastName || "",
    onChange: (e) => studentHandleChange(index, e),
    size: "small",
    name: "lastName",
    label: "Student Last Name",
    focused: true,
    variant: "outlined",
    sx: classes.textFieldError,
    inputProps: {
      style: {color: "black"}
    },
    InputLabelProps: {
      style: {color: SYSTEM_05}
    }
  }), /* @__PURE__ */ React.createElement(DropDown, {
    name: "gradeLevel",
    labelTop: true,
    placeholder: `Student Grade Level (age) as of September 1, ${2022}`,
    dropDownItems: parseGrades,
    setParentValue: setFormikGradeLevel,
    alternate: true,
    sx: classes.dropdown,
    size: "small"
  }))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Button, {
    color: "secondary",
    variant: "contained",
    style: classes.addStudentButton,
    onClick: studentAddFormFields
  }, "Add Student")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    style: classes.submitButton,
    type: "submit"
  }, "Submit to Utah School"))))));
};
