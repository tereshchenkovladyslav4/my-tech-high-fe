import {Box, Button} from "../../../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../../../_snowpack/pkg/react.js";
import {useHistory} from "../../../../../../../_snowpack/pkg/react-router-dom.js";
import {MTHORANGE, PRIMARY_MEDIUM_MOUSEOVER, SYSTEM_06} from "../../../../../../utils/constants.js";
import {Subtitle} from "../../../../../../components/Typography/Subtitle/Subtitle.js";
import InfoOutlinedIcon from "../../../../../../../_snowpack/pkg/@mui/icons-material/InfoOutlined.js";
import WarningAmberOutlinedIcon from "../../../../../../../_snowpack/pkg/@mui/icons-material/WarningAmberOutlined.js";
import moment from "../../../../../../../_snowpack/pkg/moment.js";
const Row = (props) => /* @__PURE__ */ React.createElement(Box, {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: props.content || "flex-start"
}, props.children);
export const ToDoListItem = ({
  todoItem,
  idx
}) => {
  const history = useHistory();
  return /* @__PURE__ */ React.createElement(Box, {
    key: idx,
    sx: {my: 3}
  }, /* @__PURE__ */ React.createElement(Row, {
    content: "space-between"
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Row, null, /* @__PURE__ */ React.createElement(InfoOutlinedIcon, {
    fontSize: "medium"
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: {ml: 4}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "bold"
  }, todoItem.title), /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    color: SYSTEM_06
  }, moment(todoItem.date).format("LL"))))), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Row, null, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      borderRadius: 1,
      background: "rgba(236, 89, 37, 0.1)",
      width: 72,
      height: 28,
      display: "flex",
      justifyContent: "center",
      mr: 4,
      padding: 0.4
    }
  }, /* @__PURE__ */ React.createElement(Row, null, /* @__PURE__ */ React.createElement(WarningAmberOutlinedIcon, {
    fontSize: "small",
    htmlColor: MTHORANGE
  }), /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    color: MTHORANGE,
    sx: {ml: 1}
  }, todoItem.severity))), /* @__PURE__ */ React.createElement(Button, {
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
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12
  }, "Process Now"))))));
};
