import React from "../../../../../../_snowpack/pkg/react.js";
import {Button, Modal, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {Stack} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {useStyles} from "./styles.js";
import AddedIcon from "../../../../../assets/icons/user-added.png.proxy.js";
import {SYSTEM_01} from "../../../../../utils/constants.js";
export const AddedModal = ({
  handleModem
}) => {
  const classes = useStyles;
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem("finish"),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Typography, {
    sx: {fontWeight: 700, fontSize: 20, textAlign: "center"}
  }, "New User Added"), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.content
  }, /* @__PURE__ */ React.createElement("img", {
    src: AddedIcon
  }), /* @__PURE__ */ React.createElement(Typography, {
    sx: {mt: 6.2, fontSize: 14, fontWeight: 500, textAlign: "center", color: SYSTEM_01}
  }, "Do you want to add another user?"), /* @__PURE__ */ React.createElement(Stack, {
    sx: {mt: 4},
    direction: "row",
    justifyContent: "center",
    spacing: 3,
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.cancelButton,
    onClick: () => handleModem("finish")
  }, /* @__PURE__ */ React.createElement(Typography, {
    sx: {fontSize: 12, fontWeight: 700, color: SYSTEM_01}
  }, "Finish")), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton,
    onClick: () => handleModem("add")
  }, /* @__PURE__ */ React.createElement(Typography, {
    sx: {fontSize: 12, fontWeight: 700, color: "#F2F2F2"}
  }, "Add User"))))));
};
