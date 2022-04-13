import React, {useState} from "../../../../../../_snowpack/pkg/react.js";
import CloseIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {Button, Grid, Modal, TextField} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {DropDown} from "../../../../../components/DropDown/DropDown.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {BUTTON_LINEAR_GRADIENT} from "../../../../../utils/constants.js";
import {useStyles} from "./styles.js";
import {WarningModal} from "../../../../../components/WarningModal/Warning.js";
import {StudentsModal} from "./StudentsModal.js";
export const NewUserModal = ({handleModem, visible, students = [], data}) => {
  const classes = useStyles;
  const [apolloError, setApolloError] = useState({
    title: "",
    severity: "",
    flag: false
  });
  const [email, setEmail] = useState("");
  const [parentEmail, setParentEmail] = useState(data?.parent_id ? data?.person?.email : data?.parent?.person?.email);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [region, setRegion] = useState("");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [payloadData, setPayloadData] = useState();
  const rolesOption = [
    {
      label: "Observer",
      value: 0
    }
  ];
  const regionOption = [
    {
      label: "Utah",
      value: "Utah"
    },
    {
      label: "Arizona",
      value: "Arizona"
    },
    {
      label: "Idaho",
      value: "Idaho"
    }
  ];
  const handleSubmit = () => {
    if (!firstName) {
      setApolloError({
        title: "First name is required",
        severity: "Warning",
        flag: true
      });
      return;
    } else if (!email) {
      setApolloError({
        title: "Email address is required",
        severity: "Warning",
        flag: true
      });
      return;
    } else if (!parentEmail) {
      setApolloError({
        title: "Parent Email address is required.",
        severity: "Warning",
        flag: true
      });
      return;
    } else if (!region) {
      setApolloError({
        title: "Region is required.",
        severity: "Warning",
        flag: true
      });
      return;
    }
    setPayloadData({
      email,
      first_name: firstName,
      last_name: lastName,
      parent_id: data?.parent_id ? data?.parent_id : data?.parent?.parent_id
    });
    setShowStudentModal(true);
  };
  const handleCloseStudentModal = (status) => {
    console.log(status);
    setShowStudentModal(false);
    if (status)
      handleModem();
  };
  return /* @__PURE__ */ React.createElement(Modal, {
    open: visible,
    onClose: () => handleModem(),
    "aria-labelledby": "Create User",
    "aria-describedby": "Create New User"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, apolloError.flag && /* @__PURE__ */ React.createElement(WarningModal, {
    handleModem: () => setApolloError({title: "", severity: "", flag: false}),
    title: apolloError.severity,
    subtitle: apolloError.title,
    btntitle: "Close",
    handleSubmit: () => setApolloError({title: "", severity: "", flag: false})
  }), showStudentModal && /* @__PURE__ */ React.createElement(StudentsModal, {
    visible: true,
    handleModem: handleCloseStudentModal,
    students,
    data: payloadData
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.header
  }, /* @__PURE__ */ React.createElement(Subtitle, null, "This user will receive an email giving them a link to create a password."), /* @__PURE__ */ React.createElement(CloseIcon, {
    style: classes.close,
    onClick: handleModem
  })), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Email"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: email,
    onChange: (e) => setEmail(e.target.value)
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "First Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: firstName,
    onChange: (e) => setFirstName(e.target.value)
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: lastName,
    onChange: (e) => setLastName(e.target.value)
  })), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    item: true,
    xs: 9
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(DropDown, {
    dropDownItems: rolesOption,
    setParentValue: (e) => console.log(e),
    placeholder: "User Type",
    size: "small",
    sx: {width: "50%"},
    defaultValue: 0
  }))), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    item: true,
    xs: 9
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(DropDown, {
    dropDownItems: regionOption,
    setParentValue: (e) => setRegion(e),
    placeholder: "Region",
    size: "small",
    sx: {width: "50%"}
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Parent Account Email"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: parentEmail,
    disabled: true
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "end",
      height: "100%",
      width: "100%"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: handleSubmit,
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      color: "white",
      width: "92px",
      borderRadius: "8px",
      textTransform: "none",
      fontWeight: 700,
      height: "24px"
    }
  }, "Add"))))));
};
