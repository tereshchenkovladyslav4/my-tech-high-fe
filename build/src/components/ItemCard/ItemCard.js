import {Box, Card, CardContent, CardMedia, Stack, Typography} from "../../../_snowpack/pkg/@mui/material.js";
import React from "../../../_snowpack/pkg/react.js";
import EastIcon from "../../../_snowpack/pkg/@mui/icons-material/East.js";
import {useHistory} from "../../../_snowpack/pkg/react-router-dom.js";
import AddNewIcon from "../../assets/add-new.png.proxy.js";
import EditIcon from "../../../_snowpack/pkg/@mui/icons-material/Edit.js";
import DehazeIcon from "../../../_snowpack/pkg/@mui/icons-material/Dehaze.js";
import LoginIcon from "../../../_snowpack/pkg/@mui/icons-material/Login.js";
import {SYSTEM_01} from "../../utils/constants.js";
export const ItemCard = ({title, subTitle, img, link, isLink, onClick, action}) => {
  const history = useHistory();
  return /* @__PURE__ */ React.createElement(Card, {
    id: "item-card",
    sx: {
      position: "relative",
      cursor: "pointer",
      borderRadius: 2,
      marginX: 4
    },
    onClick: (e) => {
      isLink !== false ? history.push(link) : onClick();
    }
  }, /* @__PURE__ */ React.createElement(CardMedia, {
    component: "img",
    sx: {minHeight: img ? "auto" : 240},
    src: img
  }), !img && /* @__PURE__ */ React.createElement("img", {
    onClick: () => history.push(link),
    src: AddNewIcon,
    style: {position: "absolute", top: 15, right: 15}
  }), /* @__PURE__ */ React.createElement(CardContent, {
    sx: {textAlign: "left"}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: subTitle ? "center" : "flex-start",
      alignContent: "flex-start"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    fontSize: "20px",
    component: "div"
  }, title), !action && /* @__PURE__ */ React.createElement(EastIcon, {
    sx: {mt: subTitle ? 0 : 0.75}
  })), /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Typography, {
    color: "#A1A1A1",
    fontSize: "16px",
    fontWeight: "700px",
    sx: {visibility: subTitle ? "shown" : "hidden"}
  }, subTitle || "N/A"), action && /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    spacing: 1.5,
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(DehazeIcon, {
    htmlColor: SYSTEM_01
  }), /* @__PURE__ */ React.createElement(EditIcon, {
    htmlColor: SYSTEM_01,
    onClick: (e) => {
      alert(`Edit ${title}`);
      e.stopPropagation();
    }
  }), /* @__PURE__ */ React.createElement(LoginIcon, {
    htmlColor: SYSTEM_01,
    sx: {transform: "rotate(90deg)"},
    onClick: (e) => {
      alert(`Download ${title}`);
      e.stopPropagation();
    }
  })))));
};
