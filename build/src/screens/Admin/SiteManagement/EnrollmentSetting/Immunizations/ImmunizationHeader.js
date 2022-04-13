import {Box, Button, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import ArrowBackIosRoundedIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/ArrowBackIosRounded.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import {useHistory} from "../../../../../../_snowpack/pkg/react-router-dom.js";
import {useFormikContext} from "../../../../../../_snowpack/pkg/formik.js";
const EnableDisableToggle = ({enabledState, onEnabledChange}) => {
  const toggleStyle = {
    width: "240px",
    height: "46px",
    bgcolor: "#FAFAFA",
    "& .MuiToggleButtonGroup-grouped": {
      border: 0,
      "&:not(:first-of-type)": {
        borderRadius: "54px"
      },
      "&:first-of-type": {
        borderRadius: "54px"
      },
      "&.Mui-selected": {
        bgcolor: "Black",
        color: "white",
        "&:hover": {
          bgcolor: "black"
        }
      },
      "&:hover": {
        bgcolor: "unset"
      }
    },
    padding: "5px",
    borderRadius: "54px"
  };
  const formik = useFormikContext();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ToggleButtonGroup, {
    "aria-label": "Immunizations status",
    exclusive: true,
    value: enabledState,
    onChange: (_, newState) => {
      if (newState !== null) {
        onEnabledChange(newState);
        if (formik)
          formik.setFieldValue("is_enabled", newState);
      }
    },
    fullWidth: true,
    sx: toggleStyle
  }, /* @__PURE__ */ React.createElement(ToggleButton, {
    value: true,
    "aria-label": "Enabled"
  }, "Enabled"), /* @__PURE__ */ React.createElement(ToggleButton, {
    value: false,
    "aria-label": "Enabled"
  }, "Disabled")));
};
const Title = () => {
  const {values, handleChange, errors, touched} = useFormikContext();
  return /* @__PURE__ */ React.createElement(TextField, {
    id: "title",
    name: "title",
    variant: "standard",
    sx: {
      textAlign: "center"
    },
    InputProps: {
      disableUnderline: true
    },
    placeholder: "Name",
    value: values.title || "",
    onChange: handleChange,
    error: touched.title && !!errors.title,
    helperText: touched.title && errors.title
  });
};
const SaveButton = () => {
  const context = useFormikContext();
  if (!context)
    return null;
  const {submitForm} = context;
  return /* @__PURE__ */ React.createElement(Button, {
    onClick: async () => submitForm(),
    sx: {
      background: "linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%), #4145FF",
      color: "white",
      marginLeft: "20px",
      width: "90px",
      height: "25px",
      "&:hover": {
        backgroundColor: "#4145FF"
      },
      borderRadius: "8px"
    }
  }, "Save");
};
const ImmunizationHeader = ({
  title,
  withSave,
  enabledState,
  onEnabledChange,
  backUrl
}) => {
  const history = useHistory();
  return /* @__PURE__ */ React.createElement(Box, {
    paddingY: "13px",
    paddingX: "20px",
    display: "flex",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => history.push(backUrl),
    sx: {
      position: "relative",
      bottom: "2px"
    }
  }, /* @__PURE__ */ React.createElement(ArrowBackIosRoundedIcon, {
    sx: {fontSize: "15px"}
  })), withSave ? /* @__PURE__ */ React.createElement(Title, null) : /* @__PURE__ */ React.createElement(Typography, {
    paddingLeft: "7px",
    fontSize: "20px",
    component: "span"
  }, title), withSave && /* @__PURE__ */ React.createElement(SaveButton, null)), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(EnableDisableToggle, {
    enabledState,
    onEnabledChange
  })));
};
export {ImmunizationHeader as default, EnableDisableToggle};
