import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';

import {Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, FormControl, FormHelperText} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useEffect, useRef, useState} from "../../../../_snowpack/pkg/react.js";
import {DropDown} from "../../../components/DropDown/DropDown.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {HOMEROOM, RED} from "../../../utils/constants.js";
import {useStyles} from "../styles.js";
import SignatureCanvas from "../../../../_snowpack/pkg/react-signature-canvas.js";
import {useFormik} from "../../../../_snowpack/pkg/formik.js";
import * as yup from "../../../../_snowpack/pkg/yup.js";
import {useMutation} from "../../../../_snowpack/pkg/@apollo/client.js";
import {submitEnrollmentMutation} from "./service.js";
import {EnrollmentContext} from "../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider.js";
import {useHistory} from "../../../../_snowpack/pkg/react-router-dom.js";
import {SuccessModal} from "../../../components/SuccessModal/SuccessModal.js";
export const Submission = () => {
  const {packetId, student, disabled, setMe} = useContext(EnrollmentContext);
  const setFerpa = (id) => formik.values.ferpa = id;
  const setStudentPhoto = (id) => formik.values.studentPhoto = id;
  const setDistrict = (id) => formik.values.schoolDistrict = id;
  const classes = useStyles;
  const [understand, setUnderstand] = useState(false);
  const [approve, setApprove] = useState(false);
  const [signature, setSignature] = useState();
  const [fileId, setFileId] = useState();
  const signatureRef = useRef();
  const [signatureInvalid, setSignatureInvalid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitEnrollment, {data}] = useMutation(submitEnrollmentMutation);
  const dataUrlToFile = async (dataUrl, fileName) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, {type: "image/png"});
  };
  const history = useHistory();
  const validationSchema = yup.object({
    printName: yup.string().nullable().required("Printed name is required"),
    ferpa: yup.string().nullable().required("Ferpa response is required"),
    studentPhoto: yup.string().nullable().required("Student Photo response is required"),
    schoolDistrict: yup.string().nullable().required("School District permission is required"),
    understand: yup.bool().nullable().oneOf([true], "Field must be checked"),
    approve: yup.bool().nullable().oneOf([true], "Field must be checked")
  });
  const formik = useFormik({
    initialValues: {
      printName: void 0,
      ferpa: student.packets.at(-1)?.ferpa_agreement,
      studentPhoto: student.packets.at(-1)?.photo_permission,
      schoolDistrict: student.packets.at(-1)?.photo_permission,
      understand,
      approve
    },
    validationSchema,
    onSubmit: () => {
      if (!signatureRef.current.isEmpty()) {
        getSignature();
      }
    }
  });
  const handleSubmit = (e) => {
    if (signatureRef.current.isEmpty()) {
      setSignatureInvalid(true);
    }
    formik.handleSubmit(e);
  };
  const dropDownOptions = [
    {
      label: "Approve",
      value: 1
    },
    {
      label: "Deny",
      value: 2
    }
  ];
  const resetSignature = () => {
    signatureRef.current.clear();
  };
  const getSignature = async () => {
    const file = await dataUrlToFile(signatureRef.current.getTrimmedCanvas().toDataURL("image/png"), "signature");
    setSignature(file);
  };
  useEffect(() => {
    formik.values.understand = understand;
  }, [understand]);
  useEffect(() => {
    formik.values.approve = approve;
  }, [approve]);
  useEffect(() => {
    if (signature) {
      uploadSignature();
    }
  }, [signature]);
  const uploadSignature = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append("file", signature);
    bodyFormData.append("region", "UT");
    bodyFormData.append("year", "2022");
    fetch(__SNOWPACK_ENV__.SNOWPACK_PUBLIC_S3_URL, {
      method: "POST",
      body: bodyFormData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("JWT")}`
      }
    }).then((res) => {
      res.json().then(({data: data2}) => {
        setFileId(data2.file.file_id);
      });
    });
  };
  useEffect(() => {
    if (fileId) {
      submitEnrollment({
        variables: {
          enrollmentPacketDocumentInput: {
            ferpa_agreement: formik.values.ferpa,
            photo_permission: formik.values.studentPhoto,
            dir_permission: formik.values.schoolDistrict,
            signature_name: formik.values.printName,
            signature_file_id: fileId,
            agrees_to_policy: formik.values.understand ? 1 : 0,
            approves_enrollment: formik.values.approve ? 1 : 0,
            packet_id: parseFloat(packetId)
          }
        }
      });
    }
  }, fileId);
  useEffect(() => {
    if (data !== void 0) {
      data && setShowSuccess(true);
    }
  }, [data]);
  const nextTab = (e) => {
    e.preventDefault();
    history.push(`${HOMEROOM}`);
    window.scrollTo(0, 0);
  };
  return /* @__PURE__ */ React.createElement("form", {
    onSubmit: (e) => !disabled ? handleSubmit(e) : nextTab(e)
  }, showSuccess && /* @__PURE__ */ React.createElement(SuccessModal, {
    title: "",
    subtitle: "Your Enrollment Packet has been submitted successfully and is now pending approval.",
    handleSubmit: () => {
      history.push(`${HOMEROOM}`);
      location.reload();
    }
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
  }, "Required Documents to scan (or photograph) and upload"), /* @__PURE__ */ React.createElement(Box, {
    marginTop: 1
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, "All documents are kept private and secure. Please upload files specific to this student (ie don't include another student's documents).")))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControl, {
    disabled,
    required: true,
    component: "fieldset",
    variant: "standard",
    error: formik.touched.understand && Boolean(formik.errors.understand)
  }, /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: understand,
      onClick: () => setUnderstand(!understand)
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, "I have read, understand, and agree to abide by the information outlined in the Enrollment Packet Policies page, including the repayment policy for withdrawing early or failing to demonstrate active participation (up to $350/course).")
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, formik.touched.understand && formik.errors.understand)))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    component: "fieldset",
    variant: "standard",
    error: formik.touched.understand && Boolean(formik.errors.understand)
  }, /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: approve,
      onClick: () => setApprove(!approve)
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, "I approve for my student to be enrolled in any one of the following schools (Gateway Preparatory Academy, Digital Education Center - Tooele County School District, Advanced Learning Center - Nebo School District, and Southwest Education Academy - Iron County School District)")
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, formik.touched.approve && formik.errors.approve)))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4,
    marginTop: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "FERPA Agreement Options"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    size: "small",
    dropDownItems: dropDownOptions,
    defaultValue: formik.values.ferpa,
    setParentValue: setFerpa,
    error: {
      error: !!(formik.touched.ferpa && Boolean(formik.errors.ferpa)),
      errorMsg: formik.touched.ferpa && formik.errors.ferpa
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4,
    marginTop: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Student Photo Permissions"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    size: "small",
    dropDownItems: dropDownOptions,
    defaultValue: formik.values.studentPhoto,
    setParentValue: setStudentPhoto,
    error: {
      error: !!(formik.touched.studentPhoto && Boolean(formik.errors.studentPhoto)),
      errorMsg: formik.touched.studentPhoto && formik.errors.studentPhoto
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4,
    marginTop: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "School Student Directory Permissions"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    size: "small",
    dropDownItems: dropDownOptions,
    defaultValue: formik.values.schoolDistrict,
    setParentValue: setDistrict,
    error: {
      error: !!(formik.touched.schoolDistrict && Boolean(formik.errors.schoolDistrict)),
      errorMsg: formik.touched.schoolDistrict && formik.errors.schoolDistrict
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    marginTop: 4,
    justifyContent: "center",
    display: "flex"
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "60%"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    textAlign: "center"
  }, "I certify that I am the legal guardian or custodial parent of this student. I certify that I have read and understood the information on this registration site and that the information entered is true and accurate."))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "printName",
    value: formik.values.printName,
    onChange: formik.handleChange,
    error: formik.touched.printName && Boolean(formik.errors.printName),
    helperText: formik.touched.printName && formik.errors.printName,
    style: {width: "45%"}
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "35%", display: "flex", flexDirection: "row", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(FormHelperText, {
    style: {textAlign: "center"}
  }, "Type full legal parent name and provide a Digital Signature below. Signature (use the mouse to sign)")))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {borderBottom: "1px solid", width: 500}
  }, /* @__PURE__ */ React.createElement(SignatureCanvas, {
    canvasProps: {width: 500, height: 100},
    ref: signatureRef
  }))), signatureInvalid && /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(FormHelperText, {
    style: {textAlign: "center", color: RED}
  }, "Signature required")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    sx: {textDecoration: "underline", cursor: "pointer"},
    onClick: () => resetSignature()
  }, "Reset")), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.buttonContainer
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: classes.button,
    type: "submit"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, disabled ? "Go Home" : "Done")))));
};
