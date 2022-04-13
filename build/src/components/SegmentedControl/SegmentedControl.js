import React from "../../../_snowpack/pkg/react.js";
import {AppBar, Tabs} from "../../../_snowpack/pkg/@mui/material.js";
import {LinkTab} from "./SegmentControlTab/SegmentControlTab.js";
import {useStyles} from "./styles.js";
import {Paragraph} from "../Typography/Paragraph/Paragraph.js";
export const SegmentedControl = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const classes = useStyles;
  return /* @__PURE__ */ React.createElement(AppBar, {
    position: "static",
    elevation: 9,
    style: {borderRadius: "25px", backgroundColor: "white"}
  }, /* @__PURE__ */ React.createElement(Tabs, {
    value,
    onChange: handleChange,
    sx: classes.tabs
  }, /* @__PURE__ */ React.createElement(LinkTab, {
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, "Read"),
    href: "/trash",
    sx: classes.tabTwo
  }), /* @__PURE__ */ React.createElement(LinkTab, {
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, "Unread"),
    href: "/spam",
    sx: classes.tabThree
  })));
};
