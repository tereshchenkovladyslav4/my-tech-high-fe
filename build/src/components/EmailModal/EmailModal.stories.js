import React, {useState} from "../../../_snowpack/pkg/react.js";
import {EmailModal} from "./EmailModal.js";
import {Box, Button, Card} from "../../../_snowpack/pkg/@mui/material.js";
export default {
  title: "Components/EmailModal",
  component: EmailModal
};
export const Default = () => {
  const [openModal, setOpenModal] = useState(false);
  const t = () => window.alert("hi");
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setOpenModal(true)
  }, "Hello"), /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "250px", height: "250px"}
  }, /* @__PURE__ */ React.createElement(EmailModal, {
    modalOpen: openModal,
    handleModal: setOpenModal
  }, "This is a EmailModal")));
};
