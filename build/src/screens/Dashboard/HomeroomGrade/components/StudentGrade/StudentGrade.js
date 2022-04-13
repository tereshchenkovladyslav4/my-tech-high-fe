import {Avatar, Box, CircularProgress, IconButton, Tooltip} from "../../../../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {Metadata} from "../../../../../components/Metadata/Metadata.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {useStyles} from "./styles.js";
import ErrorOutlineIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/ErrorOutline.js";
import ScheduleIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Schedule.js";
export const StudentGrade = ({student}) => {
  const red = "#D23C33";
  const blue = "#2B9EB7";
  const classes = useStyles;
  const [circleData, setCircleData] = useState();
  const progress = () => {
    const {applications, packets} = student;
    const currApplication = applications.at(0);
    const currPacket = packets.at(0);
    if (currApplication && currApplication?.status === "Submitted") {
      setCircleData({
        progress: 25,
        color: blue,
        message: "Application Pending Approval",
        icon: /* @__PURE__ */ React.createElement(ScheduleIcon, {
          sx: {color: blue, marginTop: 2, cursor: "pointer"}
        })
      });
    } else if (currApplication && currApplication?.status === "Accepted" && (packets && (currPacket?.status === "Not Started" || currPacket?.status === "Missing Info"))) {
      if (currPacket?.status === "Not Started") {
        setCircleData({
          progress: 50,
          color: red,
          message: "Please Submit an Enrollment Packet",
          icon: /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
            sx: {color: red, marginTop: 2, cursor: "pointer"}
          })
        });
      } else {
        setCircleData({
          progress: 50,
          color: red,
          message: "Please Resubmit Enrollment Packet",
          icon: /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
            sx: {color: red, marginTop: 2, cursor: "pointer"}
          })
        });
      }
    } else if (currApplication && currApplication?.status === "Accepted" && currPacket && currPacket?.status === "Started") {
      setCircleData({
        progress: 50,
        color: red,
        message: "Finish Submitting Enrollment Packet",
        icon: /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
          sx: {color: red, marginTop: 2, cursor: "pointer"}
        })
      });
    } else if (currApplication && currApplication?.status === "Accepted" && currPacket && currPacket?.status === "Submitted") {
      setCircleData({
        progress: 50,
        color: blue,
        message: "Enrollment Packet Pending Approval",
        icon: /* @__PURE__ */ React.createElement(ScheduleIcon, {
          sx: {color: blue, marginTop: 2, cursor: "pointer"}
        })
      });
    }
  };
  useEffect(() => {
    progress();
  }, []);
  return /* @__PURE__ */ React.createElement(Metadata, {
    title: /* @__PURE__ */ React.createElement(Subtitle, {
      size: "medium",
      fontWeight: "600"
    }),
    subtitle: /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Paragraph, {
      fontWeight: "700",
      color: "black",
      size: "medium"
    }, student.person.first_name), /* @__PURE__ */ React.createElement(Tooltip, {
      title: circleData?.message
    }, /* @__PURE__ */ React.createElement(IconButton, null, circleData?.icon))),
    image: /* @__PURE__ */ React.createElement(Box, {
      sx: classes.progressContainer,
      position: "relative"
    }, /* @__PURE__ */ React.createElement(CircularProgress, {
      variant: "determinate",
      value: circleData?.progress,
      size: 60,
      sx: {color: circleData?.color}
    }), /* @__PURE__ */ React.createElement(Box, {
      sx: classes.avatarContainer,
      position: "absolute"
    }, /* @__PURE__ */ React.createElement(Avatar, {
      alt: student.person.first_name,
      src: "image",
      sx: classes.avatar
    }))),
    verticle: true
  });
};
