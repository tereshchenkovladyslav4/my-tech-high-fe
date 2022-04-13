import {Card, CardMedia, CardContent} from "../../../../../../_snowpack/pkg/@mui/material.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import EastIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/East.js";
import {useHistory} from "../../../../../../_snowpack/pkg/react-router-dom.js";
export const AdminEnrollmentCard = ({
  title,
  link,
  img
}) => {
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
      alignContent: "center"
    }
  }, /* @__PURE__ */ React.createElement(Subtitle, null, title), /* @__PURE__ */ React.createElement(EastIcon, null)));
};
