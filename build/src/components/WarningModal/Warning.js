import {Button, Modal} from "../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React from "../../../_snowpack/pkg/react.js";
import {Subtitle} from "../Typography/Subtitle/Subtitle.js";
import CloseIcon from "../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {useStyles} from "./styles.js";
import ErrorOutlineIcon from "../../../_snowpack/pkg/@mui/icons-material/ErrorOutline.js";
import {Paragraph} from "../Typography/Paragraph/Paragraph.js";
import {SYSTEM_01} from "../../utils/constants.js";
export const WarningModal = ({
  handleModem,
  title,
  subtitle,
  btntitle = "Submit",
  handleSubmit,
  showIcon = true
}) => {
  const classes = useStyles;
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem(),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.header
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, title), /* @__PURE__ */ React.createElement(CloseIcon, {
    onClick: () => handleModem(),
    style: classes.close
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.content
  }, showIcon && /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
    style: classes.errorOutline
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    color: SYSTEM_01
  }, subtitle), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton,
    onClick: handleSubmit
  }, btntitle))));
};
