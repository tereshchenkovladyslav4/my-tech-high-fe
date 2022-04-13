import React, {useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {SYSTEM_01} from "../../../../../utils/constants.js";
import {Box, Checkbox, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import CustomDateInput from "./CustomDateInput.js";
import {isValidDate} from "../helpers.js";
import {Controller, useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export default function VaccinesInfoHeader() {
  const {watch, setValue, control} = useFormContext();
  const [immunizations, showValidationErrors] = watch(["immunizations", "showValidationErrors"]);
  const [fullExempt, setFullExempt] = useState(false);
  const [enableExamptiondate, setEnableExamptiondate] = useState(false);
  useEffect(() => {
    let _enableExamptiondate = false;
    let _fullExempt = true;
    for (const im of immunizations) {
      if (im.value === "Exempt") {
        _enableExamptiondate = true;
      } else {
        _fullExempt = false;
      }
    }
    setEnableExamptiondate(_enableExamptiondate);
    setFullExempt(_fullExempt);
  }, [immunizations]);
  function toggleExempt() {
    setValue("immunizations", immunizations.map((im) => ({
      ...im,
      value: !fullExempt ? "Exempt" : "",
      siblings: immunizations.filter((i) => im.immunization.consecutives?.includes(+i.immunization_id))
    })));
  }
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", width: "25rem"}
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    fontSize: "14px",
    color: SYSTEM_01,
    fontWeight: "700"
  }, "Exempt"), /* @__PURE__ */ React.createElement(Checkbox, {
    color: "primary",
    checked: fullExempt,
    onChange: toggleExempt
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      paddingBottom: "5px",
      borderBottom: "0.5px solid #A3A3A4"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      paddingLeft: "54px"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    sx: {marginBottom: "5px"},
    component: "div",
    fontSize: "14px",
    color: SYSTEM_01,
    fontWeight: "700"
  }, "Exemption Date"), /* @__PURE__ */ React.createElement(Controller, {
    name: "exemptionDate",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(CustomDateInput, {
      initVal: field.value,
      onChange: (v) => field.onChange(v),
      disabled: !enableExamptiondate,
      showError: !isValidDate(field.value) && showValidationErrors
    })
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      width: "140px",
      marginLeft: "20px",
      textAlign: "center"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    component: "div",
    fontSize: "14px",
    color: SYSTEM_01,
    fontWeight: "700"
  }, "Medical Exemption"), /* @__PURE__ */ React.createElement(Controller, {
    name: "medicalExempt",
    control,
    render: ({field}) => /* @__PURE__ */ React.createElement(Checkbox, {
      color: "primary",
      checked: field.value,
      onChange: () => field.onChange(!field.value),
      disabled: !enableExamptiondate
    })
  }))));
}
