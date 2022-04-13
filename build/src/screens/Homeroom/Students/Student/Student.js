import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import React, {useContext, useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {MTHORANGE, HOMEROOM, ENROLLMENT} from "../../../../utils/constants.js";
import {toOrdinalSuffix} from "../../../../utils/stringHelpers.js";
import {useHistory} from "../../../../../_snowpack/pkg/react-router-dom.js";
import {Avatar} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Metadata} from "../../../../components/Metadata/Metadata.js";
import {Title} from "../../../../components/Typography/Title/Title.js";
import ErrorOutlineIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ErrorOutline.js";
import ScheduleIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Schedule.js";
import {UserContext} from "../../../../providers/UserContext/UserProvider.js";
export const Student = ({student}) => {
  const {me, setMe} = useContext(UserContext);
  const enrollmentLink = `${HOMEROOM + ENROLLMENT}/${student.student_id}`;
  const homeroomLink = `${HOMEROOM}/${student.student_id}`;
  const history = useHistory();
  const [circleData, setCircleData] = useState();
  const blue = "#2B9EB7";
  const linkChecker = () => {
    const {applications, packets} = student;
    const currApplication = applications.at(0);
    const currPacket = packets?.at(0);
    if (currApplication && currApplication?.status === "Submitted") {
      return HOMEROOM;
    } else if (currApplication && currApplication?.status === "Accepted" && (packets && currPacket?.status === "Not Started")) {
      return enrollmentLink;
    } else if (currApplication && currApplication?.status === "Accepted" && currPacket && currPacket?.status === "Started") {
      return enrollmentLink;
    } else if (currApplication && currApplication?.status === "Accepted" && (currPacket && currPacket?.status === "Submitted" || currPacket?.status === "Missing Info" || currPacket?.status === "Accepted")) {
      return homeroomLink;
    }
  };
  const toolTipLinkChecker = () => {
    const {applications, packets} = student;
    const currApplication = applications.at(0);
    const currPacket = packets?.at(0);
    if (currApplication && currApplication?.status === "Submitted") {
      return HOMEROOM;
    } else if (currApplication && currApplication?.status === "Accepted" && (packets && currPacket?.status === "Not Started")) {
      return enrollmentLink;
    } else if (currApplication && currApplication?.status === "Accepted" && currPacket && currPacket?.status === "Started") {
      return enrollmentLink;
    } else if (currApplication && currApplication?.status === "Accepted" && (currPacket && currPacket?.status === "Missing Info")) {
      return enrollmentLink;
    }
  };
  const [showToolTip, setShowToolTip] = useState(true);
  const [link, setLink] = useState(linkChecker());
  const [toolTipLink] = useState(toolTipLinkChecker());
  useEffect(() => {
    progress();
  }, []);
  const progress = () => {
    const {applications, packets} = student;
    const currApplication = applications.at(0);
    const currPacket = packets?.at(0);
    if (currApplication && currApplication?.status === "Submitted") {
      setCircleData({
        color: blue,
        progress: 25,
        message: "Application Pending Approval",
        icon: /* @__PURE__ */ React.createElement(ScheduleIcon, {
          sx: {color: blue, marginTop: 2, cursor: "pointer"},
          onClick: () => history.push(toolTipLink)
        })
      });
    } else if (currApplication && currApplication?.status === "Accepted" && (packets && (currPacket?.status === "Not Started" || currPacket?.status === "Missing Info"))) {
      if (currPacket?.status === "Not Started") {
        setCircleData({
          color: MTHORANGE,
          progress: 50,
          message: "Please Submit an Enrollment Packet",
          icon: /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
            sx: {color: MTHORANGE, marginTop: 2, cursor: "pointer"},
            onClick: () => history.push(toolTipLink)
          })
        });
      } else {
        setCircleData({
          color: MTHORANGE,
          progress: 50,
          message: "Please Resubmit Enrollment Packet",
          icon: /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
            sx: {color: MTHORANGE, marginTop: 2, cursor: "pointer"},
            onClick: () => history.push(toolTipLink)
          })
        });
      }
    } else if (currApplication && currApplication?.status === "Accepted" && currPacket && currPacket?.status === "Started") {
      setCircleData({
        color: MTHORANGE,
        progress: 50,
        message: "Finish Submitting Enrollment Packet",
        icon: /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
          sx: {color: MTHORANGE, marginTop: 2, cursor: "pointer"},
          onClick: () => history.push(toolTipLink)
        })
      });
    } else if (currApplication && currApplication?.status === "Accepted" && currPacket && currPacket?.status === "Submitted") {
      setCircleData({
        color: blue,
        progress: 50,
        message: "Enrollment Packet Pending Approval",
        icon: /* @__PURE__ */ React.createElement(ScheduleIcon, {
          sx: {color: blue, marginTop: 2, cursor: "pointer"},
          onClick: () => history.push(toolTipLink)
        })
      });
    } else {
      setShowToolTip(false);
    }
  };
  const gradeText = student.grade_levels.at(-1).grade_level !== "Kin" ? `${toOrdinalSuffix(student.grade_levels.at(-1).grade_level)} Grade` : "Kindergarten";
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {marginX: 2}
  }, /* @__PURE__ */ React.createElement(Metadata, {
    title: /* @__PURE__ */ React.createElement(Title, null, student.person.first_name),
    subtitle: /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Subtitle, {
      size: "large"
    }, gradeText), showToolTip && /* @__PURE__ */ React.createElement(React.Fragment, null, circleData?.icon, /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium",
      color: circleData?.color
    }, circleData?.message))),
    image: /* @__PURE__ */ React.createElement(Avatar, {
      sx: {
        height: 150,
        width: 150,
        borderRadius: 6,
        cursor: "pointer"
      },
      alt: "Remy Sharp",
      variant: "rounded",
      onClick: () => {
        setMe({
          ...me,
          currentTab: 0
        });
        history.push(link);
      }
    }),
    rounded: true,
    verticle: true
  }));
};
