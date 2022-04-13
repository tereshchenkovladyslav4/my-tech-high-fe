import React, {useState} from "../../../../../_snowpack/pkg/react.js";
import {Button, Modal} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {useStyles} from "./styles.js";
import moment from "../../../../../_snowpack/pkg/moment.js";
import {ArrowDropDown} from "../../../../../_snowpack/pkg/@mui/icons-material.js";
export const ApplicationEmailModal = ({handleModem, data, handleSubmit}) => {
  const classes = useStyles;
  const [sort, setSort] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem(),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalEmailCard
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.content
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.emailRowHead
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    sx: classes.emailLabel
  }, "Sent Date ", /* @__PURE__ */ React.createElement(ArrowDropDown, {
    sx: {ml: 2}
  })), /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    sx: {display: "flex", alignItems: "center"}
  }, "Subject ", /* @__PURE__ */ React.createElement(ArrowDropDown, {
    sx: {ml: 5}
  }))), data.slice(0, 5).map((item, index) => /* @__PURE__ */ React.createElement(Box, {
    sx: classes.emailRow,
    key: index
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    sx: classes.emailLabel
  }, moment(item.created_at).format("MM/DD/yy")), /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, item.subject)))), /* @__PURE__ */ React.createElement(Box, {
    sx: {textAlign: "right"}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.ok,
    onClick: handleSubmit
  }, "OK"))));
};
