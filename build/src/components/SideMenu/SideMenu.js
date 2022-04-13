import {List, ListItem, Box, ListItemButton} from "../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useEffect, useState} from "../../../_snowpack/pkg/react.js";
import CreditCardRoundedIcon from "../../../_snowpack/pkg/@mui/icons-material/CreditCardRounded.js";
import CallMadeRoundedIcon from "../../../_snowpack/pkg/@mui/icons-material/CallMadeRounded.js";
import SettingsRoundedIcon from "../../../_snowpack/pkg/@mui/icons-material/SettingsRounded.js";
import {Logo} from "../SVG/Logo.js";
import {Paragraph} from "../Typography/Paragraph/Paragraph.js";
import BackupTableIcon from "../../../_snowpack/pkg/@mui/icons-material/BackupTable.js";
import {useStyles} from "./styles.js";
import {NavLink, useHistory, useLocation} from "../../../_snowpack/pkg/react-router-dom.js";
import {
  ACTIVELINKBACKGROUND,
  ANNOUNCEMENTS,
  CALENDAR,
  CURRICULUM,
  DASHBOARD,
  ENROLLMENT,
  HOMEROOM,
  PARENT_LINK,
  RECORDS,
  REIMBURSMENTS,
  REPORTS,
  SETTINGS,
  USERS
} from "../../utils/constants.js";
import {UserContext} from "../../providers/UserContext/UserProvider.js";
import {AuthContext} from "../../providers/AuthProvider/AuthContext.js";
import LogoutIcon from "../../../_snowpack/pkg/@mui/icons-material/Logout.js";
import PeopleAltOutlinedIcon from "../../../_snowpack/pkg/@mui/icons-material/PeopleAltOutlined.js";
import AllInboxOutlinedIcon from "../../../_snowpack/pkg/@mui/icons-material/AllInboxOutlined.js";
import DatRangeOutlinedIcon from "../../../_snowpack/pkg/@mui/icons-material/DateRangeOutlined.js";
import DescriptionIcon from "../../../_snowpack/pkg/@mui/icons-material/Description.js";
import {map, some} from "../../../_snowpack/pkg/lodash.js";
const noSidebarUsers = [15, 14, 16, 11, 9, 10, 13, 12];
export const SideMenu = () => {
  const history = useHistory();
  const classes = useStyles;
  const location = useLocation();
  const {me, setMe} = useContext(UserContext);
  const isActive = () => location.pathname.includes("homeroom");
  const [authorizedList, setAuthorizedList] = useState([]);
  const checkAdminAccessOnSidebar = (label) => {
    const adminAccessArr = me.userAccess;
    const role = some(adminAccessArr, (access) => access?.accessDetail?.name === label);
    if (role) {
      return me.level;
    } else {
      -1;
    }
  };
  const navigationList = [
    {
      to: ANNOUNCEMENTS,
      label: "Announcements",
      icon: /* @__PURE__ */ React.createElement(AllInboxOutlinedIcon, {
        style: classes.logos
      }),
      access: [7, checkAdminAccessOnSidebar("Announcements")]
    },
    {
      to: CALENDAR,
      label: "Calender",
      icon: /* @__PURE__ */ React.createElement(DatRangeOutlinedIcon, {
        style: classes.logos
      }),
      access: [7, checkAdminAccessOnSidebar("Calender")]
    },
    {
      to: CURRICULUM,
      label: "Curriculum",
      icon: /* @__PURE__ */ React.createElement(AllInboxOutlinedIcon, {
        style: classes.logos
      }),
      access: [6, 8, checkAdminAccessOnSidebar("Curriculum")]
    },
    {
      to: ENROLLMENT,
      label: "Enrollment",
      icon: /* @__PURE__ */ React.createElement(BackupTableIcon, {
        style: classes.logos
      }),
      access: [4, checkAdminAccessOnSidebar("Enrollment")]
    },
    {
      to: HOMEROOM,
      label: "Homeroom",
      icon: /* @__PURE__ */ React.createElement(PeopleAltOutlinedIcon, {
        style: classes.logos
      }),
      access: [5, 15, checkAdminAccessOnSidebar("Homeroom Resources")]
    },
    {
      to: PARENT_LINK,
      label: "Quick Link",
      icon: /* @__PURE__ */ React.createElement(CallMadeRoundedIcon, {
        style: classes.logos
      }),
      access: [15, checkAdminAccessOnSidebar("Parent Link")]
    },
    {
      to: RECORDS,
      label: "Records",
      icon: /* @__PURE__ */ React.createElement(CallMadeRoundedIcon, {
        style: classes.logos
      }),
      access: [4, 6, 8, checkAdminAccessOnSidebar("Records")]
    },
    {
      to: REIMBURSMENTS,
      label: "Reimbursements & Direct Orders",
      icon: /* @__PURE__ */ React.createElement(CreditCardRoundedIcon, {
        style: classes.logos
      }),
      access: [3, 15, checkAdminAccessOnSidebar("Reimbursements & Direct Orders")]
    },
    {
      to: REPORTS,
      label: "Reports",
      icon: /* @__PURE__ */ React.createElement(CallMadeRoundedIcon, {
        style: classes.logos
      }),
      access: [6, 8, checkAdminAccessOnSidebar("Reports")]
    },
    {
      to: USERS,
      label: "Users",
      icon: /* @__PURE__ */ React.createElement(PeopleAltOutlinedIcon, {
        style: classes.logos
      }),
      access: [2]
    }
  ];
  useEffect(() => {
    const updatedList = [];
    map(navigationList, (item) => {
      const listed = item.access.some((level) => level === Number(me?.role?.level));
      if (listed)
        updatedList.push(item);
    });
    setAuthorizedList(updatedList);
  }, []);
  const {signOut} = useContext(AuthContext);
  const [unauthorizedAtAll, setUnauthorizedAtAll] = useState(true);
  useEffect(() => {
    const isUnauthorized = noSidebarUsers.some((level) => {
      return level === Number(me?.role?.level);
    });
    setUnauthorizedAtAll(isUnauthorized);
  }, []);
  const logout = () => {
    setMe(null);
    signOut();
    history.push(DASHBOARD);
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: classes.container
  }, /* @__PURE__ */ React.createElement("nav", {
    "aria-label": "secondary mailbox folders",
    style: classes.navbar
  }, /* @__PURE__ */ React.createElement(List, {
    style: classes.navbar
  }, /* @__PURE__ */ React.createElement(ListItem, {
    disablePadding: true,
    style: classes.myTechHigh,
    onClick: () => history.push(DASHBOARD)
  }, /* @__PURE__ */ React.createElement(ListItemButton, {
    component: "a"
  }, /* @__PURE__ */ React.createElement(Logo, {
    style: classes.logos
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    fontFamily: "Helvetica",
    size: "medium",
    fontWeight: "bold"
  }, " ", "MY TECH HIGH"))), /* @__PURE__ */ React.createElement(NavLink, {
    exact: true,
    to: DASHBOARD,
    style: classes.navLink,
    activeStyle: {
      backgroundColor: ACTIVELINKBACKGROUND,
      color: "#4145FF"
    }
  }, /* @__PURE__ */ React.createElement(ListItem, {
    disablePadding: true,
    style: {backgroundColor: "inherit"}
  }, /* @__PURE__ */ React.createElement(ListItemButton, {
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DescriptionIcon, {
    style: classes.logos
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, "Dashboard")))), map(authorizedList, (item, index) => item.label !== "Homeroom" ? /* @__PURE__ */ React.createElement(NavLink, {
    key: index,
    exact: true,
    to: item.to,
    style: classes.navLink,
    activeStyle: {
      backgroundColor: ACTIVELINKBACKGROUND,
      color: "#4145FF"
    }
  }, /* @__PURE__ */ React.createElement(ListItem, {
    disablePadding: true,
    style: {backgroundColor: "inherit"}
  }, /* @__PURE__ */ React.createElement(ListItemButton, {
    style: {textDecoration: "none"}
  }, item.icon, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, item.label)))) : /* @__PURE__ */ React.createElement(NavLink, {
    key: index,
    exact: true,
    to: item.to,
    style: (classes.navLink, {color: isActive() ? "#4145FF" : "#CCC", textDecoration: "none"}),
    activeStyle: {
      backgroundColor: ACTIVELINKBACKGROUND,
      color: "#4145FF"
    }
  }, /* @__PURE__ */ React.createElement(ListItem, {
    disablePadding: true,
    style: {backgroundColor: "inherit"}
  }, /* @__PURE__ */ React.createElement(ListItemButton, {
    style: {textDecoration: "none"}
  }, item.icon, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, item.label))))), /* @__PURE__ */ React.createElement(NavLink, {
    exact: true,
    to: SETTINGS,
    style: classes.navLink,
    activeStyle: {
      backgroundColor: ACTIVELINKBACKGROUND,
      color: "#4145FF"
    }
  }, /* @__PURE__ */ React.createElement(ListItem, {
    disablePadding: true,
    style: {backgroundColor: "inherit"}
  }, /* @__PURE__ */ React.createElement(ListItemButton, null, /* @__PURE__ */ React.createElement(SettingsRoundedIcon, {
    style: classes.logos
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, "Settings")))), /* @__PURE__ */ React.createElement(ListItem, {
    disablePadding: true,
    style: {position: "absolute", bottom: 20},
    onClick: () => logout()
  }, /* @__PURE__ */ React.createElement(ListItemButton, null, /* @__PURE__ */ React.createElement(LogoutIcon, {
    style: classes.logos,
    sx: {color: "#CCC"}
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    color: "#CCCCCC"
  }, "Sign Out"))))));
};
