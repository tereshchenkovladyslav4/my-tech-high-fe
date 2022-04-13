import {useMutation, useQuery} from "../../../../_snowpack/pkg/@apollo/client.js";
import SearchIcon from "../../../../_snowpack/pkg/@mui/icons-material/Search.js";
import {Box, Button, Card, InputAdornment, OutlinedInput} from "../../../../_snowpack/pkg/@mui/material.js";
import {map} from "../../../../_snowpack/pkg/lodash.js";
import moment from "../../../../_snowpack/pkg/moment.js";
import React, {useContext, useEffect, useState} from "../../../../_snowpack/pkg/react.js";
import {Pagination} from "../../../components/Pagination/Pagination.js";
import {SortableUserTable} from "../../../components/SortableTable/SortableUserTable.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {WarningModal} from "../../../components/WarningModal/Warning.js";
import {changeUserStatusMutation} from "../../../graphql/mutation/user.js";
import {getUsersByRegions} from "../../../graphql/queries/user.js";
import {UserContext} from "../../../providers/UserContext/UserProvider.js";
import {BUTTON_LINEAR_GRADIENT} from "../../../utils/constants.js";
import {NewUserModal} from "./NewUserModal/NewUserModal.js";
import {UserFilters} from "./UserFilters/UserFilters.js";
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
export const Users = () => {
  const [rows, setRows] = useState([]);
  const [counter, setCounter] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState();
  const {me} = useContext(UserContext);
  const [apolloError, setApolloError] = useState({
    title: "",
    severity: "",
    flag: false
  });
  const [users, setUsers] = useState([]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [seachField, setSearchField] = useState("");
  const [selectedFilter, setselectedFilter] = useState([
    {
      id: 2,
      name: "Parent",
      type: "role"
    },
    {
      id: 3,
      name: "Student",
      type: "role"
    }
  ]);
  React.useEffect(() => {
    setSelectedRegion(JSON.parse(localStorage.getItem("selectedRegion")));
    window.addEventListener("storage", storageEventHandler, false);
  }, []);
  function storageEventHandler() {
    console.log("Hi from storageEventHandler");
    const region = localStorage.getItem("selectedRegion");
    setSelectedRegion(JSON.parse(region));
  }
  const {loading, error, data} = useQuery(getUsersByRegions, {
    variables: {
      regions: [selectedRegion?.region_id]
    },
    skip: selectedRegion === void 0,
    fetchPolicy: "cache-and-network"
  });
  const [changeUserStatus, {data: responseData, loading: uploading, error: uploadingError}] = useMutation(changeUserStatusMutation);
  useEffect(() => {
    if (!uploading && responseData !== void 0) {
      setApolloError({
        title: "Status has been updated",
        severity: "Success",
        flag: true
      });
    } else {
      if (uploadingError?.networkError || uploadingError?.graphQLErrors?.length > 0 || uploadingError?.clientErrors.length > 0) {
        setApolloError({
          title: uploadingError?.clientErrors[0]?.message || uploadingError?.graphQLErrors[0]?.message || uploadingError?.networkError?.message,
          severity: "Error",
          flag: true
        });
      }
    }
  }, [uploading]);
  const handleStatusChange = (id, status) => {
    const payload = {
      user_id: Number(id),
      creator_id: Number(me?.user_id),
      status: status.toString()
    };
    changeUserStatus({
      variables: payload,
      refetchQueries: [{query: getUsersByRegions}]
    });
  };
  useEffect(() => {
    if (!loading && data !== void 0) {
      const updatedRecord = [];
      console.log(data?.usersByRegions);
      map(data?.usersByRegions, (user) => {
        updatedRecord.push({
          user_id: user.user_id,
          name: `${user.first_name} ${user?.last_name}` || "",
          email: user.email,
          level: user?.role?.name || "null",
          last_login: user?.last_login ? moment(user?.last_login).format("L") : "Never",
          status: user?.status,
          can_emulate: user?.can_emulate ? true : false
        });
      });
      setUsers(updatedRecord);
      setRows(updatedRecord);
      setCounter((counter2) => counter2 + 1);
    } else {
      if (error?.networkError || error?.graphQLErrors?.length > 0 || error?.clientErrors.length > 0) {
        setApolloError({
          title: error?.clientErrors[0]?.message || error?.graphQLErrors[0]?.message || error?.networkError?.message,
          severity: "Error",
          flag: true
        });
      }
    }
  }, [loading]);
  useEffect(() => {
    requestRoleFilter(null, -1);
  }, [counter]);
  const handleModal = () => setNewUserModal(!newUserModal);
  const headCells = [
    {
      id: "user_id",
      numeric: false,
      disablePadding: true,
      label: "ID"
    },
    {
      id: "first_name",
      numeric: false,
      disablePadding: true,
      label: "Name"
    },
    {
      id: "email",
      numeric: false,
      disablePadding: true,
      label: "Email"
    },
    {
      id: "level",
      numeric: false,
      disablePadding: true,
      label: "Level"
    },
    {
      id: "last_login",
      numeric: false,
      disablePadding: true,
      label: "Last Login"
    },
    {
      id: "status",
      numeric: false,
      disablePadding: true,
      label: "Status"
    },
    {
      id: "can_emulate",
      numeric: false,
      disablePadding: true,
      label: "Can Emulate"
    }
  ];
  const requestSearchHandler = (input) => {
    const searchRegex = new RegExp(escapeRegExp(input), "i");
    const filteredRows = users.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };
  useEffect(() => {
    requestSearchHandler(seachField);
  }, [seachField]);
  const requestRoleFilter = (role, active) => {
    const updatedFilters = selectedFilter;
    let updatedRows = [];
    let fieldData = [];
    let otherData = [];
    if (role !== null) {
      const existed = updatedFilters.findIndex((filter) => filter.id === active);
      if (existed !== -1) {
        updatedFilters.splice(existed, 1);
      } else {
        updatedFilters.push({
          name: role.name,
          id: active,
          type: role.type
        });
      }
      setselectedFilter(updatedFilters);
    }
    map(updatedFilters, (filter) => {
      if (filter.type === "field") {
        const filteredRecord = users.filter((user) => {
          return Number(user?.status) === 0;
        });
        fieldData = [...fieldData, ...filteredRecord];
      } else {
        const filteredRecord = users.filter((user) => {
          return user?.level === filter.name;
        });
        otherData = [...otherData, ...filteredRecord];
      }
    });
    updatedRows = [...fieldData, ...otherData];
    if (updatedFilters.length > 0) {
      if (updatedRows.length > 0) {
        setRows(updatedRows);
      } else {
        setRows([]);
      }
    } else {
      setRows(users);
    }
  };
  return /* @__PURE__ */ React.createElement(Card, {
    sx: {paddingTop: "24px", margin: 2}
  }, apolloError.flag && /* @__PURE__ */ React.createElement(WarningModal, {
    handleModem: () => setApolloError({title: "", severity: "", flag: false}),
    title: apolloError.severity,
    subtitle: apolloError.title,
    btntitle: "Close",
    handleSubmit: () => setApolloError({title: "", severity: "", flag: false})
  }), /* @__PURE__ */ React.createElement(Box, {
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
      marginLeft: "24px"
    }
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "medium",
    fontWeight: "700"
  }, "Users"), /* @__PURE__ */ React.createElement(Subtitle, {
    size: "medium",
    fontWeight: "700",
    sx: {marginLeft: 2}
  }, loading ? "..." : users?.length)), /* @__PURE__ */ React.createElement(Box, {
    style: {display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(OutlinedInput, {
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
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => {
      if (me?.level === 1) {
        handleModal();
      } else {
        setApolloError({
          title: "You do not have access for this action.",
          severity: "Error",
          flag: true
        });
      }
    },
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      width: "150px"
    }
  }, "New User"), /* @__PURE__ */ React.createElement(Pagination, {
    handlePageChange: () => null,
    numPages: 5,
    currentPage: 1
  }))), /* @__PURE__ */ React.createElement(UserFilters, {
    onPress: requestRoleFilter,
    filters: selectedFilter
  }), /* @__PURE__ */ React.createElement(SortableUserTable, {
    rows,
    headCells,
    onCheck: () => {
    },
    updateStatus: handleStatusChange,
    clearAll: false,
    onRowClick: () => null,
    type: "core_user"
  }), newUserModal && /* @__PURE__ */ React.createElement(NewUserModal, {
    visible: newUserModal,
    handleModem: handleModal
  }));
};
