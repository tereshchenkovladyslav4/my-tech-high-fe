import {
  Typography,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from "../../../../../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../../../../../_snowpack/pkg/react.js";
import SettingsOutlinedIcon from "../../../../../../../_snowpack/pkg/@mui/icons-material/SettingsOutlined.js";
import DeleteForeverOutlinedIcon from "../../../../../../../_snowpack/pkg/@mui/icons-material/DeleteForeverOutlined.js";
import DehazeIcon from "../../../../../../../_snowpack/pkg/@mui/icons-material/Dehaze.js";
import {SortableContainer, SortableElement, SortableHandle} from "../../../../../../../_snowpack/pkg/react-sortable-hoc.js";
import {useHistory} from "../../../../../../../_snowpack/pkg/react-router-dom.js";
import {useMutation} from "../../../../../../../_snowpack/pkg/@apollo/client.js";
import {deleteImmunizationSetting, updateImmunizationOrderMutation} from "../services.js";
import {arrayMove} from "../../../../../../../_snowpack/pkg/react-sortable-hoc.js";
import {ErrorOutline} from "../../../../../../../_snowpack/pkg/@mui/icons-material.js";
const ImminizationItemInformation = ({itemData, settingsEnabled}) => {
  const history = useHistory();
  const enable = itemData.is_enabled && settingsEnabled;
  return /* @__PURE__ */ React.createElement(Box, {
    height: "100%",
    display: "inline-flex"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {opacity: !enable ? 0.38 : 1},
    height: "100%",
    display: "inline-flex"
  }, /* @__PURE__ */ React.createElement(Typography, {
    display: "inline-block",
    minWidth: "155px",
    component: "span"
  }, itemData.title), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(Typography, {
    display: "inline-block",
    minWidth: "95px",
    component: "span"
  }, itemData.min_grade_level && itemData.max_grade_level && itemData.is_enabled ? `${itemData.min_grade_level || "N/A"}-${itemData.max_grade_level || "N/A"}` : "N/A"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(Typography, {
    display: "inline-block",
    minWidth: "110px",
    component: "span"
  }, itemData.is_enabled ? "Enabled" : "Disabled"), /* @__PURE__ */ React.createElement(Divider, {
    sx: {borderColor: "black"},
    orientation: "vertical",
    flexItem: true
  })), /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => history.push(`/site-management/enrollment/immunizations/${itemData.id}`),
    disabled: !settingsEnabled,
    sx: {
      opacity: !settingsEnabled ? 0.38 : 1
    }
  }, /* @__PURE__ */ React.createElement(SettingsOutlinedIcon, {
    htmlColor: settingsEnabled ? "#4145FF" : "black"
  })));
};
const DragHandle = SortableHandle(({disabled}) => /* @__PURE__ */ React.createElement(IconButton, {
  disabled
}, /* @__PURE__ */ React.createElement(DehazeIcon, null)));
const ImmunizationItem = ({itemData, index, refetch, settingsEnabled}) => {
  const [deleteImmunizationSettingMutation] = useMutation(deleteImmunizationSetting);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const enabled = itemData.is_enabled && settingsEnabled;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose: handleClose,
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
      marginTop: "10px"
    }
  }, "Delete Immunization"), /* @__PURE__ */ React.createElement(ErrorOutline, {
    sx: {
      fontSize: 50,
      marginBottom: 5,
      marginX: "auto"
    }
  }), /* @__PURE__ */ React.createElement(Typography, {
    fontWeight: "bold",
    sx: {
      marginBottom: 5,
      paddingX: 10
    }
  }, `Are you sure you want to delete ${itemData.title}?`), /* @__PURE__ */ React.createElement(DialogActions, {
    sx: {
      justifyContent: "space-evenly",
      marginBottom: 2
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      borderRadius: 5,
      bgcolor: "#E7E7E7",
      paddingX: 5,
      "&:hover": {color: "black"}
    },
    onClick: handleClose
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: {
      borderRadius: 5,
      paddingX: 5,
      "&:hover": {color: "black"}
    },
    onClick: async () => {
      await deleteImmunizationSettingMutation({variables: {id: Number(itemData.id)}});
      refetch();
      handleClose();
    },
    autoFocus: true
  }, "Delete"))), /* @__PURE__ */ React.createElement(ListItem, {
    key: index,
    sx: {
      display: "flex",
      justifyContent: "space-between",
      padding: "5px",
      marginY: "10px",
      marginX: "33px",
      bgcolor: index % 2 ? "#FAFAFA" : "white",
      height: "35px",
      borderRadius: "10px",
      textAlign: "center",
      width: "auto"
    }
  }, /* @__PURE__ */ React.createElement(ImminizationItemInformation, {
    itemData,
    settingsEnabled
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: {opacity: enabled ? 1 : 0.38},
    display: "inline-flex"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    disabled: !enabled,
    onClick: handleClickOpen
  }, /* @__PURE__ */ React.createElement(DeleteForeverOutlinedIcon, null)), /* @__PURE__ */ React.createElement(DragHandle, {
    disabled: !enabled
  }))));
};
const SortableItem = SortableElement(ImmunizationItem);
const SortableListContainer = SortableContainer(({items, enabled, refetch}) => /* @__PURE__ */ React.createElement(List, null, items.map((item, index) => {
  return /* @__PURE__ */ React.createElement(SortableItem, {
    settingsEnabled: enabled,
    index,
    itemData: item,
    refetch,
    key: index
  });
})));
const ImmunizationItems = ({
  data,
  enabled,
  refetch
}) => {
  const [localData, setLocalData] = useState([...data].sort((first, second) => {
    return first.order - second.order;
  }));
  const [updateImmunizationOrder] = useMutation(updateImmunizationOrderMutation);
  useEffect(() => {
    setLocalData([...data].sort((first, second) => {
      return first.order - second.order;
    }));
  }, [data]);
  return /* @__PURE__ */ React.createElement(SortableListContainer, {
    enabled,
    items: localData,
    refetch,
    onSortEnd: ({oldIndex, newIndex}) => {
      const newData = arrayMove(localData, oldIndex, newIndex);
      setLocalData(newData);
      const ids = newData.map((item) => item.id);
      updateImmunizationOrder({variables: {input: {ids}}});
    },
    useDragHandle: true,
    lockAxis: "y"
  });
};
export {ImmunizationItems as default};
