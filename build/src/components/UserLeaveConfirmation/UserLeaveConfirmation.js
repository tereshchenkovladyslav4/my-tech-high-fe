import ReactDOM from "../../../_snowpack/pkg/react-dom.js";
import React from "../../../_snowpack/pkg/react.js";
import {Box, Button, Modal} from "../../../_snowpack/pkg/@mui/material.js";
import {SYSTEM_01} from "../../utils/constants.js";
import {Paragraph} from "../Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../Typography/Subtitle/Subtitle.js";
import {useStyles} from "./styles.js";
import ErrorOutlineIcon from "../../../_snowpack/pkg/@mui/icons-material/ErrorOutline.js";
export const UserLeaveConfirmation = (message, callback, confirmOpen, setConfirmOpen) => {
  const container = document.createElement("div");
  const classes = useStyles;
  container.setAttribute("custom-confirm-view", "");
  const handleConfirm = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container);
    callback(callbackState);
    setConfirmOpen(false);
  };
  const handleCancel = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container);
    callback();
    setConfirmOpen(false);
  };
  document.body.appendChild(container);
  const {header, content} = JSON.parse(message);
  ReactDOM.render(/* @__PURE__ */ React.createElement(Modal, {
    open: true
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.header
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, header)), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.content
  }, /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
    style: classes.errorOutline
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    color: SYSTEM_01
  }, content), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.cancelButton,
    onClick: handleCancel
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton,
    onClick: handleConfirm
  }, "Confirm"))))), container);
};
