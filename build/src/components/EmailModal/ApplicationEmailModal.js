import {Button, Modal, OutlinedInput} from "../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React, {useEffect, useRef, useState} from "../../../_snowpack/pkg/react.js";
import {useStyles} from "./styles.js";
import {EditorState, convertToRaw, ContentState} from "../../../_snowpack/pkg/draft-js.js";
import {Title} from "../Typography/Title/Title.js";
import Wysiwyg from "../../../_snowpack/pkg/react-draft-wysiwyg.js";
import "../../../_snowpack/pkg/react-draft-wysiwyg/dist/react-draft-wysiwyg.css.proxy.js";
import draftToHtml from "../../../_snowpack/pkg/draftjs-to-html.js";
import htmlToDraft from "../../../_snowpack/pkg/html-to-draftjs.js";
export const ApplicationEmailModal = ({
  handleSubmit,
  handleModem,
  title,
  options,
  template
}) => {
  const classes = useStyles;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [subject, setSubject] = useState("");
  const editorRef = useRef(null);
  const [currentBlocks, setCurrentBlocks] = useState(0);
  const onSubmit = () => {
    if (handleSubmit && subject) {
      handleSubmit(subject, draftToHtml(convertToRaw(editorState.getCurrentContent())));
    }
  };
  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({behavior: "smooth", block: "end"});
      }
      setCurrentBlocks(state.blocks.length);
    } catch {
    }
  };
  useEffect(() => {
    if (template) {
      const {id, title: title2, subject: subject2, from, bcc, body} = template;
      setSubject(subject2);
      if (body) {
        const contentBlock = htmlToDraft(body);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          setEditorState(EditorState.createWithContent(contentState));
        }
      }
    }
  }, [template]);
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem(),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Title, {
    fontWeight: "700"
  }, title), /* @__PURE__ */ React.createElement(OutlinedInput, {
    value: subject,
    size: "small",
    fullWidth: true,
    placeholder: "Subject",
    sx: classes.subject,
    onChange: (e) => setSubject(e.target.value)
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.editor
  }, /* @__PURE__ */ React.createElement(Wysiwyg.Editor, {
    onContentStateChange: handleEditorChange,
    editorRef: (ref) => editorRef.current = ref,
    editorState,
    onEditorStateChange: setEditorState,
    toolbar: {
      options: [
        "inline",
        "blockType",
        "fontSize",
        "fontFamily",
        "list",
        "textAlign",
        "colorPicker",
        "link",
        "embedded",
        "image",
        "remove",
        "history"
      ]
    }
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", flexDirection: "row", justifyContent: "center", width: "100%"}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    disableElevation: true,
    sx: classes.cancelButton,
    onClick: () => handleModem()
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton,
    onClick: onSubmit
  }, "Submit"))));
};
