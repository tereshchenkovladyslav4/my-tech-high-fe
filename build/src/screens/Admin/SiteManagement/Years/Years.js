import {Button, Stack} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import React, {useState} from "../../../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {MTHBLUE} from "../../../../utils/constants.js";
import ExpandMoreIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ExpandMore.js";
import YearNode from "./YearNode/YearNode.js";
import {useStyles} from "../styles.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
const Years = () => {
  const classes = useStyles;
  const [yearsData, setyearsData] = useState([
    {
      id: 1,
      label: "School Year",
      data: ["Open", "Select", " ", "Close", "Select"]
    },
    {
      id: 2,
      label: "Applications",
      data: ["Open", "Select", " ", "Close", "Select"]
    },
    {
      id: 3,
      label: "Mid-Year ",
      data: ["Select"]
    },
    {
      id: 4,
      label: "Schedule Builder",
      data: ["Open", "Select", " ", "Close", "Select"]
    },
    {
      id: 5,
      label: "Direct Orders",
      data: ["Tech", "Select", " ", "Custom-Built", "Select"]
    },
    {
      id: 6,
      label: "Reimbursement",
      data: ["Tech", "Select", " ", "Custom-Built", "Select"]
    },
    {
      id: 7,
      label: "2nd Semester Start",
      data: ["Select"]
    },
    {
      id: 8,
      label: "2nd Semester Schedule",
      data: ["Open", "Select", " ", "Close", "Select"]
    },
    {
      id: 9,
      label: "Intent to Re-enroll",
      data: ["Open", "Select", " ", "Close", "Select", "Withdraw", "No Response", "Select"]
    },
    {
      id: 10,
      label: "Learning Logs Close",
      data: ["Select"]
    }
  ]);
  const renderYearData = () => {
    return map(yearsData, (node) => /* @__PURE__ */ React.createElement(YearNode, {
      title: node.label,
      data: node.data
    }));
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: classes.base
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {position: "absolute", right: 20, top: "-10%"}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton
  }, "Save")), /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    spacing: 1,
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    fontWeight: "600",
    color: MTHBLUE
  }, "2020 - 2021"), /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: {mt: 1}
  }, renderYearData()));
};
export {Years as default};
