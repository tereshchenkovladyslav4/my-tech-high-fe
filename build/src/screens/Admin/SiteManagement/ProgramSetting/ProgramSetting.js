import * as __SNOWPACK_ENV__ from '../../../../../_snowpack/env.js';

import {useQuery} from "../../../../../_snowpack/pkg/@apollo/client.js";
import React, {useState, useEffect, useContext} from "../../../../../_snowpack/pkg/react.js";
import {Box, Button, Stack, Typography, IconButton, Dialog, DialogTitle, DialogActions} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Subtitle} from "../../../../components/Typography/Subtitle/Subtitle.js";
import {MTHBLUE} from "../../../../utils/constants.js";
import ExpandMoreIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ExpandMore.js";
import {useStyles} from "../styles.js";
import {UserContext} from "../../../../providers/UserContext/UserProvider.js";
import {StateSelect} from "./StateSelect/index.js";
import {ProgramSelect} from "./ProgramSelect/index.js";
import {BirthDateCutOffSelect} from "./BirthDateCutOffSelect/index.js";
import {SpecialEdSelect} from "./SpecialEdSelect/index.js";
import {StateLogo} from "./StateLogo/index.js";
import {GradesSelect} from "./GradesSelect/index.js";
import {gql, useMutation} from "../../../../../_snowpack/pkg/@apollo/client.js";
import ArrowBackIosRoundedIcon from "../../../../../_snowpack/pkg/@mui/icons-material/ArrowBackIosRounded.js";
import {ErrorOutline} from "../../../../../_snowpack/pkg/@mui/icons-material.js";
import {useHistory} from "../../../../../_snowpack/pkg/react-router-dom.js";
export const updateStateNameMutation = gql`
  mutation UpdateRegion($updateRegionInput: UpdateRegionInput!) {
    updateRegion(updateRegionInput: $updateRegionInput) {
      id
      name
      program
      state_logo
      special_ed
      birth_date
    }
  }
`;
export const getRegionInfoById = gql`
  query Region($regionId: ID!) {
    region(id: $regionId) {
      birth_date
      special_ed
      grades
    }
  }
`;
const ProgramSetting = () => {
  const classes = useStyles;
  const history = useHistory();
  const {me, setMe} = useContext(UserContext);
  const [stateName, setStateName] = useState();
  const [program, setProgram] = useState();
  const [specialEd, setSpecialEd] = useState();
  const [birthDate, setBirthDate] = useState();
  const [birthDateInvalid, setBirthDateInvalid] = useState(false);
  const [stateLogo, setStateLogo] = useState();
  const [grades, setGrades] = useState();
  const [open, setOpen] = React.useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [stateLogoFile, setStateLogoFile] = useState();
  const [submitSave, {data, loading, error}] = useMutation(updateStateNameMutation);
  const regionInfoResponse = useQuery(getRegionInfoById, {
    variables: {
      regionId: me?.selectedRegionId
    },
    fetchPolicy: "network-only"
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getRegionById = (id) => {
    return me.userRegion.find((region) => region.region_id === id);
  };
  useEffect(() => {
    const selectedRegion = getRegionById(me.selectedRegionId);
    setStateName(selectedRegion?.regionDetail?.name);
    setProgram(selectedRegion?.regionDetail?.program);
    setStateLogo(selectedRegion?.regionDetail?.state_logo);
    setStateLogoFile(null);
    setIsChanged(false);
    setSpecialEd(regionInfoResponse.data?.region?.special_ed);
    setBirthDate(regionInfoResponse.data?.region?.birth_date);
    setGrades(regionInfoResponse.data?.region?.grades);
  }, [me.selectedRegionId, regionInfoResponse.data?.region]);
  const uploadImage = async (file) => {
    const bodyFormData = new FormData();
    if (file) {
      bodyFormData.append("file", file);
      bodyFormData.append("region", "UT");
      bodyFormData.append("year", "2022");
      const response = await fetch(__SNOWPACK_ENV__.SNOWPACK_PUBLIC_S3_URL, {
        method: "POST",
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWT")}`
        }
      });
      const {
        data: {s3}
      } = await response.json();
      return s3.Location;
    }
  };
  const handleClickSave = async () => {
    let imageLocation;
    if (stateLogoFile) {
      imageLocation = await uploadImage(stateLogoFile.file);
    }
    let tempArr = birthDate?.split("/");
    if (tempArr && (tempArr[0].indexOf("m") >= 0 || tempArr[1].indexOf("d") >= 0 || tempArr[2].indexOf("y") >= 0)) {
      setBirthDateInvalid(true);
      return;
    }
    const submitedResponse = await submitSave({
      variables: {
        updateRegionInput: {
          id: me.selectedRegionId,
          name: stateName,
          program,
          state_logo: imageLocation ? imageLocation : stateLogo,
          special_ed: specialEd,
          birth_date: birthDate,
          grades
        }
      }
    });
    const forSaveUpdatedRegion = {
      region_id: me.selectedRegionId,
      regionDetail: submitedResponse.data.updateRegion
    };
    setIsChanged(false);
    setMe((prevMe) => {
      const updatedRegions = prevMe?.userRegion.map((prevRegion) => {
        return prevRegion.region_id == me.selectedRegionId ? forSaveUpdatedRegion : prevRegion;
      });
      return {
        ...prevMe,
        userRegion: updatedRegions
      };
    });
  };
  const handleBackClick = () => {
    if (isChanged) {
      setOpen(true);
    } else {
      history.push("/site-management/");
    }
  };
  return /* @__PURE__ */ React.createElement(Box, {
    sx: classes.base
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "16px"
    }
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: handleBackClick,
    sx: {
      position: "relative",
      bottom: "2px"
    }
  }, /* @__PURE__ */ React.createElement(ArrowBackIosRoundedIcon, {
    sx: {
      fontSize: "15px",
      stroke: "black",
      strokeWidth: 2
    }
  })), /* @__PURE__ */ React.createElement(Typography, {
    paddingLeft: "7px",
    fontSize: "20px",
    fontWeight: "700",
    component: "span"
  }, "Program Settings")), /* @__PURE__ */ React.createElement(Box, {
    sx: {}
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    onClick: handleClickSave,
    disableElevation: true,
    sx: classes.submitButton
  }, "Save"))), /* @__PURE__ */ React.createElement(Stack, {
    direction: "row",
    spacing: 1,
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: 12,
    fontWeight: "600",
    color: MTHBLUE
  }, "2020 - 2021"), /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(StateSelect, {
    stateName,
    setStateName,
    isChanged,
    setIsChanged
  }), /* @__PURE__ */ React.createElement(StateLogo, {
    stateLogo,
    setStateLogo,
    isChanged,
    setIsChanged,
    stateLogoFile,
    setStateLogoFile
  }), /* @__PURE__ */ React.createElement(ProgramSelect, {
    program,
    setProgram,
    isChanged,
    setIsChanged
  }), /* @__PURE__ */ React.createElement(GradesSelect, {
    grades,
    setGrades,
    isChanged,
    setIsChanged
  }), /* @__PURE__ */ React.createElement(BirthDateCutOffSelect, {
    birthDate,
    invalid: birthDateInvalid,
    setBirthDate,
    isChanged,
    setIsChanged
  }), /* @__PURE__ */ React.createElement(SpecialEdSelect, {
    specialEd,
    setSpecialEd,
    isChanged,
    setIsChanged
  }), /* @__PURE__ */ React.createElement(Dialog, {
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
  }, "Unsaved Changes"), /* @__PURE__ */ React.createElement(ErrorOutline, {
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
  }, `Are you sure you want to leave without saving changes?`), /* @__PURE__ */ React.createElement(DialogActions, {
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
      handleClose();
      history.push("/site-management");
    },
    autoFocus: true
  }, "Yes"))));
};
export {ProgramSetting as default};
