import {Box, Button, Card, InputAdornment, OutlinedInput} from "../../../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {GREEN_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT} from "../../../../utils/constants.js";
import SearchIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Search.js";
import {Pagination} from "../../../../components/Pagination/Pagination.js";
import {SortableTable} from "../../../../components/SortableTable/SortableTable.js";
import {useQuery, useMutation} from "../../../../../_snowpack/pkg/@apollo/client.js";
import {
  getEnrollmentPacketsQuery,
  emailPacketMutation,
  deletePacketMutation,
  moveNextYearPacketMutation,
  moveThisYearPacketMutation,
  packetCountQuery
} from "../services.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import moment from "../../../../../_snowpack/pkg/moment.js";
import DeleteForever from "../../../../../_snowpack/pkg/@mui/icons-material/Delete.js";
import {toOrdinalSuffix} from "../../../../utils/stringHelpers.js";
import {ApplicationEmailModal as EmailModal} from "../../../../components/EmailModal/ApplicationEmailModal.js";
import EnrollmentPacketModal from "../EnrollmentPacketModal/index.js";
import {WarningModal} from "../../../../components/WarningModal/Warning.js";
import {getEmailTemplateQuery} from "../../../../graphql/queries/email-template.js";
import {EnrollmentPacketFilters} from "../EnrollmentPacketFilters/EnrollmentPacketFilters.js";
export const EnrollmentPacketTable = () => {
  const [filters, setFilters] = useState(["Submitted", "Resubmitted"]);
  const [emailTemplate, setEmailTemplate] = useState();
  const [searchField, setSearchField] = useState("");
  const [tableData, setTableData] = useState([]);
  const [paginatinLimit, setPaginatinLimit] = useState(25);
  const [skip, setSkip] = useState();
  const [totalPackets, setTotalPackets] = useState();
  const [packetIds, setPacketIds] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [enrollmentPackets, setEnrollmentPackets] = useState([]);
  const [enrollmentPacket, setEnrollmentPacket] = useState(null);
  const [deletePacket, {data: deleteData}] = useMutation(deletePacketMutation);
  const [currentPage, setCurrentPage] = useState(1);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [packetCount, setpacketCount] = useState({});
  const createData = (packet) => {
    return {
      id: packet.packet_id,
      submitted: moment(packet.deadline).format("MM/DD/YY"),
      status: packet.status + (packet.is_age_issue ? " (Age Issue)" : ""),
      deadline: moment(packet.deadline).format("l"),
      student: `${packet.student.person.first_name} ${packet.student.person.last_name}`,
      grade: packet.student.grade_levels.length && packet.student.grade_levels[0].grade_level ? `${toOrdinalSuffix(Number(packet.student.grade_levels[0].grade_level))} Grade` : " ",
      parent: `${packet.student.parent.person.first_name} ${packet.student.parent.person.last_name}`,
      studentStatus: "New",
      emailed: "",
      delete: /* @__PURE__ */ React.createElement(DeleteForever, {
        className: "delete-row",
        onClick: (event) => handleDelete(packet.packet_id),
        sx: {
          borderRadius: 1,
          cursor: "pointer"
        }
      })
    };
  };
  const {loading, error, data, refetch} = useQuery(getEnrollmentPacketsQuery, {
    variables: {
      skip,
      sort: "status|ASC",
      take: paginatinLimit,
      search: searchField,
      filters
    },
    fetchPolicy: "network-only"
  });
  const {
    loading: templateLoading,
    data: emailTemplateData,
    refetch: refetchEmailTemplate
  } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: "Enrollment Packet Page"
    },
    fetchPolicy: "network-only"
  });
  const {loading: countLoading, data: countGroup} = useQuery(packetCountQuery, {
    fetchPolicy: "network-only"
  });
  const handlePageChange = (page) => {
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25;
    });
  };
  const handlePacketSelect = (rowId) => {
    const row = enrollmentPackets?.find((el) => el.packet_id === rowId);
    setEnrollmentPacket(row);
    setIsShowModal(true);
  };
  useEffect(() => {
    if (emailTemplateData !== void 0) {
      const {emailTemplateName} = emailTemplateData;
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName);
      }
    }
  }, [emailTemplateData]);
  useEffect(() => {
    if (data !== void 0) {
      const {packets} = data;
      const {results, total} = packets;
      setEnrollmentPackets(() => {
        return map(results, (application) => {
          return application;
        });
      });
      setTotalPackets(total);
      setTableData(() => {
        return map(results, (application) => {
          return createData(application);
        });
      });
    }
  }, [loading, data]);
  useEffect(() => {
    if (countGroup) {
      setpacketCount(countGroup.packetCount.results);
    }
  }, [countGroup]);
  const headCells = [
    {
      id: "submitted",
      numeric: false,
      disablePadding: true,
      label: "Submitted"
    },
    {
      id: "status",
      numeric: false,
      disablePadding: true,
      label: "Status"
    },
    {
      id: "deadline",
      numeric: false,
      disablePadding: true,
      label: "Deadline"
    },
    {
      id: "student",
      numeric: false,
      disablePadding: true,
      label: "Student"
    },
    {
      id: "grade",
      numeric: false,
      disablePadding: true,
      label: "Grade"
    },
    {
      id: "parent",
      numeric: false,
      disablePadding: true,
      label: "Parent"
    },
    {
      id: "studentStatus",
      numeric: false,
      disablePadding: true,
      label: "Student"
    },
    {
      id: "emailed",
      numeric: false,
      disablePadding: true,
      label: "Emailed"
    }
  ];
  const handleOpenEmailModal = () => {
    if (packetIds.length === 0) {
      setOpenWarningModal(true);
      return;
    }
    setOpenEmailModal(true);
  };
  const [emailPacket, {data: emailStatus}] = useMutation(emailPacketMutation);
  const onSendEmail = async (subject, body) => {
    if (packetIds.length === 0) {
      return;
    }
    try {
      await emailPacket({
        variables: {
          emailApplicationInput: {
            application_ids: packetIds.map((id) => Number(id)),
            subject,
            body
          }
        }
      });
      refetch();
      refetchEmailTemplate();
      setOpenEmailModal(false);
    } catch (error2) {
    }
  };
  const handleEmailSend = (subject, body) => {
    if (packetIds.length === 0) {
      return;
    }
    onSendEmail(subject, body);
  };
  const handleDelete = async (id) => {
    await deletePacket({
      variables: {
        deleteApplicationInput: {
          application_ids: [id]
        }
      }
    });
    refetch();
  };
  const handleDeleteSelected = async () => {
    if (packetIds.length === 0) {
      setOpenWarningModal(true);
      return;
    }
    await deletePacket({
      variables: {
        deleteApplicationInput: {
          application_ids: packetIds
        }
      }
    });
    refetch();
  };
  const [moveThisYearPacket, {data: thisYearData}] = useMutation(moveThisYearPacketMutation);
  const handleMoveToThisYear = async () => {
    try {
      if (packetIds.length === 0) {
        setOpenWarningModal(true);
        return;
      }
      await moveThisYearPacket({
        variables: {
          deleteApplicationInput: {
            application_ids: packetIds
          }
        }
      });
      refetch();
    } catch (error2) {
    }
  };
  const [moveNextYearPacket, {data: nextYearData}] = useMutation(moveNextYearPacketMutation);
  const handleMoveToNextYear = async () => {
    if (packetIds.length === 0) {
      setOpenWarningModal(true);
      return;
    }
    await moveNextYearPacket({
      variables: {
        deleteApplicationInput: {
          application_ids: packetIds
        }
      }
    });
    refetch();
  };
  return /* @__PURE__ */ React.createElement(Card, {
    sx: {paddingTop: "24px", marginBottom: "24px", paddingBottom: "12px"}
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      marginLeft: "24px",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "medium",
    fontWeight: "700"
  }, "Packets"), /* @__PURE__ */ React.createElement(Subtitle, {
    size: "medium",
    fontWeight: "700",
    sx: {marginLeft: 2}
  }, totalPackets), /* @__PURE__ */ React.createElement(Box, {
    marginLeft: 4
  }, /* @__PURE__ */ React.createElement(OutlinedInput, {
    onFocus: (e) => e.target.placeholder = "",
    onBlur: (e) => e.target.placeholder = "Search...",
    size: "small",
    fullWidth: true,
    value: searchField,
    placeholder: "Search...",
    onChange: (e) => setSearchField(e.target.value),
    startAdornment: /* @__PURE__ */ React.createElement(InputAdornment, {
      position: "start"
    }, /* @__PURE__ */ React.createElement(SearchIcon, {
      style: {color: "black"}
    }))
  }))), /* @__PURE__ */ React.createElement(Box, {
    style: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "flex-end",
      marginRight: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 2,
      textTransform: "none",
      background: RED_GRADIENT,
      color: "white",
      width: "157px",
      marginRight: 2,
      height: "33px",
      "&:hover": {
        background: "#D23C33",
        color: "#fff"
      }
    },
    onClick: handleOpenEmailModal
  }, "Email"), /* @__PURE__ */ React.createElement(Button, {
    sx: {
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 2,
      textTransform: "none",
      height: "33px",
      background: YELLOW_GRADIENT,
      color: "white",
      width: "195px",
      marginRight: 2,
      "&:hover": {
        background: "#FFD626",
        color: "#fff"
      }
    },
    onClick: handleMoveToThisYear
  }, "Move Packets to 21-22 Year"), /* @__PURE__ */ React.createElement(Button, {
    sx: {
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 2,
      textTransform: "none",
      height: "33px",
      background: GREEN_GRADIENT,
      color: "white",
      width: "195px",
      "&:hover": {
        background: "#33FF7C",
        color: "fff"
      }
    },
    onClick: handleMoveToNextYear
  }, "Move Packetss to 22-23 Year"))), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginY: 4,
      marginRight: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      alignItems: "left"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    style: {
      display: "flex",
      flexDirection: "row",
      alignItems: "left",
      justifyContent: "flex-end",
      marginLeft: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 29,
      color: "white",
      width: "92px",
      background: RED_GRADIENT,
      "&:hover": {
        background: "#D23C33",
        color: "#fff"
      }
    },
    onClick: handleDeleteSelected
  }, "Delete"))), /* @__PURE__ */ React.createElement(Pagination, {
    setParentLimit: setPaginatinLimit,
    handlePageChange,
    defaultValue: paginatinLimit || 25,
    numPages: Math.ceil(totalPackets / paginatinLimit),
    currentPage
  })), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(EnrollmentPacketFilters, {
    filters,
    setFilters,
    packetCount
  })), /* @__PURE__ */ React.createElement(SortableTable, {
    rows: tableData,
    headCells,
    onCheck: setPacketIds,
    clearAll: false,
    onRowClick: handlePacketSelect
  }), isShowModal && /* @__PURE__ */ React.createElement(EnrollmentPacketModal, {
    handleModem: () => setIsShowModal(!isShowModal),
    packet: enrollmentPacket,
    refetch: () => refetch()
  }), openEmailModal && /* @__PURE__ */ React.createElement(EmailModal, {
    handleModem: () => setOpenEmailModal(!openEmailModal),
    title: packetIds.length + " Recipients",
    handleSubmit: handleEmailSend,
    template: emailTemplate
  }), openWarningModal && /* @__PURE__ */ React.createElement(WarningModal, {
    title: "Warning",
    subtitle: "Please select Packets",
    btntitle: "Close",
    handleModem: () => setOpenWarningModal(!openWarningModal),
    handleSubmit: () => setOpenWarningModal(!openWarningModal)
  }));
};
