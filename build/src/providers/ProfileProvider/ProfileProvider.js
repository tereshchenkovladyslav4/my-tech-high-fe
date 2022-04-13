import React, {useState} from "../../../_snowpack/pkg/react.js";
import {ProfileContext} from "./ProfileContext.js";
import {Modal, Box} from "../../../_snowpack/pkg/@mui/material.js";
import {UserProfile} from "../../screens/Admin/UserProfile/UserProfile.js";
export const ProfileProvider = ({children}) => {
  const [store, setStore] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const profileContext = React.useMemo(() => ({
    store,
    setStore,
    hideModal: () => {
    },
    showModal: (data2) => {
      setData(data2);
      setOpen(true);
    }
  }), [store]);
  const handelClose = () => {
    setOpen(false);
    setStore(false);
  };
  return /* @__PURE__ */ React.createElement(ProfileContext.Provider, {
    value: profileContext
  }, open && /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handelClose(),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(UserProfile, {
    handleClose: handelClose,
    data
  }))), children);
};
