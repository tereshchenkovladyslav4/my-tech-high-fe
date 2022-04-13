import {Avatar, Button, Checkbox, FormControlLabel, Grid, TextField, Select, MenuItem} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import React, {useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {useQuery} from "../../../../../_snowpack/pkg/@apollo/client.js";
import {DropDown} from "../../../../components/DropDown/DropDown.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {Title} from "../../../../components/Typography/Title/Title.js";
import {BUTTON_LINEAR_GRADIENT, MTHBLUE, RED} from "../../../../utils/constants.js";
import {StudentFilters} from "./components/StudentFilters.js";
import {getStudentDetail} from "../services.js";
import moment from "../../../../../_snowpack/pkg/moment.js";
import {WarningModal} from "../../../../components/WarningModal/Warning.js";
import {KeyboardArrowDown} from "../../../../../_snowpack/pkg/@mui/icons-material.js";
import {makeStyles} from "../../../../../_snowpack/pkg/@material-ui/styles.js";
const selectStyles = makeStyles({
  select: {
    maxWidth: "150px",
    height: "35px",
    textAlign: "left",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
      display: "none"
    }
  },
  backgroundSelect: {
    fontSize: "12px",
    borderRadius: "15px",
    minWidth: "80px",
    height: "29px",
    textAlign: "center",
    background: BUTTON_LINEAR_GRADIENT,
    color: "#F2F2F2",
    "&:before": {
      borderColor: BUTTON_LINEAR_GRADIENT
    },
    "&:after": {
      borderColor: BUTTON_LINEAR_GRADIENT
    }
  }
});
const ordinal = (n) => {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
export const StudentProfile = ({studentId, setStudentPerson, setStudentStatus, studentStatus, applicationState}) => {
  const classes = selectStyles();
  const {
    loading: userLoading,
    error: userError,
    data: currentUserData,
    refetch
  } = useQuery(getStudentDetail, {
    variables: {
      student_id: studentId
    },
    fetchPolicy: "cache-and-network"
  });
  const [userInfo, setUserInfo] = useState({});
  const [preferedFirstName, setPreferredFirstName] = useState("");
  const [preferedLastName, setPreferredLastName] = useState("");
  const [hispanicOrLatino, setHispanicOrLatino] = useState("");
  const [legalFirstName, setLegalFirstName] = useState("");
  const [legalMiddleName, setLegalMiddleName] = useState("");
  const [legalLastName, setLegalLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [state, setState] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [packets, setPackets] = useState([]);
  const [openNotes, setOpenNotes] = useState(false);
  const [canMessage, setCanMessage] = useState(false);
  const hispanicOrLatinoItems = [
    {
      label: "Opt-in",
      value: "Opt-in"
    },
    {
      label: "Opt-out",
      value: "Opt-out"
    },
    {
      label: "Prefer not to say",
      value: "Prefer not to say"
    }
  ];
  const genderItems = [
    {
      label: "Male",
      value: "Male"
    },
    {
      label: "Female",
      value: "Female"
    }
  ];
  useEffect(() => {
    setStudentPerson(userInfo);
  }, [userInfo]);
  useEffect(() => {
    if (currentUserData) {
      setEmail(currentUserData.student.person.email);
      setPreferredFirstName(currentUserData.student.person.preferred_first_name);
      setPreferredLastName(currentUserData.student.person.preferred_last_name);
      setLegalFirstName(currentUserData.student.person.first_name);
      setLegalLastName(currentUserData.student.person.last_name);
      setLegalMiddleName(currentUserData.student.person.middle_name);
      setGender(currentUserData.student.person.gender);
      setCity(currentUserData.student.person.address.city);
      setState(currentUserData.student.person.address.state || applicationState);
      setStreet1(currentUserData.student.person.address.street);
      setStreet2(currentUserData.student.person.address.street2);
      setZip(currentUserData.student.person.address.zip);
      setPhone(currentUserData.student.person.phone.number);
      setUserInfo(currentUserData.student.person);
      setPackets(currentUserData.student.packets);
      if (currentUserData.student.grade_levels && currentUserData.student.grade_levels[0]) {
        setGradeLevel(currentUserData.student.grade_levels[0].grade_level);
      }
      if (currentUserData.student.person.phone.ext) {
        setCanMessage(true);
      }
      setStudentStatus({
        student_id: +studentId,
        special_ed: currentUserData.student.special_ed,
        diploma_seeking: currentUserData.student.diploma_seeking,
        testing_preference: currentUserData.student.testing_preference,
        status: currentUserData.student.status.length && currentUserData.student.status[0].status,
        school_year_id: currentUserData.student.applications.length && currentUserData.student.applications[0].school_year_id
      });
      if (currentUserData.student.testing_preference) {
        setHispanicOrLatino(currentUserData.student.testing_preference);
      }
    }
  }, [currentUserData]);
  useEffect(() => {
    refetch();
  }, [studentId]);
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      marginTop: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginRight: 2,
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
  }, "Homeroom Resources"), /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginRight: 2,
      width: "264px",
      height: "34px",
      borderRadius: 2
    }
  }, "Homeroom (Sample Teacher)")), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    marginTop: 4,
    columnSpacing: 4,
    rowSpacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Remy Sharp",
    variant: "rounded",
    style: {height: "127px", width: "127px", marginRight: "12px"}
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      textAlign: "left"
    }
  }, /* @__PURE__ */ React.createElement(Title, {
    textAlign: "left",
    fontWeight: "700",
    color: MTHBLUE
  }, legalFirstName, " ", legalLastName), /* @__PURE__ */ React.createElement(Select, {
    IconComponent: KeyboardArrowDown,
    className: classes.select,
    value: gradeLevel.includes("K") ? "K" : gradeLevel,
    sx: {fontWeight: 700}
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: "K"
  }, "K"), [...Array(12).keys()].map((item) => /* @__PURE__ */ React.createElement(MenuItem, {
    value: item + 1
  }, ordinal(item + 1), " Grade"))), /* @__PURE__ */ React.createElement(Select, {
    IconComponent: KeyboardArrowDown,
    className: classes.select,
    value: "Unassigned"
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: "Unassigned"
  }, "Unassigned"))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3,
    sx: {alignItems: "center", display: "flex", fontWeight: "700"}
  }, "Packet"), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 9,
    sx: {alignItems: "center", display: "flex"}
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginRight: 2,
      width: "198px",
      height: "29px",
      borderRadius: 2,
      fontWeight: "800"
    }
  }, packets.length && packets[0].status === "Accepted" ? `Accepted ${moment(packets[0].date_accepted).format("l")}` : "")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3,
    sx: {alignItems: "center", display: "flex", fontWeight: "700"}
  }, "Schedule"), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 9,
    sx: {alignItems: "center", display: "flex"}
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginRight: 2,
      width: "198px",
      height: "29px",
      borderRadius: 2,
      fontWeight: "800"
    }
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {alignItems: "center", display: "flex"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    color: MTHBLUE
  }, "92%"), /* @__PURE__ */ React.createElement(Subtitle, {
    textAlign: "left",
    fontWeight: "700",
    color: "#CCCCCC",
    sx: {marginLeft: 3}
  }, "1st Semester # of Zeros")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {alignItems: "center", display: "flex"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    color: RED
  }, "65%"), /* @__PURE__ */ React.createElement(Subtitle, {
    textAlign: "left",
    fontWeight: "700",
    color: "#CCCCCC",
    sx: {marginLeft: 3}
  }, "2nd Semester # of Zeros"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {display: "flex", justifyContent: "flex-end"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {alignItems: "center", display: "flex"}
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginLeft: 5,
      width: "198px",
      height: "29px",
      borderRadius: 2,
      fontWeight: "800"
    },
    onClick: () => setOpenNotes(true)
  }, "Notes and Inventions")))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(StudentFilters, {
    currentUserData,
    setStudentStatuData: setStudentStatus,
    studentStatusData: studentStatus
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Preferred First Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: preferedFirstName || legalFirstName
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
    value: preferedLastName || legalLastName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Gender"), /* @__PURE__ */ React.createElement(DropDown, {
    sx: {width: "70%"},
    size: "small",
    dropDownItems: genderItems,
    defaultValue: gender,
    placeholder: gender,
    setParentValue: (e) => {
      setGender(e);
      setUserInfo({...userInfo, ...{gender: e}});
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "left"
  }, "Testing Preference"), /* @__PURE__ */ React.createElement(Select, {
    value: hispanicOrLatino,
    onChange: (e) => {
      setHispanicOrLatino(e.target.value);
      setStudentStatus({...studentStatus, ...{testing_preference: e.target.value}});
    },
    displayEmpty: true,
    sx: {
      width: "30%",
      borderRadius: 2
    },
    size: "small"
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: "",
    disabled: true
  }, "Select"), hispanicOrLatinoItems.map((item) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: item.value,
    value: item.value
  }, item.label)))), /* @__PURE__ */ React.createElement(Grid, {
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
    xs: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "50%"}
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
      setUserInfo({...userInfo, phone: {...userInfo.phone, number: e.target.value}});
    }
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      checked: canMessage,
      onChange: (e) => {
        setCanMessage(e.target.checked);
        setUserInfo({...userInfo, phone: {...userInfo.phone, ext: e.target.checked ? "1" : null}});
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
    xs: 6
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
  })), /* @__PURE__ */ React.createElement(Grid, {
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
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "49.25%"}
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
  })))), openNotes && /* @__PURE__ */ React.createElement(WarningModal, {
    handleModem: () => setOpenNotes(false),
    title: "Notes",
    subtitle: "",
    btntitle: "Close",
    handleSubmit: () => setOpenNotes(false),
    showIcon: false
  }));
};
