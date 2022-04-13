import {Button} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import React, {useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {useStyles} from "./styles.js";
import {DocumentUploadModal} from "../DocumentUploadModal/DocumentUploadModal.js";
import {DocumentListItem} from "../DocumentList/DocumentListItem.js";
import {filter, map} from "../../../../../../_snowpack/pkg/lodash.js";
export const DocumentUpload = ({title, subtitle, document, handleUpload, file, disabled}) => {
  const classes = useStyles;
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState();
  const handleFile = (fileName) => {
    setFiles(fileName);
  };
  const deleteFile = (currFile) => {
    setFiles(filter(files, (validFile) => validFile !== currFile));
  };
  useEffect(() => {
    handleUpload(document, files);
  }, [files]);
  const renderFiles = (upload) => {
    return upload ? map(files, (curr) => /* @__PURE__ */ React.createElement(DocumentListItem, {
      file: curr,
      closeAction: deleteFile
    })) : map(file, (curr) => /* @__PURE__ */ React.createElement(DocumentListItem, {
      file: curr
    }));
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: classes.container
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, title), files ? renderFiles(true) : renderFiles(false), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.buttonContainer
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, subtitle), /* @__PURE__ */ React.createElement(Button, {
    style: classes.button,
    onClick: () => setOpen(true),
    disabled
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, "Upload"))), open && /* @__PURE__ */ React.createElement(DocumentUploadModal, {
    handleModem: () => setOpen(!open),
    handleFile
  }));
};
