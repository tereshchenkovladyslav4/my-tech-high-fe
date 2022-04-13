import React, {useContext} from "../../../../_snowpack/pkg/react.js";
import {StudentGrade} from "./components/StudentGrade/StudentGrade.js";
import Box from "../../../../_snowpack/pkg/@mui/material/Box.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {Card, Stack} from "../../../../_snowpack/pkg/@mui/material.js";
import {useStyles} from "./styles.js";
import {UserContext} from "../../../providers/UserContext/UserProvider.js";
import {map} from "../../../../_snowpack/pkg/lodash.js";
export const HomeroomGrade = () => {
  const classes = useStyles;
  const {me} = useContext(UserContext);
  const {students} = me;
  const renderStudents = () => map(students, (student) => {
    return /* @__PURE__ */ React.createElement(StudentGrade, {
      student
    });
  });
  return /* @__PURE__ */ React.createElement(Card, {
    style: {borderRadius: 12}
  }, /* @__PURE__ */ React.createElement(Box, {
    flexDirection: "row",
    textAlign: "left",
    paddingY: 1.5,
    paddingX: 3,
    display: "flex",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "bold"
  }, "Students")), /* @__PURE__ */ React.createElement(Stack, {
    display: "flex",
    justifyContent: "flex-end",
    alignSelf: "center",
    marginY: 1,
    direction: "row",
    spacing: 2
  }, renderStudents())));
};
