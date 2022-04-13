import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';

import {Box, Button, Grid} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useEffect, useState} from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {DocumentUpload} from "./components/DocumentUpload/DocumentUpload.js";
import {useStyles} from "../styles.js";
import {EnrollmentContext} from "../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider.js";
import {useMutation, useQuery} from "../../../../_snowpack/pkg/@apollo/client.js";
import {uploadDocumentMutation} from "./service.js";
import {filter, map} from "../../../../_snowpack/pkg/lodash.js";
import {useHistory} from "../../../../_snowpack/pkg/react-router-dom.js";
import {HOMEROOM} from "../../../utils/constants.js";
import {getPacketFiles} from "../../Admin/EnrollmentPackets/services.js";
import {LoadingScreen} from "../../LoadingScreen/LoadingScreen.js";
import {TabContext, UserContext} from "../../../providers/UserContext/UserProvider.js";
import {SuccessModal} from "../../../components/SuccessModal/SuccessModal.js";
export const Documents = () => {
  const {packetId, student, disabled} = useContext(EnrollmentContext);
  const {me, setMe} = useContext(UserContext);
  const {tab, setTab, visitedTabs, setVisitedTabs} = useContext(TabContext);
  const classes = useStyles;
  const [birthCert, setBirthCert] = useState();
  const [immunRec, setImmunRec] = useState();
  const [residencyRecord, setResidencyRecord] = useState();
  const missingInfo = student.packets?.at(-1).status === "Missing Info";
  const missingFiles = student.packets?.at(-1).missing_files;
  const bcFile = filter(student.packets.at(-1).files, (file) => file.kind == "bc").at(-1);
  const imFile = filter(student.packets.at(-1).files, (file) => file.kind == "im").at(-1);
  const urFile = filter(student.packets.at(-1).files, (file) => file.kind == "ur").at(-1);
  const fileIds = [bcFile?.file_id, imFile?.file_id, urFile?.file_id];
  const [dataLoading, setDataLoading] = useState(true);
  const [files, setFiles] = useState();
  const [showSuccess, setShowSuccess] = useState(false);
  const {loading, error, data: fileData} = useQuery(getPacketFiles, {
    variables: {
      fileIds: fileIds.toString()
    },
    fetchPolicy: "network-only"
  });
  const [documents, setDocuments] = useState([]);
  const [uploadDocument, {data}] = useMutation(uploadDocumentMutation);
  const history = useHistory();
  const submitRecord = (documentType, file) => {
    switch (documentType) {
      case "ur":
        setResidencyRecord(file);
        break;
      case "im":
        setImmunRec(file);
        break;
      case "bc":
        setBirthCert(file);
        break;
    }
  };
  useEffect(() => {
    if (!loading && fileData !== void 0) {
      setFiles(fileData.packetFiles.results);
    }
  }, [loading]);
  const onNext = async () => {
    const filesToUpload = [
      {
        file: birthCert,
        type: "bc"
      },
      {
        file: immunRec,
        type: "im"
      },
      {
        file: residencyRecord,
        type: "ur"
      }
    ];
    map(filesToUpload, async (uploadEl, idx) => {
      var bodyFormData = new FormData();
      if (uploadEl.file) {
        bodyFormData.append("file", uploadEl.file[0]);
        bodyFormData.append("region", "UT");
        bodyFormData.append("year", "2022");
        fetch(__SNOWPACK_ENV__.SNOWPACK_PUBLIC_S3_URL, {
          method: "POST",
          body: bodyFormData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWT")}`
          }
        }).then(async (res) => {
          res.json().then(({data: data2}) => {
            setDocuments((curr) => [
              ...curr,
              {
                kind: uploadEl.type,
                mth_file_id: data2.file.file_id
              }
            ]);
          });
        });
      }
    });
  };
  useEffect(() => {
    if (documents?.length === 3) {
      uploadDocument({
        variables: {
          enrollmentPacketDocumentInput: {
            packet_id: parseFloat(packetId),
            documents
          }
        }
      });
    }
  }, [documents]);
  useEffect(() => {
    if (data) {
      if (!missingInfo) {
        setVisitedTabs([...visitedTabs, tab.currentTab]);
        setTab({
          currentTab: 4
        });
        window.scrollTo(0, 0);
      } else {
        setShowSuccess(true);
      }
    }
  }, [data]);
  const nextTab = (e) => {
    e.preventDefault();
    setTab({
      currentTab: 4
    });
    window.scrollTo(0, 0);
  };
  const isLoading = () => {
    if (disabled) {
      if (files?.length > 0) {
        setDataLoading(false);
      }
    } else {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    isLoading();
  }, [files]);
  const onSubmit = () => {
    history.push(`${HOMEROOM}`);
    location.reload();
  };
  return !dataLoading ? /* @__PURE__ */ React.createElement("form", null, showSuccess && /* @__PURE__ */ React.createElement(SuccessModal, {
    title: "",
    subtitle: "Your Enrollment Packet has been submitted successfully and is now pending approval.",
    handleSubmit: onSubmit
  }), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 3,
    columnSpacing: {xs: 1, sm: 2, md: 3}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "50%"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Required Documents to scan (or photograph) and upload"), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, "All documents are kept private and secure. Please upload files specific to this student (ie don't include another student's documents)."))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    marginTop: 4
  }, /* @__PURE__ */ React.createElement(DocumentUpload, {
    title: "Enrollment's Birth Certificate (required)",
    subtitle: "Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)",
    document: "bc",
    handleUpload: submitRecord,
    file: files && filter(files, (file) => file.file_id === bcFile.file_id),
    disabled: disabled && !missingFiles.includes("bc")
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(DocumentUpload, {
    title: "Enrollment's Immunization Record or Personal Exemption Form (required)",
    subtitle: "Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)",
    document: "im",
    handleUpload: submitRecord,
    file: files && filter(files, (file) => file.file_id === imFile.file_id),
    disabled: disabled && !missingFiles.includes("im")
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(DocumentUpload, {
    title: "Parent's Proof of Utah Residency issued within 60 days such as a current utility bill, mortgage or rental statement (required)",
    subtitle: "Allowed file types: pdf, png, jpg, jpeg, gif, bmp (Less than 25MB)",
    document: "ur",
    handleUpload: submitRecord,
    file: files && filter(files, (file) => file.file_id === urFile.file_id),
    disabled: disabled && !missingFiles.includes("ur")
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.buttonContainer
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: classes.button,
    onClick: (e) => disabled ? nextTab(e) : onNext()
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, disabled ? "Next" : student.packets?.at(-1).status === "Missing Info" ? "Submit" : "Save & Continue"))))) : /* @__PURE__ */ React.createElement(LoadingScreen, null);
};
