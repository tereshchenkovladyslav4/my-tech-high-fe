import {Avatar, Box, Button, Card, Grid, OutlinedInput} from "../../../../../_snowpack/pkg/@mui/material.js";
import {find} from "../../../../../_snowpack/pkg/lodash.js";
import React, {useContext, useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {Prompt, useHistory, useLocation} from "../../../../../_snowpack/pkg/react-router-dom.js";
import {DropDown} from "../../../../components/DropDown/DropDown.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {Title} from "../../../../components/Typography/Title/Title.js";
import {UserContext} from "../../../../providers/UserContext/UserProvider.js";
import {ENROLLMENT, GRAY, HOMEROOM} from "../../../../utils/constants.js";
import {toOrdinalSuffix} from "../../../../utils/stringHelpers.js";
import {useStyles} from "./styles.js";
import {useFormik} from "../../../../../_snowpack/pkg/formik.js";
export const StudentProfile = () => {
  const {me} = useContext(UserContext);
  const {students} = me;
  const location = useLocation();
  const studentId = location.pathname.split("/").at(-1);
  const currStudent = find(students, {student_id: studentId});
  const [student, setStudent] = useState(currStudent);
  const history = useHistory();
  const {person} = student;
  const {status} = student?.packets.at(-1);
  const [email, setEmail] = useState(person.email);
  const [password, setPassword] = useState(void 0);
  const enrollmentLink = `${HOMEROOM + ENROLLMENT}/${student.student_id}`;
  useEffect(() => {
    setStudent(currStudent);
  }, [location]);
  const [testingPreferences, setTestingPreferences] = useState("");
  const testingPreferencesItems = [
    {
      label: "Select",
      value: void 0
    },
    {
      label: "Opt In",
      value: 1
    },
    {
      label: "Opt Out",
      value: 0
    }
  ];
  const setState = (id) => formik.values.testingPref = id;
  const formik = useFormik({
    initialValues: {
      firstName: person.preferred_first_name,
      lastName: person.preferred_last_name,
      email: person.email,
      testingPref: void 0,
      password: void 0
    },
    validateOnBlur: true,
    onSubmit: () => {
    }
  });
  const classes = useStyles;
  const grade = student.grade_levels.at(-1).grade_level;
  const warnUser = formik.values.firstName !== person.preferred_first_name || person.preferred_last_name !== formik.values.lastName || status !== "Missing Info" && (email !== person.email || password !== void 0);
  return /* @__PURE__ */ React.createElement("form", null, /* @__PURE__ */ React.createElement(Card, {
    style: {borderRadius: 12}
  }, /* @__PURE__ */ React.createElement(Prompt, {
    when: warnUser,
    message: JSON.stringify({
      header: "Unsaved Work",
      content: "Changes you made will not be saved"
    })
  }), /* @__PURE__ */ React.createElement(Grid, {
    sx: classes.gridContainer
  }, /* @__PURE__ */ React.createElement(Title, null, "Student"), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 12,
    rowSpacing: 4,
    paddingX: 8,
    columnSpacing: 4,
    marginTop: 1
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(Avatar, {
    variant: "square",
    style: classes.avatar
  }), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 4,
    color: GRAY
  }, /* @__PURE__ */ React.createElement(Title, null, grade === "Kin" ? "Kindergarten" : `${toOrdinalSuffix(student.grade_levels.at(-1).grade_level)} Grade`))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, status !== "Missing Info" && status !== "Submitted" && /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "end",
    alignItems: "end",
    height: "100%"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700",
    color: GRAY
  }, "1st Semester")), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700",
    color: GRAY
  }, "2nd Semester")))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Preferred First Name"), /* @__PURE__ */ React.createElement(OutlinedInput, {
    name: "firstName",
    value: formik.values.firstName,
    onChange: formik.handleChange,
    sx: classes.textField
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Preferred Last Name"), /* @__PURE__ */ React.createElement(OutlinedInput, {
    name: "lastName",
    value: formik.values.lastName,
    onChange: formik.handleChange,
    sx: classes.textField
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, status !== "Missing Info" && status !== "Submitted" && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Learning Logs"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.button,
    disableElevation: true
  }, "Download")))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, status !== "Missing Info" && /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Testing Preference"), /* @__PURE__ */ React.createElement(DropDown, {
    dropDownItems: testingPreferencesItems,
    defaultValue: void 0,
    setParentValue: setState,
    dropdownColor: `rgba(236, 89, 37, 0.1)`
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Enrollment Packet"), status === "Missing Info" ? /* @__PURE__ */ React.createElement(Button, {
    sx: classes.resubmitButton,
    variant: "contained",
    onClick: () => history.push(enrollmentLink)
  }, "Resubmit") : status === "Submitted" ? /* @__PURE__ */ React.createElement(Button, {
    sx: classes.enrollmentButton,
    variant: "contained",
    onClick: () => history.push(enrollmentLink)
  }, "Submitted") : /* @__PURE__ */ React.createElement(Button, {
    sx: classes.enrollmentButton,
    variant: "contained",
    onClick: () => history.push(enrollmentLink)
  }, "View"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, status !== "Missing Info" && status !== "Submitted" && /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Unofficial Transcript"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.button,
    disableElevation: true
  }, "Download"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, status !== "Missing Info" && /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Student Email"), /* @__PURE__ */ React.createElement(OutlinedInput, {
    name: "email",
    value: formik.values.email,
    onChange: formik.handleChange,
    sx: classes.textField
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, status !== "Missing Info" && /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Password"), /* @__PURE__ */ React.createElement(OutlinedInput, {
    name: "password",
    type: "password",
    value: formik.values.password,
    onChange: formik.handleChange,
    sx: classes.textField
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "\xA0"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.enroollmentButton
  }, "Save Changes")))))));
};
