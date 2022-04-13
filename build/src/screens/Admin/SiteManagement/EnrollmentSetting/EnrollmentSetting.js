import React from "../../../../../_snowpack/pkg/react.js";
import {Grid} from "../../../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import {Route, Switch, useRouteMatch, useHistory} from "../../../../../_snowpack/pkg/react-router-dom.js";
import {ItemCard} from "../../../../components/ItemCard/ItemCard.js";
import Immunizations from "./Immunizations/Immunizations.js";
import ApplicationQuestionImage from "../../../../assets/schedules.png.proxy.js";
import EnrollmentQuestionImage from "../../../../assets/q&a.png.proxy.js";
import ImmunizationsImage from "../../../../assets/immunizations.png.proxy.js";
import ApplicationQuestions from "./ApplicationQuestions/index.js";
import {Box, IconButton, Typography} from "../../../../../_snowpack/pkg/@mui/material.js";
import ArrowBackIosRoundedIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ArrowBackIosRounded.js";
const EnrollmentSetting = () => {
  const {path, isExact} = useRouteMatch("/site-management/enrollment");
  const history = useHistory();
  const items = [
    {
      id: 1,
      title: "Application Question",
      subtitle: "",
      img: ApplicationQuestionImage,
      isLink: false,
      to: `${path}/application-question`
    },
    {
      id: 2,
      title: "Enrollment Question",
      subtitle: "",
      img: EnrollmentQuestionImage,
      isLink: false,
      to: `${path}/enrollment-question`
    },
    {
      id: 3,
      title: "Immunizations",
      subtitle: "",
      img: ImmunizationsImage,
      isLink: false,
      to: `${path}/immunizations`
    }
  ];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, isExact && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      marginBottom: "52px",
      marginLeft: "32px"
    }
  }, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => history.push("/site-management/"),
    sx: {
      position: "relative",
      bottom: "2px"
    }
  }, /* @__PURE__ */ React.createElement(ArrowBackIosRoundedIcon, {
    sx: {
      fontSize: "15px",
      stroke: "black",
      strokeWidth: 2
    }
  })), /* @__PURE__ */ React.createElement(Typography, {
    paddingLeft: "7px",
    fontSize: "20px",
    fontWeight: "700",
    component: "span"
  }, "Enrollment Settings")), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 4,
    columnSpacing: 0
  }, map(items, (item, idx) => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4,
    key: idx
  }, /* @__PURE__ */ React.createElement(ItemCard, {
    title: item.title,
    subTitle: item.subtitle,
    img: item.img,
    link: item.to
  }))))), /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    path: `${path}/immunizations`
  }, /* @__PURE__ */ React.createElement(Immunizations, null)), /* @__PURE__ */ React.createElement(Route, {
    path: `${path}/application-question`
  }, /* @__PURE__ */ React.createElement(ApplicationQuestions, null))));
};
export {EnrollmentSetting as default};
