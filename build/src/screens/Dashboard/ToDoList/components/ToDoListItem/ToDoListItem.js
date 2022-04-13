import {TableRow, TableCell, Avatar, Button, AvatarGroup, Box} from "../../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import {Metadata} from "../../../../../components/Metadata/Metadata.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import SubjectIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Subject.js";
import {HOMEROOM, ENROLLMENT, PRIMARY_MEDIUM_MOUSEOVER} from "../../../../../utils/constants.js";
import {useHistory} from "../../../../../../_snowpack/pkg/react-router-dom.js";
import {map} from "../../../../../../_snowpack/pkg/lodash.js";
export const ToDoListItem = ({
  todoItem,
  idx
}) => {
  const history = useHistory();
  const {students} = todoItem;
  const renderStudentAvatars = () => {
    return /* @__PURE__ */ React.createElement(AvatarGroup, null, map(todoItem.students, (student) => /* @__PURE__ */ React.createElement(Avatar, {
      alt: `${student.person.first_name} ${student.person.last_name}`,
      src: " "
    })));
  };
  const link = students.length > 1 ? HOMEROOM : `${HOMEROOM + ENROLLMENT}/1`;
  return /* @__PURE__ */ React.createElement(TableRow, {
    key: idx,
    sx: {
      "&:last-child td, &:last-child th": {border: 0}
    }
  }, /* @__PURE__ */ React.createElement(TableCell, {
    style: {padding: 8},
    component: "th",
    scope: "row"
  }, /* @__PURE__ */ React.createElement(Metadata, {
    title: /* @__PURE__ */ React.createElement(Subtitle, {
      fontWeight: "500"
    }, todoItem.phrase),
    subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, "2:11 PM, September 12"),
    image: /* @__PURE__ */ React.createElement(SubjectIcon, {
      style: {color: "black", marginRight: 24}
    })
  })), /* @__PURE__ */ React.createElement(TableCell, {
    component: "th",
    scope: "row"
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "100px"
  }, renderStudentAvatars())), /* @__PURE__ */ React.createElement(TableCell, {
    component: "th",
    scope: "row"
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => history.push(link),
    variant: "contained",
    sx: {
      borderRadius: 2,
      fontSize: 12,
      background: "linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF",
      width: 140,
      height: 48,
      fontWeight: 700,
      textTransform: "none",
      "&:hover": {
        background: PRIMARY_MEDIUM_MOUSEOVER,
        color: "white"
      }
    }
  }, todoItem.button)));
};
