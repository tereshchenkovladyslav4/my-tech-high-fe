import React, {useRef, useState, useEffect} from "../../../../../../_snowpack/pkg/react.js";
import {
  Button,
  Modal,
  OutlinedInput,
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem
} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {ContentState, EditorState, convertToRaw} from "../../../../../../_snowpack/pkg/draft-js.js";
import {makeStyles} from "../../../../../../_snowpack/pkg/@material-ui/core.js";
import CloseIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {BUTTON_LINEAR_GRADIENT} from "../../../../../utils/constants.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {Add} from "../../../../../../_snowpack/pkg/@mui/icons-material.js";
import {getEmailTemplateQuery} from "../../services.js";
import {useQuery} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import Wysiwyg from "../../../../../../_snowpack/pkg/react-draft-wysiwyg.js";
import "../../../../../../_snowpack/pkg/react-draft-wysiwyg/dist/react-draft-wysiwyg.css.proxy.js";
import draftToHtml from "../../../../../../_snowpack/pkg/draftjs-to-html.js";
import htmlToDraft from "../../../../../../_snowpack/pkg/html-to-draftjs.js";
const useStyles = makeStyles({
  modalCard: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 828,
    backgroundColor: "white",
    boxShadow: "24px",
    padding: "15px 15px 30px",
    borderRadius: "12px",
    maxHeight: "90%",
    overflow: "auto"
  },
  editor: {
    border: "1px solid #d1d1d1",
    borderRadius: 1,
    marginBottom: "24px",
    "& div.DraftEditor-editorContainer": {
      minHeight: "200px",
      maxHeight: "250px",
      padding: "0 10px",
      "& .public-DraftEditor-content": {
        minHeight: "200px"
      }
    }
  },
  toolBar: {
    borderBottom: "1px solid #d1d1d1",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 1
  },
  cancelButton: {
    borderRadius: 10,
    background: "#E7E7E7",
    width: "200px",
    marginRight: 1
  },
  submitButton: {
    borderRadius: 10,
    width: "200px",
    marginLeft: 1
  },
  icon: {
    marginRight: 2,
    color: "#e7e7e7",
    cursor: "pointer"
  },
  subject: {
    marginTop: 2
  },
  isActive: {
    color: "black",
    marginRight: 2,
    cursor: "pointer"
  },
  close: {
    background: "black",
    borderRadius: 1,
    color: "white",
    cursor: "pointer"
  },
  header: {
    display: "flex",
    alignItems: "center"
  },
  subHeader: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  save: {
    borderRadius: 8,
    textTransform: "none",
    height: 24,
    background: "#000",
    color: "white",
    marginRight: "12px",
    width: "92px"
  },
  add: {
    borderRadius: 8,
    textTransform: "none",
    height: 40,
    background: BUTTON_LINEAR_GRADIENT,
    color: "white",
    fontSize: 16
  },
  "availbe-row": {
    display: "flex",
    alignItems: "center",
    "& .type-field": {
      width: "220px",
      textTransform: "uppercase"
    }
  },
  select: {
    width: "150px"
  }
});
const insertDescriptions = {
  parent: "Parent's First Name",
  student: "Student's First Name",
  application_year: "School Year (2021-2022)",
  deadline: "The deadline that the packet information must be all submitted",
  teacher: "Teacher Full Name",
  link: "The link for the parent to access student's packet",
  period_list: "List of Periods that need to be changed",
  files: "List of files that need to be uploaded",
  instructions: "Where the specific instructions to the parent will be included in the email"
};
export const EmailTemplateModal = ({
  handleModem,
  type = "standard",
  category,
  onSave,
  templateName,
  availableInserts
}) => {
  const classes = useStyles();
  const [titleReadOnly, setTitleReadOnly] = useState(true);
  const [emailTemplateId, setEmailTemplateId] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [subject, setSubject] = useState("");
  const [emailTitle, setEmailTitle] = useState(templateName);
  const [notes, setNotes] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [emailBcc, setEmailBcc] = useState("");
  const [deadline, setDeadline] = useState("");
  const editorRef = useRef(null);
  const [currentBlocks, setCurrentBlocks] = useState(0);
  const [reminders, setReminders] = useState([
    {
      reminderDay: "",
      reminderTitle: "Reminder 1",
      reminderSubject: "",
      reminderBody: "",
      editorState: EditorState.createEmpty()
    }
  ]);
  const {called, loading, error, data, refetch} = useQuery(getEmailTemplateQuery, {
    variables: {
      template: templateName
    },
    fetchPolicy: "network-only"
  });
  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({behavior: "smooth", block: "end"});
      }
      setCurrentBlocks(state.blocks.length);
    } catch {
    }
  };
  const handleAddReminder = () => {
    setReminders([
      ...reminders,
      ...[
        {
          reminderDay: "",
          reminderTitle: "Reminder " + (reminders.length + 1),
          reminderSubject: "",
          reminderBody: "",
          editorState: EditorState.createEmpty()
        }
      ]
    ]);
  };
  const handleChangeReminder = (value, i, field) => {
    const temp = reminders.slice();
    temp[i][field] = value;
    if (field === "editorState") {
      temp[i]["reminderBody"] = draftToHtml(convertToRaw(value.getCurrentContent()));
    }
    setReminders(temp);
  };
  const handleSave = () => {
    if (type === "deadline") {
      onSave({
        id: Number(emailTemplateId),
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: templateName,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent()))
      });
    } else if (type === "email") {
      onSave({
        id: Number(emailTemplateId),
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: templateName,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent()))
      });
    } else {
      onSave({
        id: Number(emailTemplateId),
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: templateName,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent()))
      });
    }
  };
  useEffect(() => {
    if (data !== void 0) {
      const {emailTemplateName} = data;
      if (emailTemplateName) {
        const {id, title, subject: subject2, from, bcc, body} = emailTemplateName;
        setEmailTemplateId(id);
        setEmailTitle(title);
        setSubject(subject2);
        setEmailBcc(bcc);
        setEmailFrom(from);
        if (body) {
          const contentBlock = htmlToDraft(body);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            setEditorState(EditorState.createWithContent(contentState));
          }
        }
      }
    }
  }, [data]);
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem(),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    className: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Box, {
    className: classes.header
  }, /* @__PURE__ */ React.createElement(OutlinedInput, {
    sx: {flex: 1},
    inputProps: {sx: {textOverflow: "ellipsis", overflow: "hidden"}},
    size: "small",
    fullWidth: true,
    placeholder: "[Email Title]",
    value: emailTitle,
    onChange: (e) => setEmailTitle(e.target.value),
    readOnly: titleReadOnly,
    onFocus: (e) => setTitleReadOnly(false),
    onBlur: (e) => setTitleReadOnly(true)
  }), /* @__PURE__ */ React.createElement(Box, {
    className: classes.subHeader
  }, /* @__PURE__ */ React.createElement(Button, {
    className: classes.save,
    onClick: handleSave
  }, "Save"), /* @__PURE__ */ React.createElement(CloseIcon, {
    onClick: () => handleModem(),
    className: classes.close
  }))), /* @__PURE__ */ React.createElement(Typography, {
    fontWeight: "700"
  }), /* @__PURE__ */ React.createElement(OutlinedInput, {
    value: subject,
    size: "small",
    fullWidth: true,
    placeholder: "Subject",
    onChange: (e) => setSubject(e.target.value)
  }), /* @__PURE__ */ React.createElement(Box, {
    className: classes.editor
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
  })), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "From"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: emailFrom,
    onChange: (e) => setEmailFrom(e.target.value)
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Email BCC"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: emailBcc,
    onChange: (e) => setEmailBcc(e.target.value)
  })), type === "deadline" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Deadline (Days)"), /* @__PURE__ */ React.createElement(Select, {
    size: "small",
    name: "deadline",
    onChange: (e) => setDeadline(e.target.value),
    value: deadline,
    className: classes.select
  }, [...Array(30).keys()].map((i) => /* @__PURE__ */ React.createElement(MenuItem, {
    value: i,
    key: i
  }, i)))), reminders.map((reminder, i) => /* @__PURE__ */ React.createElement(Box, {
    key: i,
    sx: {width: "100%"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Reminder ", i + 1, " (Days before deadline)"), /* @__PURE__ */ React.createElement(Select, {
    size: "small",
    name: "reminderDay",
    onChange: (e) => handleChangeReminder(e.target.value, i, "reminderDay"),
    value: reminder.reminderDay,
    className: classes.select
  }, [...Array(30).keys()].map((i2) => /* @__PURE__ */ React.createElement(MenuItem, {
    value: i2,
    key: i2
  }, i2)))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {marginTop: "28px"}
  }, /* @__PURE__ */ React.createElement(Box, {
    className: classes.header
  }, /* @__PURE__ */ React.createElement(OutlinedInput, {
    sx: {flex: 1},
    size: "small",
    fullWidth: true,
    placeholder: "",
    value: reminder.reminderTitle,
    onChange: (e) => handleChangeReminder(e.target.value, i, "reminderTitle")
  })), /* @__PURE__ */ React.createElement(Typography, {
    fontWeight: "700"
  }), /* @__PURE__ */ React.createElement(OutlinedInput, {
    value: reminder.reminderSubject,
    size: "small",
    fullWidth: true,
    placeholder: "Subject",
    onChange: (e) => handleChangeReminder(e.target.value, i, "reminderSubject")
  }), /* @__PURE__ */ React.createElement(Box, {
    className: classes.editor
  }, /* @__PURE__ */ React.createElement(Wysiwyg.Editor, {
    onContentStateChange: handleEditorChange,
    editorRef: (ref) => editorRef.current = ref,
    editorState: reminder.editorState,
    onEditorStateChange: (editorState2) => handleChangeReminder(editorState2, i, "editorState"),
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
  }))))), /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "100%", textAlign: "right"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Button, {
    className: classes.add,
    onClick: handleAddReminder
  }, /* @__PURE__ */ React.createElement(Add, null), "Add Reminder")))), type === "email" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Auto Reminder Deadline"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Days to Submit a LL Early"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true
  }))), availableInserts && /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Available Inserts"), availableInserts.map((item, i) => /* @__PURE__ */ React.createElement(Box, {
    key: i,
    className: classes["availbe-row"]
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "600",
    size: "large",
    className: "type-field"
  }, "[", item, "]"), /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "600",
    color: "#A3A3A4",
    sx: {fontSize: "18px"}
  }, insertDescriptions[item]))))))));
};
