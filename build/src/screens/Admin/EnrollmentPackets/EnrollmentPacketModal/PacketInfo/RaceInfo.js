import React from "../../../../../../_snowpack/pkg/react.js";
import {Checkbox, Grid, TextField} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {Controller, useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
const RacesTypes = {
  asian: "Asian",
  american_indian_alaska: "American Indian or Alaska Native",
  white: "White",
  black_american: "Black or African American",
  hawaiian: "Native Hawaiian or Other Pacific Islander",
  undeclared: "Undeclared"
};
export default function RaceInfo() {
  const {control} = useFormContext();
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {paddingTop: "15px"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "700"
  }, "Race"), /* @__PURE__ */ React.createElement(Controller, {
    name: "race",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      sx: {paddingTop: "15px"}
    }, /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 6
    }, /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === RacesTypes.asian,
      onClick: () => field.onChange(RacesTypes.asian)
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Asian")), /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === RacesTypes.black_american,
      onClick: () => field.onChange(RacesTypes.black_american)
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Black or African American")), /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === RacesTypes.white,
      onClick: () => field.onChange(RacesTypes.white)
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "White"))), /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 6
    }, /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === RacesTypes.american_indian_alaska,
      onClick: () => field.onChange(RacesTypes.american_indian_alaska)
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "American Indian or Alaska Native")), /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === RacesTypes.hawaiian,
      onClick: () => field.onChange(RacesTypes.hawaiian)
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Native Hawaiian or Other Pacific Islander ")), /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: field.value === RacesTypes.undeclared,
      onClick: () => field.onChange(RacesTypes.undeclared)
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Undeclared"))), /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      xs: 12
    }, /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: !Object.values(RacesTypes).includes(field.value),
      onClick: () => field.onChange("")
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, "Other "), /* @__PURE__ */ React.createElement(TextField, {
      sx: {width: "300px", paddingLeft: 4},
      placeholder: "Other",
      size: "small",
      variant: "outlined",
      fullWidth: true,
      disabled: Object.values(RacesTypes).includes(field.value),
      name: "race",
      value: Object.values(RacesTypes).includes(field.value) ? "" : field.value,
      onChange: field.onChange
    }))))
  }));
}
