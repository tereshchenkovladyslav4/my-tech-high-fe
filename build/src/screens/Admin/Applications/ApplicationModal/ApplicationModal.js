import React, {useEffect, useContext} from "../../../../../_snowpack/pkg/react.js";
import {Button, MenuItem, Modal, Select} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import CloseIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {useStyles} from "./styles.js";
import {Formik, Form} from "../../../../../_snowpack/pkg/formik.js";
import moment from "../../../../../_snowpack/pkg/moment.js";
import {ProfileContext} from "../../../../providers/ProfileProvider/ProfileContext.js";
import {makeStyles} from "../../../../../_snowpack/pkg/@material-ui/styles.js";
const selectStyles = makeStyles({
  select: {
    fontSize: "12px",
    borderRadius: "15px",
    minWidth: "80px",
    height: "29px",
    textAlign: "center"
  }
});
export const ApplicationModal = ({
  handleModem,
  title = "Application",
  subtitle,
  btntitle = "Save",
  handleSubmit,
  data,
  schoolYears,
  handleRefetch
}) => {
  const classes = useStyles;
  const selectClasses = selectStyles();
  const {showModal, hideModal, store, setStore} = useContext(ProfileContext);
  console.log(store);
  const handleOpenProfile = (data2) => {
    showModal(data2);
    setStore(true);
  };
  useEffect(() => {
    handleRefetch && handleRefetch();
  }, [store]);
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem(),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Formik, {
    initialValues: data,
    onSubmit: (values, actions) => {
      handleSubmit(values);
    }
  }, ({values, errors, touched, handleChange, handleSubmit: handleSubmit2}) => /* @__PURE__ */ React.createElement(Form, {
    onSubmit: handleSubmit2
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.header
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, title), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.headerRight
  }, /* @__PURE__ */ React.createElement(Button, {
    size: "small",
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton,
    type: "submit"
  }, btntitle), /* @__PURE__ */ React.createElement(CloseIcon, {
    onClick: () => handleModem(),
    style: classes.close
  }))), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.content
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formLabel,
    fontWeight: "500"
  }, "Student", /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {...classes.formValue, ...{cursor: "pointer"}},
    fontWeight: "500",
    onClick: () => handleOpenProfile(data.student)
  }, data?.student?.person?.first_name, " ", data?.student?.person?.last_name)), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formLabel,
    fontWeight: "500"
  }, "Application", /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formValue,
    fontWeight: "500"
  }, data.date_submitted ? "Submitted " + moment(data.date_submitted).format("MM/DD/yy") : null)), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formLabel,
    fontWeight: "500"
  }, "Parent", /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {...classes.formValue, ...{cursor: "pointer"}},
    fontWeight: "500",
    onClick: () => handleOpenProfile(data?.student?.parent)
  }, data?.student?.parent?.person?.first_name, " ", data?.student?.parent?.person?.last_name)), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formLabel,
    fontWeight: "500"
  }, "Contact", /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formValue,
    fontWeight: "500"
  }, /* @__PURE__ */ React.createElement("a", {
    style: {color: "#7b61ff"},
    href: `mailto:${data?.student?.parent?.person?.email}`
  }, data?.student?.parent?.person?.email), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formValue,
    fontWeight: "500"
  }, data?.student?.parent?.person?.phone?.number))), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formLabel,
    fontWeight: "500"
  }, "Referred By", /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formValue,
    fontWeight: "500"
  }, data?.referred_by)), /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", alignItems: "center", pl: 2}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {pr: 3},
    fontWeight: "700"
  }, "Mid-year Application"), /* @__PURE__ */ React.createElement(Select, {
    size: "small",
    name: "midyear_application",
    onChange: handleChange,
    value: values.midyear_application || "false",
    className: selectClasses.select
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: "false"
  }, "No"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: "true"
  }, "Yes"))), /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", alignItems: "center", px: 5}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {pr: 3},
    fontWeight: "700"
  }, "School Year"), /* @__PURE__ */ React.createElement(Select, {
    className: selectClasses.select,
    size: "small",
    name: "school_year_id",
    onChange: handleChange,
    value: values.school_year_id
  }, schoolYears?.map((item) => /* @__PURE__ */ React.createElement(MenuItem, {
    value: item.school_year_id
  }, `${moment(item.date_begin).format("YYYY")}-${moment(item.date_end).format("YY")}`)))), /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {pr: 3},
    fontWeight: "700"
  }, "Status"), /* @__PURE__ */ React.createElement(Select, {
    className: selectClasses.select,
    size: "small",
    name: "status",
    onChange: handleChange,
    value: values.status
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: "Submitted"
  }, "Submitted"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: "Accepted"
  }, "Accepted")))))))));
};
