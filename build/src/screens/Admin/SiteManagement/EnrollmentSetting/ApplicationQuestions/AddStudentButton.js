import React, {useState} from "../../../../../../_snowpack/pkg/react.js";
import {Box, Button, List} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {useStyles} from "./styles.js";
import {initStudentQuestion} from "./types.js";
import ApplicationQuestionItem from "./Question.js";
import {arrayMove, SortableContainer, SortableElement} from "../../../../../../_snowpack/pkg/react-sortable-hoc.js";
const SortableItem = SortableElement(ApplicationQuestionItem);
const SortableStudentAddQuestionContainer = SortableContainer(({items}) => /* @__PURE__ */ React.createElement(List, null, items.map((item, index) => /* @__PURE__ */ React.createElement(SortableItem, {
  index,
  key: index,
  item
}))));
export default function AddStudentButton() {
  const [studentQuestion, setStudentQuestion] = useState(initStudentQuestion);
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {marginBottom: "20px"}
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {...useStyles.addStudentButton}
  }, "Add Student"), /* @__PURE__ */ React.createElement("p", null, "Student(s) agrees to adhere to all program policies and requirements, including participation in state testing. Review details at"), /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", flexDirection: "column", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "600px"
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "600px"
  }, /* @__PURE__ */ React.createElement(SortableStudentAddQuestionContainer, {
    items: studentQuestion,
    useDragHandle: true,
    onSortEnd: ({oldIndex, newIndex}) => {
      const newData = arrayMove(studentQuestion, oldIndex, newIndex);
      setStudentQuestion(newData);
    }
  }))), /* @__PURE__ */ React.createElement(Button, {
    sx: {...useStyles.submitButton, color: "white"}
  }, "Submit to Utah Program")));
}
