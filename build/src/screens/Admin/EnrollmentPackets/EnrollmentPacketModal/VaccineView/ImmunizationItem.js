import React, {useMemo} from "../../../../../../_snowpack/pkg/react.js";
import {SYSTEM_01} from "../../../../../utils/constants.js";
import {Checkbox, Box, Typography, Tooltip, InputAdornment} from "../../../../../../_snowpack/pkg/@mui/material.js";
import CustomDateInput from "./CustomDateInput.js";
import {checkImmmValueWithSpacing, isValidDate, isValidVaccInput} from "../helpers.js";
import {ErrorOutlineOutlined} from "../../../../../../_snowpack/pkg/@mui/icons-material.js";
import {useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export function ImmunizationItem({item}) {
  const {watch, setValue} = useFormContext();
  const [immunizations, showError] = watch(["immunizations", "showValidationErrors"]);
  const siblings = useMemo(() => immunizations.filter((i) => item.immunization.consecutives?.includes(+i.immunization_id)), [immunizations]);
  let exempt = useMemo(() => item.value === "Exempt" && siblings?.every((v) => v.value === "Exempt"), [item.value, siblings]);
  const validValue = useMemo(() => !item.immunization.is_deleted && isValidVaccInput(item.value, item.immunization?.immunity_allowed === 1), [item.immunization?.immunity_allowed, item.value]);
  const validDateSpace = useMemo(() => checkImmmValueWithSpacing(item, immunizations), [item, immunizations]);
  function onExemptCheck(exempt2) {
    setValue("immunizations", immunizations.map((im) => {
      if (im.immunization_id === item.immunization_id || item.immunization?.consecutives?.includes(+im.immunization_id)) {
        return {
          ...im,
          value: exempt2 ? "Exempt" : ""
        };
      }
      return im;
    }));
  }
  function changeImmunValue(value) {
    const isTopVac = item.immunization?.consecutive_vaccine === 0;
    if (value === "Exempt" && isTopVac)
      onExemptCheck(true);
    setValue("immunizations", immunizations.map((im) => {
      if (im.immunization_id === item.immunization_id) {
        return {
          ...im,
          value
        };
      }
      return im;
    }));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      background: validValue ? "unset" : item.immunization.is_deleted ? "#f0f0f0" : "rgba(255, 214, 38, 0.3)",
      border: showError && !validValue && !item.immunization.is_deleted ? "2px solid red" : "unset",
      opacity: item.immunization.is_deleted ? 0.4 : 1
    }
  }, item.immunization.consecutive_vaccine === 0 ? /* @__PURE__ */ React.createElement(Checkbox, {
    color: "primary",
    checked: exempt,
    sx: {
      paddingY: "10px"
    },
    disabled: isValidDate(item.value) || item.immunization.is_deleted,
    onChange: (e) => onExemptCheck(e.target.checked)
  }) : /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "42px"}
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderBottom: "0.5px solid #A3A3A4",
      paddingY: "10px",
      marginLeft: "5px"
    }
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: item.immunization.tooltip
  }, /* @__PURE__ */ React.createElement(Typography, {
    sx: {width: "70px", display: "inline-block"},
    component: "span",
    fontSize: "14px",
    color: SYSTEM_01,
    fontWeight: "700"
  }, item.immunization.title)), /* @__PURE__ */ React.createElement(CustomDateInput, {
    initVal: item.value || "",
    onChange: changeImmunValue,
    showError: !isValidDate && showError || !validDateSpace,
    allowIM: item.immunization.immunity_allowed === 1,
    disabled: item.immunization.is_deleted,
    endAdornment: !validDateSpace && /* @__PURE__ */ React.createElement(InputAdornment, {
      position: "end"
    }, /* @__PURE__ */ React.createElement(Tooltip, {
      title: "Does not fall within vaccine timeframe, school may request a new vaccine record.",
      sx: {width: "20px"}
    }, /* @__PURE__ */ React.createElement(ErrorOutlineOutlined, {
      color: "error"
    })))
  }))));
}
export default ImmunizationItem;
