import {Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography} from "../../../../../../../_snowpack/pkg/@mui/material.js";
import {useFormikContext} from "../../../../../../../_snowpack/pkg/formik.js";
import React, {useState} from "../../../../../../../_snowpack/pkg/react.js";
import {DropDown} from "../../../../../../components/DropDown/DropDown.js";
import {Subtitle} from "../../../../../../components/Typography/Subtitle/Subtitle.js";
import {SYSTEM_07} from "../../../../../../utils/constants.js";
import {QuestionTypes} from "../types.js";
import QuestionOptions from "./Options.js";
export default function AddQuestionModal({
  onClose,
  editItem
}) {
  const {values, setValues} = useFormikContext();
  const [question, setQuestion] = useState(editItem?.question || "");
  const [type, setType] = useState(editItem?.type || 1);
  const [required, setRequired] = useState(editItem?.required || false);
  const [options, setOptions] = useState([
    ...editItem?.options || [{label: "", value: 1}],
    {label: "", value: (editItem?.options?.length || 1) + 1}
  ]);
  const [error, setError] = useState("");
  function onSave() {
    if (question.trim() === "") {
      setError("Question is required");
      return;
    } else if ([1, 3, 5].includes(type) && options.length && options[0].label.trim() === "") {
      setError("Options are required");
      return;
    }
    const item = {
      id: editItem?.id,
      order: editItem?.order || values.length + 1,
      question,
      type,
      options: options.filter((v) => v.label.trim()),
      required
    };
    if (editItem) {
      setValues(values.map((v) => v.id === editItem.id ? item : v));
    } else {
      setValues([...values, item]);
    }
    onClose();
  }
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    "aria-labelledby": "child-modal-title",
    "aria-describedby": "child-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "800px",
      bgcolor: "#EEF4F8",
      borderRadius: 8,
      p: 4
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      height: "40px",
      width: "100%",
      justifyContent: "end"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: styles.cancelButton,
    onClick: () => onClose()
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    sx: styles.actionButtons,
    onClick: () => onSave()
  }, "Save")), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      width: "100%",
      height: "40px",
      mt: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    sx: {
      minWidth: "300px",
      [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: SYSTEM_07
      }
    },
    label: "Question",
    variant: "outlined",
    value: question,
    onChange: (v) => setQuestion(v.currentTarget.value),
    focused: true
  }), /* @__PURE__ */ React.createElement(DropDown, {
    sx: {
      minWidth: "200px",
      [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: SYSTEM_07
      }
    },
    labelTop: true,
    dropDownItems: QuestionTypes,
    placeholder: "Type",
    defaultValue: type,
    setParentValue: (v) => setType(+v),
    size: "small"
  })), /* @__PURE__ */ React.createElement(Box, {
    mt: "30px",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  }, type === 2 || type === 4 ? /* @__PURE__ */ React.createElement(Box, {
    height: "50px"
  }) : /* @__PURE__ */ React.createElement(QuestionOptions, {
    options,
    setOptions,
    type
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      width: "100%",
      height: "40px",
      mt: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "end"
    }
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    checked: required,
    onClick: () => setRequired(!required)
  }), /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small"
  }, "Required")), error && /* @__PURE__ */ React.createElement(Typography, {
    color: "red"
  }, error)));
}
const styles = {
  actionButtons: {
    borderRadius: 4,
    background: "linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF",
    fontWeight: "bold",
    padding: "11px 60px",
    color: "white"
  },
  cancelButton: {
    borderRadius: 4,
    background: "linear-gradient(90deg, #D23C33 0%, rgba(62, 39, 131, 0) 100%) #D23C33",
    fontWeight: "bold",
    mr: 2,
    color: "white",
    padding: "11px 60px"
  }
};
