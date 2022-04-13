import {Button, Grid} from "../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../_snowpack/pkg/react.js";
import {useFormContext} from "../../../../../_snowpack/pkg/react-hook-form.js";
import {
  BLACK_GRADIENT,
  BUTTON_LINEAR_GRADIENT,
  GREEN_GRADIENT,
  RED_GRADIENT,
  YELLOW_GRADIENT
} from "../../../../utils/constants.js";
import {checkImmmValueWithSpacing, isValidDate, isValidVaccInput} from "./helpers.js";
export default function PacketSaveButtons({submitForm}) {
  const {watch, getValues, setValue} = useFormContext();
  const status = watch("status");
  const onlySaveButton = !["Submitted", "Resubmitted"].includes(status);
  function onClick(action) {
    const vals = getValues();
    if (action === "Missing Info") {
      setValue("showMissingInfoModal", true);
    } else if (action === "Age Issue") {
      setValue("showAgeIssueModal", true);
    } else {
      let isValid = true;
      for (const e of vals.immunizations) {
        if (e.immunization.is_deleted)
          continue;
        if (!isValidVaccInput(e.value, e.immunization.immunity_allowed === 1)) {
          isValid = false;
          break;
        }
        if (e.value === "Exempt" && !isValidDate(vals.exemptionDate)) {
          isValid = false;
          break;
        }
        if (checkImmmValueWithSpacing(e, vals.immunizations)) {
          isValid = false;
          break;
        }
      }
      if (["Accepted", "Conditional"].includes(action)) {
        setValue("preSaveStatus", action);
        if (isValid) {
          submitForm();
          setValue("status", action);
        } else
          setValue("showSaveWarnModal", true);
      } else {
        if (isValid)
          submitForm();
        else
          setValue("showSaveWarnModal", true);
      }
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Grid, {
    sx: {
      "&.MuiGrid-root": {
        width: "100%",
        minWidth: "600px"
      }
    },
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 2,
    sm: 2,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      background: BUTTON_LINEAR_GRADIENT,
      color: "white",
      width: "92px"
    },
    onClick: () => onClick("Save")
  }, "Save")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 2,
    sm: 2,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: onlySaveButton,
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      background: GREEN_GRADIENT,
      color: "white",
      width: "92px"
    },
    onClick: () => onClick("Accepted")
  }, "Accept")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 2,
    sm: 2,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: onlySaveButton,
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      background: RED_GRADIENT,
      color: "white",
      width: "92px"
    },
    onClick: () => onClick("Missing Info")
  }, "Missing Info")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 2,
    sm: 2,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: onlySaveButton,
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      background: YELLOW_GRADIENT,
      color: "white",
      width: "92px"
    },
    onClick: () => onClick("Age Issue")
  }, "Age Issue")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 2,
    sm: 2,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: onlySaveButton,
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      background: BLACK_GRADIENT,
      color: "white",
      width: "92px"
    },
    onClick: () => onClick("Conditional")
  }, "Conditional")))));
}
