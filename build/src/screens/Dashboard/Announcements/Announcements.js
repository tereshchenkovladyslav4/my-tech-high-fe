import {Box, Button} from "../../../../_snowpack/pkg/@mui/material.js";
import {Flexbox} from "../../../components/Flexbox/Flexbox.js";
import React, {useState} from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {AnnouncementItem} from "./components/AnnouncementItem/AnnouncementItem.js";
import {map} from "../../../../_snowpack/pkg/lodash.js";
import {EmptyState} from "../../../components/EmptyState/EmptyState.js";
import {SYSTEM_06} from "../../../utils/constants.js";
import {Title} from "../../../components/Typography/Title/Title.js";
import moment from "../../../../_snowpack/pkg/moment.js";
export const Announcements = ({expandAnnouncments}) => {
  const date = new Date();
  console.log();
  const [announcements, setAnnouncements] = useState([
    {
      title: "Highlighting our new MTH Game Maker course!",
      date: moment(date).format("MMMM D")
    },
    {
      title: "Highlighting our new MTH Game Maker course!",
      date: moment(date).format("MMMM D")
    },
    {
      title: "Highlighting our new MTH Game Maker course!",
      date: moment(date).format("MMMM D")
    }
  ]);
  const onClose = (idx) => {
    setAnnouncements(announcements.filter((announement, el) => idx !== el));
  };
  const renderAnnouncements = () => map(announcements, (announcment, idx) => {
    return /* @__PURE__ */ React.createElement(AnnouncementItem, {
      title: announcment.title,
      subtitle: announcment.date,
      onClose: () => onClose(idx)
    });
  });
  return /* @__PURE__ */ React.createElement(Box, {
    paddingY: 1.5,
    paddingX: 3
  }, /* @__PURE__ */ React.createElement(Flexbox, {
    flexDirection: "column",
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "large",
    fontWeight: "700"
  }, "Announcements"), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => expandAnnouncments(true)
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    color: "#4145FF"
  }, "View All"))), announcements.length > 0 ? /* @__PURE__ */ React.createElement(Box, {
    sx: {position: "relative"}
  }, renderAnnouncements()) : /* @__PURE__ */ React.createElement(Box, {
    marginTop: 20
  }, /* @__PURE__ */ React.createElement(EmptyState, {
    title: /* @__PURE__ */ React.createElement(Title, null, "Congrats"),
    subtitle: /* @__PURE__ */ React.createElement(Subtitle, {
      color: SYSTEM_06,
      fontWeight: "700"
    }, "You are all caught up.")
  }))));
};
