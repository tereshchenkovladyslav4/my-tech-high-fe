import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  OutlinedInput
} from "../../../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {BUTTON_LINEAR_GRADIENT, GREEN_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT} from "../../../../utils/constants.js";
import SearchIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Search.js";
import {Paragraph} from "../../../../components/Typography/Paragraph/Paragraph.js";
import {Pagination} from "../../../../components/Pagination/Pagination.js";
import {SortableTable} from "../../../../components/SortableTable/SortableTable.js";
import {ApplicationEmailModal as EmailModal} from "../../../../components/EmailModal/ApplicationEmailModal.js";
import {useQuery, useMutation} from "../../../../../_snowpack/pkg/@apollo/client.js";
import {
  getApplicationsQuery,
  approveApplicationMutation,
  deleteApplicationMutation,
  emailApplicationMutation,
  moveThisYearApplicationMutation,
  moveNextYearApplicationMutation,
  getSchoolYearQuery,
  updateApplicationMutation,
  toggleHideApplicationMutation
} from "../services.js";
import {getEmailTemplateQuery} from "../../../../graphql/queries/email-template.js";
import {map, parseInt} from "../../../../../_snowpack/pkg/lodash.js";
import moment from "../../../../../_snowpack/pkg/moment.js";
import {WarningModal} from "../../../../components/WarningModal/Warning.js";
import {ApplicationModal} from "../ApplicationModal/ApplicationModal.js";
import {ApplicationEmailModal} from "../ApplicationModal/ApplicationEmailModal.js";
export const ApplicationTable = ({filter}) => {
  const [emailTemplate, setEmailTemplate] = useState();
  const [pageLoading, setPageLoading] = useState(false);
  const [seachField, setSearchField] = useState("");
  const [shouldClear, setShouldClear] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [paginatinLimit, setPaginatinLimit] = useState(Number(localStorage.getItem("pageLimit")) || 25);
  const [skip, setSkip] = useState(0);
  const [totalApplications, setTotalApplications] = useState();
  const [tableData, setTableData] = useState([]);
  const [applicationIds, setApplicationIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [acceptMidYear, setAcceptMidYear] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [schoolYears, setSchoolYears] = useState([]);
  const [editData, setEditData] = useState();
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [emailHostory, setEmailHistory] = useState([]);
  const specialEds = ["None", "IEP", "504", "Exit"];
  const status = ["New", "Sibling", "Returning", "Hidden"];
  const createData = (application) => {
    return {
      id: application.application_id,
      submitted: application.date_submitted ? moment(application.date_submitted).format("MM/DD/YY") : null,
      year: `${moment(application.school_year.date_begin).format("YYYY")}-${moment(application.school_year.date_end).format("YY")}`,
      student: `${application.student.person.last_name}, ${application.student.person.first_name}`,
      grade: application.student.grade_levels.length && (application.student.grade_levels[0].grade_level.includes("Kin") ? "K" : application.student.grade_levels[0].grade_level),
      sped: application.student.special_ed ? "Yes" : "No",
      parent: `${application.student.parent.person.last_name}, ${application.student.parent.person.first_name}`,
      relation: application.relation_status ? status[application.relation_status] : "New",
      verified: application?.student?.parent?.person?.email_verifier?.verified ? "Yes" : "No",
      emailed: application.application_emails.length > 0 ? /* @__PURE__ */ React.createElement(Box, {
        sx: {cursor: "pointer"},
        onClick: () => handleOpenEmailHistory(application)
      }, moment(application.application_emails[0].created_at).format("MM/DD/YY")) : null,
      actions: /* @__PURE__ */ React.createElement(Box, {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }, /* @__PURE__ */ React.createElement(Box, {
        display: "flex",
        flexDirection: "column",
        marginRight: 4,
        sx: {width: 15}
      }, application.hidden ? /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium",
        sx: {cursor: "pointer"},
        fontWeight: "700",
        onClick: () => handleToggleHideApplication(application.application_id, false)
      }, "Unhide") : /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium",
        sx: {cursor: "pointer"},
        fontWeight: "700",
        onClick: () => handleToggleHideApplication(application.application_id, true)
      }, "Hide"), /* @__PURE__ */ React.createElement(Paragraph, {
        size: "medium",
        sx: {cursor: "pointer"},
        fontWeight: "700",
        onClick: () => handleEditApplication(application)
      }, "Edit")), /* @__PURE__ */ React.createElement(Box, {
        onClick: (event) => handleDelete(application.application_id),
        sx: {
          borderRadius: 1,
          cursor: "pointer"
        }
      }, /* @__PURE__ */ React.createElement("svg", {
        width: "14",
        height: "18",
        viewBox: "0 0 14 18",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, /* @__PURE__ */ React.createElement("path", {
        d: "M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z",
        fill: "#323232"
      }))))
    };
  };
  const {loading: schoolLoading, data: schoolYearData} = useQuery(getSchoolYearQuery);
  const {called, loading, error, data, refetch} = useQuery(getApplicationsQuery, {
    variables: {
      filter,
      skip,
      sort: "status|ASC",
      take: paginatinLimit,
      search: seachField
    },
    fetchPolicy: "network-only"
  });
  const {
    loading: templateLoading,
    data: emailTemplateData,
    refetch: refetchEmailTemplate
  } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: "Application Page"
    },
    fetchPolicy: "network-only"
  });
  const handlePageChange = (page) => {
    localStorage.setItem("currentPage", page.toString());
    setCurrentPage(page);
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25;
    });
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
    setSchoolYears(schoolYearData?.schoolYears);
  }, [schoolLoading]);
  useEffect(() => {
    if (pageLoading) {
      setSkip(0);
      setCurrentPage(1);
    }
  }, [filter]);
  useEffect(() => {
    if (data !== void 0) {
      setPageLoading(true);
      const {applications} = data;
      const {results, total} = applications;
      setTableData(() => {
        return map(results, (application) => {
          if (editData && editData.application_id === application.application_id) {
            setEditData(application);
          }
          return createData(application);
        });
      });
      setTotalApplications(total);
    }
  }, [data]);
  useEffect(() => {
    if (localStorage.getItem("currentPage")) {
      handlePageChange(Number(localStorage.getItem("currentPage")));
    }
    if (localStorage.getItem("pageLimit")) {
      setPaginatinLimit(Number(localStorage.getItem("pageLimit")));
    }
    return () => {
      localStorage.removeItem("currentPage");
      localStorage.removeItem("pageLimit");
    };
  }, []);
  const tableHeaders = [
    {
      id: "submitted",
      numeric: false,
      disablePadding: true,
      label: "Submitted"
    },
    {
      id: "year",
      numeric: false,
      disablePadding: true,
      label: "Year"
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
      id: "sped",
      numeric: false,
      disablePadding: true,
      label: "SPED"
    },
    {
      id: "parent",
      numeric: false,
      disablePadding: true,
      label: "Parent"
    },
    {
      id: "relation",
      numeric: false,
      disablePadding: true,
      label: "Relation"
    },
    {
      id: "verified",
      numeric: false,
      disablePadding: true,
      label: "Verified"
    },
    {
      id: "emailed",
      numeric: false,
      disablePadding: true,
      label: "Emailed"
    },
    {
      id: "Actions",
      numeric: false,
      disablePadding: true,
      label: "Actions"
    }
  ];
  const [deleteApplication, {data: deleteData}] = useMutation(deleteApplicationMutation);
  const handleDelete = async (id) => {
    await deleteApplication({
      variables: {
        deleteApplicationInput: {
          application_ids: [id]
        }
      }
    });
    refetch();
  };
  const handleDeleteSelected = async () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true);
      return;
    }
    await deleteApplication({
      variables: {
        deleteApplicationInput: {
          application_ids: applicationIds
        }
      }
    });
    refetch();
  };
  const handleApplicationAccept = async () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true);
      return;
    }
    await approveApplicationAction();
  };
  const [approveApplication, {data: dt}] = useMutation(approveApplicationMutation);
  const approveApplicationAction = async () => {
    await approveApplication({
      variables: {
        acceptApplicationInput: {
          application_ids: applicationIds,
          midyear_application: acceptMidYear
        }
      }
    });
    refetch();
  };
  const [emailApplication, {data: emailStatus}] = useMutation(emailApplicationMutation);
  const onSendEmail = async (subject, body) => {
    if (applicationIds.length === 0) {
      return;
    }
    try {
      await emailApplication({
        variables: {
          emailApplicationInput: {
            application_ids: applicationIds.map((item) => parseInt(item)),
            subject,
            body
          }
        }
      });
      refetchEmailTemplate();
      refetch();
      setOpen(false);
    } catch (error2) {
    }
  };
  const handleEmailSend = (subject, body) => {
    if (applicationIds.length === 0) {
      return;
    }
    onSendEmail(subject, body);
  };
  const handleOpenEmailModal = () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true);
    } else {
      setOpen(true);
    }
  };
  const [moveThisYearApplication, {data: thisYearData}] = useMutation(moveThisYearApplicationMutation);
  const handleMoveToThisYear = async () => {
    try {
      if (applicationIds.length === 0) {
        setOpenAlert(true);
        return;
      }
      await moveThisYearApplication({
        variables: {
          deleteApplicationInput: {
            application_ids: applicationIds
          }
        }
      });
      refetch();
    } catch (error2) {
    }
  };
  const [moveNextYearApplication, {data: nextYearData}] = useMutation(moveNextYearApplicationMutation);
  const handleMoveToNextYear = async () => {
    if (applicationIds.length === 0) {
      setOpenAlert(true);
      return;
    }
    await moveNextYearApplication({
      variables: {
        deleteApplicationInput: {
          application_ids: applicationIds
        }
      }
    });
    refetch();
  };
  const handleChangeMidYer = (e) => {
    setAcceptMidYear(e.target.checked);
  };
  const handleEditApplication = (data2) => {
    setEditData(data2);
    setOpenEditModal(true);
  };
  const [updateApplication, {data: updatedData}] = useMutation(updateApplicationMutation);
  const handleSaveApplication = async (data2) => {
    await updateApplication({
      variables: {
        updateApplicationInput: {
          application_id: Number(data2.application_id),
          school_year_id: Number(data2.school_year_id),
          status: data2.status,
          midyear_application: data2.midyear_application === "true" ? true : false
        }
      }
    });
    refetch();
    setOpenEditModal(false);
  };
  const [toogleHideApplication, {data: toggleData}] = useMutation(toggleHideApplicationMutation);
  const handleToggleHideApplication = async (application_id, status2) => {
    await toogleHideApplication({
      variables: {
        updateApplicationInput: {
          application_id: Number(application_id),
          midyear_application: status2,
          relation_status: "1",
          school_year_id: 1
        }
      }
    });
    refetch();
  };
  const handleOpenEmailHistory = (data2) => {
    setEmailHistory(data2?.application_emails);
    setOpenEmailModal(true);
  };
  const handleChangePageLimit = (value) => {
    localStorage.setItem("pageLimit", value);
    handlePageChange(1);
    setPaginatinLimit(value);
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
  }, "Applications"), /* @__PURE__ */ React.createElement(Subtitle, {
    size: "medium",
    fontWeight: "700",
    sx: {marginLeft: 2}
  }, totalApplications), /* @__PURE__ */ React.createElement(Box, {
    marginLeft: 4
  }, /* @__PURE__ */ React.createElement(OutlinedInput, {
    onFocus: (e) => e.target.placeholder = "",
    onBlur: (e) => e.target.placeholder = "Search...",
    size: "small",
    fullWidth: true,
    value: seachField,
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
  }, "Move Application to This Year"), /* @__PURE__ */ React.createElement(Button, {
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
  }, "Move Applications to Next Year"))), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      alignItems: "left",
      marginTop: "12px"
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
  }, "Delete"))), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginY: "12px"
    }
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      marginLeft: "24px",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      borderRadius: 2,
      textTransform: "none",
      height: 29,
      background: BUTTON_LINEAR_GRADIENT,
      color: "white",
      marginRight: "12px",
      width: "92px"
    },
    onClick: handleApplicationAccept
  }, "Accept"), /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      value: acceptMidYear,
      onChange: handleChangeMidYer
    }),
    label: "Accept as Mid-year"
  }))), /* @__PURE__ */ React.createElement(Pagination, {
    setParentLimit: handleChangePageLimit,
    handlePageChange,
    defaultValue: paginatinLimit || 25,
    numPages: Math.ceil(totalApplications / paginatinLimit) || 0,
    currentPage
  })), /* @__PURE__ */ React.createElement(SortableTable, {
    rows: tableData,
    headCells: tableHeaders,
    onCheck: setApplicationIds,
    clearAll: shouldClear
  }), open && /* @__PURE__ */ React.createElement(EmailModal, {
    handleModem: () => setOpen(!open),
    title: applicationIds.length + " Recipients",
    handleSubmit: handleEmailSend,
    template: emailTemplate
  }), openAlert && /* @__PURE__ */ React.createElement(WarningModal, {
    handleModem: () => setOpenAlert(!openAlert),
    title: "Warning",
    subtitle: "Please select applications",
    btntitle: "Close",
    handleSubmit: () => setOpenAlert(!openAlert)
  }), openEditModal && /* @__PURE__ */ React.createElement(ApplicationModal, {
    handleModem: () => setOpenEditModal(!openEditModal),
    handleSubmit: (data2) => handleSaveApplication(data2),
    data: editData,
    schoolYears,
    handleRefetch: refetch
  }), openEmailModal && /* @__PURE__ */ React.createElement(ApplicationEmailModal, {
    handleModem: () => setOpenEmailModal(!openEditModal),
    handleSubmit: () => setOpenEmailModal(false),
    data: emailHostory
  }));
};
