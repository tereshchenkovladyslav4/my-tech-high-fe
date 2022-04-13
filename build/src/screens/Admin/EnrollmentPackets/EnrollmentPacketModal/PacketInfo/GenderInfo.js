import React from "../../../../../../_snowpack/pkg/react.js";
import {Checkbox, Grid} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {Controller, useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export default function GenderInfo() {
  const {control} = useFormContext();
  return /* @__PURE__ */ React.createElement(Controller, {
    name: "gender",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(Box, {
      sx: {paddingTop: "15px", width: "20rem"}
    }, /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small",
      fontWeight: "700"
    }, "Gender"), /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      sx: {paddingTop: "15px"}
    }, /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 6
    }, /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === "Male" ? true : false,
      onChange: (v) => v && field.onChange("Male")
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Male"))), /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 6
    }, /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === "Non Binary" ? true : false,
      onChange: (v) => v && field.onChange("Non Binary")
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Non Binary")))), /* @__PURE__ */ React.createElement(Grid, {
      container: true
    }, /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 6
    }, /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === "Female" ? true : false,
      onChange: (v) => v && field.onChange("Female")
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Female"))), /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 6
    }, /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === "Undeclared" ? true : false,
      onChange: (v) => v && field.onChange("Undeclared")
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Undeclared ")))))
  });
}
