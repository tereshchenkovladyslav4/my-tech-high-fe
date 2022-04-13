import ArrowBackIosOutlinedIcon from "../../../../_snowpack/pkg/@mui/icons-material/ArrowBackIosOutlined.js";
import {Box, ButtonBase, Grid, Typography} from "../../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../../_snowpack/pkg/lodash.js";
import React, {useState} from "../../../../_snowpack/pkg/react.js";
import {Route, Switch, useRouteMatch} from "../../../../_snowpack/pkg/react-router-dom.js";
import DirectOrdersImage from "../../../assets/direct-orders.png.proxy.js";
import EmailTemplateImage from "../../../assets/email-template.png.proxy.js";
import EnrollmentImg from "../../../assets/enrollment.png.proxy.js";
import HomeRoomImage from "../../../assets/homeroom.png.proxy.js";
import QuickLinkImage from "../../../assets/quick-link.png.proxy.js";
import ReEnrollLinkImage from "../../../assets/re-enroll.png.proxy.js";
import ProgramSettingImage from "../../../assets/program-setting.png.proxy.js";
import QAImage from "../../../assets/q&a.png.proxy.js";
import RequestConsultationImage from "../../../assets/request-consultation.png.proxy.js";
import YearstImg from "../../../assets/schedules.png.proxy.js";
import SchoolPartnerImage from "../../../assets/schoolAssignments.png.proxy.js";
import {ItemCard} from "../../../components/ItemCard/ItemCard.js";
import EnrollmentSetting from "./EnrollmentSetting/EnrollmentSetting.js";
import {ProgramSetting} from "./ProgramSetting/index.js";
import QuickLink from "./QuickLink/QuickLink.js";
import Withdrawal from "./Withdrawal/Withdrawal.js";
import Years from "./Years/Years.js";
import {EmailTemplatePage} from "./components/EmailTemplates/EmailTemplatePage.js";
const SiteManagement = () => {
  const {path, isExact} = useRouteMatch("/site-management");
  const [currentView, setCurrentView] = useState("root");
  const [prevView, setPrevView] = useState([]);
  const [selected, setSelected] = useState(null);
  const [prevSelected, setPrevSelected] = useState([]);
  const items = [
    {
      id: 1,
      title: "Years",
      subtitle: "2021-22",
      img: YearstImg,
      isLink: false,
      to: `years`
    },
    {
      id: 2,
      title: "Email Templates",
      subtitle: "",
      img: EmailTemplateImage,
      isLink: false,
      to: `email-template`
    },
    {
      id: 3,
      title: "Reimbursements and Direct orders",
      subtitle: "",
      img: DirectOrdersImage,
      isLink: false,
      to: `direct-order`
    },
    {
      id: 4,
      title: "School Partners",
      subtitle: "Add and Edit",
      isLink: false,
      img: SchoolPartnerImage,
      to: `school-partner`
    },
    {
      id: 5,
      title: "Enrollment Setting",
      subtitle: "Applications, Packets, Immunization",
      img: EnrollmentImg,
      isLink: true,
      to: `enrollment`
    },
    {
      id: 6,
      title: "Homeroom",
      subtitle: "",
      img: HomeRoomImage,
      isLink: false,
      to: `homeroom`
    },
    {
      id: 7,
      title: "Program Settings",
      subtitle: "",
      isLink: true,
      img: ProgramSettingImage,
      to: `program-setting`
    },
    {
      id: 8,
      title: "Quick Links",
      subtitle: "",
      img: QuickLinkImage,
      isLink: false,
      to: `quick-links`
    },
    {
      id: 9,
      title: "Re-enroll",
      subtitle: "",
      isLink: false,
      img: ReEnrollLinkImage,
      to: `re-enroll`
    }
  ];
  const quickLinks = [
    {
      id: 1,
      action: true,
      title: "Q&A Help",
      subtitle: "Subheadline_Entry",
      img: QAImage,
      isLink: false,
      to: `q&a`
    },
    {
      id: 2,
      action: true,
      title: "Request a Transcript",
      subtitle: "Subheadline_Entry",
      img: QAImage,
      isLink: false,
      to: `request-transcript`
    },
    {
      id: 3,
      action: true,
      title: "Request Consultations",
      subtitle: "Subheadline_Entry",
      img: RequestConsultationImage,
      isLink: false,
      to: `request-consultation`
    },
    {
      id: 4,
      action: true,
      title: "Special Ed Referral",
      subtitle: "Subheadline_Entry",
      isLink: false,
      img: RequestConsultationImage,
      to: `special-ed`
    },
    {
      id: 5,
      action: true,
      title: "Student Success Story ",
      subtitle: "Subheadline_Entry",
      img: QAImage,
      isLink: false,
      to: `student-success-story`
    },
    {
      id: 6,
      action: true,
      title: "Withdrawal",
      subtitle: "Subheadline_Entry",
      img: QAImage,
      isLink: false,
      to: `withdrawal`
    },
    {
      id: 7,
      action: true,
      title: "Add New",
      subtitle: "Subtitle",
      img: "",
      isLink: false,
      to: `add-new-link`
    }
  ];
  const onBackPress = () => {
    if (prevView.length === 1) {
      setCurrentView(prevView[0]);
      setPrevView([]);
      setPrevSelected([]);
      setSelected(null);
    } else {
      setCurrentView(prevView[prevView.length - 1]);
      setSelected(prevSelected[prevSelected.length - 1]);
      const updatedPrevView = prevView;
      const updatedPrevSelected = prevSelected;
      updatedPrevView.splice(prevView.length - 1, 1);
      updatedPrevSelected.splice(prevSelected.length - 1, 1);
      setPrevView(updatedPrevView);
      setPrevSelected(updatedPrevSelected);
    }
  };
  const BackHeader = () => /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    sx: {
      p: 2,
      width: currentView !== "quick-links" ? "95%" : "auto",
      margin: "auto",
      background: currentView !== "quick-links" ? "#fff" : "inherit"
    }
  }, /* @__PURE__ */ React.createElement(ButtonBase, {
    onClick: onBackPress,
    sx: {p: 1},
    disableRipple: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "flex-start",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(ArrowBackIosOutlinedIcon, null), /* @__PURE__ */ React.createElement(Typography, {
    sx: {fontWeight: 700, fontSize: 20, ml: 1}
  }, selected?.title))));
  const renderCardsHandler = (items2) => /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 4,
    columnSpacing: 0
  }, map(items2, (item, idx) => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4,
    key: idx
  }, /* @__PURE__ */ React.createElement(ItemCard, {
    title: item.title,
    subTitle: item.subtitle,
    img: item.img,
    isLink: item.isLink,
    link: "/site-management/" + item.to,
    action: item?.action,
    onClick: () => {
      setPrevView((prevView2) => [...prevView2, currentView]);
      setCurrentView(item.to);
      setPrevSelected((prevSelected2) => [...prevSelected2, selected]);
      setSelected(item);
    }
  }))));
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {px: 1, my: 4}
  }, currentView !== "root" && currentView !== "email-template" && /* @__PURE__ */ React.createElement(BackHeader, null), isExact && (currentView === "root" ? renderCardsHandler(items) : currentView === "quick-links" ? renderCardsHandler(quickLinks) : currentView === "withdrawal" ? /* @__PURE__ */ React.createElement(Withdrawal, null) : currentView === "years" ? /* @__PURE__ */ React.createElement(Years, null) : currentView === "program-settifng" ? /* @__PURE__ */ React.createElement(ProgramSetting, null) : currentView === "add-new-link" ? /* @__PURE__ */ React.createElement(QuickLink, null) : currentView === "email-template" && /* @__PURE__ */ React.createElement(EmailTemplatePage, {
    onBackPress
  })), /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    path: `/site-management/enrollment`
  }, /* @__PURE__ */ React.createElement(EnrollmentSetting, null)), /* @__PURE__ */ React.createElement(Route, {
    exact: true,
    path: `/site-management/program-setting`
  }, /* @__PURE__ */ React.createElement(ProgramSetting, null))));
};
export {SiteManagement as default};
