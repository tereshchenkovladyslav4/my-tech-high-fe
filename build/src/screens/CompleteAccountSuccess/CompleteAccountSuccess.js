import {Box, Container} from "../../../_snowpack/pkg/@mui/material.js";
import React from "../../../_snowpack/pkg/react.js";
import BGSVG from "../../assets/ApplicationBG.svg.proxy.js";
import {Link} from "../../../_snowpack/pkg/react-router-dom.js";
import {useStyles} from "./styles.js";
import {Title} from "../../components/Typography/Title/Title.js";
import {NewApplicationFooter} from "../../components/NewApplicationFooter/NewApplicationFooter.js";
import {DASHBOARD, MTHBLUE} from "../../utils/constants.js";
export const CompleteAccountSuccess = () => {
  const classes = useStyles;
  return /* @__PURE__ */ React.createElement(Container, {
    sx: {bgcolor: "#EEF4F8"}
  }, /* @__PURE__ */ React.createElement(Box, {
    paddingY: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      backgroundImage: `url(${BGSVG})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top",
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    paddingX: 36,
    height: "175vh"
  }, /* @__PURE__ */ React.createElement(Box, {
    marginTop: 12
  }, /* @__PURE__ */ React.createElement(Title, {
    color: MTHBLUE,
    textAlign: "center"
  }, "InfoCenter")), /* @__PURE__ */ React.createElement(Title, {
    fontWeight: "500",
    textAlign: "center"
  }, "Apply"), /* @__PURE__ */ React.createElement(Box, {
    marginTop: "25%"
  }, /* @__PURE__ */ React.createElement(Title, {
    size: "medium",
    fontWeight: "500",
    textAlign: "center"
  }, "You have successfully created your account. please continue", /* @__PURE__ */ React.createElement(Link, {
    to: DASHBOARD,
    style: {fontWeight: 700, color: MTHBLUE, textDecoration: "none"}
  }, "\xA0", "here", "\xA0"), "and login."))))), /* @__PURE__ */ React.createElement(Box, {
    paddingBottom: 4
  }, /* @__PURE__ */ React.createElement(NewApplicationFooter, null)));
};
