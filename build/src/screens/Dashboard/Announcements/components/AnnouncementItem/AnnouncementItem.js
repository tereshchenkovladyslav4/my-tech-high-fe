import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import React, {useState} from "../../../../../../_snowpack/pkg/react.js";
import {Metadata} from "../../../../../components/Metadata/Metadata.js";
import {Paragraph} from "../../../../../components/Typography/Paragraph/Paragraph.js";
import CloseIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {useStyles} from "../../styles.js";
export const AnnouncementItem = ({title, subtitle, onClose}) => {
  const classes = useStyles;
  const [style, setStyle] = useState({display: "none"});
  return /* @__PURE__ */ React.createElement(Box, {
    onMouseEnter: (e) => setStyle({display: "block"}),
    onMouseLeave: (e) => setStyle({display: "none"})
  }, /* @__PURE__ */ React.createElement(Metadata, {
    disableGutters: true,
    title: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "large"
    }, title),
    subtitle: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, subtitle),
    secondaryAction: /* @__PURE__ */ React.createElement(Box, {
      position: "absolute",
      sx: classes.closeIconContainer
    }, /* @__PURE__ */ React.createElement(CloseIcon, {
      sx: style,
      style: classes.closeIcon,
      onClick: () => onClose()
    }))
  }));
};
