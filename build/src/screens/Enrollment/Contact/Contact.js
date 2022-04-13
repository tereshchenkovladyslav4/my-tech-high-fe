import {Grid, TextField, FormGroup, FormControlLabel, Checkbox, Button, FormControl, FormLabel} from "../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../_snowpack/pkg/@mui/system.js";
import React, {useContext, useEffect, useState} from "../../../../_snowpack/pkg/react.js";
import {Paragraph} from "../../../components/Typography/Paragraph/Paragraph.js";
import {Subtitle} from "../../../components/Typography/Subtitle/Subtitle.js";
import {enrollmentContactMutation} from "./service.js";
import {useMutation} from "../../../../_snowpack/pkg/@apollo/client.js";
import {useStyles} from "../styles.js";
import {EnrollmentContext} from "../../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider.js";
import {useFormik} from "../../../../_snowpack/pkg/formik.js";
import * as yup from "../../../../_snowpack/pkg/yup.js";
import {ERROR_RED} from "../../../utils/constants.js";
import {TabContext, UserContext} from "../../../providers/UserContext/UserProvider.js";
import {isNumber, isPhoneNumber} from "../../../utils/stringHelpers.js";
import {usStates} from "../../../utils/states.js";
import {DropDown} from "../../../components/DropDown/DropDown.js";
import moment from "../../../../_snowpack/pkg/moment.js";
import {map} from "../../../../_snowpack/pkg/lodash.js";
export const Contact = ({id: id2}) => {
  const {me, setMe} = useContext(UserContext);
  const {tab, setTab, visitedTabs, setVisitedTabs} = useContext(TabContext);
  console.log("tab ===", tab);
  const {profile} = me;
  const [gender, setGender] = useState(profile.gender);
  const classes = useStyles;
  const [submitContactMutation, {data}] = useMutation(enrollmentContactMutation);
  const {setPacketId, student, disabled} = useContext(EnrollmentContext);
  const setState = (id3) => formik.values.state = id3;
  const genderSelected = (value) => gender === value;
  const selectGender = (genderValue) => {
    setGender((prev) => genderValue === prev ? "" : genderValue);
  };
  useEffect(() => {
    formik.values.gender = gender;
  }, [gender]);
  if (student.packets?.at(-1).status === "Missing Info") {
    setTab({
      currentTab: 3
    });
  }
  const validationSchema = yup.object({
    parentFirstName: yup.string().nullable().required("First name is required"),
    parentMiddleName: yup.string().nullable(),
    parentLastName: yup.string().nullable().required("Last name is required"),
    parentPrefferredName: yup.string().nullable(),
    parentCell: yup.string().nullable().matches(isPhoneNumber, "Phone number is invalid").required("Phone number is required"),
    parentEmail: yup.string().nullable().email("Enter a valid email").required("Email is required"),
    dateOfBirth: yup.string().nullable().required("Date of birth is required"),
    gender: yup.string().nullable().required("Gender is required"),
    secondaryFirstName: yup.string().nullable().required("First name is required"),
    secondaryLastName: yup.string().nullable().required("Last name is required"),
    secondaryCell: yup.string().nullable().matches(isPhoneNumber, "Phone number is invalid").required("Phone number is required"),
    secondaryEmail: yup.string().nullable().email("Enter a valid email").required("Email is required"),
    studentFirstName: yup.string().nullable().required("First name is required"),
    studentLastName: yup.string().nullable().required("Last name is required"),
    studentMiddleName: yup.string().nullable(),
    studentCell: yup.string().nullable().matches(isPhoneNumber, "Phone number is invalid").required("Phone number is required"),
    studentEmail: yup.string().nullable().email("Enter a valid email").required("Email is required"),
    studentEmailConfirm: yup.string().nullable().required("Email is required").oneOf([yup.ref("studentEmail")], "Emails do not match"),
    studentPrefferredFirstName: yup.string().nullable(),
    studentPrefferredLastName: yup.string().nullable(),
    street: yup.string().nullable().required("Street is required"),
    streetSecondary: yup.string().nullable(),
    city: yup.string().nullable().required("City is required"),
    state: yup.string().nullable().required("State is required"),
    zipcode: yup.string().nullable().required("Zip is required").test("lastSchoolAttended-selected", "Zip is invalid", (value) => {
      return isNumber.test(value);
    })
  });
  const formik = useFormik({
    initialValues: {
      parentFirstName: profile.first_name,
      parentMiddleName: profile.middle_name,
      parentLastName: profile.last_name,
      parentPrefferredName: profile.preferred_first_name,
      parentCell: profile.phone.number,
      parentEmail: profile.email,
      dateOfBirth: moment(profile.date_of_birth).format("YYYY-MM-DD"),
      gender: profile.gender,
      secondaryFirstName: student.packets.at(-1)?.secondary_contact_first,
      secondaryLastName: student.packets.at(-1)?.secondary_contact_last,
      secondaryCell: student.packets.at(-1)?.secondary_phone,
      secondaryEmail: student.packets.at(-1)?.secondary_email,
      studentFirstName: student.person?.first_name,
      studentLastName: student.person?.last_name,
      studentMiddleName: student.person?.middle_name,
      studentCell: student.person.phone.number,
      studentEmail: student.person.email,
      studentEmailConfirm: student.person.email,
      studentPrefferredFirstName: student.person.preferred_first_name,
      studentPrefferredLastName: student.person.preferred_last_name,
      street: student.person.address.street,
      streetSecondary: student.person.address.street2,
      city: student.person.address.city,
      state: student.person.address.state,
      zipcode: student.person.address.zip
    },
    validationSchema,
    onSubmit: () => {
      goNext();
    }
  });
  const submitContact = async () => {
    submitContactMutation({
      variables: {
        enrollmentPacketContactInput: {
          student_id: parseInt(id2),
          parent: {
            first_name: formik.values.parentFirstName,
            last_name: formik.values.parentLastName,
            middle_name: formik.values.parentMiddleName,
            gender: formik.values.gender,
            email: formik.values.parentEmail,
            date_of_birth: formik.values.dateOfBirth,
            phone_number: formik.values.parentCell,
            preferred_first_name: formik.values.parentPrefferredName
          },
          secondaryParent: {
            first_name: formik.values.secondaryFirstName,
            last_name: formik.values.secondaryLastName,
            email: formik.values.secondaryEmail,
            phone_number: formik.values.secondaryCell
          },
          student: {
            email: formik.values.studentEmail,
            first_name: formik.values.studentFirstName,
            last_name: formik.values.studentLastName,
            middle_name: formik.values.studentMiddleName,
            preferred_first_name: formik.values.studentPrefferredFirstName,
            preferred_last_name: formik.values.studentPrefferredLastName,
            phone_number: formik.values.studentCell,
            address: {
              street: formik.values.street,
              street2: formik.values.streetSecondary,
              city: formik.values.city,
              state: formik.values.state,
              zip: formik.values.zipcode
            }
          }
        }
      }
    }).then((data2) => {
      setPacketId(data2.data.saveEnrollmentPacketContact.packet.packet_id);
      setVisitedTabs([...visitedTabs, tab.currentTab]);
      setMe((prev) => {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            first_name: formik.values.parentFirstName,
            last_name: formik.values.parentLastName,
            middle_name: formik.values.parentMiddleName,
            gender: formik.values.gender,
            email: formik.values.parentEmail,
            date_of_birth: formik.values.dateOfBirth,
            phone_number: formik.values.parentCell,
            preferred_first_name: formik.values.parentPrefferredName
          },
          students: map(prev?.students, (student2) => {
            const returnValue = {...student2};
            if (student2.student_id === data2.data.saveEnrollmentPacketContact.student.student_id) {
              return data2.data.saveEnrollmentPacketContact.student;
            }
            return returnValue;
          })
        };
      });
    });
  };
  const goNext = async () => {
    await submitContact().then(() => {
      console.log(tab.currentTab);
      setTab({
        currentTab: tab.currentTab + 1
      });
      window.scrollTo(0, 0);
    });
  };
  const nextTab = (e) => {
    e.preventDefault();
    console.log(tab.currentTab);
    setTab({
      currentTab: tab.currentTab + 1
    });
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
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "50%"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Instructions"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Box, {
    width: "50%"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    size: "medium"
  }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    marginTop: "24px"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Parent / Guardian Information")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Legal First Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "parentFirstName",
    value: formik.values.parentFirstName,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.parentFirstName && Boolean(formik.errors.parentFirstName),
    helperText: formik.touched.parentFirstName && formik.errors.parentFirstName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Legal Middle Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "parentMiddleName",
    value: formik.values.parentMiddleName,
    onChange: formik.handleChange,
    error: formik.touched.parentMiddleName && Boolean(formik.errors.parentMiddleName),
    helperText: formik.touched.parentMiddleName && formik.errors.parentMiddleName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Legal Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "parentLastName",
    value: formik.values.parentLastName,
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    error: formik.touched.parentLastName && Boolean(formik.errors.parentLastName),
    helperText: formik.touched.parentLastName && formik.errors.parentLastName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Preferred First Name"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    disabled,
    variant: "outlined",
    fullWidth: true,
    name: "parentPrefferredName",
    value: formik.values.parentPrefferredName,
    onChange: formik.handleChange,
    error: formik.touched.parentPrefferredName && Boolean(formik.errors.parentPrefferredName),
    helperText: formik.touched.parentPrefferredName && formik.errors.parentPrefferredName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Parent Cell Phone"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    disabled,
    variant: "outlined",
    fullWidth: true,
    name: "parentCell",
    value: formik.values.parentCell,
    onChange: (e) => formik.handleChange(e),
    onBlur: formik.handleBlur,
    error: formik.touched.parentCell && Boolean(formik.errors.parentCell),
    helperText: formik.touched.parentCell && formik.errors.parentCell
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Parent Email"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    disabled,
    variant: "outlined",
    fullWidth: true,
    name: "parentEmail",
    onBlur: formik.handleBlur,
    value: formik.values.parentEmail,
    onChange: formik.handleChange,
    error: formik.touched.parentEmail && Boolean(formik.errors.parentEmail),
    helperText: formik.touched.parentEmail && formik.errors.parentEmail
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Date of Birth"), /* @__PURE__ */ React.createElement(TextField, {
    size: "small",
    disabled,
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
  }, "Gender"), /* @__PURE__ */ React.createElement(FormLabel, {
    sx: {color: ERROR_RED}
  }, formik.touched.gender && formik.errors.gender), /* @__PURE__ */ React.createElement(FormControl, {
    required: true,
    disabled,
    name: "gender",
    component: "fieldset",
    variant: "standard",
    error: formik.touched.gender && Boolean(formik.errors.gender)
  }, /* @__PURE__ */ React.createElement(FormGroup, {
    style: {display: "flex", flexDirection: "row", flexWrap: "wrap"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true
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
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Secondary Contact")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Legal First Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "secondaryFirstName",
    value: formik.values.secondaryFirstName,
    onChange: formik.handleChange,
    error: formik.touched.secondaryFirstName && Boolean(formik.errors.secondaryFirstName),
    helperText: formik.touched.secondaryFirstName && formik.errors.secondaryFirstName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Legal Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "secondaryLastName",
    value: formik.values.secondaryLastName,
    onChange: formik.handleChange,
    error: formik.touched.secondaryLastName && Boolean(formik.errors.secondaryLastName),
    helperText: formik.touched.secondaryLastName && formik.errors.secondaryLastName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Secondary Cell Phone"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "secondaryCell",
    onBlur: formik.handleBlur,
    value: formik.values.secondaryCell,
    onChange: formik.handleChange,
    error: formik.touched.secondaryCell && Boolean(formik.errors.secondaryCell),
    helperText: formik.touched.secondaryCell && formik.errors.secondaryCell
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Secondary Email"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "secondaryEmail",
    onBlur: formik.handleBlur,
    value: formik.values.secondaryEmail,
    onChange: formik.handleChange,
    error: formik.touched.secondaryEmail && Boolean(formik.errors.secondaryEmail),
    helperText: formik.touched.secondaryEmail && formik.errors.secondaryEmail
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    marginTop: "24px"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "700"
  }, "Enrollment Information")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {textDecoration: "underline"},
    fontWeight: "500"
  }, "Legal Name (Same as on the birth certificate)")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Legal First Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "studentFirstName",
    value: formik.values.studentFirstName,
    onChange: formik.handleChange,
    error: formik.touched.studentFirstName && Boolean(formik.errors.studentFirstName),
    helperText: formik.touched.studentFirstName && formik.errors.studentFirstName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Legal Middle Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "studentMiddleName",
    value: formik.values.studentMiddleName,
    onChange: formik.handleChange,
    error: formik.touched.studentMiddleName && Boolean(formik.errors.studentMiddleName),
    helperText: formik.touched.studentMiddleName && formik.errors.studentMiddleName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Legal Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "studentLastName",
    value: formik.values.studentLastName,
    onChange: formik.handleChange,
    error: formik.touched.studentLastName && Boolean(formik.errors.studentLastName),
    helperText: formik.touched.studentLastName && formik.errors.studentLastName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Student Cell Phone"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "studentCell",
    value: formik.values.studentCell,
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    error: formik.touched.studentCell && Boolean(formik.errors.studentCell),
    helperText: formik.touched.studentCell && formik.errors.studentCell
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Secondary Email"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "secondaryEmail",
    value: formik.values.secondaryEmail,
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    error: formik.touched.secondaryEmail && Boolean(formik.errors.secondaryEmail),
    helperText: formik.touched.secondaryEmail && formik.errors.secondaryEmail
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {textDecoration: "underline"},
    fontWeight: "500"
  }, "Preferred name")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "First Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "studentPrefferredFirstName",
    value: formik.values.studentPrefferredFirstName,
    onChange: formik.handleChange,
    error: formik.touched.studentPrefferredFirstName && Boolean(formik.errors.studentPrefferredFirstName),
    helperText: formik.touched.studentPrefferredFirstName && formik.errors.studentPrefferredFirstName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Last Name"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "studentPrefferredLastName",
    value: formik.values.studentPrefferredLastName,
    onChange: formik.handleChange,
    error: formik.touched.studentPrefferredLastName && Boolean(formik.errors.studentPrefferredLastName),
    helperText: formik.touched.studentPrefferredLastName && formik.errors.studentPrefferredLastName
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Student Email (must be an active email)"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "studentEmail",
    value: formik.values.studentEmail,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.studentEmail && Boolean(formik.errors.studentEmail),
    helperText: formik.touched.studentEmail && formik.errors.studentEmail
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Student Email Again"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "studentEmailConfirm",
    value: formik.values.studentEmailConfirm,
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    error: formik.touched.studentEmailConfirm && Boolean(formik.errors.studentEmailConfirm),
    helperText: formik.touched.studentEmailConfirm && formik.errors.studentEmailConfirm
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    sx: {textDecoration: "underline"},
    fontWeight: "500"
  }, "Home Address")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Street"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "street",
    value: formik.values.street,
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    error: formik.touched.street && Boolean(formik.errors.street),
    helperText: formik.touched.street && formik.errors.street
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Street Line 2"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "streetSecondary",
    value: formik.values.streetSecondary,
    onChange: formik.handleChange,
    error: formik.touched.streetSecondary && Boolean(formik.errors.streetSecondary),
    helperText: formik.touched.streetSecondary && formik.errors.streetSecondary
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "City"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "city",
    value: formik.values.city,
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    error: formik.touched.city && Boolean(formik.errors.city),
    helperText: formik.touched.city && formik.errors.city
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "State"), /* @__PURE__ */ React.createElement(DropDown, {
    size: "small",
    name: "state",
    defaultValue: formik.values.state,
    dropDownItems: usStates,
    placeholder: formik.values.state,
    setParentValue: setState,
    error: {
      error: !!(formik.touched.state && Boolean(formik.errors.state)),
      errorMsg: formik.touched.state && formik.errors.state
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    fontWeight: "500"
  }, "Zip"), /* @__PURE__ */ React.createElement(TextField, {
    disabled,
    size: "small",
    variant: "outlined",
    fullWidth: true,
    name: "zipcode",
    onBlur: formik.handleBlur,
    value: formik.values.zipcode,
    onChange: formik.handleChange,
    error: formik.touched.zipcode && Boolean(formik.errors.zipcode),
    helperText: formik.touched.zipcode && formik.errors.zipcode
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.buttonContainer
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: classes.button,
    type: "submit"
  }, /* @__PURE__ */ React.createElement(Paragraph, {
    fontWeight: "700",
    size: "medium"
  }, disabled ? "Next" : "Save & Continue")))));
};
