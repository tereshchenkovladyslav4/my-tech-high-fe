import {Box, Button, Modal} from "../../../../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {useStyles} from "./styles.js";
import UploadFileIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/UploadFile.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {RED, SYSTEM_06} from "../../../../../utils/constants.js";
import {DocumentListItem} from "../DocumentList/DocumentListItem.js";
import {filter, includes, map, pull} from "../../../../../../_snowpack/pkg/lodash.js";
export const DocumentUploadModal = ({
  handleModem,
  handleFile,
  limit
}) => {
  const classes = useStyles;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletedFiles, setDeletedFiles] = useState([]);
  useEffect(() => {
    let filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    const filterDeletedFiles = filter(filteredArr, (file) => !deletedFiles.includes(file));
    setValidFiles([...filterDeletedFiles]);
  }, [selectedFiles]);
  const preventDefault = (e) => {
    e.preventDefault();
  };
  const dragOver = (e) => {
    preventDefault(e);
  };
  const dragEnter = (e) => {
    preventDefault(e);
  };
  const dragLeave = (e) => {
    preventDefault(e);
  };
  const fileDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    addDeletedFiles(files);
    if (limit && files.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`);
    } else {
      handleFiles(files);
    }
  };
  const filesSelected = (e) => {
    setErrorMessage("");
    const files = e.target.files;
    addDeletedFiles(files);
    handleFiles(files);
  };
  const addDeletedFiles = (files) => {
    map(files, (file) => {
      if (includes(JSON.stringify(deletedFiles), JSON.stringify(file))) {
        setDeletedFiles((prev) => {
          const newFiles = [...prev];
          pull(newFiles, deletedFiles[0]);
          return newFiles;
        });
      }
    });
  };
  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = validateFile(files[i]);
      if (file.status === true) {
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
      } else {
        files[i]["invalid"] = true;
        setErrorMessage(file.message);
      }
    }
  };
  const validateFile = (file) => {
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/gif", "image/bmp"];
    if (Math.round(file.size / 1024) > 25e3) {
      return {
        status: false,
        message: "This file exceeds maximum allowed size of 25 MB"
      };
    }
    if (validTypes.indexOf(file.type) === -1) {
      return {
        status: false,
        message: "Please only submit pdf, jpeg, or png"
      };
    }
    return {
      status: true
    };
  };
  const submitAndClose = () => {
    handleFile(validFiles);
    handleModem();
  };
  const deleteFile = (file) => {
    setValidFiles(filter(validFiles, (validFile) => validFile !== file));
    setDeletedFiles((prev) => [...prev, file]);
  };
  const renderFiles = () => map(validFiles, (file) => /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(DocumentListItem, {
    file,
    closeAction: deleteFile
  })));
  return /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem(),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }, validFiles.length > 0 && /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "700"
  }, "Uploaded"), renderFiles())), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    onDragOver: dragOver,
    onDragEnter: dragEnter,
    onDragLeave: dragLeave,
    onDrop: fileDrop
  }, /* @__PURE__ */ React.createElement(UploadFileIcon, null), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "700",
    sx: classes.dragAndDropText
  }, "Drag & Drop to Upload"), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    color: SYSTEM_06
  }, " Or"), /* @__PURE__ */ React.createElement(Button, {
    sx: classes.uploadButton,
    variant: "contained"
  }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("input", {
    type: "file",
    onSubmit: () => window.alert("h"),
    style: classes.input,
    onChange: filesSelected,
    multiple: true,
    accept: "application/pdf, image/png, image/jpeg, image/gif, image/bmp",
    onClick: (event) => {
      event.currentTarget.value = "";
    }
  }), "Browse Files")), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "700",
    color: RED
  }, errorMessage)), /* @__PURE__ */ React.createElement(Box, {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: classes.cancelButton,
    variant: "contained",
    onClick: () => handleModem()
  }, "Cancel"), validFiles.length > 0 && /* @__PURE__ */ React.createElement(Button, {
    sx: classes.finishButton,
    variant: "contained",
    onClick: () => submitAndClose()
  }, "Finish"))));
};
