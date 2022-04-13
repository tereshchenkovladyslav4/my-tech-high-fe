import React, {createContext, useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {Box, Button} from "../../../../../../_snowpack/pkg/@mui/material.js";
import ImmunizationHeader from "./ImmunizationHeader.js";
import ImmunizationItems from "./ImmunizationItems/ImmunizationItems.js";
import {Route, Switch, useHistory, useRouteMatch} from "../../../../../../_snowpack/pkg/react-router-dom.js";
import ImminizationSettings from "./ImminizationSettings/ImminizationSettings.js";
import AddIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/Add.js";
import {useMutation, useQuery} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import {getImmunizationSettings, getSchoolYears} from "./services.js";
import {getSettingsQuery, updateSettingsMutation} from "../../../EnrollmentPackets/services.js";
export const YearsContext = createContext(null);
export const DataContext = createContext(null);
const Immunizations = () => {
  const {path, isExact} = useRouteMatch("/site-management/enrollment/immunizations");
  const history = useHistory();
  const {loading, error, data, refetch} = useQuery(getImmunizationSettings, {
    fetchPolicy: "network-only"
  });
  const settingsQuery = useQuery(getSettingsQuery);
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    setEnabled(settingsQuery.data?.settings?.enable_immunizations === 1);
  }, [settingsQuery.data]);
  const [updateSettings] = useMutation(updateSettingsMutation);
  const {
    data: yearsData,
    loading: yearsLoading,
    error: yearsError
  } = useQuery(getSchoolYears);
  if (loading || yearsLoading)
    return null;
  if (error || yearsError) {
    console.error(error || yearsError);
    return null;
  }
  const {
    immunizationSettings: {results}
  } = data;
  return /* @__PURE__ */ React.createElement(Box, {
    width: "95%",
    marginX: "auto",
    marginY: "13px",
    bgcolor: "white",
    borderRadius: "12px",
    sx: {
      display: "flex",
      flexDirection: "column",
      alignContent: "start",
      paddingY: "30px"
    }
  }, isExact && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ImmunizationHeader, {
    enabledState: enabled,
    withSave: false,
    title: "Immunization Settings",
    onEnabledChange: async (v) => {
      setEnabled(v);
      await updateSettings({
        variables: {
          input: {enable_immunizations: v ? 1 : 0}
        }
      });
      refetch();
    },
    backUrl: "/site-management/enrollment/"
  }), /* @__PURE__ */ React.createElement(ImmunizationItems, {
    enabled,
    data: results,
    refetch
  }), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => history.push("/site-management/enrollment/immunizations/add"),
    sx: {
      background: "linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%), #4145FF",
      color: "white",
      width: "210px",
      marginLeft: "40px",
      marginTop: "40px",
      "&:hover": {
        backgroundColor: "#4145FF"
      },
      borderRadius: "8px"
    },
    startIcon: /* @__PURE__ */ React.createElement(AddIcon, null)
  }, "Add Immunization")), /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    path: `${path}/:id`
  }, /* @__PURE__ */ React.createElement(YearsContext.Provider, {
    value: yearsData.schoolYears
  }, /* @__PURE__ */ React.createElement(DataContext.Provider, {
    value: results
  }, /* @__PURE__ */ React.createElement(ImminizationSettings, {
    data: results,
    refetch
  }))))));
};
export {Immunizations as default};
