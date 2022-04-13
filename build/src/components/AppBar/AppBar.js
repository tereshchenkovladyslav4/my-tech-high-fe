import AddIcon from "../../../_snowpack/pkg/@mui/icons-material/Add.js";
import ChevronLeftIcon from "../../../_snowpack/pkg/@mui/icons-material/ChevronLeft.js";
import ChevronRightIcon from "../../../_snowpack/pkg/@mui/icons-material/ChevronRight.js";
import {AppBar as MUIAppBar, Avatar, Box, Button, Divider, Grid} from "../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../_snowpack/pkg/lodash.js";
import React, {useContext, useRef} from "../../../_snowpack/pkg/react.js";
import {NavLink, useLocation} from "../../../_snowpack/pkg/react-router-dom.js";
import Slider from "../../../_snowpack/pkg/react-slick.js";
import {UserContext} from "../../providers/UserContext/UserProvider.js";
import {APPLICATIONS, HOMEROOM, MTHBLUE} from "../../utils/constants.js";
import {toOrdinalSuffix} from "../../utils/stringHelpers.js";
import {Metadata} from "../Metadata/Metadata.js";
import {Paragraph} from "../Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../Typography/Subtitle/Subtitle.js";
import {useStyles} from "./styles.js";
export const AppBar = () => {
  const classes = useStyles;
  const sliderRef = useRef();
  const {me} = useContext(UserContext);
  const {students} = me;
  const location = useLocation();
  const isActive = (id) => location.pathname.includes(`/${id}`);
  const AddStudentButton = () => /* @__PURE__ */ React.createElement(Button, {
    disableElevation: true,
    href: APPLICATIONS,
    variant: "contained",
    sx: {
      background: "#FAFAFA",
      color: "black",
      width: "200px",
      height: "44px",
      alignItems: "center",
      "&:hover": {
        background: "#F5F5F5",
        color: "#000"
      }
    },
    startIcon: /* @__PURE__ */ React.createElement(AddIcon, null)
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {whiteSpace: "nowrap"}
  }, "Add Student"));
  function SampleNextArrow(props) {
    const {className, style, onClick} = props;
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        right: "-160px",
        top: "31%",
        width: "150px",
        height: "30px",
        marginLeft: 2,
        position: "absolute",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(AddStudentButton, null), /* @__PURE__ */ React.createElement(ChevronRightIcon, {
      style: {...style, display: "block", color: "black", background: "#FAFAFA", cursor: "pointer"},
      onClick: () => sliderRef.current.slickNext()
    }));
  }
  function SamplePrevArrow(props) {
    const {className, style, onClick} = props;
    return /* @__PURE__ */ React.createElement(ChevronLeftIcon, {
      className,
      style: {...style, display: "block", color: "black", background: "#FAFAFA"},
      onClick: () => sliderRef.current.slickPrev()
    });
  }
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: /* @__PURE__ */ React.createElement(SampleNextArrow, null),
    prevArrow: /* @__PURE__ */ React.createElement(SamplePrevArrow, null)
  };
  const gradeText = (student) => student.grade_levels.at(-1)?.grade_level !== "Kin" ? `${toOrdinalSuffix(student.grade_levels.at(-1)?.grade_level)} Grade` : "Kindergarten";
  const renderStudentHeader = () => map(students, (student) => {
    const link = student?.applications?.at(-1)?.status === "Submitted" || student?.status?.at(-1)?.status === 2 || student?.packets?.at(-1)?.status === "Started" ? void 0 : `${HOMEROOM}/${student.student_id}`;
    return /* @__PURE__ */ React.createElement(Box, {
      sx: {textDecoration: "none", marginTop: 1}
    }, link ? /* @__PURE__ */ React.createElement(NavLink, {
      to: link,
      style: {textDecoration: "none"}
    }, /* @__PURE__ */ React.createElement(Metadata, {
      divider: true,
      title: /* @__PURE__ */ React.createElement(Subtitle, {
        color: isActive(student.student_id) ? MTHBLUE : "#A1A1A1"
      }, student.person.first_name),
      subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
        color: "#cccccc",
        size: "large"
      }, gradeText(student)),
      image: /* @__PURE__ */ React.createElement(Avatar, {
        alt: student.person.first_name,
        src: " ",
        variant: "rounded",
        style: {marginRight: 24}
      })
    })) : /* @__PURE__ */ React.createElement(Metadata, {
      divider: true,
      title: /* @__PURE__ */ React.createElement(Subtitle, {
        color: isActive(student.student_id) ? MTHBLUE : "#A1A1A1"
      }, student.person.first_name),
      subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
        color: "#cccccc",
        size: "large"
      }, gradeText(student)),
      image: /* @__PURE__ */ React.createElement(Avatar, {
        alt: student.person.first_name,
        src: " ",
        variant: "rounded",
        style: {marginRight: 24}
      })
    }));
  });
  return /* @__PURE__ */ React.createElement(MUIAppBar, {
    position: "static",
    sx: classes.appBar,
    elevation: 0
  }, /* @__PURE__ */ React.createElement("div", {
    style: classes.toolbar
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "flex-end",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    display: "flex",
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Box, {
    width: students.length > 3 ? "50vw" : "100%"
  }, students && students.length > 3 ? /* @__PURE__ */ React.createElement(Slider, {
    ...settings,
    ref: sliderRef
  }, renderStudentHeader()) : students && (students.length > 0 && students.length <= 3) && /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}
  }, renderStudentHeader(), /* @__PURE__ */ React.createElement(Divider, {
    sx: {
      background: "black",
      height: 35,
      marginX: 3,
      marginTop: 2
    },
    variant: "middle",
    orientation: "vertical"
  }), /* @__PURE__ */ React.createElement(AddStudentButton, null)))))));
};
