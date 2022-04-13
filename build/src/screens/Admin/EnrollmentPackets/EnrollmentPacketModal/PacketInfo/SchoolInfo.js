import React, {useState} from "../../../../../../_snowpack/pkg/react.js";
import {Checkbox, Grid, TextField} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {DropDown} from "../../../../../components/DropDown/DropDown.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {schoolDistricts} from "../../../../../utils/constants.js";
import {Controller, useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export default function SchoolInfo() {
  const {watch, control} = useFormContext();
  const [last_school_type] = watch(["last_school_type"]);
  const [isDisableSchoolPart, setIsDisableSchoolPart] = useState(last_school_type === 1 ? true : false);
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {paddingTop: "15px"}
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignItems: "center",
    paddingLeft: 0
  }, /* @__PURE__ */ React.createElement(Controller, {
    name: "last_school_type",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(Checkbox, {
      sx: {paddingLeft: 0},
      checked: field.value === 1 ? true : false,
      onChange: (e) => {
        field.onChange(e.target.checked ? 1 : 0);
        setIsDisableSchoolPart(e.target.checked);
      }
    })
  }), /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {fontSize: "12px"}
  }, "None - Student has always been homeschooled")), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    columnSpacing: 4,
    rowSpacing: 2,
    sx: {paddingTop: "15px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Name of School"), /* @__PURE__ */ React.createElement(Controller, {
    name: "last_school",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "Name of School",
      size: "small",
      variant: "outlined",
      fullWidth: true,
      disabled: isDisableSchoolPart
    })
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {width: 200}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "School District of Residence"), /* @__PURE__ */ React.createElement(Controller, {
    name: "school_district",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(DropDown, {
      dropDownItems: schoolDistricts,
      placeholder: "Entry",
      defaultValue: field.value,
      size: "small",
      setParentValue: (v) => field.onChange(v)
    })))
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 8,
    sm: 8,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Address of School"), /* @__PURE__ */ React.createElement(Controller, {
    name: "last_school_address",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      placeholder: "Address of School",
      size: "small",
      variant: "outlined",
      fullWidth: true,
      disabled: isDisableSchoolPart
    })
  })))));
}
