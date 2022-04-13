import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../../../../_snowpack/pkg/lodash.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {DocumentListItem} from "./DocumentListItem.js";
export const DocumentList = ({files}) => {
  const renderFileNames = () => map(files, (file) => /* @__PURE__ */ React.createElement(DocumentListItem, {
    file
  }));
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "700"
  }, "Uploaded"), renderFileNames());
};
