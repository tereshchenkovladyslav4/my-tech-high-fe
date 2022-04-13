import {Link} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import React from "../../../../../_snowpack/pkg/react.js";
import {DataRow} from "../../../../components/DataRow/DataRow.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
export const SchoolEnrollment = () => {
  const data = [
    {
      label: "Unassigned",
      value: "10"
    },
    {
      label: "GPA",
      value: "10"
    },
    {
      label: "Tooele",
      value: "10"
    },
    {
      label: "Nebo",
      value: "10"
    },
    {
      label: "ICSD/SEA",
      value: "10"
    }
  ];
  const renderRows = () => map(data, (el, idx) => {
    const backgroundColor = idx === 0 || idx % 2 == 0 ? "#FAFAFA" : "white";
    return /* @__PURE__ */ React.createElement(DataRow, {
      backgroundColor,
      label: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium",
        fontWeight: "500"
      }, el.label),
      value: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium",
        fontWeight: "500"
      }, el.value)
    });
  });
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingX: 3
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700"
  }, "School Of Enrollment"), /* @__PURE__ */ React.createElement(Link, {
    color: "#4145FF",
    fontWeight: 600,
    fontSize: 12
  }, "Assign")), renderRows());
};
