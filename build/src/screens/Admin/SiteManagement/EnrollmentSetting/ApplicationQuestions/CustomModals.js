import React from "../../../../../../_snowpack/pkg/react.js";
import {Box, Button, Modal, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import InfoIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/InfoOutlined.js";
export default function CustomModal({
  title,
  description,
  onClose,
  onConfirm,
  confirmStr = "Confirm",
  cancelStr = "Cancel"
}) {
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    "aria-labelledby": "child-modal-title",
    "aria-describedby": "child-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "441px",
      height: "auto",
      bgcolor: "#EEF4F8",
      borderRadius: 2,
      display: "flex",
      justifyContent: "center",
      p: 4
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {textAlign: "center"}
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, title), /* @__PURE__ */ React.createElement(InfoIcon, {
    sx: {fontSize: 50, margin: "20px 0px"}
  }), /* @__PURE__ */ React.createElement(Typography, null, description), /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", justifyContent: "space-between", marginTop: "30px", gap: "20px"}
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {width: "160px", height: "36px", background: "#E7E7E7", borderRadius: "50px"},
    onClick: onClose
  }, cancelStr), /* @__PURE__ */ React.createElement(Button, {
    sx: {
      width: "160px",
      height: "36px",
      background: "#43484F",
      borderRadius: "50px",
      color: "white"
    },
    onClick: onConfirm
  }, confirmStr)))));
}
