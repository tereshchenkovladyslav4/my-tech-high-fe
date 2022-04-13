import React from "../../../../../../_snowpack/pkg/react.js";
import {Modal, Box, Button, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
const EnrollmentWarnSaveModal = ({onClose, onSave}) => {
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose,
    "aria-labelledby": "child-modal-title",
    "aria-describedby": "child-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      position: "absolute",
      top: "30%",
      left: "40%",
      width: 400,
      padding: "1rem",
      borderRadius: 3,
      bgcolor: "background.paper",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /* @__PURE__ */ React.createElement("h2", {
    id: "child-modal-title"
  }, "Missing Vaccine"), /* @__PURE__ */ React.createElement("div", {
    id: "child-modal-description"
  }, /* @__PURE__ */ React.createElement(Typography, {
    sx: {width: "300px", textAlign: "center", padding: "10px 0 20px 0"}
  }, "Data is missing for immunizatoins. Do you wish to save the packet?")), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      width: "100%",
      justifyContent: "space-evenly"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      borderRadius: 20,
      backgroundColor: "#f0f0f0",
      fontWeight: "bold",
      paddingX: "50px",
      textTransform: "none"
    },
    onClick: onClose
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    sx: {
      borderRadius: 20,
      backgroundColor: "black",
      color: "white",
      fontWeight: "bold",
      paddingX: "50px",
      hover: {
        backgroundColor: "#a0a0a0"
      }
    },
    onClick: onSave
  }, "Yes"))));
};
export default EnrollmentWarnSaveModal;
