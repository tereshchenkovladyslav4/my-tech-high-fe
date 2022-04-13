import {Box, Card, Container} from "../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useEffect, useMemo, useState} from "../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../components/Typography/Subtitle/Subtitle.js";
import ChevronLeftIcon from "../../../_snowpack/pkg/@mui/icons-material/ChevronLeft.js";
import {Breadcrumbs} from "../../components/Breadcrumbs/Breadcrumbs.js";
import {Submission} from "./Submission/Submission.js";
import {Contact} from "./Contact/Contact.js";
import {Personal} from "./Personal/Personal.js";
import {Education} from "./Education/Education.js";
import {Documents} from "./Documents/Documents.js";
import {useStyles} from "./styles.js";
import {useHistory} from "../../../_snowpack/pkg/react-router-dom.js";
import {HOMEROOM} from "../../utils/constants.js";
import {EnrollmentContext} from "../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider.js";
import {find, includes} from "../../../_snowpack/pkg/lodash.js";
import {TabContext, UserContext} from "../../providers/UserContext/UserProvider.js";
export const Enrollment = ({id, disabled}) => {
  const {me, setMe} = useContext(UserContext);
  const {students} = me;
  const {tab, setTab, visitedTabs, setVisitedTabs} = useContext(TabContext);
  const {currentTab} = tab;
  const [packetId, setPacketId] = useState();
  const [student] = useState(find(students, {student_id: id}));
  const classes = useStyles;
  const enrollmentPacketContext = useMemo(() => ({
    packetId,
    setPacketId,
    student,
    disabled,
    setMe,
    setTab,
    setVisitedTabs,
    visitedTabs
  }), [packetId, disabled]);
  useEffect(() => {
    if (student.packets.at(-1)) {
      setPacketId(student.packets.at(-1).packet_id);
    }
    if (student.packets?.at(-1).status === "Missing Info") {
    }
  }, [tab]);
  const breadCrumbData = [
    {
      label: "Contact",
      active: true
    },
    {
      label: "Personal",
      active: currentTab >= 1
    },
    {
      label: "Education",
      active: currentTab >= 2
    },
    {
      label: "Documents",
      active: currentTab >= 3
    },
    {
      label: "Submission",
      active: currentTab >= 4
    }
  ];
  const history = useHistory();
  const handleBreadCrumbClicked = (idx) => {
    if (includes(visitedTabs, idx) || disabled) {
      setTab({
        currentTab: idx
      });
    }
  };
  return /* @__PURE__ */ React.createElement(EnrollmentContext.Provider, {
    value: enrollmentPacketContext
  }, /* @__PURE__ */ React.createElement(Container, {
    sx: classes.container
  }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.header
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row"
    }
  }, /* @__PURE__ */ React.createElement(ChevronLeftIcon, {
    sx: classes.chevronIcon,
    onClick: () => history.push(HOMEROOM)
  }), /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large",
    fontWeight: "700"
  }, "Enrollment Packet")), /* @__PURE__ */ React.createElement(Breadcrumbs, {
    steps: breadCrumbData,
    handleClick: handleBreadCrumbClicked,
    disabled
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.breadcrumbs
  }, currentTab === 0 ? /* @__PURE__ */ React.createElement(Contact, {
    id
  }) : currentTab === 1 ? /* @__PURE__ */ React.createElement(Personal, null) : currentTab === 2 ? /* @__PURE__ */ React.createElement(Education, null) : currentTab === 3 ? /* @__PURE__ */ React.createElement(Documents, null) : /* @__PURE__ */ React.createElement(Submission, null)))));
};
