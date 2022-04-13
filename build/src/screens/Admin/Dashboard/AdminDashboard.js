import {Avatar, AvatarGroup, Box, Card, Divider, Grid, IconButton, TextField} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useEffect, useState} from "../../../../_snowpack/pkg/react.js";
import {SchoolEnrollment} from "./SchoolEnrollment/SchoolEnrollment.js";
import {Homeroom} from "./Homeroom/Homeroom.js";
import {SchoolYear} from "./SchoolYear/SchoolYear.js";
import {SegmentedControl} from "../../../components/SegmentedControl/SegmentedControl.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {Metadata} from "../../../components/Metadata/Metadata.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {imageA, imageB, imageC} from "../../Dashboard/Dashboard.js";
import ChevronLeftIcon from "../../../../_snowpack/pkg/@mui/icons-material/ChevronLeft.js";
import SearchIcon from "../../../../_snowpack/pkg/@mui/icons-material/Search.js";
import {Table} from "../../../components/Table/Table.js";
import {UserContext} from "../../../providers/UserContext/UserProvider.js";
import {ToDo} from "./ToDoList/ToDo.js";
export const AdminDashboard = () => {
  const {me} = useContext(UserContext);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [isSuper, setIsSuper] = useState(null);
  useEffect(() => {
    if (me) {
      setIsSuper(Number(me?.role?.level) === 1);
      setShowAnnouncements(Number(me?.role?.level) === 1);
    }
  }, [me]);
  const avatarGroup = /* @__PURE__ */ React.createElement(AvatarGroup, {
    max: 4,
    spacing: 1
  }, /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Remy Sharp",
    src: imageA
  }), /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Travis Howard",
    src: imageB
  }), /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Cindy Baker",
    src: imageC
  }), /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Agnes Walker",
    src: imageA
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
  return showAnnouncements ? /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 8,
    sx: {paddingX: 2, my: 4}
  }, /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 5
  }, /* @__PURE__ */ React.createElement(SchoolYear, null)), /* @__PURE__ */ React.createElement(ToDo, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Card, {
    style: {
      width: 300,
      marginRight: 25,
      borderRadius: 12,
      marginTop: 30,
      marginBottom: 30,
      paddingTop: 24,
      paddingBottom: 24
    }
  }, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SchoolEnrollment, null), /* @__PURE__ */ React.createElement(Divider, {
    sx: {marginY: "12px"}
  }), /* @__PURE__ */ React.createElement(Homeroom, null))))) : /* @__PURE__ */ React.createElement(Box, {
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
  }, /* @__PURE__ */ React.createElement(IconButton, {
    sx: {marginRight: 0.5, marginLeft: -2.5},
    onClick: () => setShowAnnouncements(false)
  }, /* @__PURE__ */ React.createElement(ChevronLeftIcon, null)), /* @__PURE__ */ React.createElement(Box, {
    sx: {marginRight: 10}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700"
  }, "Parent Announcements")), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(SegmentedControl, null))), /* @__PURE__ */ React.createElement(TextField, {
    inputMode: "search",
    size: "small",
    InputProps: {
      startAdornment: /* @__PURE__ */ React.createElement(SearchIcon, null)
    }
  })), /* @__PURE__ */ React.createElement(Table, {
    tableBody: data
  })))));
};
