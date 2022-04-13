import {Box} from "../../../../../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../../../../../_snowpack/pkg/lodash.js";
import React, {useState} from "../../../../../../../_snowpack/pkg/react.js";
import {ToDoListItem} from "../ToDoListItem/ToDoListItem.js";
export const TodoList = () => {
  const [todoList, setTodoList] = useState([
    {
      id: 1,
      title: "Applications",
      date: new Date(),
      severity: 100
    },
    {
      id: 2,
      title: "Enrollment Packets",
      date: new Date(),
      severity: 30
    },
    {
      id: 3,
      title: "Schedules",
      date: new Date(),
      severity: 10
    },
    {
      id: 4,
      title: "Reimbursements and Direct Orders",
      date: new Date(),
      severity: 300
    },
    {
      id: 5,
      title: "Withdrawals",
      date: new Date(),
      severity: 10
    }
  ]);
  const renderTodoListItem = () => map(todoList, (el, idx) => /* @__PURE__ */ React.createElement(ToDoListItem, {
    key: idx,
    todoItem: el,
    idx
  }));
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {mt: 1.5}
  }, renderTodoListItem());
};
