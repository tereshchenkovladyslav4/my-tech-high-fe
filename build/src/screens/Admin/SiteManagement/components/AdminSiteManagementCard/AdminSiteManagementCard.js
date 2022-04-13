import {Card, CardMedia, CardContent, Box, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import EastIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/East.js";
import {useHistory} from "../../../../../../_snowpack/pkg/react-router-dom.js";
export const AdminSiteManagementCard = ({title, link, img, subTitle}) => {
  const history = useHistory();
  return /* @__PURE__ */ React.createElement(Card, {
    sx: {
      cursor: "pointer",
      borderRadius: 2,
      marginX: 4
    },
    onClick: () => history.push(link)
  }, /* @__PURE__ */ React.createElement(CardMedia, {
    component: "img",
    src: img
  }), /* @__PURE__ */ React.createElement(CardContent, {
    sx: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "flex-start"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    textAlign: "start"
  }, /* @__PURE__ */ React.createElement(Typography, {
    fontSize: "20px",
    component: "div"
  }, title), /* @__PURE__ */ React.createElement(Typography, {
    color: "#A1A1A1",
    fontSize: "16px",
    fontWeight: "700px"
  }, subTitle)), /* @__PURE__ */ React.createElement(EastIcon, null)));
};
