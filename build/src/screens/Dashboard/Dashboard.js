import React, {useEffect, useState} from "../../../_snowpack/pkg/react.js";
import {HomeroomGrade} from "./HomeroomGrade/HomeroomGrade.js";
import {Calendar} from "./Calendar/Calendar.js";
import {ToDo} from "./ToDoList/ToDo.js";
import {Announcements} from "./Announcements/Announcements.js";
import {Box} from "../../../_snowpack/pkg/@mui/system.js";
import {Avatar, AvatarGroup, Button, Card, Grid, TextField} from "../../../_snowpack/pkg/@mui/material.js";
import {Table} from "../../components/Table/Table.js";
import {Metadata} from "../../components/Metadata/Metadata.js";
import ChevronLeftIcon from "../../../_snowpack/pkg/@mui/icons-material/ChevronLeft.js";
import SearchIcon from "../../../_snowpack/pkg/@mui/icons-material/Search.js";
import {Subtitle} from "../../components/Typography/Subtitle/Subtitle.js";
import {Paragraph} from "../../components/Typography/Paragraph/Paragraph.js";
import {SegmentedControl} from "../../components/SegmentedControl/SegmentedControl.js";
import {CSSTransition, TransitionGroup} from "../../../_snowpack/pkg/react-transition-group.js";
export const imageA = "https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-facebook-1.jpg?quality=85";
export const imageB = "https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=0hb44OrI";
export const imageC = "https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg";
export const Dashboard = () => {
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [inProp, setInProp] = useState(false);
  const avatarGroup = /* @__PURE__ */ React.createElement(AvatarGroup, {
    max: 4,
    spacing: 0
  }, /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Remy Sharp"
  }), /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Travis Howard"
  }), /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Cindy Baker"
  }), /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Agnes Walker"
  }));
  const data = [
    {
      date: /* @__PURE__ */ React.createElement(Metadata, {
        title: "2:11 PM",
        subtitle: "September 12"
      }),
      age: /* @__PURE__ */ React.createElement(Subtitle, {
        fontWeight: "500"
      }, "Highlighting our new MTH Game Maker course!"),
      avatars: avatarGroup,
      description: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium"
      }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore Read More")
    },
    {
      date: /* @__PURE__ */ React.createElement(Metadata, {
        title: "2:11 PM",
        subtitle: "September 12"
      }),
      age: /* @__PURE__ */ React.createElement(Subtitle, {
        fontWeight: "500"
      }, "Highlighting our new MTH Game Maker course!"),
      avatars: avatarGroup,
      description: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium"
      }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore Read More")
    },
    {
      date: /* @__PURE__ */ React.createElement(Metadata, {
        title: "2:11 PM",
        subtitle: "September 12"
      }),
      age: /* @__PURE__ */ React.createElement(Subtitle, {
        fontWeight: "500"
      }, "Highlighting our new MTH Game Maker course!"),
      avatars: avatarGroup,
      description: /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium"
      }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore Read More")
    }
  ];
  useEffect(() => {
    setInProp(!inProp);
  }, [showAnnouncements]);
  return !showAnnouncements ? /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2,
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 11
  }, /* @__PURE__ */ React.createElement(HomeroomGrade, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 11
  }, /* @__PURE__ */ React.createElement(Calendar, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 11
  }, /* @__PURE__ */ React.createElement(ToDo, null))), /* @__PURE__ */ React.createElement(Card, {
    style: {
      width: 300,
      marginRight: 25,
      borderRadius: 12
    }
  }, /* @__PURE__ */ React.createElement(Announcements, {
    expandAnnouncments: () => setShowAnnouncements(true)
  }))) : /* @__PURE__ */ React.createElement(TransitionGroup, null, /* @__PURE__ */ React.createElement(CSSTransition, {
    in: inProp,
    timeout: 1e3,
    classNames: "my-node"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2,
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 11
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    marginTop: 2
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 11
  }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    marginTop: 2,
    justifyContent: "space-between",
    marginX: 4
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center"
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setShowAnnouncements(false)
  }, /* @__PURE__ */ React.createElement(ChevronLeftIcon, {
    sx: {marginRight: 0.5, marginLeft: -2.5}
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: {marginRight: 10}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700"
  }, "Parent Announcements")), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(SegmentedControl, null))), /* @__PURE__ */ React.createElement(TextField, {
    InputProps: {
      startAdornment: /* @__PURE__ */ React.createElement(SearchIcon, null)
    }
  })), /* @__PURE__ */ React.createElement(Table, {
    tableBody: data
  })))))));
};
