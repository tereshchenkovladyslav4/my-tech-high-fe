import {Grid, Select, MenuItem} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import React, {useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {MTHBLUE, BLACK, BUTTON_LINEAR_GRADIENT} from "../../../../../utils/constants.js";
import moment from "../../../../../../_snowpack/pkg/moment.js";
import {makeStyles} from "../../../../../../_snowpack/pkg/@material-ui/styles.js";
import {KeyboardArrowDown} from "../../../../../../_snowpack/pkg/@mui/icons-material.js";
const selectStyles = makeStyles({
  backgroundSelect: {
    fontSize: "12px",
    borderRadius: "8px",
    minWidth: "135px",
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
  },
  selectIcon: {
    fill: "#F2F2F2",
    color: "#F2F2F2"
  },
  selectRoot: {
    color: "#F2F2F2"
  }
});
const useStyles = {
  modalCard: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 850,
    bgcolor: "#EEF4F8",
    boxShadow: 24,
    padding: "16px 32px",
    borderRadius: 2
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "200px"
  },
  close: {
    background: "black",
    borderRadius: 1,
    color: "white",
    cursor: "pointer"
  },
  errorOutline: {
    background: "#FAFAFA",
    borderRadius: 1,
    color: BLACK,
    marginBottom: 12,
    height: 42,
    width: 42
  },
  content: {
    padding: "10px 0"
  },
  submitButton: {
    borderRadius: "8px",
    width: "90px"
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    height: "39px",
    background: "#FAFAFA",
    "&:nth-child(even)": {
      background: "#fff",
      borderRadius: "8px"
    }
  },
  formLabel: {
    width: "155px",
    textAlign: "center",
    position: "relative",
    color: "#000000"
  },
  formValue: {
    padding: "0 30px",
    color: "#7b61ff",
    position: "relative"
  },
  labelAfter: {
    width: 0,
    height: "23px",
    borderRight: "1px solid #000000",
    position: "absolute",
    top: 0,
    right: 0
  },
  modalEmailCard: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 441,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  },
  emailRowHead: {
    display: "flex",
    alignItems: "center",
    mb: 3
  },
  emailRow: {
    display: "flex",
    alignItems: "center",
    mb: 2
  },
  emailLabel: {
    width: "150px",
    display: "flex",
    alignItems: "center"
  },
  ok: {
    borderRadius: 10,
    width: "9px",
    height: "19px",
    marginTop: 4
  }
};
const ordinal = (n) => {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
export const StudentFilters = ({currentUserData, setStudentStatuData, studentStatusData}) => {
  const classes = useStyles;
  const selectClasses = selectStyles();
  const [showDetails, setShowDetails] = useState(false);
  const [applications, setApplications] = useState([]);
  const [studentStatus, setStudentStatus] = useState();
  const [specialEd, setSpecialEd] = useState();
  const [diplomaSeeking, setDiplomaSeeking] = useState("");
  const specialEds = [
    {
      label: "No",
      value: 0
    },
    {
      label: "IEP",
      value: 1
    },
    {
      label: "504",
      value: 2
    },
    {
      label: "Exit",
      value: 3
    }
  ];
  const seeking = [
    {
      label: "No",
      value: 0
    },
    {
      label: "Yes",
      value: 1
    }
  ];
  const status = [
    {
      label: "Pending",
      value: 0
    },
    {
      label: "Active",
      value: 1
    },
    {
      label: "Withdrawn",
      value: 2
    }
  ];
  useEffect(() => {
    if (currentUserData && currentUserData.student) {
      setApplications(currentUserData.student.applications);
    }
  }, [currentUserData]);
  useEffect(() => {
    if (studentStatusData.diploma_seeking !== null && studentStatusData.diploma_seeking !== void 0) {
      setDiplomaSeeking(studentStatusData.diploma_seeking);
    }
  }, [studentStatusData]);
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      marginTop: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    xs: 4,
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    sx: {marginRight: "30px", marginBottom: "5px"}
  }, applications.length && `${moment(applications[0].school_year.date_begin).format("YYYY")} - ${moment(applications[0].school_year.date_end).format("YY")}`, " ", "Status"), /* @__PURE__ */ React.createElement(Select, {
    className: selectClasses.backgroundSelect,
    IconComponent: KeyboardArrowDown,
    inputProps: {
      classes: {
        icon: selectClasses.selectIcon
      }
    },
    value: +studentStatusData.status,
    onChange: (e) => {
      setStudentStatus(e.target.value);
      setStudentStatuData({...studentStatusData, ...{status: e.target.value}});
    }
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: ""
  }, "Select"), status.map((item) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: item.value,
    value: item.value
  }, item.label)))), /* @__PURE__ */ React.createElement(Box, {
    onClick: () => setShowDetails(!showDetails)
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    sx: {textDecoration: "underline", color: MTHBLUE}
  }, showDetails ? "Hide" : "View", " Details"))), /* @__PURE__ */ React.createElement(Grid, {
    xs: 4
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    textAlign: "left",
    fontWeight: "700",
    sx: {marginRight: "30px", marginBottom: "5px"}
  }, "Special Ed"), /* @__PURE__ */ React.createElement(Select, {
    className: selectClasses.backgroundSelect,
    IconComponent: KeyboardArrowDown,
    inputProps: {
      classes: {
        icon: selectClasses.selectIcon
      }
    },
    value: +studentStatusData.special_ed,
    onChange: (e) => {
      setSpecialEd(e.target.value);
      setStudentStatuData({...studentStatusData, ...{special_ed: e.target.value}});
    }
  }, specialEds.map((item) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: item.value,
    value: item.value
  }, item.label))))), /* @__PURE__ */ React.createElement(Grid, {
    xs: 4
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    textAlign: "left",
    fontWeight: "700",
    sx: {marginRight: "30px", marginBottom: "5px"}
  }, "Diploma Seeking"), /* @__PURE__ */ React.createElement(Select, {
    displayEmpty: true,
    className: selectClasses.backgroundSelect,
    IconComponent: KeyboardArrowDown,
    inputProps: {
      classes: {
        icon: selectClasses.selectIcon
      }
    },
    value: diplomaSeeking,
    onChange: (e) => {
      setDiplomaSeeking(e.target.value);
      setStudentStatuData({...studentStatusData, ...{diploma_seeking: e.target.value}});
    }
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: "",
    disabled: true
  }, "Select"), seeking.map((item) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: item.value,
    value: item.value
  }, item.label))))), showDetails && /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.content
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formLabel,
    fontWeight: "500"
  }, "Application", /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {...classes.formValue},
    fontWeight: "500"
  }, applications[0].status, " ", applications[0].date_submitted ? moment(applications[0].date_submitted).format("l") : moment(applications[0].date_accepted).format("l"))), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formLabel,
    fontWeight: "500"
  }, "Date of Birth", /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formValue,
    fontWeight: "500"
  }, currentUserData.student.person.date_of_birth && moment(currentUserData.student.person.date_of_birth).format("l"), currentUserData.student.person.date_of_birth && `(${moment().diff(currentUserData.student.person.date_of_birth, "years")})`)), applications.map((application) => /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formLabel,
    fontWeight: "500"
  }, `${moment(application.school_year.date_begin).format("YYYY")}-${moment(application.school_year.date_end).format("YY")}`, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.formRow
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: classes.formValue,
    fontWeight: "500"
  }, currentUserData.student.grade_levels && ordinal(currentUserData.student.grade_levels[0].grade_level), " ", "Grade", /* @__PURE__ */ React.createElement(Box, {
    sx: classes.labelAfter
  })))))))));
};
