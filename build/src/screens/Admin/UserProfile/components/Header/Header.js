import {Avatar, Button} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import React from "../../../../../../_snowpack/pkg/react.js";
import {Metadata} from "../../../../../components/Metadata/Metadata.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import AddIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Add.js";
export const Header = ({
  userData,
  setOpenObserverModal,
  observers,
  handleChangeParent,
  selectedParent,
  parentId,
  isParent
}) => {
  const handleOpenObserverModal = () => {
    setOpenObserverModal(true);
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {cursor: "pointer"},
    onClick: () => handleChangeParent(userData)
  }, /* @__PURE__ */ React.createElement(Metadata, {
    title: userData && /* @__PURE__ */ React.createElement(Subtitle, {
      fontWeight: "700",
      color: isParent && selectedParent === parentId ? "#4145FF" : "#cccccc"
    }, userData.first_name, " ", userData.last_name),
    subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
      color: "#cccccc",
      size: "large"
    }, "Parent"),
    image: /* @__PURE__ */ React.createElement(Avatar, {
      alt: "Remy Sharp",
      variant: "rounded",
      style: {marginRight: 8}
    })
  })), observers.map((item) => /* @__PURE__ */ React.createElement(Box, {
    sx: {
      marginLeft: "12px",
      cursor: "pointer"
    },
    onClick: () => handleChangeParent(item)
  }, /* @__PURE__ */ React.createElement(Metadata, {
    title: /* @__PURE__ */ React.createElement(Subtitle, {
      fontWeight: "700",
      color: selectedParent === item.observer_id ? "#4145FF" : "#cccccc"
    }, item.person.first_name, " ", item.person.last_name),
    subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
      color: "#cccccc",
      size: "large"
    }, "Observer"),
    image: /* @__PURE__ */ React.createElement(Avatar, {
      alt: "Remy Sharp",
      variant: "rounded",
      style: {marginRight: 8}
    })
  }))), /* @__PURE__ */ React.createElement(Button, {
    onClick: handleOpenObserverModal,
    disableElevation: true,
    variant: "contained",
    sx: {
      marginLeft: "12px",
      background: "#FAFAFA",
      color: "black",
      textTransform: "none",
      fontSize: "16px",
      "&:hover": {
        background: "#F5F5F5",
        color: "#000"
      }
    },
    startIcon: /* @__PURE__ */ React.createElement(AddIcon, null)
  }, "Add Observer"));
};
