import {FormControl, FormLabel, RadioGroup, FormControlLabel, Checkbox, Radio} from "../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../../_snowpack/pkg/lodash.js";
import React from "../../../../_snowpack/pkg/react.js";
import {BLACK} from "../../../utils/constants.js";
import {Paragraph} from "../../Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../Typography/Subtitle/Subtitle.js";
export const StandardResponses = ({options, setTemplate}) => {
  let SelectionComponent = Checkbox;
  if (options.type === "AGE_ISSUE")
    SelectionComponent = Radio;
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(FormControl, {
    component: "fieldset"
  }, /* @__PURE__ */ React.createElement(FormLabel, {
    component: "legend"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700",
    color: BLACK
  }, "Standard Responses")), /* @__PURE__ */ React.createElement(RadioGroup, {
    "aria-label": "gender",
    name: "radio-buttons-group"
  }, map(options.values, (option) => /* @__PURE__ */ React.createElement(FormControlLabel, {
    value: option.title,
    control: /* @__PURE__ */ React.createElement(SelectionComponent, {
      onChange: (e) => {
        if (options.type === "AGE_ISSUE") {
          const currentSelected = e.target.value;
          options.values.forEach((option2) => {
            if (option2.title !== currentSelected)
              option2.checked = false;
          });
        }
        option.checked = !option.checked;
        setTemplate();
      }
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large"
    }, option.title),
    style: {fontSize: "12px"}
  })))));
};
