import {Box, Button, Stack} from "../../../../../_snowpack/pkg/@mui/material.js";
import React, {useRef, useState} from "../../../../../_snowpack/pkg/react.js";
import SignaturePad from "../../../../../_snowpack/pkg/react-signature-pad-wrapper.js";
import DeleteForeverOutlinedIcon from "../../../../../_snowpack/pkg/@mui/icons-material/DeleteForeverOutlined.js";
import EditIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Edit.js";
import DehazeIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Dehaze.js";
import {DropDown} from "../../../../components/DropDown/DropDown.js";
import TextField from "../../../../components/TextField/TextField.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import CircleIcon from "./CircleIcon.js";
import {useStyles} from "../styles.js";
const WithDrawal = () => {
  const classes = useStyles;
  const [student, setStudent] = useState(0);
  const [reason, setReason] = useState(0);
  const [effectiveWithdrawDate, setEffectiveWithdrawDate] = useState("");
  const [publicSchoolname, setPublicSchoolname] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const signatureRef = useRef(null);
  const resetSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };
  const students = [
    {
      label: "Student 1",
      value: 1
    },
    {
      label: "Student 2",
      value: 2
    },
    {
      label: "Student 3",
      value: 3
    }
  ];
  const reasonForWithdraw = [
    {
      label: "Reason 1",
      value: 1
    },
    {
      label: "Reason 2",
      value: 2
    },
    {
      label: "Reason 3",
      value: 3
    }
  ];
  const RenderWithOptions = ({top}) => {
    return /* @__PURE__ */ React.createElement(Box, {
      sx: {position: "absolute", right: "-25%", top: `${top || 40}%`}
    }, /* @__PURE__ */ React.createElement(Stack, {
      direction: "row",
      alignItems: "center",
      spacing: 2
    }, /* @__PURE__ */ React.createElement(DehazeIcon, {
      htmlColor: "#A3A3A4"
    }), /* @__PURE__ */ React.createElement(EditIcon, {
      htmlColor: "#A3A3A4"
    }), /* @__PURE__ */ React.createElement(DeleteForeverOutlinedIcon, {
      htmlColor: "#A3A3A4"
    })));
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: classes.base
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {position: "absolute", right: 20, top: "-5%"}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "100%"}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    disableElevation: true,
    sx: classes.cancelButton
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton
  }, "Submit"))), /* @__PURE__ */ React.createElement(CircleIcon, null), /* @__PURE__ */ React.createElement(Stack, {
    justifyContent: "center",
    alignItems: "center",
    direction: "column",
    sx: {width: "50%", margin: "auto", mt: 2}
  }, /* @__PURE__ */ React.createElement(DropDown, {
    dropDownItems: students,
    placeholder: "Student",
    labelTop: true,
    setParentValue: (value) => {
      setStudent(Number(value));
    },
    size: "small",
    sx: {width: "100%"}
  }), /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(DropDown, {
    dropDownItems: reasonForWithdraw,
    placeholder: "Reason for Withdraw",
    labelTop: true,
    setParentValue: (value) => {
      setReason(Number(value));
    },
    size: "small",
    sx: {width: "100%", mt: 2}
  }), /* @__PURE__ */ React.createElement(RenderWithOptions, null)), /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(TextField, {
    label: "Effective Withdraw Date",
    fullWidth: true,
    value: effectiveWithdrawDate,
    onChange: (value) => setEffectiveWithdrawDate(value),
    style: classes.input,
    sx: {my: 2}
  }), /* @__PURE__ */ React.createElement(RenderWithOptions, null)), /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(TextField, {
    label: "New Public School Name",
    fullWidth: true,
    value: publicSchoolname,
    onChange: (value) => setPublicSchoolname(value),
    style: classes.input,
    sx: {my: 2}
  }), /* @__PURE__ */ React.createElement(RenderWithOptions, null)), /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(TextField, {
    label: "School Address",
    fullWidth: true,
    value: schoolAddress,
    onChange: (value) => setSchoolAddress(value),
    style: classes.input,
    sx: {my: 2}
  }), /* @__PURE__ */ React.createElement(RenderWithOptions, null))), /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "55%", margin: "auto", mt: 2}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.button
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12
  }, "+ Add Question"))), /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "50%", margin: "auto", mt: 2}
  }, /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    width: "100%",
    sx: {mt: 3}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12
  }, "I (parent/guardian) verify my intent to withdraw my student:"), /* @__PURE__ */ React.createElement(RenderWithOptions, {
    top: 25
  })), /* @__PURE__ */ React.createElement(TextField, {
    placeholder: "Entry",
    fullWidth: true,
    value: schoolAddress,
    onChange: (value) => setSchoolAddress(value),
    style: {p: 0, pb: 1, ...classes.input},
    size: "medium",
    sx: {my: 2, background: "#fff"}
  }), /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    sx: {px: 5}
  }, "Type full legal parent name and provide a Digital Signature below. Signature (use the mouse to sign)"), /* @__PURE__ */ React.createElement(SignaturePad, {
    options: {minWidth: 1, maxWidth: 1},
    width: 500,
    height: 100,
    ref: signatureRef
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: {height: 1, width: "100%", border: "1px solid #000", mb: 0.5}
  }), /* @__PURE__ */ React.createElement(Button, {
    onClick: resetSignature
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12
  }, "Reset"))), /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "55%", margin: "auto", mt: 2}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.button
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12
  }, "Submit Withdrawal Request"))));
};
export {WithDrawal as default};
