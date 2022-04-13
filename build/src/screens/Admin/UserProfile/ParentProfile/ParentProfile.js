import {Button, Checkbox, FormControlLabel, Grid, TextField} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import React, {useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {BUTTON_LINEAR_GRADIENT} from "../../../../utils/constants.js";
export const ParentProfile = ({
  userInfo,
  setUserInfo,
  phoneInfo,
  setPhoneInfo,
  notes,
  setNotes,
  applicationState
}) => {
  const [preferedFirstName, setPreferredFirstName] = useState("");
  const [preferedLastName, setPreferredLastName] = useState("");
  const [legalFirstName, setLegalFirstName] = useState("");
  const [legalMiddleName, setLegalMiddleName] = useState("");
  const [legalLastName, setLegalLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [state, setState] = useState("");
  const [canMessage, setCanMessage] = useState(false);
  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
      setPreferredFirstName(userInfo.preferred_first_name || "");
      setPreferredLastName(userInfo.preferred_last_name || "");
      setLegalFirstName(userInfo.first_name || "");
      setLegalLastName(userInfo.last_name || "");
      setLegalMiddleName(userInfo.middle_name || "");
      setCity(userInfo.address.city || "");
      setState(userInfo.address.state || applicationState);
      setStreet1(userInfo.address.street || "");
      setStreet2(userInfo.address.street2 || "");
      setZip(userInfo.address.zip || "");
    }
    setPhone(phoneInfo?.number || "");
    if (phoneInfo?.ext) {
      setCanMessage(true);
    }
  }, [userInfo]);
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      marginTop: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginRight: 5,
      width: "264px",
      height: "34px",
      borderRadius: 2
    }
  }, "Reimbursements"), /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginRight: 2,
      width: "264px",
      height: "34px",
      borderRadius: 2
    }
  }, "Homeroom Resources")), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    marginTop: 4,
    columnSpacing: 4,
    rowSpacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Preferred First Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: preferedFirstName,
    onChange: (e) => {
      setPreferredFirstName(e.target.value);
      setUserInfo({...userInfo, ...{preferred_first_name: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Preferred Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: preferedLastName,
    onChange: (e) => {
      setPreferredLastName(e.target.value);
      setUserInfo({...userInfo, ...{preferred_last_name: e.target.value}});
    }
  }))), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    marginTop: 0,
    columnSpacing: 4,
    rowSpacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Legal First Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: legalFirstName,
    onChange: (e) => {
      setLegalFirstName(e.target.value);
      setUserInfo({...userInfo, ...{first_name: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Legal Middle Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: legalMiddleName,
    onChange: (e) => {
      setLegalMiddleName(e.target.value);
      setUserInfo({...userInfo, ...{middle_name: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Legal Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: legalLastName,
    onChange: (e) => {
      setLegalLastName(e.target.value);
      setUserInfo({...userInfo, ...{last_name: e.target.value}});
    }
  }))), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    marginTop: 0,
    columnSpacing: 4,
    rowSpacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Phone"), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: phone,
    onChange: (e) => {
      setPhone(e.target.value);
      setPhoneInfo({...phoneInfo, ...{number: e.target.value}});
    }
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      checked: canMessage,
      onChange: (e) => {
        setCanMessage(e.target.checked);
        setPhoneInfo({...phoneInfo, ...{ext: e.target.checked ? "1" : null}});
      }
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, null, "I can receive text messages via this number")
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Email"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: email,
    onChange: (e) => {
      setEmail(e.target.value);
      setUserInfo({...userInfo, ...{email: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "City"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: city,
    onChange: (e) => {
      setCity(e.target.value);
      setUserInfo({...userInfo, address: {...userInfo.address, city: e.target.value}});
    }
  }))), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    marginTop: 0,
    columnSpacing: 4,
    rowSpacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Address line 1"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: street1,
    onChange: (e) => {
      setStreet1(e.target.value);
      setUserInfo({...userInfo, address: {...userInfo.address, street: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "State"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: state,
    onChange: (e) => {
      setState(e.target.value);
      setUserInfo({...userInfo, address: {...userInfo.address, state: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Zip"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: zip,
    onChange: (e) => {
      setZip(e.target.value);
      setUserInfo({...userInfo, address: {...userInfo.address, zip: e.target.value}});
    }
  }))), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    marginTop: 0,
    columnSpacing: 4,
    rowSpacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Address line 2"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: street2,
    onChange: (e) => {
      setStreet2(e.target.value);
      setUserInfo({...userInfo, address: {...userInfo.address, street2: e.target.value}});
    }
  }))), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    marginTop: 0,
    columnSpacing: 4,
    rowSpacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 7
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large",
    textAlign: "left"
  }, "Notes"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: notes,
    onChange: (e) => {
      setNotes(e.target.value);
    },
    multiline: true,
    rows: 8
  }))));
};
