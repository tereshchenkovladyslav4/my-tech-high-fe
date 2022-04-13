import {Box, Button, Card} from "../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../_snowpack/pkg/react.js";
import {BUTTON_LINEAR_GRADIENT} from "../../../../utils/constants.js";
import CloseIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
export const EnrollmentPacketView = () => {
  return /* @__PURE__ */ React.createElement(Card, {
    sx: {
      padding: 2,
      margin: 2
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginRight: 2,
      width: "92px"
    }
  }, "Save"), /* @__PURE__ */ React.createElement(CloseIcon, null)));
};
