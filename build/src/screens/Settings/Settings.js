import {Box, Tab, Tabs} from "../../../_snowpack/pkg/@mui/material.js";
import React from "../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../components/Typography/Subtitle/Subtitle.js";
import {MTHBLUE} from "../../utils/constants.js";
import {Account} from "./Account/Account.js";
import {Profile} from "./Profile/Profile.js";
import {useStyles} from "./styles.js";
export const Settings = () => {
  const classes = useStyles;
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabTextColor = (tab) => value === tab ? MTHBLUE : "";
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  }, /* @__PURE__ */ React.createElement(Tabs, {
    value,
    onChange: handleChange,
    centered: true,
    sx: classes.activeTab,
    TabIndicatorProps: {style: {background: "#4145FF"}}
  }, /* @__PURE__ */ React.createElement(Tab, {
    label: /* @__PURE__ */ React.createElement(Subtitle, {
      color: tabTextColor(0)
    }, "Profile"),
    sx: {textTransform: "none"}
  }), /* @__PURE__ */ React.createElement(Tab, {
    label: /* @__PURE__ */ React.createElement(Subtitle, {
      color: tabTextColor(1)
    }, "Account"),
    sx: {textTransform: "none"}
  })), /* @__PURE__ */ React.createElement(Box, {
    paddingX: 2,
    height: "100%",
    paddingY: 2
  }, value === 0 ? /* @__PURE__ */ React.createElement(Profile, null) : /* @__PURE__ */ React.createElement(Account, null)));
};
