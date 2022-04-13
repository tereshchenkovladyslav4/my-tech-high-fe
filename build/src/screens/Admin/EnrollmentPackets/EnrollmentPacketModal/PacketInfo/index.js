import {Grid} from "../../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import {Title} from "../../../../../components/Typography/Title/Title.js";
import GenderInfo from "./GenderInfo.js";
import LanguagesInfo from "./LanguagesInfo.js";
import OtherInfo from "./OtherInfo.js";
import RaceInfo from "./RaceInfo.js";
import SchoolInfo from "./SchoolInfo.js";
import SecondaryContact from "./SecondaryContact.js";
import VoluntaryIncomeInfo from "./VoluntaryIncomeInfo.js";
import {SYSTEM_01} from "../../../../../utils/constants.js";
import SignatureComp from "./Signature.js";
export default function EnrollmentPacketInfo() {
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    columnSpacing: 5,
    maxWidth: "100%"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Title, {
    color: SYSTEM_01,
    size: "small",
    fontWeight: "700"
  }, "Packet Info")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(SecondaryContact, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(SchoolInfo, null), /* @__PURE__ */ React.createElement(VoluntaryIncomeInfo, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(RaceInfo, null), /* @__PURE__ */ React.createElement(GenderInfo, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(OtherInfo, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(LanguagesInfo, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(SignatureComp, null)));
}
