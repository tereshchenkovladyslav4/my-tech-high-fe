import {Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useContext, useEffect, useState} from "../../../../_snowpack/pkg/react.js";
import {DropDown} from "../../../components/DropDown/DropDown.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {useMutation} from "../../../../_snowpack/pkg/@apollo/client.js";
import {enrollmentPersonalMutation} from "./service.js";
import {EnrollmentContext} from "../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider.js";
import {useStyles} from "../styles.js";
import {useFormik} from "../../../../_snowpack/pkg/formik.js";
import * as yup from "../../../../_snowpack/pkg/yup.js";
import {countries} from "../../../utils/countries.js";
import {languages} from "../../../utils/languages.js";
import {ERROR_RED, monthlyIncome} from "../../../utils/constants.js";
import {TabContext, UserContext} from "../../../providers/UserContext/UserProvider.js";
import moment from "../../../../_snowpack/pkg/moment.js";
import {filter, indexOf, map} from "../../../../_snowpack/pkg/lodash.js";
export const Personal = () => {
  const {me, setMe} = useContext(UserContext);
  const {tab, setTab, visitedTabs, setVisitedTabs} = useContext(TabContext);
  const {packetId, student, disabled} = useContext(EnrollmentContext);
  const classes = useStyles;
  const [race, setRace] = useState(student.packets.at(-1)?.race?.split(",") ?? []);
  const [gender, setGender] = useState(student.person.gender);
  const [livingSituation, setLivingSituation] = useState(student.packets.at(-1)?.living_location);
  const [livingWith, setLivingWith] = useState(student.packets.at(-1)?.lives_with);
  const [workMove, setWorkMove] = useState(student.packets.at(-1)?.work_move);
  const [submitPersonalMutation, {data}] = useMutation(enrollmentPersonalMutation);
  const setCountry = (id) => formik.values.country = id;
  const setHouseholdMonthlyIncome = (id) => formik.values.householdMonthlyIncome = id;
  const setHispanicOrLatino = (id) => formik.values.hispanic = id;
  const setLanguageUsedByAdults = (id) => formik.values.languageUsedByAdults = id;
  const setFirstLanguageLearned = (id) => formik.values.firstLanguageLearned = id;
  const setLanguageUsedByChild = (id) => formik.values.languageUsedByChild = id;
  const setLanguageUsedOutside = (id) => formik.values.languageUsedOutside = id;
  const setpPrefferredLanguage = (id) => formik.values.prefferredLanguage = id;
  const setWorkedInAgriculture = (id) => formik.values.workedInAgriculture = id;
  const setActiveMilitary = (id) => formik.values.activeMilitary = id;
  const setWorkMoveValue = () => {
    setWorkMove(() => {
      if (workMove === 0) {
        formik.values.workMove = 1;
        return 1;
      } else {
        formik.values.workMove = 0;
        return 0;
      }
    });
  };
  const asian = "Asian";
  const native = "American Indian or Alaska Native";
  const other = "Other";
  const black = "Black or African American";
  const hawaiian = "Native Hawaiian or Other Pacific Islander";
  const white = "White";
  const undeclared = "Undeclared";
  const races = [asian, native, black, hawaiian, white, undeclared];
  const [otherRace, setOtherRace] = useState(filter(race, (curr) => !races?.includes(curr)).at(0));
  const otherRaceSelected = () => {
    const races2 = [asian, native, black, hawaiian, white, undeclared];
    const otherRaces = filter(race, (curr) => !races2?.includes(curr));
    return otherRaces.length > 0;
  };
  const validationSchema = yup.object({
    dateOfBirth: yup.string().nullable().required("Date of birth is required"),
    birthplace: yup.string().nullable().required("Birthplace is required"),
    country: yup.string().nullable().required("Country is required"),
    hispanic: yup.string().nullable().required("Field is required"),
    firstLanguageLearned: yup.string().nullable().required("First language is required"),
    languageUsedByAdults: yup.string().nullable().required("Language used by adults is required"),
    languageUsedByChild: yup.string().nullable().required("Language used by child is required"),
    languageUsedOutside: yup.string().nullable().required("Language used outside is required"),
    prefferredLanguage: yup.string().nullable().required("Preferred Language is required"),
    householdSize: yup.number().typeError("Amount must be a number").nullable().required("Household size is required"),
    householdMonthlyIncome: yup.string().nullable().required("Household monthly income is required"),
    workedInAgriculture: yup.string().nullable().required("Worked in Agriculture field is required"),
    activeMilitary: yup.string().nullable().required("Active military field is required"),
    race: yup.string().nullable().required("Race is required"),
    gender: yup.string().nullable().required("Gender is required"),
    livingSituation: yup.string().nullable().required("Living situation is required"),
    otherRace: yup.string().nullable().when("race", {
      is: (race2) => race2 === other,
      then: yup.string().required("Please enter the race.")
    })
  });
  const formik = useFormik({
    initialValues: {
      dateOfBirth: moment(student.person.date_of_birth).format("YYYY-MM-DD"),
      birthplace: student.packets.at(-1)?.birth_place,
      country: student.packets.at(-1)?.birth_country,
      hispanic: student.packets.at(-1)?.hispanic,
      firstLanguageLearned: student.packets.at(-1)?.language,
      languageUsedByAdults: student.packets.at(-1)?.language_home,
      languageUsedByChild: student.packets.at(-1)?.language_home_child,
      languageUsedOutside: student.packets.at(-1)?.language_friends,
      prefferredLanguage: student.packets.at(-1)?.language_home_preferred,
      householdSize: student.packets.at(-1)?.household_size,
      householdMonthlyIncome: student.packets.at(-1)?.household_income,
      workedInAgriculture: student.packets.at(-1)?.worked_in_agriculture,
      activeMilitary: student.packets.at(-1)?.military,
      race: student.packets.at(-1)?.race,
      gender: student.packets.at(-1).gender,
      livingSituation: student.packets.at(-1)?.living_location,
      livingWith: student.packets.at(-1)?.lives_with,
      workMove: student.packets.at(-1)?.work_move,
      otherRace: otherRaceSelected() ? otherRace : void 0
    },
    validationSchema,
    onSubmit: () => {
      goNext();
    }
  });
  const submitPersonal = async () => {
    if (race?.includes(other)) {
      const idx = indexOf(race, other);
      race[idx] = formik.values.otherRace;
      formik.values.race = race?.join(",");
    }
    submitPersonalMutation({
      variables: {
        enrollmentPacketPersonalInput: {
          packet_id: parseFloat(packetId),
          birth_date: formik.values.dateOfBirth,
          birth_place: formik.values.birthplace,
          birth_country: formik.values.country,
          race: formik.values.race,
          gender: formik.values.gender,
          hispanic: formik.values.hispanic,
          language: formik.values.firstLanguageLearned,
          language_first_learned: formik.values.firstLanguageLearned,
          language_home: formik.values.languageUsedByAdults,
          language_home_child: formik.values.languageUsedByChild,
          language_friends: formik.values.languageUsedOutside,
          language_home_preferred: formik.values.prefferredLanguage,
          household_size: formik.values.householdSize,
          household_income: formik.values.householdMonthlyIncome,
          worked_in_agriculture: formik.values.workedInAgriculture,
          military: formik.values.activeMilitary,
          work_move: formik.values.workMove,
          living_location: formik.values.livingSituation,
          lives_with: formik.values.livingWith
        }
      }
    }).then((data2) => {
      setMe((prev) => {
        return {
          ...prev,
          students: map(prev?.students, (student2) => {
            const returnValue = {...student2};
            if (student2.student_id === data2.data.saveEnrollmentPacketPersonal.student.student_id) {
              return data2.data.saveEnrollmentPacketPersonal.student;
            }
            return returnValue;
          })
        };
      });
    });
  };
  const raceSelected = (value) => {
    return race?.includes(value);
  };
  const selectRace = (raceValue) => {
    if (raceValue === other) {
      if (otherRaceSelected()) {
        setRace(filter(race, (curr) => curr !== otherRace));
        setOtherRace(void 0);
      } else {
        setOtherRace(other);
        setRace([...race, raceValue]);
      }
    } else if (race?.includes(raceValue)) {
      setRace(filter(race, (curr) => curr !== raceValue));
    } else {
      setRace([...race, raceValue]);
    }
  };
  const genderSelected = (value) => gender === value;
  const selectGender = (genderValue) => {
    setGender((prev) => genderValue === prev ? "" : genderValue);
  };
  const livingSituationSelected = (value) => livingSituation == value;
  const selectLivingSituation = (livingValue) => {
    setLivingSituation((prev) => livingValue === prev ? void 0 : livingValue);
  };
  const livesWith = (value) => livingWith === value;
  const selectLivingWith = (livingValue) => {
    setLivingWith((prev) => livingValue === prev ? "" : livingValue);
  };
  useEffect(() => {
    formik.values.gender = gender;
  }, [gender]);
  useEffect(() => {
    formik.values.race = race?.join(",");
  }, [race]);
  useEffect(() => {
    formik.values.livingWith = livingWith;
  }, [livingWith]);
  useEffect(() => {
    formik.values.livingSituation = livingSituation;
  }, [livingSituation]);
  useEffect(() => {
    if (otherRace === void 0 || otherRace === other) {
      formik.setFieldValue("otherRace", "");
    } else {
      formik.setFieldValue("otherRace", otherRace);
    }
  }, [otherRace]);
  const shelter = 0;
  const shelterLabel = "In a shelter, transitional housing or awaiting foster care";
  const hotel = 1;
  const hotelLabel = "In a hotel or motel";
  const family = 2;
  const familyLabel = "With more than one family in a house or an apartment due to loss of housing or economic hardship";
  const trailer = 3;
  const trailerLabel = "In a temporary trailer";
  const skip = 4;
  const skipLabel = "Choices above do not apply (skip question 2)";
  const parent = 0;
  const parentLabel = "Parent";
  const parents = 1;
  const parentsLabel = "Parents";
  const parentAdult = 2;
  const parentAdultLabel = "1 Parent &amp; another adult";
  const relative = 3;
  const relativeLabel = "A relative, friend or another adult";
  const alone = 4;
  const aloneLabel = "Alone with no adults";
  const guardian = 5;
  const guardianLabel = "An adult that is not the parent or the legal guardian";
  const hispanicOrLatinoItems = [
    {
      label: "Yes",
      value: 1
    },
    {
      label: "No",
      value: 0
    }
  ];
  const goNext = () => {
    submitPersonal().then(() => {
      setVisitedTabs([...visitedTabs, tab.currentTab]);
      setTab({
        currentTab: 2
      });
      window.scrollTo(0, 0);
    });
  };
  const yesNoResponse = [
    {
      label: "Yes",
      value: 1
    },
    {
      label: "No",
      value: 0
    }
  ];
  const nextTab = (e) => {
    e.preventDefault();
    setCurrentTab((curr) => curr + 1);
    window.scrollTo(0, 0);
  };
  return /* @__PURE__ */ React.createElement("form", {
    onSubmit: (e) => !disabled ? formik.handleSubmit(e) : nextTab(e)
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 2,
    columnSpacing: {xs: 1, sm: 2, md: 3}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Enrollments Personal Information")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Date of Birth"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "dateOfBirth",
    value: formik.values.dateOfBirth,
    onChange: formik.handleChange,
    error: formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth),
    helperText: formik.touched.dateOfBirth && formik.errors.dateOfBirth,
    type: "date",
    InputLabelProps: {
      shrink: true
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Birthplace"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "birthplace",
    value: formik.values.birthplace,
    onChange: formik.handleChange,
    error: formik.touched.birthplace && Boolean(formik.errors.birthplace),
    helperText: formik.touched.birthplace && formik.errors.birthplace
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Country"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    name: "country",
    dropDownItems: countries,
    placeholder: formik.values.country,
    defaultValue: formik.values.country,
    setParentValue: setCountry,
    error: {
      error: !!(formik.touched.country && Boolean(formik.errors.country)),
      errorMsg: formik.touched.country && formik.errors.country
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Race"), /* @__PURE__ */ React.createElement(FormLabel, {
    sx: {color: ERROR_RED}
  }, formik.touched.race && formik.errors.race), /* @__PURE__ */ React.createElement(FormControl, {
    disabled,
    required: true,
    name: "race",
    component: "fieldset",
    variant: "standard",
    error: true
  }, /* @__PURE__ */ React.createElement(FormGroup, {
    style: {display: "flex", flexDirection: "row", flexWrap: "wrap"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 1,
    columnSpacing: {xs: 1, sm: 2, md: 3}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: raceSelected(asian),
      onClick: () => selectRace(asian)
    }),
    label: asian
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: raceSelected(native),
      onClick: () => selectRace(native)
    }),
    label: native
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start"
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: otherRaceSelected(),
      onClick: () => selectRace(other)
    }),
    label: other
  }), /* @__PURE__ */ React.createElement(TextField, {
    disabled: disabled || !otherRaceSelected(),
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "otherRace",
    value: formik.values.otherRace,
    onChange: formik.handleChange,
    error: formik.values.race === other && formik.values.otherRace === void 0,
    helperText: formik.values.race === other && formik.values.otherRace === void 0 && formik.errors.otherRace
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: race?.includes(black),
      onClick: () => selectRace(black)
    }),
    label: black
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 8
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: race?.includes(hawaiian),
      onClick: () => selectRace(hawaiian)
    }),
    label: hawaiian
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: race?.includes(white),
      onClick: () => selectRace(white)
    }),
    label: white
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: race?.includes(undeclared),
      onClick: () => selectRace(undeclared)
    }),
    label: undeclared
  })))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Gender"), /* @__PURE__ */ React.createElement(FormLabel, {
    sx: {color: ERROR_RED}
  }, formik.touched.gender && formik.errors.gender), /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    name: "gender",
    component: "fieldset",
    variant: "standard",
    error: formik.touched.gender && Boolean(formik.errors.gender)
  }, /* @__PURE__ */ React.createElement(FormGroup, {
    style: {display: "flex", flexDirection: "row", flexWrap: "wrap"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 1,
    columnSpacing: {xs: 1, sm: 2, md: 3}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: genderSelected("male"),
      onClick: () => selectGender("male")
    }),
    label: "Male"
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: genderSelected("non-binary"),
      onClick: () => selectGender("non-binary")
    }),
    label: "Non Binary"
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: genderSelected("female"),
      onClick: () => selectGender("female")
    }),
    label: "Female"
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: genderSelected("undecided"),
      onClick: () => selectGender("undecided")
    }),
    label: "Undecided"
  })))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Hispanic / Latino"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    name: "hispanicOrLatino",
    dropDownItems: hispanicOrLatinoItems,
    defaultValue: formik.values.hispanic,
    placeholder: formik.values.hispanic,
    setParentValue: setHispanicOrLatino,
    error: {
      error: !!(formik.touched.hispanic && Boolean(formik.errors.hispanic)),
      errorMsg: formik.touched.hispanic && formik.errors.hispanic
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "First Language learned by child"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    name: "firstLanguageLearned",
    dropDownItems: languages,
    defaultValue: formik.values.firstLanguageLearned,
    placeholder: formik.values.firstLanguageLearned,
    setParentValue: setFirstLanguageLearned,
    error: {
      error: !!(formik.touched.firstLanguageLearned && Boolean(formik.errors.firstLanguageLearned)),
      errorMsg: formik.touched.firstLanguageLearned && formik.errors.firstLanguageLearned
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Language used most often by adults in the home"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    name: "languageUsedByAdults",
    dropDownItems: languages,
    placeholder: formik.values.languageUsedByAdults,
    defaultValue: formik.values.languageUsedByAdults,
    setParentValue: setLanguageUsedByAdults,
    error: {
      error: !!(formik.touched.languageUsedByAdults && Boolean(formik.errors.languageUsedByAdults)),
      errorMsg: formik.touched.languageUsedByAdults && formik.errors.languageUsedByAdults
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Language used most often by child in home"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    name: "languageUsedByChild",
    dropDownItems: languages,
    placeholder: formik.values.languageUsedByChild,
    setParentValue: setLanguageUsedByChild,
    defaultValue: formik.values.languageUsedByChild,
    error: {
      error: !!(formik.touched.languageUsedByChild && Boolean(formik.errors.languageUsedByChild)),
      errorMsg: formik.touched.languageUsedByChild && formik.errors.languageUsedByChild
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Language used most often by child with friends outside "), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    name: "languageUsedOutside",
    dropDownItems: languages,
    defaultValue: formik.values.languageUsedOutside,
    placeholder: formik.values.languageUsedOutside,
    setParentValue: setLanguageUsedOutside,
    error: {
      error: !!(formik.touched.languageUsedOutside && Boolean(formik.errors.languageUsedOutside)),
      errorMsg: formik.touched.languageUsedOutside && formik.errors.languageUsedOutside
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Preferred correspondence language for adults in the home"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    name: "prefferredLanguage",
    dropDownItems: languages,
    placeholder: formik.values.prefferredLanguage,
    setParentValue: setpPrefferredLanguage,
    defaultValue: formik.values.prefferredLanguage,
    error: {
      error: !!(formik.touched.prefferredLanguage && Boolean(formik.errors.prefferredLanguage)),
      errorMsg: formik.touched.prefferredLanguage && formik.errors.prefferredLanguage
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "50%"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Voluntary Income Information"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "50%"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, "Schools are eligible for Title 1 funds based on enrollment and student demographics. They appreciate your voluntary participation in providing income information to assist them in meeting grant requirements."))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Household Size"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "householdSize",
    type: "number",
    value: formik.values.householdSize,
    onChange: formik.handleChange,
    error: formik.touched.householdSize && Boolean(formik.errors.householdSize),
    helperText: formik.touched.householdSize && formik.errors.householdSize
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Household Gross Monthly Income"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    size: "small",
    name: "householdMonthlyIncome",
    dropDownItems: monthlyIncome,
    defaultValue: formik.values.householdMonthlyIncome,
    setParentValue: setHouseholdMonthlyIncome,
    error: {
      error: !!(formik.touched.householdMonthlyIncome && Boolean(formik.errors.householdMonthlyIncome)),
      errorMsg: formik.touched.householdMonthlyIncome && formik.errors.householdMonthlyIncome
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Other")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Has the parent or spouse worked in Agriculture?"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    size: "small",
    name: "workedInAgriculture",
    dropDownItems: yesNoResponse,
    placeholder: formik.values.workedInAgriculture,
    defaultValue: formik.values.workedInAgriculture,
    setParentValue: setWorkedInAgriculture,
    error: {
      error: !!(formik.touched.workedInAgriculture && Boolean(formik.errors.workedInAgriculture)),
      errorMsg: formik.touched.workedInAgriculture && formik.errors.workedInAgriculture
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Is a parent or legal guardian on active duty in the military"), /* @__PURE__ */ React.createElement(DropDown, {
    disabled,
    size: "small",
    name: "activeMilitary",
    dropDownItems: yesNoResponse,
    placeholder: formik.values.activeMilitary,
    defaultValue: formik.values.activeMilitary,
    setParentValue: setActiveMilitary,
    error: {
      error: !!(formik.touched.activeMilitary && Boolean(formik.errors.activeMilitary)),
      errorMsg: formik.touched.activeMilitary && formik.errors.activeMilitary
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(Checkbox, {
    disabled,
    checked: workMove == 1,
    onClick: () => setWorkMoveValue()
  }), /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, "Check box if your family has moved at some time in the past 3 years to look for work in:")), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    marginLeft: "40px"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, "-Agriculture"), /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, "-Nursery"), /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, "-Fishing"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Answer two questions related to the McKinney Vento Act:")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "1. Is the student presently living"), /* @__PURE__ */ React.createElement(FormLabel, {
    sx: {color: ERROR_RED}
  }, formik.touched.livingSituation && formik.errors.livingSituation), /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    name: "livingSituation",
    component: "fieldset",
    variant: "standard",
    error: formik.touched.livingSituation && Boolean(formik.errors.livingSituation)
  }, /* @__PURE__ */ React.createElement(FormGroup, {
    style: {display: "flex", flexDirection: "row", flexWrap: "wrap"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 1,
    columnSpacing: {xs: 1, sm: 2, md: 3}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: livingSituationSelected(shelter),
      onClick: () => selectLivingSituation(shelter)
    }),
    label: shelterLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: livingSituationSelected(hotel),
      onClick: () => selectLivingSituation(hotel)
    }),
    label: hotelLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: livingSituationSelected(family),
      onClick: () => selectLivingSituation(family)
    }),
    label: familyLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: livingSituationSelected(skip),
      onClick: () => selectLivingSituation(skip)
    }),
    label: skipLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled,
      checked: livingSituationSelected(trailer),
      onClick: () => selectLivingSituation(trailer)
    }),
    label: trailerLabel
  })))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    marginTop: "24px"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "2. The Student lives with"), /* @__PURE__ */ React.createElement(FormGroup, {
    style: {display: "flex", flexDirection: "row", flexWrap: "wrap"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    rowSpacing: 1,
    columnSpacing: {xs: 1, sm: 2, md: 3}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabled || livingSituation === skip,
      checked: livesWith(parent),
      onClick: () => selectLivingWith(parent)
    }),
    label: parentLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabled || livingSituation === skip,
      checked: livesWith(relative),
      onClick: () => selectLivingWith(relative)
    }),
    label: relativeLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabled || livingSituation === skip,
      checked: livesWith(parents),
      onClick: () => selectLivingWith(parents)
    }),
    label: parentsLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabled || livingSituation === skip,
      checked: livesWith(alone),
      onClick: () => selectLivingWith(alone)
    }),
    label: aloneLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabled || livingSituation === skip,
      checked: livesWith(parentAdult),
      onClick: () => selectLivingWith(parentAdult)
    }),
    label: parentAdultLabel
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      disabled: disabled || livingSituation === skip,
      checked: livesWith(guardian),
      onClick: () => selectLivingWith(guardian)
    }),
    label: guardianLabel
  }))))), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.buttonContainer
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: classes.button,
    type: "submit"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, disabled ? "Next" : "Save & Continue")))));
};
