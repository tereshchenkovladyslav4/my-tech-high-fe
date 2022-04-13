import React, {useState} from "../../../../../../_snowpack/pkg/react.js";
import {useMutation} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import CloseIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {Button, Checkbox, FormControlLabel, Grid, Modal} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../../../../_snowpack/pkg/lodash.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {BUTTON_LINEAR_GRADIENT, RED_GRADIENT} from "../../../../../utils/constants.js";
import {useStyles} from "./styles.js";
import {WarningModal} from "../../../../../components/WarningModal/Warning.js";
import {CreateObserMutation} from "../../services.js";
export const StudentsModal = ({handleModem, students = [], data}) => {
  const classes = useStyles;
  const [apolloError, setApolloError] = useState({
    title: "",
    severity: "",
    flag: false
  });
  const [selected, setSelected] = useState([]);
  const handleChange = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  const [createObser, {data: observerData}] = useMutation(CreateObserMutation);
  const handleSubmit = async () => {
    if (selected.length === 0) {
      setApolloError({title: "Please select students", severity: "Warning", flag: true});
      return;
    }
    await createObser({
      variables: {
        observerInput: {
          parent_id: +data.parent_id,
          student_ids: selected.map((item) => +item),
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email
        }
      }
    });
    handleModem(true);
  };
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem()
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalStudentCard
  }, apolloError.flag && /* @__PURE__ */ React.createElement(WarningModal, {
    handleModem: () => setApolloError({title: "", severity: "", flag: false}),
    title: apolloError.severity,
    subtitle: apolloError.title,
    btntitle: "Close",
    handleSubmit: () => setApolloError({title: "", severity: "", flag: false})
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.header
  }, /* @__PURE__ */ React.createElement(Subtitle, null, "Select students the Observer has access to"), /* @__PURE__ */ React.createElement(CloseIcon, {
    style: classes.close,
    onClick: () => handleModem()
  })), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large",
    sx: {marginBottom: "20px"}
  }, "Students"), map(students, (student, index) => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    key: index,
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      checked: selected.includes(student.student_id),
      onChange: () => handleChange(student.student_id)
    }),
    label: student.person.first_name + " " + student.person.last_name
  })))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      justifyContent: "center",
      alignItems: "end",
      height: "100%",
      width: "100%"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 29,
      color: "white",
      width: "92px",
      background: RED_GRADIENT,
      marginRight: 3,
      "&:hover": {
        background: "#D23C33",
        color: "#fff"
      }
    },
    onClick: () => handleModem()
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    onClick: handleSubmit,
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      color: "white",
      width: "92px",
      borderRadius: 2,
      textTransform: "none",
      fontWeight: 700,
      height: 29
    }
  }, "Save"))))));
};
