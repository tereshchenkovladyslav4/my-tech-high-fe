import {Box, Card} from "../../../../_snowpack/pkg/@mui/material.js";
import {Flexbox} from "../../../components/Flexbox/Flexbox.js";
import {EmptyState} from "../../../components/EmptyState/EmptyState.js";
import React, {useState} from "../../../../_snowpack/pkg/react.js";
import {TodoList} from "./components/TodoList/TodoList.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
export const ToDo = () => {
  const [showEmpty] = useState(false);
  return /* @__PURE__ */ React.createElement(Card, {
    style: {borderRadius: 12}
  }, /* @__PURE__ */ React.createElement(Box, {
    flexDirection: "row",
    textAlign: "left",
    paddingY: 1.5,
    paddingX: 3,
    display: "flex",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Flexbox, {
    flexDirection: "column",
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "bold"
  }, "To Do List"), !showEmpty ? /* @__PURE__ */ React.createElement(TodoList, null) : /* @__PURE__ */ React.createElement(EmptyState, {
    title: "Congrats!",
    subtitle: "You are all caught up."
  }))));
};
