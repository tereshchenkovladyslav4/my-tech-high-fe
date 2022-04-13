import React from "../../../../../../_snowpack/pkg/react.js";
import {Grid, TextField} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {DropDown} from "../../../../../components/DropDown/DropDown.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {countries, hispanicOptions, SYSTEM_01} from "../../../../../utils/constants.js";
import {Controller, useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export default function SecondaryContact() {
  const {control} = useFormContext();
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {paddingTop: "15px"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    color: SYSTEM_01,
    size: "small",
    fontWeight: "700"
  }, "Secondary Contact"), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    columnSpacing: 4,
    rowSpacing: 2,
    sx: {paddingTop: "15px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "First Name"), /* @__PURE__ */ React.createElement(Controller, {
    name: "secondary_contact_first",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "First Name",
      size: "small",
      variant: "outlined",
      fullWidth: true
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Last Name"), /* @__PURE__ */ React.createElement(Controller, {
    name: "secondary_contact_last",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "Last Name",
      size: "small",
      variant: "outlined",
      fullWidth: true
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"},
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Secondary Phone"), /* @__PURE__ */ React.createElement(Controller, {
    name: "secondary_phone",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "Secondary Phone",
      size: "small",
      variant: "outlined",
      fullWidth: true
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"},
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Secondary Email"), /* @__PURE__ */ React.createElement(Controller, {
    name: "secondary_email",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "Secondary Email",
      size: "small",
      variant: "outlined",
      fullWidth: true
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"},
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Date of Birth"), /* @__PURE__ */ React.createElement(Controller, {
    name: "date_of_birth",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      type: "date",
      placeholder: "Date of Birth",
      size: "small",
      variant: "outlined",
      fullWidth: true
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"},
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Birthplace"), /* @__PURE__ */ React.createElement(Controller, {
    name: "birth_place",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "Birthplace",
      size: "small",
      variant: "outlined",
      fullWidth: true
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Country"), /* @__PURE__ */ React.createElement(Controller, {
    name: "birth_country",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: countries,
      placeholder: "Entry",
      defaultValue: field.value,
      size: "small",
      setParentValue: (v) => field.onChange(v)
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: "10px"},
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Hispanic / Latino"), /* @__PURE__ */ React.createElement(Controller, {
    name: "hispanic",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: hispanicOptions,
      defaultValue: field.value,
      placeholder: "Entry",
      size: "small",
      setParentValue: (v) => field.onChange(v)
    })
  })))));
}
