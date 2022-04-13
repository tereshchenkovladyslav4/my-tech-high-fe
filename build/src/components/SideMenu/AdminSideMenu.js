import {List, ListItem, Box, ListItemButton} from "../../../_snowpack/pkg/@mui/material.js";
import React, {useContext} from "../../../_snowpack/pkg/react.js";
import {Logo} from "../SVG/Logo.js";
import {Paragraph} from "../Typography/Paragraph/Paragraph.js";
import {useStyles} from "./styles.js";
import {NavLink, useHistory, useLocation} from "../../../_snowpack/pkg/react-router-dom.js";
import {map} from "../../../_snowpack/pkg/lodash.js";
import {
  ACTIVELINKBACKGROUND,
  ANNOUNCEMENTS,
  CALENDAR,
  CURRICULUM,
  DASHBOARD,
  ENROLLMENT,
  HOMEROOM,
  REIMBURSMENTS,
  REPORTS,
  SETTINGS,
  SITE_MANAGEMENT,
  RECORDS,
  USERS
} from "../../utils/constants.js";
import {UserContext} from "../../providers/UserContext/UserProvider.js";
import {AuthContext} from "../../providers/AuthProvider/AuthContext.js";
import LogoutIcon from "../../../_snowpack/pkg/@mui/icons-material/Logout.js";
import PeopleAltOutlinedIcon from "../../../_snowpack/pkg/@mui/icons-material/PeopleAltOutlined.js";
import CreditCardRoundedIcon from "../../../_snowpack/pkg/@mui/icons-material/CreditCardRounded.js";
import CallMadeRoundedIcon from "../../../_snowpack/pkg/@mui/icons-material/CallMadeRounded.js";
import BackupTableIcon from "../../../_snowpack/pkg/@mui/icons-material/BackupTable.js";
import AllInboxOutlinedIcon from "../../../_snowpack/pkg/@mui/icons-material/AllInboxOutlined.js";
import DatRangeOutlinedIcon from "../../../_snowpack/pkg/@mui/icons-material/DateRangeOutlined.js";
import SettingsOutlinedIcon from "../../../_snowpack/pkg/@mui/icons-material/SettingsOutlined.js";
import KeyIcon from "../../../_snowpack/pkg/@mui/icons-material/VpnKey.js";
import DescriptionIcon from "../../../_snowpack/pkg/@mui/icons-material/Description.js";
import StorageIcon from "../../../_snowpack/pkg/@mui/icons-material/Storage.js";
export const AdminSideMenu = () => {
  const history = useHistory();
  const classes = useStyles;
  const location = useLocation();
  const isActiveTemp = () => (location.pathname.includes("enrollment") || location.pathname.includes("applications")) && !location.pathname.includes("setting") ? true : false;
  const isActive = (basePath) => {
    const match = basePath.match(/^\/settings/);
    return !!match;
  };
  const {setMe} = useContext(UserContext);
  const {signOut} = useContext(AuthContext);
  const logout = () => {
    setMe(null);
    signOut();
    history.push(DASHBOARD);
  };
  const navigationList = [
    {
      to: DASHBOARD,
      label: "Dashboard",
      icon: /* @__PURE__ */ React.createElement(BackupTableIcon, {
        style: classes.logos
      })
    },
    {
      to: ENROLLMENT,
      label: "Enrollment",
      icon: /* @__PURE__ */ React.createElement(DescriptionIcon, {
        style: classes.logos
      })
    },
    {
      to: REIMBURSMENTS,
      label: "Reimbursements & Direct Orders",
      icon: /* @__PURE__ */ React.createElement(CreditCardRoundedIcon, {
        style: classes.logos
      })
    },
    {
      to: HOMEROOM,
      label: "Homeroom",
      icon: /* @__PURE__ */ React.createElement(BackupTableIcon, {
        style: classes.logos
      })
    },
    {
      to: ANNOUNCEMENTS,
      label: "Announcements",
      icon: /* @__PURE__ */ React.createElement(AllInboxOutlinedIcon, {
        style: classes.logos
      })
    },
    {
      to: CALENDAR,
      label: "Calender",
      icon: /* @__PURE__ */ React.createElement(DatRangeOutlinedIcon, {
        style: classes.logos
      })
    },
    {
      to: CURRICULUM,
      label: "Curriculum",
      icon: /* @__PURE__ */ React.createElement(AllInboxOutlinedIcon, {
        style: classes.logos
      })
    },
    {
      to: REPORTS,
      label: "Reports",
      icon: /* @__PURE__ */ React.createElement(CallMadeRoundedIcon, {
        style: classes.logos
      })
    },
    {
      to: SITE_MANAGEMENT,
      label: "Site Management",
      icon: /* @__PURE__ */ React.createElement(KeyIcon, {
        style: classes.logos
      })
    },
    {
      to: RECORDS,
      label: "Records",
      icon: /* @__PURE__ */ React.createElement(StorageIcon, {
        style: classes.logos
      })
    },
    {
      to: USERS,
      label: "Users",
      icon: /* @__PURE__ */ React.createElement(PeopleAltOutlinedIcon, {
        style: classes.logos
      })
    },
    {
      to: SETTINGS,
      label: "Settings",
      icon: /* @__PURE__ */ React.createElement(SettingsOutlinedIcon, {
        style: classes.logos
      })
    }
  ];
  return /* @__PURE__ */ React.createElement(Box, {
    sx: classes.container
  }, /* @__PURE__ */ React.createElement("nav", {
    "aria-label": "secondary mailbox folders",
    style: classes.navbar
  }, /* @__PURE__ */ React.createElement(List, {
    style: classes.navbar
  }, /* @__PURE__ */ React.createElement(ListItem, {
    disablePadding: true,
    style: classes.myTechHigh
  }, /* @__PURE__ */ React.createElement(ListItemButton, null, /* @__PURE__ */ React.createElement(Logo, {
    style: classes.logos
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    fontFamily: "Helvetica",
    size: "medium",
    fontWeight: "bold"
  }, "MY TECH HIGH"))), map(navigationList, (item, index) => /* @__PURE__ */ React.createElement(NavLink, {
    key: index,
    exact: item.to !== SITE_MANAGEMENT ? true : false,
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
  }, item.label))))), /* @__PURE__ */ React.createElement(ListItem, {
    disablePadding: true,
    style: {position: "absolute", bottom: 20},
    onClick: () => logout()
  }, /* @__PURE__ */ React.createElement(ListItemButton, null, /* @__PURE__ */ React.createElement(LogoutIcon, {
    style: classes.logos,
    sx: {color: "#CCC"}
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    color: "#CCCCCC"
  }, "Logout"))))));
};
