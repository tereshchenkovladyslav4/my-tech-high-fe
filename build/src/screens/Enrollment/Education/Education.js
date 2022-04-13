import {useMutation} from "../../../../_snowpack/pkg/@apollo/client.js";
import {Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, outlinedInputClasses, TextField} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useEffect, useState} from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {enrollmentContactMutation} from "./service.js";
import {useStyles} from "../styles.js";
import {EnrollmentContext} from "../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider.js";
import {useFormik} from "../../../../_snowpack/pkg/formik.js";
import * as yup from "../../../../_snowpack/pkg/yup.js";
import {ERROR_RED, GRADES, SYSTEM_07, schoolDistricts} from "../../../utils/constants.js";
import {DropDown} from "../../../components/DropDown/DropDown.js";
import {map} from "../../../../_snowpack/pkg/lodash.js";
import {DocumentUploadModal} from "../Documents/components/DocumentUploadModal/DocumentUploadModal.js";
import {TabContext, UserContext} from "../../../providers/UserContext/UserProvider.js";
export const Education = () => {
  const {tab, setTab, visitedTabs, setVisitedTabs} = useContext(TabContext);
  const {me, setMe} = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState("");
  const [lastSchoolAttended, setLastSchoolAttended] = useState("");
  const [acknowledge, setAcknowledge] = useState(false);
  const [iep504, setIEP504] = useState(true);
  const [iep504Final, setIEP504Final] = useState(true);
  const [iepActive, setIEPActive] = useState(false);
  const [iepPerspective, setIEPPerspective] = useState(false);
  const [specEdDoc, setScpecEdDoc] = useState(true);
  const [specEdCurric, setScpecEdCurric] = useState(true);
  const [uploadFile, setUploadFile] = useState();
  const handleFile = (fileName) => {
    setUploadFile(fileName);
  };
  const setSchoolDistrict = (id) => formik.values.schoolDistrict = id;
  const setGrade = (id) => formik.values.enrollmentGradeLevel = id;
  const [submitEducationlMutation, {data}] = useMutation(enrollmentContactMutation);
  const classes = useStyles;
  const {setCurrentTab, packetId, student, disabled: disabledField} = useContext(EnrollmentContext);
  const no = "No";
  const iep = "Yes - an IEP";
  const plan = "Yes - a 504 Plan (Not an IEP)";
  const none = "None - Student has always been home schooled";
  const studentMsg = "Student was previously enrolled in the following school";
  const iep504Text = "I understand that an IEP/504 is an important legal document that defines a student's educational plan and that it must be reviewed regularly by the school's Special Education IEP/504 Team.";
  const iep504FinalText = "I also understand that all final curriculum and scheduling choices for students with an IEP/504 must be made in consultation with the parent and the school's Special Education Team.";
  const renderPlanOptions = () => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    name: "iep504",
    component: "fieldset",
    variant: "standard"
  }, /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabledField,
      checked: iep504,
      onClick: () => setIEP504(!iep504)
    }),
    label: iep504Text
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabledField,
      checked: iep504Final,
      onClick: () => setIEP504Final(!iep504Final)
    }),
    label: iep504FinalText,
    sx: {marginTop: 2}
  }))));
  const renderIEPOptions = () => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Has the IEP been active in the past 3 years?"), /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    name: "iep504",
    component: "fieldset",
    variant: "standard"
  }, /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      checked: !iepActive,
      onClick: () => setIEPActive(!iepActive)
    }),
    label: "No"
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      checked: iepActive,
      onClick: () => setIEPActive(!iepActive)
    }),
    label: "Yes"
  }))));
  const renderIEPPerspective = () => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "From your perspective, do you thinking your student still requires Special Education services?"), /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    name: "iep504",
    component: "fieldset",
    variant: "standard"
  }, /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      checked: !iepPerspective,
      onClick: () => setIEPPerspective(!iepPerspective)
    }),
    label: "No, Please email me an exit form to sign"
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      checked: iepPerspective,
      onClick: () => setIEPPerspective(!iepPerspective)
    }),
    label: "Yes, please schedule me for a meeting with the Special Ed team this fall to review and update the IEP"
  }))));
  const UploadComponent = () => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Subtitle, null, " If applicable submit IEP or 504 plan "), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    sx: classes.documentButton,
    onClick: () => setOpen(true)
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, "Select file..."))));
  const validationSchema = yup.object({
    enrollmentGradeLevel: yup.string().required("Enrollment Grade is required"),
    schoolDistrict: yup.string().required("School District is required"),
    disabled: yup.string().required("Required field"),
    lastSchoolAttended: yup.string().required("Required field"),
    schoolName: yup.string().when("lastSchoolAttended", {
      is: (lastSchoolAttended2) => lastSchoolAttended2 === studentMsg,
      then: yup.string().required("Please enter the race.")
    }),
    schoolAddress: yup.string().when("lastSchoolAttended", {
      is: (lastSchoolAttended2) => lastSchoolAttended2 === studentMsg,
      then: yup.string().required("Please enter the race.")
    }),
    acknowledge: yup.boolean().required("Please Acknowledge to continue").when("lastSchoolAttended", {
      is: (lastSchoolAttended2) => lastSchoolAttended2 === studentMsg,
      then: yup.string().required("Please enter the race.")
    })
  });
  const formik = useFormik({
    initialValues: {
      enrollmentGradeLevel: student.current_school_year_status?.grade_level,
      schoolDistrict: student.packets.at(-1)?.school_district,
      school_year_id: student.current_school_year_status?.school_year_id,
      schoolName: void 0,
      schoolAddress: void 0,
      disabled: void 0,
      lastSchoolAttended: void 0,
      acknowledge: void 0
    },
    validationSchema,
    onSubmit: () => {
      goNext();
    }
  });
  useEffect(() => {
    console.log(uploadFile);
  }, [uploadFile]);
  const submitEducation = async () => {
    if (disabled === iep && iepActive && uploadFile === void 0 || disabled === plan && uploadFile === void 0) {
      throw "Please Upload a plan";
    }
    submitEducationlMutation({
      variables: {
        enrollmentPacketEducationInput: {
          packet_id: parseFloat(packetId),
          school_year_id: 10,
          grade_level: formik.values.enrollmentGradeLevel,
          school_district: formik.values.schoolDistrict,
          last_school: formik.values.schoolName,
          last_school_address: formik.values.schoolAddress,
          last_school_type: null,
          permission_to_request_records: null,
          special_ed: null,
          special_ed_desc: null,
          understands_special_ed: null
        }
      }
    }).then((data2) => {
      setMe((prev) => {
        return {
          ...prev,
          students: map(prev?.students, (student2) => {
            const returnValue = {...student2};
            if (student2.student_id === data2.data.saveEnrollmentPacketEducation.student.student_id) {
              return data2.data.saveEnrollmentPacketEducation.student;
            }
            return returnValue;
          })
        };
      });
    });
  };
  const disabledSelected = (value) => disabled === value;
  const lastSchoolSelected = (value) => lastSchoolAttended === value;
  const selectDisabledOption = (isDisabled) => {
    setDisabled((prev) => isDisabled === prev ? "" : isDisabled);
  };
  const selectLastSchoolOption = (isDisabled) => {
    setLastSchoolAttended((prev) => isDisabled === prev ? "" : isDisabled);
  };
  useEffect(() => {
    formik.values.disabled = disabled;
  }, [disabled]);
  useEffect(() => {
    formik.values.acknowledge = acknowledge;
  }, [acknowledge]);
  useEffect(() => {
    formik.values.lastSchoolAttended = lastSchoolAttended;
    if (lastSchoolAttended === none) {
      formik.values.schoolName = void 0;
      formik.values.schoolAddress = void 0;
    }
  }, [lastSchoolAttended]);
  useEffect(() => {
    if (iepActive) {
      setIEPPerspective(false);
    }
  }, [iepActive]);
  const goNext = async () => {
    await submitEducation().then(() => {
      setVisitedTabs([...visitedTabs, tab.currentTab]);
      setTab({
        currentTab: 3
      });
      window.scrollTo(0, 0);
    }).catch((e) => window.alert(e));
  };
  const parseGrades = map(GRADES, (grade) => {
    return {
      label: grade,
      value: grade.toString()
    };
  });
  const nextTab = (e) => {
    e.preventDefault();
    setCurrentTab((curr) => curr + 1);
    window.scrollTo(0, 0);
  };
  return /* @__PURE__ */ React.createElement("form", {
    onSubmit: (e) => !disabledField ? formik.handleSubmit(e) : nextTab(e)
  }, open && /* @__PURE__ */ React.createElement(DocumentUploadModal, {
    handleModem: () => setOpen(!open),
    handleFile
  }), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2,
    columnSpacing: {xs: 1, sm: 2, md: 3}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Education")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Enrollments Grade Level (age for 2022-2023)"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled: disabledField,
    name: "enrollmentGradeLevel",
    defaultValue: formik.values.enrollmentGradeLevel,
    dropDownItems: parseGrades,
    setParentValue: setGrade,
    size: "small",
    sx: {
      [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: SYSTEM_07
      },
      marginY: 2,
      width: "100%"
    },
    error: {
      error: !!(formik.touched.enrollmentGradeLevel && Boolean(formik.errors.enrollmentGradeLevel)),
      errorMsg: formik.touched.enrollmentGradeLevel && formik.errors.enrollmentGradeLevel
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "School District of Residence"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled: disabledField,
    name: "schoolDistrict",
    defaultValue: formik.values.schoolDistrict,
    dropDownItems: schoolDistricts,
    setParentValue: setSchoolDistrict,
    size: "small",
    sx: {
      [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: SYSTEM_07
      },
      marginY: 2,
      width: "100%"
    },
    error: {
      error: !!(formik.touched.schoolDistrict && Boolean(formik.errors.schoolDistrict)),
      errorMsg: formik.touched.schoolDistrict && formik.errors.schoolDistrict
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Has this student ever been diagnosed with a learning disability or ever qualified for Special Education Services through an IEP or 504 plan (including Speech Therapy)?")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(FormLabel, {
    sx: {color: ERROR_RED}
  }, formik.touched.disabled && formik.errors.disabled), /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    disabled: disabledField,
    name: "disabled",
    component: "fieldset",
    variant: "standard",
    error: formik.touched.disabled && Boolean(formik.errors.disabled)
  }, /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabledField,
      checked: disabledSelected(no),
      onClick: () => selectDisabledOption(no)
    }),
    label: no
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabledField,
      checked: disabledSelected(iep),
      onClick: () => selectDisabledOption(iep)
    }),
    label: iep
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabledField,
      checked: disabledSelected(plan),
      onClick: () => selectDisabledOption(plan)
    }),
    label: plan
  }))), disabled === plan ? renderPlanOptions() : disabled === iep && renderIEPOptions(), disabled === iep && iepActive && renderIEPPerspective(), disabled === iep && iepActive && iepPerspective && renderPlanOptions(), disabled === plan ? /* @__PURE__ */ React.createElement(UploadComponent, null) : disabled === iep && /* @__PURE__ */ React.createElement(UploadComponent, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Last School Attended"), /* @__PURE__ */ React.createElement(FormLabel, {
    sx: {color: ERROR_RED}
  }, formik.touched.lastSchoolAttended && formik.errors.lastSchoolAttended), /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    name: "lastSchoolAttended",
    component: "fieldset",
    variant: "standard",
    error: formik.touched.lastSchoolAttended && Boolean(formik.errors.lastSchoolAttended)
  }, /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabledField,
      checked: lastSchoolSelected(none),
      onClick: () => selectLastSchoolOption(none)
    }),
    label: none
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabledField,
      checked: lastSchoolSelected(studentMsg),
      onClick: () => selectLastSchoolOption(studentMsg)
    }),
    label: studentMsg
  })))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Name of School"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    disabled: disabledField,
    name: "schoolName",
    value: formik.values.schoolName,
    onChange: formik.handleChange,
    error: formik.touched.lastSchoolAttended && lastSchoolAttended !== none && formik.touched.schoolName && Boolean(formik.errors.schoolName),
    helperText: formik.touched.lastSchoolAttended && lastSchoolAttended !== none && formik.touched.schoolName && formik.errors.schoolName,
    disabled: lastSchoolAttended !== studentMsg
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Address of School"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    variant: "outlined",
    fullWidth: true,
    disabled: disabledField,
    name: "schoolAddress",
    value: formik.values.schoolAddress,
    onChange: formik.handleChange,
    error: formik.touched.schoolAddress && Boolean(formik.errors.schoolAddress),
    helperText: formik.touched.schoolAddress && formik.errors.schoolAddress,
    disabled: lastSchoolAttended !== studentMsg
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(FormLabel, {
    sx: {color: ERROR_RED}
  }, formik.touched.acknowledge && formik.errors.acknowledge), /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    name: "acknowledge",
    component: "fieldset",
    variant: "standard",
    error: formik.touched.acknowledge && Boolean(formik.errors.acknowledge)
  }, /* @__PURE__ */ React.createElement(FormGroup, {
    style: {width: "50%"}
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabledField,
      checked: acknowledge,
      onClick: () => setAcknowledge(!acknowledge)
    }),
    label: /* @__PURE__ */ React.createElement(Paragraph, {
      size: "medium"
    }, "I understand that Enrollment's records will be requested from his/her prior school anytime after June 1 (for Fall enrollments) or January 15 (for mid-year enrollments).")
  })), /* @__PURE__ */ React.createElement(FormLabel, {
    sx: {color: ERROR_RED}
  }, formik.touched.acknowledge && formik.errors.acknowledge))), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.buttonContainer
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: classes.button,
    type: "submit"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, disabledField ? "Next" : "Save & Continue")))));
};
