import {Title} from "../../components/Typography/Title/Title.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React, {useState} from "../../../_snowpack/pkg/react.js";
import BGSVG from "../../assets/ApplicationBG.svg.proxy.js";
import {MTHBLUE} from "../../utils/constants.js";
import {Button, TextField} from "../../../_snowpack/pkg/@mui/material.js";
import {useStyles} from "./styles.js";
import {Paragraph} from "../../components/Typography/Paragraph/Paragraph.js";
import {NewApplicationFooter} from "../../components/NewApplicationFooter/NewApplicationFooter.js";
import {useMutation} from "../../../_snowpack/pkg/@apollo/client.js";
import {confirmAccount} from "./service.js";
import {useFormik} from "../../../_snowpack/pkg/formik.js";
import * as yup from "../../../_snowpack/pkg/yup.js";
import {CompleteAccountSuccess} from "../CompleteAccountSuccess/CompleteAccountSuccess.js";
export const CompleteAccount = () => {
  const token = window.location.href.split("=")[1];
  const [confirmEmail] = useMutation(confirmAccount);
  const [showSuccess, setShowSuccess] = useState(false);
  const classes = useStyles;
  const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password is required"),
    confirmPassword: yup.string().required("Please enter your password again").oneOf([yup.ref("password")], "Passwords do not match")
  });
  const formik = useFormik({
    initialValues: {
      email: void 0,
      password: void 0,
      confirmPassword: void 0
    },
    validationSchema,
    onSubmit: async () => {
      await completeAccount();
    }
  });
  const completeAccount = async () => {
    confirmEmail({
      variables: {
        verifyInput: {
          token,
          password: formik.values.password,
          confirm_password: formik.values.confirmPassword
        }
      }
    }).then(() => setShowSuccess(true));
  };
  return !showSuccess ? /* @__PURE__ */ React.createElement(Box, {
    paddingY: 6,
    sx: {bgcolor: "#EEF4F8"}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      backgroundImage: `url(${BGSVG})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Box, {
    paddingX: 36,
    height: "175vh"
  }, /* @__PURE__ */ React.createElement(Box, {
    marginTop: 12
  }, /* @__PURE__ */ React.createElement(Title, {
    color: MTHBLUE,
    textAlign: "center"
  }, "InfoCenter")), /* @__PURE__ */ React.createElement(Title, {
    fontWeight: "500",
    textAlign: "center"
  }, "Thanks for verifying your email."), /* @__PURE__ */ React.createElement(Title, {
    fontWeight: "500",
    textAlign: "center",
    sx: {marginTop: 2, marginBottom: 8}
  }, "Please create a password to complete your account"), /* @__PURE__ */ React.createElement("form", {
    onSubmit: formik.handleSubmit,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(TextField, {
    name: "email",
    sx: classes.textField,
    label: "Account Email",
    focused: true,
    variant: "outlined",
    inputProps: {
      style: {color: "black"}
    },
    value: formik.values.email,
    onChange: formik.handleChange,
    error: formik.touched.email && Boolean(formik.errors.email),
    helperText: formik.touched.email && formik.errors.email
  }), /* @__PURE__ */ React.createElement(TextField, {
    name: "password",
    type: "password",
    sx: classes.textField,
    label: "Password",
    focused: true,
    variant: "outlined",
    inputProps: {
      style: {color: "black"}
    },
    value: formik.values.password,
    onChange: formik.handleChange,
    error: formik.touched.password && Boolean(formik.errors.password),
    helperText: formik.touched.password && formik.errors.password
  }), /* @__PURE__ */ React.createElement(TextField, {
    name: "confirmPassword",
    type: "password",
    sx: classes.textField,
    label: "Re-type Password",
    focused: true,
    variant: "outlined",
    inputProps: {
      style: {color: "black"}
    },
    value: formik.values.confirmPassword,
    onChange: formik.handleChange,
    error: formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword),
    helperText: formik.touched.confirmPassword && formik.errors.confirmPassword
  }), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    style: classes.button,
    type: "submit"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    sx: {fontSize: "11.2px"}
  }, "Create Account"))), /* @__PURE__ */ React.createElement(Box, {
    position: "absolute",
    bottom: 20
  }, /* @__PURE__ */ React.createElement(NewApplicationFooter, null)))))) : /* @__PURE__ */ React.createElement(CompleteAccountSuccess, null);
};
