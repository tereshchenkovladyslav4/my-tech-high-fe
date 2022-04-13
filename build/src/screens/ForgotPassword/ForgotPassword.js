import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React, {useState} from "../../../_snowpack/pkg/react.js";
import {BUTTON_LINEAR_GRADIENT} from "../../utils/constants.js";
import {Button, TextField, Typography} from "../../../_snowpack/pkg/@mui/material.js";
import {useStyles} from "./styles.js";
import {NewApplicationFooter} from "../../components/NewApplicationFooter/NewApplicationFooter.js";
import {useMutation} from "../../../_snowpack/pkg/@apollo/client.js";
import {forgotPasswordMutation} from "./service.js";
import {useFormik} from "../../../_snowpack/pkg/formik.js";
import * as yup from "../../../_snowpack/pkg/yup.js";
export const ForgotPassword = () => {
  const token = window.location.href.split("=")[1];
  const [forgotPassword] = useMutation(forgotPasswordMutation);
  const [alert, setAlert] = useState(null);
  const classes = useStyles;
  const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required")
  });
  const formik = useFormik({
    initialValues: {
      email: void 0
    },
    validationSchema,
    onSubmit: async () => {
      setAlert(null);
      await completeAccount();
    }
  });
  const completeAccount = async () => {
    forgotPassword({
      variables: {
        email: formik.values.email
      }
    }).then((data) => {
      if (data?.data?.forgotPassword) {
        setAlert({
          type: "success",
          message: "Instructions to reset your password have been emailed to you."
        });
      } else {
        formik.setErrors({email: " "});
        setAlert({
          type: "error",
          message: "We were unable to find an account associated with that email address."
        });
      }
    }).catch(() => {
      formik.setErrors({email: " "});
      setAlert({
        type: "error",
        message: "We were unable to find an account associated with that email address."
      });
    });
  };
  return /* @__PURE__ */ React.createElement(Box, {
    paddingX: 36,
    paddingY: 6,
    height: "100vh",
    sx: {bgcolor: "#EEF4F8"}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 12,
      paddingBottom: 12,
      background: BUTTON_LINEAR_GRADIENT,
      width: "100%"
    }
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 58,
    fontWeight: 400,
    color: "white"
  }, "Reset Your Password")), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 17,
    marginTop: 3,
    color: "white"
  }, 'Please enter your email address below and press "Reset Password".'), /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 17,
    marginTop: 1,
    color: "white"
  }, "You'll receive instructions on how to set a new password.")), /* @__PURE__ */ React.createElement("form", {
    onSubmit: formik.handleSubmit,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 24
    }
  }, /* @__PURE__ */ React.createElement(TextField, {
    color: "secondary",
    name: "email",
    sx: classes.textField,
    label: "Email",
    focused: true,
    variant: "outlined",
    inputProps: {
      style: {color: "white"}
    },
    value: formik.values.email,
    onChange: (e) => {
      formik.handleChange(e);
      setAlert(null);
    },
    error: formik.touched.email && Boolean(formik.errors.email),
    helperText: formik.touched.email && formik.errors.email
  }), alert && alert.message && /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 14,
    marginTop: 3,
    color: alert.type === "error" ? "#BD0043" : "white"
  }, alert.message), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.button,
    type: "submit"
  }, "Reset Password")), /* @__PURE__ */ React.createElement(Box, {
    position: "absolute",
    bottom: 20
  }, /* @__PURE__ */ React.createElement(NewApplicationFooter, null)))));
};
