import {Button, Box} from "../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../_snowpack/pkg/react.js";
import {MTHBLUE, BUTTON_LINEAR_GRADIENT} from "../../../../utils/constants.js";
export const EnrollmentPacketFilters = ({filters, setFilters, packetCount}) => {
  console.log(packetCount);
  const handleSelectFilter = (value) => {
    if (filters.includes(value)) {
      setFilters(filters.filter((item) => item !== value));
    } else {
      setFilters([...filters, ...[value]]);
    }
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      paddingX: "100px",
      marginY: 2,
      paddingY: 3
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: filters.includes("Not Started") ? "text" : "outlined",
    sx: {
      background: filters.includes("Not Started") && BUTTON_LINEAR_GRADIENT,
      color: filters.includes("Not Started") ? "white" : MTHBLUE,
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      whiteSpace: "nowrap"
    },
    onClick: () => handleSelectFilter("Not Started")
  }, "Not Started (", packetCount && packetCount["Not Started"] ? packetCount["Not Started"] : 0, ")"), /* @__PURE__ */ React.createElement(Button, {
    variant: filters.includes("Started") ? "text" : "outlined",
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      background: filters.includes("Started") && BUTTON_LINEAR_GRADIENT,
      color: filters.includes("Started") ? "white" : MTHBLUE,
      whiteSpace: "nowrap"
    },
    onClick: () => handleSelectFilter("Started")
  }, "Started (", packetCount && packetCount["Started"] ? packetCount["Started"] : 0, ")"), /* @__PURE__ */ React.createElement(Button, {
    variant: filters.includes("Missing Info") ? "text" : "outlined",
    sx: {
      background: filters.includes("Missing Info") && BUTTON_LINEAR_GRADIENT,
      color: filters.includes("Missing Info") ? "white" : MTHBLUE,
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      whiteSpace: "nowrap"
    },
    onClick: () => handleSelectFilter("Missing Info")
  }, "Missing Info (", packetCount && packetCount["Missing Info"] ? packetCount["Missing Info"] : 0, ")"), /* @__PURE__ */ React.createElement(Button, {
    variant: filters.includes("Submitted") ? "text" : "outlined",
    sx: {
      background: filters.includes("Submitted") && BUTTON_LINEAR_GRADIENT,
      color: filters.includes("Submitted") ? "white" : MTHBLUE,
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      whiteSpace: "nowrap"
    },
    onClick: () => handleSelectFilter("Submitted")
  }, "Submitted (", packetCount && packetCount["Submitted"] ? packetCount["Submitted"] : 0, ")"), /* @__PURE__ */ React.createElement(Button, {
    variant: filters.includes("Resubmitted") ? "text" : "outlined",
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      background: filters.includes("Resubmitted") && BUTTON_LINEAR_GRADIENT,
      color: filters.includes("Resubmitted") ? "white" : MTHBLUE,
      whiteSpace: "nowrap"
    },
    onClick: () => handleSelectFilter("Resubmitted")
  }, "Resubmitted (", packetCount && packetCount["Resubmitted"] ? packetCount["Resubmitted"] : 0, ")"), /* @__PURE__ */ React.createElement(Button, {
    variant: filters.includes("Age Issue") ? "text" : "outlined",
    sx: {
      background: filters.includes("Age Issue") && BUTTON_LINEAR_GRADIENT,
      color: filters.includes("Age Issue") ? "white" : MTHBLUE,
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      whiteSpace: "nowrap"
    },
    onClick: () => handleSelectFilter("Age Issue")
  }, "Age Issue (", packetCount && packetCount["Age Issue"] ? packetCount["Age Issue"] : 0, ")"), /* @__PURE__ */ React.createElement(Button, {
    variant: filters.includes("Conditional") ? "text" : "outlined",
    sx: {
      background: filters.includes("Conditional") && BUTTON_LINEAR_GRADIENT,
      color: filters.includes("Conditional") ? "white" : MTHBLUE,
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      whiteSpace: "nowrap"
    },
    onClick: () => handleSelectFilter("Conditional")
  }, "Conditional (", packetCount && packetCount["Conditional"] ? packetCount["Conditional"] : 0, ")"));
};
