import React, {useRef, useState} from "../../../../../../../../_snowpack/pkg/react.js";
import {Box, FormControl, Typography, Button, Divider, Modal, Select, MenuItem, FormHelperText} from "../../../../../../../../_snowpack/pkg/@mui/material.js";
import {useStyles} from "../../../../../../../components/EmailModal/styles.js";
import {Title} from "../../../../../../../components/Typography/Title/Title.js";
import FormatBoldIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/FormatBold.js";
import FormatItalicIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/FormatItalic.js";
import FormatUnderlinedIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/FormatUnderlined.js";
import FormatListBulletedIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/FormatListBulleted.js";
import FormatListNumberedIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/FormatListNumbered.js";
import {useFormikContext} from "../../../../../../../../_snowpack/pkg/formik.js";
import {convertFromHTML} from "../../../../../../../../_snowpack/pkg/draft-convert.js";
import {useStyles as useImStyles} from "./style.js";
import KeyboardArrowDownIcon from "../../../../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {EditorState, RichUtils, Editor, convertToRaw} from "../../../../../../../../_snowpack/pkg/draft-js.js";
const EmailModal = ({title, handleSubmit, setIsEmailOpen, body, onCancel}) => {
  const classes = useStyles;
  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromHTML(body || "")));
  const [boldActive, setBoldActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);
  const [italicActive, setItalicctive] = useState(false);
  const [olListActive, setOlListctive] = useState(false);
  const [ulListActive, setUlListActive] = useState(false);
  const editorRef = useRef();
  const boldText = (e) => {
    e.preventDefault();
    const nextState = RichUtils.toggleInlineStyle(editorState, "BOLD");
    setEditorState(nextState);
    setBoldActive(!boldActive);
  };
  const underlineText = (e) => {
    e.preventDefault();
    const nextState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
    setEditorState(nextState);
    setUnderlineActive(!underlineActive);
  };
  const italicText = (e) => {
    e.preventDefault();
    const nextState = RichUtils.toggleInlineStyle(editorState, "ITALIC");
    setEditorState(nextState);
    setItalicctive(!italicActive);
  };
  const unorderedList = (e) => {
    e.preventDefault();
    const nextState = RichUtils.toggleBlockType(editorState, "unordered-list-item");
    setEditorState(nextState);
    setUlListActive(!ulListActive);
    setOlListctive(false);
  };
  const orderedList = (e) => {
    e.preventDefault();
    const nextState = RichUtils.toggleBlockType(editorState, "ordered-list-item");
    setEditorState(nextState);
    setOlListctive(!olListActive);
    setUlListActive(false);
  };
  const onSubmit = () => {
    handleSubmit(editorRef.current?.editor?.innerHTML || "");
  };
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Title, {
    fontWeight: "700"
  }, title), /* @__PURE__ */ React.createElement(Box, {
    sx: {padding: "40px", paddingBottom: alert ? "20px" : void 0}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.editor
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.toolBar
  }, /* @__PURE__ */ React.createElement(FormatBoldIcon, {
    type: "button",
    onMouseDown: (e) => boldText(e),
    sx: boldActive ? {
      ...classes.icon,
      ...classes.isActive
    } : classes.icon
  }), /* @__PURE__ */ React.createElement(FormatUnderlinedIcon, {
    type: "button",
    onMouseDown: (e) => underlineText(e),
    sx: underlineActive ? {
      ...classes.icon,
      ...classes.isActive
    } : classes.icon
  }), /* @__PURE__ */ React.createElement(FormatItalicIcon, {
    type: "button",
    onMouseDown: (e) => italicText(e),
    sx: italicActive ? {
      ...classes.icon,
      ...classes.isActive
    } : classes.icon
  }), /* @__PURE__ */ React.createElement(FormatListBulletedIcon, {
    type: "button",
    onMouseDown: (e) => unorderedList(e),
    sx: ulListActive ? {
      ...classes.icon,
      ...classes.isActive
    } : classes.icon
  }), /* @__PURE__ */ React.createElement(FormatListNumberedIcon, {
    type: "button",
    onMouseDown: (e) => orderedList(e),
    sx: olListActive ? {
      ...classes.icon,
      ...classes.isActive
    } : classes.icon
  })), /* @__PURE__ */ React.createElement(Editor, {
    editorState,
    onChange: setEditorState,
    ref: editorRef
  }))), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      width: "100%"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    disableElevation: true,
    sx: classes.cancelButton,
    onClick: () => {
      setIsEmailOpen(false);
      onCancel && onCancel();
    }
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton,
    onClick: onSubmit
  }, "Save"))));
};
const EmailButton = ({
  emailState,
  onClick
}) => {
  return /* @__PURE__ */ React.createElement(Button, {
    onClick,
    sx: {color: "#4145FF", padding: 0, fontSize: "16px"}
  }, emailState);
};
const EmailResponse = () => {
  const styles = useImStyles();
  const {values, setFieldValue, touched, errors} = useFormikContext();
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const emailState = values.email_update_template === "-1" ? "None" : values.email_update_template ? "Edit" : "Select";
  const handleEmail = (email) => {
    setIsEmailOpen(false);
    const contentBlock = convertToRaw(EditorState.createWithContent(convertFromHTML(email || "")).getCurrentContent());
    const contentString = contentBlock.blocks[0].text.replace(/[^a-zA-Z0-9]/g, "");
    if (contentString.length === 0) {
      setFieldValue("email_update_template", "-1");
    } else {
      setFieldValue("email_update_template", email);
    }
  };
  function onChange(val) {
    if (val === "None") {
      setFieldValue("email_update_template", "-1");
    } else {
      values.email_update_template === "-1" && setFieldValue("email_update_template", "");
      setIsEmailOpen(true);
    }
  }
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      padding: "5px",
      marginY: "10px",
      marginX: "33px",
      bgcolor: "white",
      height: "35px",
      borderRadius: "10px",
      textAlign: "center",
      width: "auto"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    component: "span",
    sx: {width: "200px", textAlign: "left"}
  }, "Email Response"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    classes: {root: styles.formRoot}
  }, /* @__PURE__ */ React.createElement(Select, {
    name: "email_update_template",
    value: emailState,
    IconComponent: KeyboardArrowDownIcon,
    classes: {root: styles.selectRoot, icon: styles.icon},
    MenuProps: {classes: {paper: styles.selectPaper}},
    renderValue: (s) => s || "Select"
  }, emailState !== "Edit" && /* @__PURE__ */ React.createElement(MenuItem, {
    value: "Add",
    onClick: () => onChange("Add")
  }, "Add"), emailState !== "Edit" && /* @__PURE__ */ React.createElement(MenuItem, {
    value: "None",
    onClick: () => onChange("None")
  }, "None"), emailState === "Edit" && /* @__PURE__ */ React.createElement(MenuItem, {
    value: "Edit",
    onClick: () => onChange("Edit")
  }, "Edit"))), /* @__PURE__ */ React.createElement(FormHelperText, {
    error: true
  }, touched.email_update_template && errors.email_update_template), isEmailOpen && /* @__PURE__ */ React.createElement(EmailModal, {
    setIsEmailOpen,
    title: values.title || "",
    handleSubmit: handleEmail,
    body: values.email_update_template,
    onCancel: () => {
      if (!values.email_update_template) {
        setFieldValue("email_update_template", "-1");
      }
    }
  }));
};
export {EmailResponse as default};
