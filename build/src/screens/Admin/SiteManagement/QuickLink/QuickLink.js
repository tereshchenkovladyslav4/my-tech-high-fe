import {Button, Stack} from "../../../../../_snowpack/pkg/@mui/material.js";
import React, {useState} from "../../../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {useStyles} from "../styles.js";
import SystemUpdateAltOutlinedIcon from "../../../../../_snowpack/pkg/@mui/icons-material/SystemUpdateAltOutlined.js";
import TextField from "../../../../components/TextField/TextField.js";
import {DropDown} from "../../../../components/DropDown/DropDown.js";
const QuickLink = () => {
  const classes = useStyles;
  const [title, setTitle] = useState("");
  const [type, setType] = useState(0);
  const [image, setImage] = useState(null);
  const typeArr = [
    {
      label: "Type 1",
      value: 1
    },
    {
      label: "Type 2",
      value: 2
    },
    {
      label: "Type 3",
      value: 3
    }
  ];
  const handleFileInput = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage({
        name: file.name,
        image: URL.createObjectURL(file),
        file
      });
    }
  };
  return /* @__PURE__ */ React.createElement(Stack, {
    direction: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    sx: classes.base
  }, /* @__PURE__ */ React.createElement("input", {
    style: {display: "none"},
    id: "uploadLinkImage",
    type: "file",
    accept: "image/png, image/jpeg",
    onChange: (e) => handleFileInput(e)
  }), /* @__PURE__ */ React.createElement("label", {
    htmlFor: "uploadLinkImage"
  }, !image ? /* @__PURE__ */ React.createElement(Stack, {
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
  }, "Upload Photo")) : /* @__PURE__ */ React.createElement("img", {
    src: image.image,
    width: 314,
    height: 266,
    style: {borderTopRightRadius: 10, borderTopLeftRadius: 10, cursor: "pointer"}
  })), /* @__PURE__ */ React.createElement(Stack, {
    direction: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "65%",
    marginTop: 3
  }, /* @__PURE__ */ React.createElement(TextField, {
    label: "Title",
    placeholder: "Entry",
    fullWidth: true,
    value: title,
    onChange: (value) => setTitle(value),
    style: classes.input,
    sx: {my: 2, width: "65%"}
  }), /* @__PURE__ */ React.createElement(DropDown, {
    dropDownItems: typeArr,
    placeholder: "Type",
    labelTop: true,
    setParentValue: (value) => {
      setType(Number(value));
    },
    size: "small",
    sx: {my: 2, width: "65%"}
  })), /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    justifyContent: "center",
    alignItems: "center",
    spacing: 8,
    marginTop: 3
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    disableElevation: true,
    sx: classes.cancelButton
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    disableElevation: true,
    sx: classes.submitButton
  }, "Save")));
};
export {QuickLink as default};
