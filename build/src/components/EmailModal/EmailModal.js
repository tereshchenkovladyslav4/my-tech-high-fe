import {Alert, Button, Modal, OutlinedInput} from "../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React, {useContext, useRef, useState, useMemo, useEffect} from "../../../_snowpack/pkg/react.js";
import {useStyles} from "./styles.js";
import {ContentState, EditorState, convertToRaw} from "../../../_snowpack/pkg/draft-js.js";
import {StandardResponses} from "./StandardReponses/StandardResponses.js";
import {Title} from "../Typography/Title/Title.js";
import {studentContext} from "../../screens/Admin/EnrollmentPackets/EnrollmentPacketModal/providers.js";
import {cloneDeep} from "../../../_snowpack/pkg/lodash.js";
import {convertFromHTML} from "../../../_snowpack/pkg/draft-convert.js";
import Wysiwyg from "../../../_snowpack/pkg/react-draft-wysiwyg.js";
import "../../../_snowpack/pkg/react-draft-wysiwyg/dist/react-draft-wysiwyg.css.proxy.js";
import draftToHtml from "../../../_snowpack/pkg/draftjs-to-html.js";
import htmlToDraft from "../../../_snowpack/pkg/html-to-draftjs.js";
export const EmailModal = ({handleSubmit, handleModem, title, options, template}) => {
  const student = useContext(studentContext);
  const setStudentInfo = (email) => {
    const yearbegin = new Date(student.grade_levels[0].school_year.date_begin).getFullYear().toString();
    const yearend = new Date(student.grade_levels[0].school_year.date_end).getFullYear().toString();
    return email.replace(/<STUDENT_ID>/g, student.student_id + "").replace(/<STUDENT NAME>/g, student.person.first_name).replace(/<PARENT>/g, student.parent.person.first_name).replace(/<STUDENT GRADE>/g, student.grade_level).replace(/<SCHOOL YEAR>/g, `${yearbegin}-${yearend.substring(2, 4)}`);
  };
  const localOptions = useMemo(() => cloneDeep(options), []);
  const defaultEmail = useMemo(() => setStudentInfo(localOptions.default.replace("<NOTICE>\n", "")), []);
  const classes = useStyles;
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(defaultEmail)));
  const [subject, setSubject] = useState("");
  const [alert, setAlert] = useState(false);
  const editorRef = useRef(null);
  const [currentBlocks, setCurrentBlocks] = useState(0);
  const onSubmit = () => {
    const email = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (email.search(/\[BLANK\]/g) >= 0) {
      setAlert(true);
      return;
    }
    if (handleSubmit) {
      handleSubmit(subject, draftToHtml(convertToRaw(editorState.getCurrentContent())), localOptions);
    }
  };
  const buildEmail = () => {
    let oneChecked = false;
    const embededOptions = localOptions.type === "AGE_ISSUE" ? [] : ["<SEP>"];
    const localValues = [...localOptions.values].reverse();
    let hasExtraText = false;
    localValues.forEach((option) => {
      if (option.checked) {
        oneChecked = true;
        if (localOptions.type === "MISSING_INFO")
          embededOptions.splice(0, 0, "<li>" + option.title + "</li>");
        if (option.extraText) {
          const textHTML = option.extraText.replace(/(\n)/g, "<br/>");
          embededOptions.splice(embededOptions.indexOf("<SEP>") + 1, 0, textHTML);
          hasExtraText = true;
        }
      }
    });
    if (!oneChecked)
      return template?.body ? template?.body : null;
    const sepIndex = embededOptions.indexOf("<SEP>");
    if (sepIndex >= 0)
      embededOptions.splice(sepIndex, 1);
    const stringEmbed = embededOptions.join("");
    const emailHTML = template?.body ? template?.body.replace(/(\n)/g, "<br/>") : localOptions.default.replace(/(\n)/g, "<br/>");
    return emailHTML.replace(hasExtraText ? "<NOTICE>" : "<NOTICE><br/>", stringEmbed);
  };
  const setTemplate = () => {
    const emailWithTags = buildEmail();
    const email = emailWithTags ? setStudentInfo(emailWithTags) : null;
    const block = convertFromHTML(email || "");
    setEditorState(EditorState.createWithContent(email ? block : ContentState.createFromText(defaultEmail)));
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
        const contentBlock = htmlToDraft(setStudentInfo(body));
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
  }, title), /* @__PURE__ */ React.createElement(Box, {
    sx: {padding: "40px", paddingBottom: alert ? "20px" : void 0}
  }, localOptions && /* @__PURE__ */ React.createElement(StandardResponses, {
    options: localOptions,
    setTemplate
  }), template?.from && /* @__PURE__ */ React.createElement(OutlinedInput, {
    value: template.from,
    size: "small",
    fullWidth: true,
    placeholder: "From email",
    sx: classes.subject,
    disabled: true
  }), /* @__PURE__ */ React.createElement(OutlinedInput, {
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
  }))), /* @__PURE__ */ React.createElement(Alert, {
    onClose: () => setAlert(false),
    sx: {marginBottom: "15px", display: alert ? "flex" : "none"},
    severity: "error"
  }, "Please replace the [BLANK] text in the specific instructions."), /* @__PURE__ */ React.createElement(Box, {
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
    onClick: handleModem
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton,
    onClick: onSubmit
  }, "Send"))));
};
