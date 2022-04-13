import {Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../_snowpack/pkg/react.js";
import {DASHBOARD} from "../../../utils/constants.js";
import withdrawlsImg from "../../../assets/withdrawls.png.proxy.js";
import {ParentLinkCard} from "./components/AdminEnrollmentCard/ParentLinkCard.js";
export const ParentLink = () => {
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 4,
    columnSpacing: 0,
    sx: {paddingX: 2, marginTop: 4}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(ParentLinkCard, {
    title: "Withdrawal",
    link: DASHBOARD,
    img: withdrawlsImg
  })));
};
