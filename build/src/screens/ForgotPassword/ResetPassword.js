import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React, {useState, useContext} from "../../../_snowpack/pkg/react.js";
import {BUTTON_LINEAR_GRADIENT} from "../../utils/constants.js";
import {Button, TextField} from "../../../_snowpack/pkg/@mui/material.js";
import {useStyles} from "./styles.js";
import {NewApplicationFooter} from "../../components/NewApplicationFooter/NewApplicationFooter.js";
import {useMutation} from "../../../_snowpack/pkg/@apollo/client.js";
import {resetPasswordMutation} from "./service.js";
import {useFormik} from "../../../_snowpack/pkg/formik.js";
import * as yup from "../../../_snowpack/pkg/yup.js";
import {CompleteAccountSuccess} from "../CompleteAccountSuccess/CompleteAccountSuccess.js";
import {Typography} from "../../../_snowpack/pkg/@mui/material.js";
import {AuthContext} from "../../providers/AuthProvider/AuthContext.js";
import {useHistory} from "../../../_snowpack/pkg/react-router-dom.js";
export const ResetPassword = () => {
  const token = window.location.href.split("=")[1];
  const decodedToken = atob(token);
  const [user_id, email] = decodedToken.split("-");
  const [resetPassword] = useMutation(resetPasswordMutation);
  const [showSuccess, setShowSuccess] = useState(false);
  const {setCredentials} = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const classes = useStyles;
  const history = useHistory();
  const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password is required"),
    confirmPassword: yup.string().required("Please enter your password again").oneOf([yup.ref("password")], "Passwords do not match")
  });
  const formik = useFormik({
    initialValues: {
      email,
      password: void 0,
      confirmPassword: void 0
    },
    validationSchema,
    onSubmit: async () => {
      setAlert(null);
      await completeAccount();
    }
  });
  const completeAccount = async () => {
    resetPassword({
      variables: {
        verifyInput: {
          token,
          password: formik.values.password,
          confirm_password: formik.values.confirmPassword
        }
      }
    }).then((data) => {
      if (data?.data?.resetPassword) {
        localStorage.setItem("JWT", data.data.resetPassword.token);
        setCredentials(data.data.resetPassword.token);
        history.push("/");
      } else {
        setAlert({
          type: "error",
          message: "Please check password again."
        });
      }
    }).catch((error) => {
      formik.setErrors({password: " ", confirmPassword: " "});
      setAlert({
        type: "error",
        message: error.message
      });
    });
  };
  return !showSuccess ? /* @__PURE__ */ React.createElement(Box, {
    paddingX: 36,
    paddingY: 6,
    height: "100vh",
    sx: {bgcolor: "#EEF4F8"}
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: BUTTON_LINEAR_GRADIENT,
      paddingTop: 12,
      paddingBottom: 12
    }
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 58,
    fontWeight: 400,
    color: "white",
    marginBottom: 5
  }, "Update Your Password")), /* @__PURE__ */ React.createElement("form", {
    onSubmit: formik.handleSubmit,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
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
    error: formik.touched.email && Boolean(formik.errors.email),
    helperText: formik.touched.email && formik.errors.email
  }), /* @__PURE__ */ React.createElement(TextField, {
    color: "secondary",
    name: "password",
    type: "password",
    sx: classes.textField,
    label: "Password",
    focused: true,
    variant: "outlined",
    inputProps: {
      style: {color: "white"}
    },
    value: formik.values.password,
    onChange: (e) => {
      formik.handleChange(e);
      setAlert(null);
    },
    error: formik.touched.password && Boolean(formik.errors.password),
    helperText: formik.touched.password && formik.errors.password
  }), /* @__PURE__ */ React.createElement(TextField, {
    color: "secondary",
    name: "confirmPassword",
    type: "password",
    sx: classes.textField,
    label: "Re-type Password",
    focused: true,
    variant: "outlined",
    inputProps: {
      style: {color: "white"}
    },
    value: formik.values.confirmPassword,
    onChange: (e) => {
      formik.handleChange(e);
      setAlert(null);
    },
    error: formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword),
    helperText: formik.touched.confirmPassword && formik.errors.confirmPassword
  }), alert && alert.message && /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 14,
    marginTop: 3,
    color: alert.type === "error" ? "#BD0043" : "white"
  }, alert.message), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.button,
    type: "submit"
  }, "Update Password")), /* @__PURE__ */ React.createElement(Box, {
    position: "absolute",
    bottom: 20
  }, /* @__PURE__ */ React.createElement(NewApplicationFooter, null))))) : /* @__PURE__ */ React.createElement(CompleteAccountSuccess, null);
};
