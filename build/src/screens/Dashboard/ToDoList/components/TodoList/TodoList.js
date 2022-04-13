import {Table, TableBody, TableContainer} from "../../../../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {useQuery} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import {getTodoList} from "../../service.js";
import {forOwn, map} from "../../../../../../_snowpack/pkg/lodash.js";
import {ToDoListItem} from "../ToDoListItem/ToDoListItem.js";
const imageA = "https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-facebook-1.jpg?quality=85";
const imageB = "https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=0hb44OrI";
const imageC = "https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg";
const images = [imageA, imageB, imageC];
const image = images[Math.floor(Math.random() * images.length)];
export const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [paginatinLimit, setPaginatinLimit] = useState(25);
  const [skip, setSkip] = useState();
  const {loading, error, data} = useQuery(getTodoList, {
    variables: {
      skip,
      sort: "status|ASC",
      take: paginatinLimit
    }
  });
  useEffect(() => {
    if (data !== void 0) {
      const {parent_todos} = data;
      forOwn(parent_todos, (item, key) => {
        if (key !== "__typename") {
          setTodoList((prev) => [...prev, item]);
        }
      });
    }
  }, [loading]);
  const renderTodoListItem = () => map(todoList, (el, idx) => idx === 0 && /* @__PURE__ */ React.createElement(ToDoListItem, {
    key: idx,
    todoItem: el,
    idx
  }));
  return /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(Table, {
    sx: {minWidth: 650},
    "aria-label": "simple table"
  }, /* @__PURE__ */ React.createElement(TableBody, null, renderTodoListItem())));
};
