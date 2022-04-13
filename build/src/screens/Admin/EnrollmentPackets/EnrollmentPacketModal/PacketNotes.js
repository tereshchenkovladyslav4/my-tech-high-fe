import React from "../../../../../_snowpack/pkg/react.js";
import {Grid, TextField} from "../../../../../_snowpack/pkg/@mui/material.js";
import {useFormContext, Controller} from "../../../../../_snowpack/pkg/react-hook-form.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {SYSTEM_01} from "../../../../utils/constants.js";
export default function EnrollmentPacketNotes() {
  const {control} = useFormContext();
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    sx: {paddingTop: "20px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 12,
    sm: 12,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    color: SYSTEM_01,
    size: "medium",
    fontWeight: "700"
  }, "Packet Notes")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 12,
    sm: 12,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Controller, {
    name: "notes",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      size: "small",
      variant: "outlined",
      fullWidth: true,
      multiline: true,
      rows: 8,
      sx: {padding: "10px 0px 20px 0px", width: "70%"}
    })
  })));
}
