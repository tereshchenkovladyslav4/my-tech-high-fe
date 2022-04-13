import React, {useState} from "../../../../../../_snowpack/pkg/react.js";
import {Box, Typography, Stack} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {ImageCropper} from "../../../../../components/ImageCropper/index.js";
import SystemUpdateAltOutlinedIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/SystemUpdateAltOutlined.js";
import {useStyles} from "../../styles.js";
export default function StateLogo({
  stateLogo,
  setStateLogo,
  stateLogoFile,
  setStateLogoFile,
  setIsChanged
}) {
  const classes = useStyles;
  const [open, setOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(void 0);
  const [croppedImage, setCroppedImage] = useState(void 0);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleFileInput = (e) => {
    setOpen(false);
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const image = reader.result;
        setImageToCrop(image);
        handleClickOpen();
        e.target.value = "";
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    spacing: 1,
    alignItems: "center",
    sx: {my: 2}
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 16,
    fontWeight: "600",
    textAlign: "left",
    sx: {minWidth: 150}
  }, "State Logo"), /* @__PURE__ */ React.createElement(Typography, null, "|"), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement("input", {
    style: {display: "none"},
    id: "uploadStateLogoImageId",
    type: "file",
    accept: "image/png, image/jpeg",
    onChange: (e) => handleFileInput(e)
  }), /* @__PURE__ */ React.createElement("label", {
    style: {display: "flex", justifyContent: "space-around", minWidth: 200},
    htmlFor: "uploadStateLogoImageId"
  }, !(stateLogoFile || stateLogo) && /* @__PURE__ */ React.createElement(Stack, {
    sx: {cursor: "pointer"},
    direction: "column",
    justifyContent: "center",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(SystemUpdateAltOutlinedIcon, {
    sx: {transform: "rotate(180deg)"},
    fontSize: "large"
  }), /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    fontWeight: "500"
  }, "Upload Photo")), (stateLogoFile || stateLogo) && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement("img", {
    src: stateLogoFile ? stateLogoFile.image : stateLogo,
    width: 150,
    style: {cursor: "pointer"}
  }))), open && /* @__PURE__ */ React.createElement(ImageCropper, {
    imageToCrop,
    classes,
    setStateLogoFile,
    setIsChanged
  })));
}
