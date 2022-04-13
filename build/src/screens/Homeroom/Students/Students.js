import {Box, Button, Card, Divider} from "../../../../_snowpack/pkg/@mui/material.js";
import {filter, map} from "../../../../_snowpack/pkg/lodash.js";
import React, {useContext, useState} from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Title} from "../../../components/Typography/Title/Title.js";
import {UserContext} from "../../../providers/UserContext/UserProvider.js";
import {Student} from "./Student/Student.js";
export const Students = () => {
  const {me, setMe} = useContext(UserContext);
  const {students} = me;
  const [showInactiveButton] = useState(filter(students, (student) => student.status.at(-1)?.status === 2).length > 0);
  const [showInactiveStudents, setShowInactiveStudents] = useState(false);
  const inactiveStudents = filter(students, (student) => student.status.at(-1)?.status === 2);
  const renderStudents = () => map(students, (student) => {
    if (student.status.at(-1)?.status !== 2)
      return /* @__PURE__ */ React.createElement(Student, {
        student
      });
  });
  const renderInactiveStudents = () => map(inactiveStudents, (student) => {
    return /* @__PURE__ */ React.createElement(Student, {
      student
    });
  });
  return /* @__PURE__ */ React.createElement(Card, {
    sx: {paddingY: 4, paddingX: 8}
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Title, {
    textAlign: "left"
  }, "Students"), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    sx: {paddingY: 10, paddingX: 8},
    flexWrap: "wrap"
  }, renderStudents()), showInactiveStudents && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    sx: {paddingY: 10, paddingX: 8},
    flexWrap: "wrap"
  }, renderInactiveStudents())), showInactiveButton && /* @__PURE__ */ React.createElement(Box, {
    width: "100%",
    display: "flex",
    justifyContent: "end"
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setShowInactiveStudents(!showInactiveStudents)
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, showInactiveStudents ? "Hide Inactive Students" : "Show Inactive Students")))));
};
