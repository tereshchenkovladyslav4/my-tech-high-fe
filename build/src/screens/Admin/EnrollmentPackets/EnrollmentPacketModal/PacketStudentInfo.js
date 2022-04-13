import React, {useContext} from "../../../../../_snowpack/pkg/react.js";
import {Grid} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Title} from "../../../../components/Typography/Title/Title.js";
import {MTHBLUE, SYSTEM_06} from "../../../../utils/constants.js";
import moment from "../../../../../_snowpack/pkg/moment.js";
import {parseGradeLevel} from "../../../../utils/stringHelpers.js";
import {ProfileContext} from "../../../../providers/ProfileProvider/ProfileContext.js";
export function EnrollmentJobsInfo({packet}) {
  const {showModal} = useContext(ProfileContext);
  const student = packet.student;
  const phoneFormat = (phone) => {
    phone = phone.replaceAll("-", "");
    return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
  };
  const age = student.person.date_of_birth ? moment().diff(student.person.date_of_birth, "years", false) : void 0;
  const street = student.parent.person.address.street;
  const street2 = student.parent.person.address.street2;
  function studentSPED() {
    switch (packet.special_ed) {
      case "0":
        return "No";
      case "1":
        return "IEP";
      case "2":
        return "504";
      case "3":
        return "EXIT";
      default:
        return "";
    }
  }
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    sx: {
      "&.MuiGrid-root": {
        maxWidth: "12rem",
        paddingRight: "3px"
      }
    },
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Title, {
    color: MTHBLUE,
    size: "small",
    fontWeight: "700",
    sx: {
      cursor: "pointer"
    }
  }, /* @__PURE__ */ React.createElement("span", {
    onClick: () => showModal(student)
  }, student.person.first_name, " ", student.person.last_name)), /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {marginY: "4px", fontSize: "14px"},
    color: SYSTEM_06,
    fontWeight: "400"
  }, /* @__PURE__ */ React.createElement("b", null, student.person.preferred_first_name && student.person.preferred_last_name ? `${student.person.preferred_first_name} ${student.person.preferred_last_name}` : "Not found")), /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {marginY: "4px", fontSize: "14px"},
    color: SYSTEM_06,
    fontWeight: "400"
  }, "Gender: ", /* @__PURE__ */ React.createElement("b", null, student.person.gender ? student.person.gender : "Not found")), /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {fontSize: "14px"},
    color: SYSTEM_06,
    fontWeight: "400"
  }, "DOB:", " ", /* @__PURE__ */ React.createElement("b", null, student.person.date_of_birth ? moment(student.person.date_of_birth).format("MMMM D, YYYY") : "Not found", age ? ` (${age})` : "")), /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {marginY: "4px", fontSize: "14px"},
    color: SYSTEM_06,
    fontWeight: "400"
  }, parseGradeLevel(student.grade_levels?.[0]?.grade_level)), /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {marginY: "4px", fontSize: "14px"},
    color: SYSTEM_06,
    fontWeight: "400"
  }, "SPED: ", studentSPED())), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12,
    sx: {
      "&.MuiGrid-root": {
        maxWidth: "12rem"
      }
    }
  }, /* @__PURE__ */ React.createElement(Title, {
    color: MTHBLUE,
    size: "small",
    fontWeight: "700",
    sx: {
      cursor: "pointer"
    }
  }, /* @__PURE__ */ React.createElement("span", {
    onClick: () => showModal(student.parent)
  }, student.parent.person.first_name, " ", student.parent.person.last_name)), /* @__PURE__ */ React.createElement(Paragraph, {
    color: "#7B61FF",
    sx: {fontSize: "14px", marginY: "4px"},
    fontWeight: "400"
  }, student.parent.person.email ? `${student.parent.person.email}` : "Not found"), /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "14px", marginY: "4px"},
    fontWeight: "400"
  }, student.parent.phone.number ? phoneFormat(student.parent.phone.number) : "Not found"), /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "14px", marginY: "4px"},
    fontWeight: "400"
  }, street ? `${street} ${street2 ? street2 : ""}` : "Not found"), /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "14px", marginY: "4px"},
    fontWeight: "400"
  }, !student.parent.person.address.city && !student.parent.person.address.state && !student.parent.person.address.zip ? "Not found" : `${student.parent.person.address.city + "," || ""} ${student.parent.person.address.state || ""}
            ${student.parent.person.address.zip || ""}`, ".")));
}
