import {FormControlLabel, Checkbox, Avatar, Grid} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import React, {useState, useRef} from "../../../../../../_snowpack/pkg/react.js";
import {Metadata} from "../../../../../components/Metadata/Metadata.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import Slider from "../../../../../../_snowpack/pkg/react-slick.js";
import ChevronLeftIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/ChevronLeft.js";
import ChevronRightIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/ChevronRight.js";
const ordinal = (n) => {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
export const Students = ({students, selectedStudent, handleChangeStudent}) => {
  const sliderRef = useRef(null);
  const [showAll, setShowAll] = useState(false);
  const status = ["Pending", "Active", "Withdrawn", "Blank"];
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
        position: "absolute",
        alignItems: "center"
      }
    }, /* @__PURE__ */ React.createElement(ChevronRightIcon, {
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
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: /* @__PURE__ */ React.createElement(SampleNextArrow, null),
    prevArrow: /* @__PURE__ */ React.createElement(SamplePrevArrow, null)
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700",
    sx: {marginRight: "36px"}
  }, "Students"), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: showAll,
      onChange: (e, checked) => setShowAll(checked)
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      fontWeight: "700",
      size: "medium"
    }, "Show Graduated/Transitioned")
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 10,
    style: {paddingLeft: "20px"}
  }, /* @__PURE__ */ React.createElement(Slider, {
    ...settings,
    ref: sliderRef
  }, students.filter((item) => showAll || item.status.length === 0 || item.status.length && Number(item.status[0].status) < 2).map((item) => /* @__PURE__ */ React.createElement(Box, {
    sx: {cursor: "pointer"},
    onClick: () => handleChangeStudent(item)
  }, /* @__PURE__ */ React.createElement(Metadata, {
    title: /* @__PURE__ */ React.createElement(Subtitle, {
      fontWeight: "700",
      color: selectedStudent === item.student_id ? "#4145FF" : "#cccccc"
    }, item.person.first_name),
    subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
      color: "#cccccc",
      size: "large"
    }, item.status.length && item.status[0].status > 1 ? status[item.status[0].status] : ordinal(item.grade_level || item.grade_levels.length && item.grade_levels[0].grade_level) + " Grade"),
    image: /* @__PURE__ */ React.createElement(Avatar, {
      alt: "Remy Sharp",
      variant: "rounded",
      style: {marginRight: 8}
    })
  })))))));
};
