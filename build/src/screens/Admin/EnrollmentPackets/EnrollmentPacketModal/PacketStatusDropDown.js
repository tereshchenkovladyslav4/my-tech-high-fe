import * as React from "../../../../../_snowpack/pkg/react.js";
import {styled} from "../../../../../_snowpack/pkg/@mui/material/styles.js";
import Button from "../../../../../_snowpack/pkg/@mui/material/Button.js";
import Menu from "../../../../../_snowpack/pkg/@mui/material/Menu.js";
import MenuItem from "../../../../../_snowpack/pkg/@mui/material/MenuItem.js";
import KeyboardArrowDownIcon from "../../../../../_snowpack/pkg/@mui/icons-material/KeyboardArrowDown.js";
import {BUTTON_LINEAR_GRADIENT} from "../../../../utils/constants.js";
import {useQuery} from "../../../../../_snowpack/pkg/@apollo/client.js";
import {getEnrollmentPacketStatusesQuery} from "../services.js";
import {useFormContext} from "../../../../../_snowpack/pkg/react-hook-form.js";
const StyledMenu = styled((props) => /* @__PURE__ */ React.createElement(Menu, {
  elevation: 0,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "right"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "right"
  },
  ...props
}))(({theme}) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow: "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0"
    }
  }
}));
export default function EnrollmentPacketDropDownButton() {
  const {watch, setValue} = useFormContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [status, packetStatuses] = watch(["status", "packetStatuses"]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const {data} = useQuery(getEnrollmentPacketStatusesQuery);
  React.useEffect(() => {
    if (data?.packetStatuses?.results) {
      setValue("packetStatuses", data.packetStatuses.results);
    }
  }, [data]);
  const handlePacketStatus = (name) => {
    setValue("status", name);
    setValue("preSaveStatus", name);
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
    id: "demo-customized-button",
    "aria-controls": open ? "demo-customized-menu" : void 0,
    "aria-haspopup": "true",
    "aria-expanded": open ? "true" : void 0,
    variant: "contained",
    disableElevation: true,
    onClick: handleClick,
    endIcon: /* @__PURE__ */ React.createElement(KeyboardArrowDownIcon, null),
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 25,
      background: BUTTON_LINEAR_GRADIENT,
      color: "white",
      width: "115px",
      padding: "unset"
    }
  }, status), /* @__PURE__ */ React.createElement(StyledMenu, {
    id: "demo-customized-menu",
    MenuListProps: {
      "aria-labelledby": "demo-customized-button"
    },
    anchorEl,
    open,
    onClose: handleClose
  }, packetStatuses?.map((x, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: index,
    onClick: () => handlePacketStatus(x),
    disableRipple: true
  }, x))));
}
