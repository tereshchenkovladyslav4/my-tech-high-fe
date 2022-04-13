import {Box, Card} from "../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../_snowpack/pkg/react.js";
import {Table} from "../../../../components/Table/Table.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {MTHBLUE} from "../../../../utils/constants.js";
export const StudentSchedule = () => {
  const tableHeaders = [/* @__PURE__ */ React.createElement(Paragraph, {
    size: "large"
  }, "Period"), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large"
  }, "Course")];
  const data = [
    {
      period: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "01"),
      course: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "Homeroom")
    },
    {
      period: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "02"),
      course: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "Middle School Math")
    },
    {
      period: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "03"),
      course: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "Middle School Language")
    },
    {
      period: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "04"),
      course: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "Middle School Science")
    },
    {
      period: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "05"),
      course: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "Exploring Technology")
    },
    {
      period: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "06"),
      course: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "large",
        color: "#A1A1A1",
        sx: {padding: 0.8}
      }, "Exploring Technology")
    }
  ];
  return /* @__PURE__ */ React.createElement(Card, {
    sx: {borderRadius: 4, alignSelf: "center", width: "95%", paddingY: 2, paddingX: 4, marginLeft: 2}
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 1
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Schedule"), /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {textDecoration: "underline"},
    color: MTHBLUE
  }, "Edit/View All")), /* @__PURE__ */ React.createElement(Table, {
    tableHeaders,
    tableBody: data
  }));
};
