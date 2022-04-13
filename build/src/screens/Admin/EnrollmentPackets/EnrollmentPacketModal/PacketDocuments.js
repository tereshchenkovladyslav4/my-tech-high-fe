import React, {useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {Grid} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {SYSTEM_06, SYSTEM_01, PRIMARY_MEDIUM_MOUSEOVER} from "../../../../utils/constants.js";
import {useMutation, useQuery} from "../../../../../_snowpack/pkg/@apollo/client.js";
import {deletePacketDocumentFileMutation, getPacketFiles} from "../services.js";
import {useStyles} from "./styles.js";
import DeleteIcon from "../../../../assets/icons/icon-delete-small.svg.proxy.js";
import CustomModal from "../../SiteManagement/EnrollmentSetting/ApplicationQuestions/CustomModals.js";
export const EnrollmentPacketDocument = ({packetData}) => {
  const classes = useStyles;
  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [deleteFile] = useMutation(deletePacketDocumentFileMutation);
  const {loading, error, data, refetch} = useQuery(getPacketFiles, {
    variables: {
      fileIds
    },
    fetchPolicy: "network-only"
  });
  const onDeletefile = (id) => {
    setOpenConfirmModal(true);
    setSelectedFileId(id);
  };
  const onDeleteConfirm = async () => {
    await deleteFile({variables: {fileId: `${selectedFileId}`}});
    refetch();
    setOpenConfirmModal(false);
  };
  useEffect(() => {
    if (packetData.files.length > 0) {
      const ids = [];
      for (const packetfile of packetData.files) {
        ids.push(packetfile.mth_file_id);
      }
      setFileIds(ids.toString());
    }
  }, [packetData]);
  useEffect(() => {
    if (data !== void 0) {
      const filesData = [];
      if (packetData.files.length > 0) {
        for (const packetfile of packetData.files) {
          if (packetfile.kind === "bc" || packetfile.kind === "ur" || packetfile.kind === "im") {
            for (const file of data.packetFiles.results) {
              if (parseInt(packetfile.mth_file_id) === parseInt(file.file_id)) {
                const tempFile = {
                  file_id: file.file_id,
                  kind: packetfile.kind,
                  name: packetData.student?.person.first_name.substring(0, 1).toUpperCase() + "." + packetData.student?.person.last_name + packetfile.kind.toUpperCase(),
                  url: file.signedUrl
                };
                filesData.push(tempFile);
              }
            }
          }
        }
      }
      setFiles(filesData);
    }
  }, [loading, data]);
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    sx: {paddingTop: "20px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 12,
    sm: 12,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {fontSize: "12px"},
    color: SYSTEM_01,
    fontWeight: "700"
  }, "Documents")), /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    sx: {
      "&.MuiGrid-root": {
        maxWidth: "8rem"
      }
    },
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Birth Certificate"), /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Immunization"), /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Proof of Residency")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, files?.length > 0 ? /* @__PURE__ */ React.createElement("div", null, files?.find((e) => e.kind === "bc") ? /* @__PURE__ */ React.createElement(Paragraph, {
    color: PRIMARY_MEDIUM_MOUSEOVER,
    fontWeight: "400",
    sx: {fontSize: "12px", display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement("a", {
    href: files?.find((e) => e.kind === "bc").url,
    target: "_blank",
    style: {cursor: "pointer", textDecoration: "unset"},
    rel: "noreferrer"
  }, files?.find((e) => e.kind === "bc").name), /* @__PURE__ */ React.createElement("img", {
    src: DeleteIcon,
    style: classes.deleteIcon,
    onClick: () => onDeletefile(files?.find((e) => e.kind === "bc").file_id)
  })) : /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Not found"), files?.find((e) => e.kind === "im") ? /* @__PURE__ */ React.createElement(Paragraph, {
    color: PRIMARY_MEDIUM_MOUSEOVER,
    fontWeight: "400",
    sx: {fontSize: "12px", display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement("a", {
    href: files?.find((e) => e.kind === "im").url,
    target: "_blank",
    style: {cursor: "pointer", textDecorationLine: "unset"},
    rel: "noreferrer"
  }, files?.find((e) => e.kind === "im").name), /* @__PURE__ */ React.createElement("img", {
    src: DeleteIcon,
    style: classes.deleteIcon,
    onClick: () => onDeletefile(files?.find((e) => e.kind === "im").file_id)
  })) : /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Not found"), files?.find((e) => e.kind === "ur") ? /* @__PURE__ */ React.createElement(Paragraph, {
    color: PRIMARY_MEDIUM_MOUSEOVER,
    fontWeight: "400",
    sx: {fontSize: "12px", display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement("a", {
    href: files?.find((e) => e.kind === "ur").url,
    target: "_blank",
    style: {cursor: "pointer", textDecoration: "unset"},
    rel: "noreferrer"
  }, files?.find((e) => e.kind === "ur").name), /* @__PURE__ */ React.createElement("img", {
    src: DeleteIcon,
    style: classes.deleteIcon,
    onClick: () => onDeletefile(files?.find((e) => e.kind === "ur").file_id)
  })) : /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Not found")) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Not found"), /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Not found"), /* @__PURE__ */ React.createElement(Paragraph, {
    color: SYSTEM_06,
    sx: {fontSize: "12px"},
    fontWeight: "400"
  }, "Not found")))), openConfirmModal && /* @__PURE__ */ React.createElement(CustomModal, {
    title: "Delete File",
    description: "Are you sure you want to delete this file?",
    confirmStr: "Delete",
    cancelStr: "Cancel",
    onConfirm: onDeleteConfirm,
    onClose: () => setOpenConfirmModal(false)
  }));
};
