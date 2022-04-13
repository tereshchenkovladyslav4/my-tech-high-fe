import {Box, Checkbox, IconButton, outlinedInputClasses, Radio, TextField} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {useFormikContext} from "../../../../../../_snowpack/pkg/formik.js";
import React, {useState} from "../../../../../../_snowpack/pkg/react.js";
import {DropDown} from "../../../../../components/DropDown/DropDown.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import DehazeIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Dehaze.js";
import DeleteForeverOutlinedIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/DeleteForeverOutlined.js";
import EditIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Edit.js";
import {SortableHandle} from "../../../../../../_snowpack/pkg/react-sortable-hoc.js";
import AddQuestionModal from "./AddQuestion/index.js";
import {useMutation} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import {deleteQuestionGql} from "./services.js";
import CustomModal from "./CustomModals.js";
import {SYSTEM_05, SYSTEM_07} from "../../../../../utils/constants.js";
const DragHandle = SortableHandle(() => /* @__PURE__ */ React.createElement(IconButton, null, /* @__PURE__ */ React.createElement(DehazeIcon, null)));
export default function ApplicationQuestionItem({
  item,
  mainQuestion = false
}) {
  const {values, setValues} = useFormikContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteQuestion] = useMutation(deleteQuestionGql);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    mt: "20px",
    alignItems: "center",
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Box, {
    flex: "1",
    paddingTop: "10px"
  }, /* @__PURE__ */ React.createElement(Item, {
    question: item
  })), !mainQuestion && /* @__PURE__ */ React.createElement(Box, {
    display: "inline-flex",
    height: "40px"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => setShowEditDialog(true)
  }, /* @__PURE__ */ React.createElement(EditIcon, null)), /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => setShowDeleteDialog(true)
  }, /* @__PURE__ */ React.createElement(DeleteForeverOutlinedIcon, null)), /* @__PURE__ */ React.createElement(DragHandle, null))), showEditDialog && /* @__PURE__ */ React.createElement(AddQuestionModal, {
    onClose: () => setShowEditDialog(false),
    editItem: item
  }), showDeleteDialog && /* @__PURE__ */ React.createElement(CustomModal, {
    title: "Delete Question",
    description: "Are you sure you want to delete this question?",
    confirmStr: "Delete",
    onClose: () => setShowDeleteDialog(false),
    onConfirm: () => {
      setShowDeleteDialog(false);
      setValues(values.filter((i) => i.id !== item.id));
      deleteQuestion({variables: {id: item.id}});
    }
  }));
}
function Item({question: q}) {
  const {values, errors, touched, setValues} = useFormikContext();
  const index = values.find((i) => i.id === q.id)?.id;
  function onChange(value) {
    setValues(values.map((v) => v.id === q.id ? {...v, response: value} : v));
  }
  if (q.type === 1) {
    return /* @__PURE__ */ React.createElement(DropDown, {
      sx: {
        marginTop: "10px",
        minWidth: "100%",
        borderColor: errors[index] ? "red" : "",
        [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: SYSTEM_07
        }
      },
      labelTop: true,
      dropDownItems: q.options || [],
      placeholder: q.question,
      setParentValue: (v) => onChange(v),
      alternate: true,
      size: "small",
      error: {
        error: !!touched[index] && !!errors[index],
        errorMsg: !!touched[index] && !!errors[index] ? "This field is required" : ""
      }
    });
  } else if (q.type === 2) {
    return /* @__PURE__ */ React.createElement(TextField, {
      size: "small",
      sx: {
        marginTop: "20px",
        minWidth: "100%",
        [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: SYSTEM_07
        }
      },
      InputLabelProps: {
        style: {color: SYSTEM_05}
      },
      label: q.question,
      variant: "outlined",
      value: q.response,
      onChange: (v) => onChange(v.currentTarget.value),
      focused: true,
      error: !!touched[index] && !!errors[index],
      helperText: errors[index]
    });
  } else if (q.type === 3) {
    return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Subtitle, {
      color: SYSTEM_05,
      sx: {
        paddingLeft: "20px",
        paddingBottom: "10px",
        width: "100%",
        textAlign: "start",
        borderBottom: "1px solid " + SYSTEM_07
      }
    }, q.question), (q.options ?? []).map((o) => /* @__PURE__ */ React.createElement(Box, {
      key: o.value,
      display: "flex",
      alignItems: "center",
      sx: {
        borderBottom: "1px solid " + SYSTEM_07,
        marginTop: "10px",
        width: "100%"
      }
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: o.value === +q.response,
      onClick: () => onChange(o.value + "")
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, o.label))));
  } else if (q.type === 4) {
    return /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      checked: q.response === "true",
      onChange: (e) => onChange(e.currentTarget.checked ? "true" : "false")
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small",
      color: SYSTEM_05
    }, q.question));
  } else if (q.type === 5) {
    return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Subtitle, {
      sx: {
        paddingLeft: "20px",
        paddingBottom: "10px",
        width: "100%",
        textAlign: "start",
        borderBottom: "1px solid " + SYSTEM_07
      },
      color: SYSTEM_05
    }, q.question), (q.options ?? []).map((o) => /* @__PURE__ */ React.createElement(Box, {
      key: o.value,
      display: "flex",
      alignItems: "center",
      sx: {
        borderBottom: "1px solid " + SYSTEM_07,
        marginTop: "10px",
        width: "100%"
      }
    }, /* @__PURE__ */ React.createElement(Radio, {
      checked: false
    }), /* @__PURE__ */ React.createElement(Subtitle, {
      size: "small"
    }, o.label))));
  }
  return null;
}
