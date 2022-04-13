import {Box, Button, Card, Grid, TextField} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useContext} from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {UserContext} from "../../../providers/UserContext/UserProvider.js";
import {useStyles} from "../styles.js";
import {updatePassword} from "../service.js";
import {useMutation} from "../../../../_snowpack/pkg/@apollo/client.js";
import * as yup from "../../../../_snowpack/pkg/yup.js";
import {useFormik} from "../../../../_snowpack/pkg/formik.js";
export const Account = () => {
  const classes = useStyles;
  const {me} = useContext(UserContext);
  const {profile} = me;
  const [updatePasswordMutation] = useMutation(updatePassword);
  const onSave = async () => {
    await updatePasswordMutation({
      variables: {
        updateAccountInput: {
          password: formik.values.password,
          confirm_password: formik.values.confirmPassword
        }
      }
    });
  };
  const validationSchema = yup.object({
    password: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password is required"),
    confirmPassword: yup.string().required("Re-Enter password is required").oneOf([yup.ref("password")], "Passwords do not match")
  });
  const formik = useFormik({
    initialValues: {
      password: void 0,
      confirmPassword: void 0
    },
    validationSchema,
    onSubmit: async () => {
      await onSave();
    }
  });
  return /* @__PURE__ */ React.createElement("form", {
    onSubmit: formik.handleSubmit,
    style: {display: "flex", height: "100%"}
  }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    paddingX: 6,
    rowSpacing: 2,
    marginTop: 1
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Account")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 12,
    paddingX: 6
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500",
    textAlign: "left"
  }, "Username")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 10
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(TextField, {
    disabled: true,
    variant: "filled",
    value: profile?.email
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.accountSaveChanges,
    type: "submit"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "700"
  }, "Save Changes"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 10
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500",
    textAlign: "left"
  }, "Password"), /* @__PURE__ */ React.createElement(TextField, {
    name: "password",
    type: "password",
    value: formik.values.password,
    onChange: formik.handleChange,
    error: formik.touched.password && Boolean(formik.errors.password),
    helperText: formik.touched.password && formik.errors.password
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 10
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500",
    textAlign: "left"
  }, "Re-Enter Password"), /* @__PURE__ */ React.createElement(TextField, {
    name: "confirmPassword",
    type: "password",
    value: formik.values.confirmPassword,
    onChange: formik.handleChange,
    error: formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword),
    helperText: formik.touched.confirmPassword && formik.errors.confirmPassword
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(Subtitle, null, "Secondary Observer Account (Added by Admin)")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 5
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginRight: 2
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500",
    textAlign: "left"
  }, "First Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled: true,
    variant: "filled"
  })))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 5
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginLeft: 2
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500",
    textAlign: "left"
  }, "Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled: true,
    variant: "filled",
    value: ""
  })))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 10
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500",
    textAlign: "left"
  }, "Username"), /* @__PURE__ */ React.createElement(TextField, {
    disabled: true,
    variant: "filled"
  })))))));
};
