import React from "../../../../../../_snowpack/pkg/react.js";
import {Grid} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {DropDown} from "../../../../../components/DropDown/DropDown.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {directoryPermissionptions, militaryOptions, otherPermissionptions, picturePermissionptions, workInAgricultureOptions} from "../../../../../utils/constants.js";
import {Controller, useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export default function OtherInfo() {
  const {control} = useFormContext();
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {paddingTop: "15px"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "700"
  }, "Other"), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    columnSpacing: 2,
    sx: {paddingTop: "20px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    maxWidth: "25rem"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Has the parent or spouse worked in Agriculture?"), /* @__PURE__ */ React.createElement(Controller, {
    name: "worked_in_agriculture",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: workInAgricultureOptions,
      placeholder: "Entry",
      defaultValue: field.value,
      size: "small",
      setParentValue: (v) => field.onChange(v)
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    maxWidth: "25rem"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Is a parent or legal guardian on active duty in the military"), /* @__PURE__ */ React.createElement(Controller, {
    name: "military",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: militaryOptions,
      placeholder: "Entry",
      defaultValue: field.value,
      size: "small",
      setParentValue: (v) => field.onChange(v)
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"},
    display: "flex",
    flexDirection: "column",
    maxWidth: "25rem"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "FERPA Agreement Options"), /* @__PURE__ */ React.createElement(Controller, {
    name: "ferpa_agreement",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: otherPermissionptions,
      placeholder: "Entry",
      defaultValue: field.value,
      size: "small",
      setParentValue: (v) => field.onChange(v)
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"},
    display: "flex",
    flexDirection: "column",
    maxWidth: "25rem"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Student Photo Permissions"), /* @__PURE__ */ React.createElement(Controller, {
    name: "photo_permission",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: picturePermissionptions,
      placeholder: "Entry",
      defaultValue: field.value,
      size: "small",
      setParentValue: (v) => field.onChange(v)
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"},
    display: "flex",
    flexDirection: "column",
    maxWidth: "25rem"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "School Student Directory Permissions"), /* @__PURE__ */ React.createElement(Controller, {
    name: "dir_permission",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: directoryPermissionptions,
      placeholder: "Entry",
      defaultValue: field.value,
      size: "small",
      setParentValue: (v) => field.onChange(v)
    })
  })))));
}
