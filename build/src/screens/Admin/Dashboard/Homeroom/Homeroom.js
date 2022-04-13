import {Link, TextField} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import React from "../../../../../_snowpack/pkg/react.js";
import {DataRow} from "../../../../components/DataRow/DataRow.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import DatePicker from "../../../../../_snowpack/pkg/@mui/lab/DatePicker.js";
import AdapterDateFns from "../../../../../_snowpack/pkg/@mui/lab/AdapterDateFns.js";
import LocalizationProvider from "../../../../../_snowpack/pkg/@mui/lab/LocalizationProvider.js";
export const Homeroom = () => {
  const [value, setValue] = React.useState(new Date());
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const data = [
    {
      label: "Unassigned Students",
      value: "10"
    },
    {
      label: "Assigned Students",
      value: "10"
    },
    {
      label: "Ungraded Logs",
      value: "10"
    },
    {
      label: "Graded Logs",
      value: "10"
    },
    {
      label: "Not Submitted Logs",
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
        size: "medium"
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
  }, "Homeroom"), /* @__PURE__ */ React.createElement(Link, {
    color: "#4145FF",
    fontWeight: 600,
    fontSize: 12
  }, "View All")), /* @__PURE__ */ React.createElement(Box, {
    sx: {width: 220, px: 3, mt: 2}
  }, /* @__PURE__ */ React.createElement(LocalizationProvider, {
    dateAdapter: AdapterDateFns
  }, /* @__PURE__ */ React.createElement(DatePicker, {
    label: "Due Date",
    inputFormat: "MM/dd/yyyy",
    value,
    onChange: handleChange,
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      color: "primary",
      size: "small",
      ...params
    })
  }))), renderRows());
};
