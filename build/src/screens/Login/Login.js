import {Button, Grid, TextField} from "../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import React, {useContext, useEffect, useState} from "../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../components/Typography/Subtitle/Subtitle.js";
import {BUTTON_LINEAR_GRADIENT} from "../../utils/constants.js";
import {Typography} from "../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../_snowpack/pkg/lodash.js";
import PlayCircleOutlineIcon from "../../../_snowpack/pkg/@mui/icons-material/PlayCircleOutline.js";
import {Metadata} from "../../components/Metadata/Metadata.js";
import {Contact} from "./Contact/Contact.js";
import {Footer} from "./Footer/Footer.js";
import {useStyles} from "./styles.js";
import {loginMutation} from "./service.js";
import {useMutation} from "../../../_snowpack/pkg/@apollo/client.js";
import {AuthContext} from "../../providers/AuthProvider/AuthContext.js";
import {Link} from "../../../_snowpack/pkg/react-router-dom.js";
import {WarningModal} from "../../components/WarningModal/Warning.js";
import {useHistory} from "../../../_snowpack/pkg/react-router-dom.js";
export const Login = () => {
  const infocenterHelpLinks = [
    {
      title: "Find answers in Parent Link"
    },
    {
      title: "Submit applications and enrollment packets"
    },
    {
      title: "Read announcements"
    },
    {
      title: "View the calendar"
    },
    {
      title: "Submit Weekly Learning Logs"
    },
    {
      title: "Check student grades"
    },
    {
      title: "Update student and family information"
    },
    {
      title: "Manage schedules"
    },
    {
      title: "Submit and track reimbursements"
    },
    {
      title: "Bookmark this website: infocenter.mytechhigh.com"
    }
  ];
  const canvasHelpLinks = [
    {
      title: "Gain access to digital curriculum, practice exercises, and hands-on projects"
    },
    {
      title: "Request online support from a Tech Mentor"
    },
    {
      title: "Bookmark this website: mytechhigh.com/canvas"
    }
  ];
  const [apolloError, setApolloError] = useState({
    title: "",
    severity: "",
    flag: false
  });
  const renderInfocenterHelpLinks = (arr, canvas) => map(arr, (link, idx) => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    color: canvas ? "black" : "white"
  }, link.title), /* @__PURE__ */ React.createElement("hr", {
    style: {borderTop: "dotted 1px white", borderBottom: "0"}
  })));
  const classes = useStyles;
  const [login, {data, loading, error}] = useMutation(loginMutation);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const {setCredentials} = useContext(AuthContext);
  const history = useHistory();
  const loginAction = async () => {
    login({
      variables: {
        loginInput: {
          username,
          password
        }
      }
    });
  };
  const handleForgotPassword = () => {
    history.push("/forgot-password");
  };
  useEffect(() => {
    if (!loading && data !== void 0) {
      const jwt = data.login.jwt;
      localStorage.setItem("JWT", jwt);
      setCredentials(jwt);
    } else {
      if (error?.networkError || error?.graphQLErrors?.length > 0 || error?.clientErrors.length > 0) {
        setApolloError({
          title: error?.clientErrors[0]?.message || error?.graphQLErrors[0]?.message || error?.networkError?.message,
          severity: "Error",
          flag: true
        });
      }
    }
  }, [loading]);
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {backgroundColor: "white"}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {alignItems: "center", marginBottom: 4}
  }, apolloError.flag && /* @__PURE__ */ React.createElement(WarningModal, {
    handleModem: () => setApolloError({title: "", severity: "", flag: false}),
    title: apolloError.severity,
    subtitle: apolloError.title,
    btntitle: "Close",
    handleSubmit: () => setApolloError({title: "", severity: "", flag: false})
  }), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    sx: {
      position: "relative",
      paddingY: "48px",
      paddingX: "93px"
    }
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 6,
    sx: {background: BUTTON_LINEAR_GRADIENT, padding: 6}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 58,
    fontWeight: 400,
    color: "white"
  }, "InfoCenter"), /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 17,
    color: "white"
  }, "Manage your My Tech High experience"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 8
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(TextField, {
    label: "Username",
    color: "secondary",
    focused: true,
    variant: "outlined",
    sx: {marginY: 2},
    inputProps: {
      style: {color: "white"}
    },
    value: username,
    onChange: (e) => setUsername(e.target.value)
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.passwordContainer
  }, /* @__PURE__ */ React.createElement(TextField, {
    color: "secondary",
    id: "outlined-read-only-input",
    label: "Password",
    variant: "outlined",
    focused: true,
    inputProps: {
      style: {color: "white"}
    },
    type: "password",
    value: password,
    onChange: (e) => setPassword(e.target.value),
    sx: {width: "100%"}
  }), /* @__PURE__ */ React.createElement(Typography, {
    sx: classes.forgotPassword,
    onClick: handleForgotPassword
  }, "Forgot Password")))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", justifyContent: "flex-end"}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    onClick: () => loginAction(),
    sx: classes.signInButton
  }, "Sign In"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    sx: {marginY: 4}
  }, renderInfocenterHelpLinks(infocenterHelpLinks)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Metadata, {
    title: /* @__PURE__ */ React.createElement(Subtitle, {
      color: "white"
    }, " Watch this two-minute InfoCenter overview."),
    subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
      color: "white"
    }, "of navigation InfoCenter"),
    image: /* @__PURE__ */ React.createElement(PlayCircleOutlineIcon, {
      style: {color: "white", marginRight: 24}
    })
  })))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 6,
    sx: {padding: 6, background: "#EEF4F8"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 58,
    fontWeight: 400,
    color: "black"
  }, "Canvas"), /* @__PURE__ */ React.createElement(Typography, {
    fontSize: 17,
    color: "black"
  }, "Home of MTH Direct tech and entrepreneurship courses"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", justifyContent: "flex-start", marginTop: -20}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.canvasButton
  }, "Sign In"))), /* @__PURE__ */ React.createElement(Box, {
    sx: {marginTop: -30}
  }, renderInfocenterHelpLinks(canvasHelpLinks, true)))), /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(Link, {
    to: "applications",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    style: {
      borderRadius: 8,
      fontSize: 12,
      background: BUTTON_LINEAR_GRADIENT,
      width: 600,
      height: 48
    }
  }, "Apply Now")))), /* @__PURE__ */ React.createElement(Contact, null), /* @__PURE__ */ React.createElement(Footer, null));
};
