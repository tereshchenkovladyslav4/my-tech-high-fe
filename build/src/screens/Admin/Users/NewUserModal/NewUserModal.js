import React, {Fragment, useCallback, useContext, useEffect, useState} from "../../../../../_snowpack/pkg/react.js";
import {useMutation, useQuery} from "../../../../../_snowpack/pkg/@apollo/client.js";
import CloseIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {Button, Checkbox, FormControlLabel, FormGroup, Grid, Modal, TextField, IconButton} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import {map} from "../../../../../_snowpack/pkg/lodash.js";
import {DropDown} from "../../../../components/DropDown/DropDown.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {createUserMutation} from "../../../../graphql/mutation/user.js";
import {getAllAccess} from "../../../../graphql/queries/access.js";
import {getAllRegion} from "../../../../graphql/queries/region.js";
import {getAllRoles} from "../../../../graphql/queries/role.js";
import {getUsersByRegions} from "../../../../graphql/queries/user.js";
import {UserContext} from "../../../../providers/UserContext/UserProvider.js";
import {BUTTON_LINEAR_GRADIENT, PROVIDERS, SOE, SOE_OPTIONS, SPED} from "../../../../utils/constants.js";
import {useStyles} from "./styles.js";
import {WarningModal} from "../../../../components/WarningModal/Warning.js";
import {AddedModal} from "./AddedModal/AddedModal.js";
export const NewUserModal = ({
  handleModem,
  visible
}) => {
  const classes = useStyles;
  const {me} = useContext(UserContext);
  const [apolloError, setApolloError] = useState({
    title: "",
    severity: "",
    flag: false
  });
  const [userAddedModal, setUserAddedModal] = useState(false);
  const [email, setEmail] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [state, setState] = useState([]);
  const [regionAll, setRegionAll] = useState(false);
  const [accessAll, setAccessAll] = useState(false);
  const [counter, setCounter] = useState(0);
  const [soe, setSoe] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [regions, setRegions] = useState([]);
  const [accesses, setAccesses] = useState([]);
  const [role, setRole] = useState(0);
  const [rolesOption, setRolesOption] = useState([]);
  const [regionOption, setRegionOption] = useState([]);
  const [accessOption, setAccessOption] = useState([]);
  const {loading: load1, error: error1, data: data1} = useQuery(getAllRegion);
  const {loading: load2, data: data2} = useQuery(getAllRoles);
  const {loading: load3, data: data3} = useQuery(getAllAccess);
  const [createUser, {data: responseData, loading: uploading, error: uploadingError}] = useMutation(createUserMutation);
  useEffect(() => {
    if (!uploading && responseData !== void 0) {
      setUserAddedModal(true);
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
  useEffect(() => {
    if (!load1 && data1 !== void 0) {
      const updatedRegions = map(data1?.regions, (region) => {
        return {
          value: region.id,
          label: region.name,
          selected: false
        };
      });
      setRegionOption(updatedRegions);
    } else {
      console.log(JSON.stringify(error1, null, 2));
    }
  }, [load1]);
  useEffect(() => {
    if (!load2 && data2 !== void 0) {
      const updatedRoles = data2?.roles?.map((role2) => {
        return {
          label: role2?.name,
          value: role2?.id
        };
      });
      setRolesOption(updatedRoles);
    }
  }, [load2]);
  useEffect(() => {
    if (!load3 && data3 !== void 0) {
      setAccessOption(data3?.getAllAccesses);
      const updatedAccess = map(data3?.getAllAccesses, (access) => {
        return {
          value: access.id,
          label: access.name,
          selected: false
        };
      });
      setAccessOption(updatedAccess);
    }
  }, [load3]);
  const dropDownSOE = map(SOE, (el) => ({
    label: el,
    value: el
  }));
  const handleRoleChange = (value) => {
    const data = rolesOption.filter((role2) => role2?.value == value);
    if (data.length > 0) {
      setUserLevel(data[0]?.label);
    }
    setRegions([]);
    setAccesses([]);
    toggleCheckBoxes("region");
    toggleCheckBoxes("access");
    setSelectedState(null);
    setParentEmail("");
    setSoe("");
  };
  const toggleCheckBoxes = (group, flag = false) => {
    if (group === "region") {
      if (flag) {
        const updatedRegion = map(regionOption, (region) => {
          return {
            value: region.value,
            label: region.label,
            selected: true
          };
        });
        const regions2 = [];
        map(updatedRegion, (reg) => regions2.push(Number(reg.value)));
        setRegions(regions2);
        setRegionOption(updatedRegion);
      } else {
        const updatedRegion = map(regionOption, (region) => {
          return {
            value: region.value,
            label: region.label,
            selected: false
          };
        });
        setRegionOption(updatedRegion);
        setRegions([]);
      }
    } else if (group === "access") {
      if (flag) {
        const updatedAccess = map(accessOption, (access2) => {
          return {
            value: access2.value,
            label: access2.label,
            selected: true
          };
        });
        setAccessOption(updatedAccess);
        const access = [];
        map(updatedAccess, (acc) => access.push(Number(acc.value)));
        setAccesses(access);
      } else {
        const updatedAccess = map(accessOption, (access) => {
          return {
            value: access.value,
            label: access.label,
            selected: false
          };
        });
        setAccessOption(updatedAccess);
        setAccesses([]);
      }
    }
  };
  const handleRegionChange = (value, index, checked) => {
    checkboxRegionChanged(index, checked);
    const updatedRegions = regions;
    const indexAt = updatedRegions.findIndex((r) => r == value);
    if (indexAt !== -1) {
      updatedRegions.splice(indexAt, 1);
    } else {
      updatedRegions.push(Number(value));
    }
    if (updatedRegions.length === regionOption.length) {
      setRegionAll(true);
    } else {
      setRegionAll(false);
    }
    setRegions(updatedRegions);
  };
  const handleAccessChange = (value, index, checked) => {
    checkboxAccessChanged(index, checked);
    const updatedAccesses = accesses;
    const indexAt = updatedAccesses.findIndex((r) => r == value);
    if (indexAt !== -1) {
      updatedAccesses.splice(indexAt, 1);
    } else {
      updatedAccesses.push(Number(value));
    }
    if (updatedAccesses.length === accessOption.length) {
      setAccessAll(true);
    } else {
      setAccessAll(false);
    }
    setAccesses(updatedAccesses);
  };
  const checkboxAccessChanged = (index, checked) => {
    const updatedAccess = accessOption;
    accessOption[index].selected = !checked;
    setAccessOption(updatedAccess);
    setCounter((counter2) => counter2 + 1);
  };
  const checkboxRegionChanged = (index, checked) => {
    const updatedRegion = regionOption;
    regionOption[index].selected = !checked;
    setRegionOption(updatedRegion);
    setCounter((counter2) => counter2 + 1);
  };
  const handleSubmit = () => {
    if (!firstName) {
      setApolloError({
        title: "First name is required",
        severity: "Warning",
        flag: true
      });
      return;
    } else if (!email) {
      setApolloError({
        title: "Email address is required",
        severity: "Warning",
        flag: true
      });
      return;
    } else if (!role) {
      setApolloError({
        title: "You must declare a role for user.",
        severity: "Warning",
        flag: true
      });
      return;
    }
    const payload = {
      creator_id: Number(me.user_id),
      email,
      first_name: firstName,
      last_name: lastName,
      level: Number(role),
      regions: selectedState ? [Number(selectedState)] : regions,
      parent_email: parentEmail,
      access: accesses
    };
    createUser({
      variables: {createUserInput: payload},
      refetchQueries: [{
        query: getUsersByRegions,
        variables: {
          regions: map(me?.userRegion, (region) => region.region_id)
        }
      }]
    });
  };
  const conditionalUserForm = useCallback(() => {
    let form;
    switch (userLevel) {
      case "Teacher":
      case "Super Admin":
        form = /* @__PURE__ */ React.createElement(Grid, {
          item: true
        }, /* @__PURE__ */ React.createElement(Subtitle, {
          fontWeight: "700"
        }, "Regions"), /* @__PURE__ */ React.createElement(FormGroup, null, map(regionOption, (region, index) => /* @__PURE__ */ React.createElement(FormControlLabel, {
          key: index,
          control: /* @__PURE__ */ React.createElement(Checkbox, {
            checked: region.selected,
            onChange: () => handleRegionChange(region.value, index, region.selected)
          }),
          label: region.label
        })), /* @__PURE__ */ React.createElement(FormControlLabel, {
          control: /* @__PURE__ */ React.createElement(Checkbox, {
            checked: regionAll,
            onChange: (e) => {
              setRegionAll(e.target.checked);
              toggleCheckBoxes("region", e.target.checked ? true : false);
              setCounter((counter2) => counter2 + 1);
            }
          }),
          label: "All"
        })));
        break;
      case "Admin":
        form = /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          container: true,
          xs: 12
        }, /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 6
        }, /* @__PURE__ */ React.createElement(Subtitle, {
          fontWeight: "700"
        }, "Regions"), /* @__PURE__ */ React.createElement(FormGroup, null, map(regionOption, (region, index) => /* @__PURE__ */ React.createElement(FormControlLabel, {
          key: index,
          control: /* @__PURE__ */ React.createElement(Checkbox, {
            checked: region.selected,
            onChange: () => handleRegionChange(region.value, index, region.selected)
          }),
          label: region.label
        })), /* @__PURE__ */ React.createElement(FormControlLabel, {
          control: /* @__PURE__ */ React.createElement(Checkbox, {
            checked: regionAll,
            onChange: (e) => {
              setRegionAll(e.target.checked);
              toggleCheckBoxes("region", e.target.checked ? true : false);
            }
          }),
          label: "All"
        }))), /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 6
        }, /* @__PURE__ */ React.createElement(Subtitle, {
          fontWeight: "700"
        }, "Access"), /* @__PURE__ */ React.createElement(FormGroup, null, map(accessOption, (access, index) => /* @__PURE__ */ React.createElement(FormControlLabel, {
          key: index,
          control: /* @__PURE__ */ React.createElement(Checkbox, {
            checked: access.selected,
            onChange: () => handleAccessChange(access.value, index, access.selected)
          }),
          label: access.label
        })), /* @__PURE__ */ React.createElement(FormControlLabel, {
          control: /* @__PURE__ */ React.createElement(Checkbox, {
            checked: accessAll,
            onChange: (e) => {
              setAccessAll(e.target.checked);
              toggleCheckBoxes("access", e.target.checked ? true : false);
            }
          }),
          label: "All"
        }))));
        break;
      case "Parent":
        form = /* @__PURE__ */ React.createElement(Grid, {
          container: true
        }, /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 6
        }, /* @__PURE__ */ React.createElement(DropDown, {
          size: "small",
          dropDownItems: regionOption,
          defaultValue: selectedState,
          placeholder: "Select State",
          setParentValue: (value) => setSelectedState(Number(value))
        })));
        break;
      case "Observer":
      case "Student":
        form = /* @__PURE__ */ React.createElement(Grid, {
          container: true
        }, /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 6
        }, /* @__PURE__ */ React.createElement(DropDown, {
          size: "small",
          dropDownItems: regionOption,
          defaultValue: selectedState,
          placeholder: "Select State",
          setParentValue: (value) => {
            setSelectedState(Number(value));
          }
        }), selectedState ? /* @__PURE__ */ React.createElement(Box, {
          sx: {mt: 2}
        }, /* @__PURE__ */ React.createElement(Subtitle, null, "Parent Email"), /* @__PURE__ */ React.createElement(TextField, {
          size: "small",
          variant: "outlined",
          fullWidth: true,
          value: parentEmail,
          onChange: (e) => setParentEmail(e.target.value)
        })) : /* @__PURE__ */ React.createElement(Fragment, null)), /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 2
        }), /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 4
        }, /* @__PURE__ */ React.createElement(Subtitle, {
          fontWeight: "700"
        }, "Access"), /* @__PURE__ */ React.createElement(FormGroup, null, map(accessOption, (access, index) => /* @__PURE__ */ React.createElement(FormControlLabel, {
          key: index,
          control: /* @__PURE__ */ React.createElement(Checkbox, {
            checked: access.selected,
            onChange: () => handleAccessChange(access.value, index, access.selected)
          }),
          label: access.label
        })), /* @__PURE__ */ React.createElement(FormControlLabel, {
          control: /* @__PURE__ */ React.createElement(Checkbox, {
            checked: accessAll,
            onChange: (e) => {
              setAccessAll(e.target.checked);
              toggleCheckBoxes("access", e.target.checked ? true : false);
            }
          }),
          label: "All"
        }))));
        break;
      case "Teacher Assistant":
        form = /* @__PURE__ */ React.createElement(Grid, {
          container: true,
          justifyContent: "space-between"
        }, /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 6
        }, /* @__PURE__ */ React.createElement(DropDown, {
          size: "small",
          dropDownItems: regionOption,
          defaultValue: selectedState,
          placeholder: "Select State",
          setParentValue: (value) => setSelectedState(Number(value)),
          sx: {width: "100%"}
        }), selectedState ? /* @__PURE__ */ React.createElement(Box, {
          sx: {mt: 2}
        }, /* @__PURE__ */ React.createElement(DropDown, {
          size: "small",
          dropDownItems: dropDownSOE,
          placeholder: soe,
          setParentValue: setSoe
        })) : /* @__PURE__ */ React.createElement(Fragment, null)), /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 4,
          sx: {ml: 4}
        }, conditionalTAForm()));
        break;
      case "School Partner":
        form = /* @__PURE__ */ React.createElement(Grid, {
          container: true
        }, /* @__PURE__ */ React.createElement(Grid, {
          item: true,
          xs: 6
        }, /* @__PURE__ */ React.createElement(DropDown, {
          size: "small",
          dropDownItems: regionOption,
          defaultValue: selectedState,
          placeholder: "Select State",
          setParentValue: (value) => setSelectedState(Number(value)),
          sx: {width: "100%"}
        }), selectedState ? /* @__PURE__ */ React.createElement(Box, {
          sx: {mt: 2}
        }, /* @__PURE__ */ React.createElement(DropDown, {
          size: "small",
          dropDownItems: dropDownSOE,
          placeholder: "Select Type",
          setParentValue: setSoe,
          sx: {width: "100%"}
        })) : /* @__PURE__ */ React.createElement(Fragment, null)));
        break;
      default:
        break;
    }
    return form;
  }, [userLevel, selectedState, regionAll, accessAll, parentEmail, soe]);
  const conditionalTAForm = () => {
    let form;
    switch (soe) {
      case "School of Enrollment":
        form = /* @__PURE__ */ React.createElement(Box, {
          sx: {
            display: "flex",
            flexDirection: "column"
          }
        }, /* @__PURE__ */ React.createElement(Subtitle, {
          fontWeight: "700"
        }, "School of Enrollment"), map(SOE_OPTIONS, (option) => /* @__PURE__ */ React.createElement(FormControlLabel, {
          control: /* @__PURE__ */ React.createElement(Checkbox, null),
          label: option
        })));
        break;
      case "Provider":
        form = /* @__PURE__ */ React.createElement(Box, {
          sx: {
            display: "flex",
            flexDirection: "column"
          }
        }, /* @__PURE__ */ React.createElement(Subtitle, {
          fontWeight: "700"
        }, "Providers"), map(PROVIDERS, (provider) => /* @__PURE__ */ React.createElement(FormControlLabel, {
          control: /* @__PURE__ */ React.createElement(Checkbox, null),
          label: provider
        })));
        break;
      case "SPED":
        form = /* @__PURE__ */ React.createElement(Box, {
          sx: {
            display: "flex",
            flexDirection: "column"
          }
        }, /* @__PURE__ */ React.createElement(Subtitle, {
          fontWeight: "700"
        }, "SPED"), map(SPED, (sped) => /* @__PURE__ */ React.createElement(FormControlLabel, {
          control: /* @__PURE__ */ React.createElement(Checkbox, null),
          label: sped
        })));
        break;
    }
    return form;
  };
  return /* @__PURE__ */ React.createElement(Modal, {
    open: visible,
    onClose: () => handleModem(),
    "aria-labelledby": "Create User",
    "aria-describedby": "Create New User"
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, userAddedModal && /* @__PURE__ */ React.createElement(AddedModal, {
    handleModem: (type) => {
      if (type === "finish") {
        setUserAddedModal(false);
        handleModem();
      } else if (type === "add") {
        setFirstName("");
        setLastName("");
        setUserLevel("");
        setRole(-1);
        setParentEmail("");
        setSoe("");
        setUserAddedModal(false);
      }
    }
  }), apolloError.flag && /* @__PURE__ */ React.createElement(WarningModal, {
    handleModem: () => setApolloError({title: "", severity: "", flag: false}),
    title: apolloError.severity,
    subtitle: apolloError.title,
    btntitle: "Close",
    handleSubmit: () => setApolloError({title: "", severity: "", flag: false})
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.header
  }, /* @__PURE__ */ React.createElement(Subtitle, null, "This user will receive an email giving them a link to create a password."), /* @__PURE__ */ React.createElement(IconButton, {
    onClick: handleModem
  }, /* @__PURE__ */ React.createElement(CloseIcon, {
    style: classes.close
  }))), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Email"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: email,
    onChange: (e) => setEmail(e.target.value)
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "First Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: firstName,
    onChange: (e) => setFirstName(e.target.value)
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700",
    size: "large"
  }, "Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    value: lastName,
    onChange: (e) => setLastName(e.target.value)
  })), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    item: true,
    xs: 9
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sx: {mb: 3}
  }, /* @__PURE__ */ React.createElement(DropDown, {
    dropDownItems: rolesOption,
    placeholder: "User Type",
    setParentValue: (value) => {
      setRole(Number(value));
      handleRoleChange(value);
    },
    size: "small",
    sx: {width: "70%"}
  })), conditionalUserForm())), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "end",
      height: "100%",
      width: "100%"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: handleSubmit,
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      color: "white",
      width: "92px",
      borderRadius: 8,
      textTransform: "none",
      fontWeight: 700
    }
  }, "Add")))));
};
