import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';

import {useMutation} from "../../../../_snowpack/pkg/@apollo/client.js";
import {Avatar, Box, Button, Card, Checkbox, FormControlLabel, Grid, TextField} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useEffect, useState} from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {UserContext} from "../../../providers/UserContext/UserProvider.js";
import {updateProfile, removeProfilePhoto} from "../service.js";
import {useStyles} from "../styles.js";
import SystemUpdateAltIcon from "../../../../_snowpack/pkg/@mui/icons-material/SystemUpdateAlt.js";
import {DocumentUploadModal} from "../../Enrollment/Documents/components/DocumentUploadModal/DocumentUploadModal.js";
import {WarningModal} from "../../../components/WarningModal/Warning.js";
import * as yup from "../../../../_snowpack/pkg/yup.js";
import {useFormik} from "../../../../_snowpack/pkg/formik.js";
export const Profile = () => {
  const classes = useStyles;
  const {me} = useContext(UserContext);
  const {profile} = me;
  const [submitUpdate, {data}] = useMutation(updateProfile);
  const [submitRemoveProfilePhoto, {data: userData}] = useMutation(removeProfilePhoto);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const hasImage = !!me.avatar_url;
  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState();
  const onSave = () => {
    submitUpdate({
      variables: {
        updateProfileInput: {
          address_1: formik.values.address1,
          address_2: formik.values.address2,
          city: formik.values.city,
          email: formik.values.email,
          first_name: formik.values.legalFName,
          is_can_receive_text_msg: formik.values.recieveText ? "Y" : "N",
          last_name: formik.values.legalLName,
          middle_name: formik.values.legalMName,
          phone_number: formik.values.phoneNumber,
          preferred_first_name: formik.values.preferredFName,
          preferred_last_name: formik.values.preferredLName,
          state: formik.values.state,
          zipcode: formik.values.zipcode
        }
      }
    }).then((res) => {
    });
    uploadPhoto(file);
  };
  const onRemoveProfilePhoto = () => {
    setWarningModalOpen(!warningModalOpen);
    submitRemoveProfilePhoto().then((res) => {
      setFile(void 0);
      setAvatar(null);
    });
  };
  const validationSchema = yup.object({
    preferredFName: yup.string().nullable(),
    preferredLName: yup.string().nullable(),
    legalFName: yup.string().required("Legal First Name is required").nullable(),
    legalMName: yup.string().nullable(),
    legalLName: yup.string().required("Legal Last Name is required").nullable(),
    phoneNumber: yup.string().required("Phone number is required").nullable(),
    email: yup.string().email("Please enter a valid email").nullable().required("Email is required"),
    city: yup.string().nullable().required("City is required"),
    recieveText: yup.boolean().nullable(),
    address1: yup.string().nullable().required("Address line 1 is required"),
    address2: yup.string().nullable(),
    state: yup.string().required("State is required").nullable(),
    zipcode: yup.string().required("Zipcode is required").nullable()
  });
  const formik = useFormik({
    initialValues: {
      preferredFName: profile.preferred_first_name,
      preferredLName: profile.preferred_last_name,
      legalFName: profile.first_name,
      legalMName: profile.middle_name,
      legalLName: profile.last_name,
      phoneNumber: profile.phone.number,
      email: profile.email,
      city: profile.address.city,
      recieveText: void 0,
      address1: profile.address.street,
      address2: profile.address.street2,
      state: profile.address.state,
      zipcode: profile.address.zip
    },
    validationSchema,
    onSubmit: async () => {
      await onSave();
    }
  });
  const convertToBlob = (file2) => {
    const fileUrl = URL.createObjectURL(file2[0]);
    return fileUrl;
  };
  const getProfilePhoto = () => {
    if (!avatar)
      return;
    const s3URL = "https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/";
    return s3URL + me.avatar_url;
  };
  const uploadPhoto = (file2) => {
    var bodyFormData = new FormData();
    if (file2) {
      bodyFormData.append("file", file2[0]);
      bodyFormData.append("region", "UT");
      bodyFormData.append("year", "2022");
      fetch(__SNOWPACK_ENV__.SNOWPACK_PUBLIC_S3_UPLOAD, {
        method: "POST",
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWT")}`
        }
      }).then(async (res) => {
        res.json().then(({data: data2}) => {
          console.log("Upload: ", data2);
        });
      });
    }
  };
  const openImageModal = () => setImageModalOpen(true);
  const handleFile = (fileName) => setFile(fileName);
  useEffect(() => {
    if (me && me.avatar_url)
      setAvatar(me.avatar_url);
    console.log(file), [file];
  }, [me]);
  const Image = () => /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    sx: {height: 167, width: 167}
  }, file || avatar ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Avatar, {
    src: file ? convertToBlob(file) : getProfilePhoto(),
    variant: "rounded",
    sx: {height: "100%", width: "100%"}
  }), /* @__PURE__ */ React.createElement(Box, {
    onClick: () => setWarningModalOpen(true),
    sx: {cursor: "pointer"}
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500",
    textAlign: "center"
  }, "Remove Profile Picture"))) : /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    sx: {backgroundColor: "#FAFAFA", alignItems: "center", cursor: "pointer", height: "100%", width: "100%"},
    onClick: () => openImageModal()
  }, /* @__PURE__ */ React.createElement(SystemUpdateAltIcon, null), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Upload Photo")));
  return /* @__PURE__ */ React.createElement("form", {
    onSubmit: formik.handleSubmit,
    style: {display: "flex", height: "100%"}
  }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2,
    columnSpacing: {xs: 1, sm: 2, md: 3},
    sx: classes.gridContainer
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 9
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700"
  }, "Profile")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.saveButton,
    type: "submit"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "700"
  }, "Save Changes")))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, Image()), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Preferred First Name"), /* @__PURE__ */ React.createElement(TextField, {
    name: "preferredFName",
    value: formik.values.preferredFName,
    onChange: formik.handleChange,
    error: formik.touched.preferredFName && Boolean(formik.errors.preferredFName),
    helperText: formik.touched.preferredFName && formik.errors.preferredFName
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    height: "100%",
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Preferred Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    name: "preferredLName",
    value: formik.values.preferredLName,
    onChange: formik.handleChange,
    error: formik.touched.preferredLName && Boolean(formik.errors.preferredLName),
    helperText: formik.touched.preferredLName && formik.errors.preferredLName
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Legal First Name"), /* @__PURE__ */ React.createElement(TextField, {
    name: "legalFName",
    value: formik.values.legalFName,
    onChange: formik.handleChange,
    error: formik.touched.legalFName && Boolean(formik.errors.legalFName),
    helperText: formik.touched.legalFName && formik.errors.legalFName
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Legal Middle Name"), /* @__PURE__ */ React.createElement(TextField, {
    name: "legalMName",
    value: formik.values.legalMName,
    onChange: formik.handleChange,
    error: formik.touched.legalMName && Boolean(formik.errors.legalMName),
    helperText: formik.touched.legalMName && formik.errors.legalMName
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "50%"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    name: "legalLName",
    value: formik.values.legalLName,
    onChange: formik.handleChange,
    error: formik.touched.legalLName && Boolean(formik.errors.legalLName),
    helperText: formik.touched.legalLName && formik.errors.legalLName
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Phone"), /* @__PURE__ */ React.createElement(TextField, {
    name: "phoneNumber",
    value: formik.values.phoneNumber,
    onChange: formik.handleChange,
    error: formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber),
    helperText: formik.touched.phoneNumber && formik.errors.phoneNumber
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: formik.values.recieveText,
      onClick: formik.handleChange,
      name: "recieveText"
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, "I can receive text messages via this number")
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Email"), /* @__PURE__ */ React.createElement(TextField, {
    name: "email",
    value: formik.values.email,
    onChange: formik.handleChange,
    error: formik.touched.email && Boolean(formik.errors.email),
    helperText: formik.touched.email && formik.errors.email
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "City"), /* @__PURE__ */ React.createElement(TextField, {
    name: "city",
    value: formik.values.city,
    onChange: formik.handleChange,
    error: formik.touched.city && Boolean(formik.errors.city),
    helperText: formik.touched.city && formik.errors.city
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Address Line 1"), /* @__PURE__ */ React.createElement(TextField, {
    name: "address1",
    value: formik.values.address1,
    onChange: formik.handleChange,
    error: formik.touched.address1 && Boolean(formik.errors.address1),
    helperText: formik.touched.address1 && formik.errors.address1
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "State"), /* @__PURE__ */ React.createElement(TextField, {
    name: "state",
    value: formik.values.state,
    onChange: formik.handleChange,
    error: formik.touched.state && Boolean(formik.errors.state),
    helperText: formik.touched.state && formik.errors.state
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Zipcode"), /* @__PURE__ */ React.createElement(TextField, {
    name: "zipcode",
    value: formik.values.zipcode,
    onChange: formik.handleChange,
    error: formik.touched.zipcode && Boolean(formik.errors.zipcode),
    helperText: formik.touched.zipcode && formik.errors.zipcode
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium",
    fontWeight: "500"
  }, "Address Line 2"), /* @__PURE__ */ React.createElement(TextField, {
    name: "address2",
    value: formik.values.address2,
    onChange: formik.handleChange,
    error: formik.touched.address2 && Boolean(formik.errors.address2),
    helperText: formik.touched.address2 && formik.errors.address2
  })))), imageModalOpen && /* @__PURE__ */ React.createElement(DocumentUploadModal, {
    handleModem: () => setImageModalOpen(!imageModalOpen),
    handleFile
  }), warningModalOpen && /* @__PURE__ */ React.createElement(WarningModal, {
    handleSubmit: () => onRemoveProfilePhoto(),
    handleModem: () => setWarningModalOpen(!warningModalOpen),
    title: "Delete Image",
    subtitle: "Are you sure you  want to delete  this image"
  })));
};
