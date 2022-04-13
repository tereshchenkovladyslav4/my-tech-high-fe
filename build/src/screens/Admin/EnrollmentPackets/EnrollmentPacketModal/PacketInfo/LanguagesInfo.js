import React from "../../../../../../_snowpack/pkg/react.js";
import {Grid} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {DropDown} from "../../../../../components/DropDown/DropDown.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {languages} from "../../../../../utils/languages.js";
import {Controller, useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export default function LanguagesInfo() {
  const {control} = useFormContext();
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2,
    sx: {paddingTop: "20px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12,
    sx: {maxWidth: "25rem"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "First Language learned by child"), /* @__PURE__ */ React.createElement(Controller, {
    name: "language",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: languages,
      placeholder: "Entry",
      defaultValue: field.value,
      setParentValue: (v) => field.onChange(v),
      size: "small"
    })
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12,
    sx: {maxWidth: "25rem"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Language used most often by child in home"), /* @__PURE__ */ React.createElement(Controller, {
    name: "language_home_child",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: languages,
      placeholder: "Entry",
      defaultValue: field.value,
      setParentValue: (v) => field.onChange(v),
      size: "small"
    })
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12,
    sx: {maxWidth: "25rem"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Preferred correspondence language for adults in the home"), /* @__PURE__ */ React.createElement(Controller, {
    name: "language_home_preferred",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: languages,
      placeholder: "Entry",
      defaultValue: field.value,
      setParentValue: (v) => field.onChange(v),
      size: "small"
    })
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12,
    sx: {maxWidth: "25rem"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Language used most often by adults in the home"), /* @__PURE__ */ React.createElement(Controller, {
    name: "language_home",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: languages,
      placeholder: "Entry",
      defaultValue: field.value,
      setParentValue: (v) => field.onChange(v),
      size: "small"
    })
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 6,
    xs: 12,
    sx: {maxWidth: "25rem"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Language used most often by child with friends outside "), /* @__PURE__ */ React.createElement(Controller, {
    name: "language_friends",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: languages,
      placeholder: "Entry",
      defaultValue: field.value,
      setParentValue: (v) => field.onChange(v),
      size: "small"
    })
  })));
}
