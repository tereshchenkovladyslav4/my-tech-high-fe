import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import CloseIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {useStyles} from "./styles.js";
export const DocumentListItem = ({file, closeAction}) => {
  const classes = useStyles;
  return /* @__PURE__ */ React.createElement(Box, {
    onClick: () => !closeAction && window.open(file.signedUrl),
    display: "flex",
    flexDirection: "row",
    color: "#7B61FF",
    marginTop: "6px"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    sx: classes.text
  }, file.name), closeAction && /* @__PURE__ */ React.createElement(CloseIcon, {
    style: classes.close,
    onClick: () => closeAction(file)
  }));
};
