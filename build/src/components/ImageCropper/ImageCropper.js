import React, {useState, useEffect} from "../../../_snowpack/pkg/react.js";
import Cropper from "../../../_snowpack/pkg/react-cropper.js";
import {Box, Button, Stack, Dialog, DialogTitle, DialogActions} from "../../../_snowpack/pkg/@mui/material.js";
import "../../../_snowpack/pkg/cropperjs/dist/cropper.css.proxy.js";
export default function ImageCropper({imageToCrop, classes, setStateLogoFile, setIsChanged}) {
  const [cropper, setCropper] = useState();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, [imageToCrop]);
  const blobToFile = (theBlob, fileName = "CroppedImage") => {
    const myFile = new File([theBlob], "image.jpeg", {
      type: theBlob.type
    });
    return myFile;
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    setOpen(false);
    if (typeof cropper !== "undefined") {
      cropper.getCroppedCanvas().toBlob((blob) => {
        const croppedImageFile = blobToFile(blob);
        setStateLogoFile({
          name: croppedImageFile.name,
          image: URL.createObjectURL(croppedImageFile),
          file: croppedImageFile
        });
        setIsChanged(true);
      }, "image/png");
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, imageToCrop && /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose: handleClose,
    fullWidth: true,
    maxWidth: "xl",
    sx: {
      marginX: "auto",
      paddingY: "10px",
      borderRadius: 10,
      textAlign: "center",
      alignItems: "center",
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    sx: {
      fontWeight: "bold",
      marginTop: "10px",
      textAlign: "left"
    }
  }, "Image Cropper"), /* @__PURE__ */ React.createElement(Box, {
    sx: {maxWidth: "50vw", minWidth: "400px", overflow: "hidden"}
  }, /* @__PURE__ */ React.createElement(Stack, null, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Cropper, {
    style: {height: "auto", width: "100%"},
    zoomTo: 0.5,
    initialAspectRatio: 1,
    aspectRatio: 1,
    src: imageToCrop,
    viewMode: 3,
    minCropBoxHeight: 10,
    minCropBoxWidth: 10,
    background: false,
    responsive: true,
    autoCropArea: 1,
    checkOrientation: false,
    onInitialized: (instance) => {
      setCropper(instance);
    },
    guides: true
  })))), /* @__PURE__ */ React.createElement(DialogActions, {
    sx: {
      justifyContent: "center",
      marginBottom: 2
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.cancelButton,
    onClick: handleClose
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.submitButton,
    onClick: handleSave
  }, "Save"))));
}
