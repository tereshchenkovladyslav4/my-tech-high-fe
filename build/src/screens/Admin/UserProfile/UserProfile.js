import {useMutation, useQuery} from "../../../../_snowpack/pkg/@apollo/client.js";
import {Box, Button, Card} from "../../../../_snowpack/pkg/@mui/material.js";
import React, {useState, useEffect} from "../../../../_snowpack/pkg/react.js";
import {BLACK, BUTTON_LINEAR_GRADIENT} from "../../../utils/constants.js";
import CloseIcon from "../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {Header} from "./components/Header/Header.js";
import {Students} from "./components/Students/Students.js";
import {ParentProfile} from "./ParentProfile/ParentProfile.js";
import {StudentProfile} from "./StudentProfile/StudentProfile.js";
import {getParentDetail, updatePersonAddressMutation, UpdateStudentMutation} from "./services.js";
import {NewUserModal} from "./components/NewUserModal/NewUserModal.js";
import {useStyles} from "./styles.js";
export const UserProfile = ({handleClose, data}) => {
  const classes = useStyles;
  const [userInfo, setUserInfo] = useState();
  const [phoneInfo, setPhoneInfo] = useState();
  const [students, setStudents] = useState([]);
  const [observers, setObservers] = useState([]);
  const [notes, setNotes] = useState("");
  const [studentPerson, setStudentPerson] = useState();
  const [openObserverModal, setOpenObserverModal] = useState(false);
  const [studentStatus, setStudentStatus] = useState({});
  const [selectedParent, setSelectedParent] = useState();
  const [selectedStudent, setSelectedStudent] = useState(data.student_id);
  const [applicationState, setApplicationState] = useState("");
  const {
    loading: userLoading,
    error: userError,
    data: currentUserData,
    refetch
  } = useQuery(getParentDetail, {
    variables: {
      id: data.parent_id || data.parent.parent_id
    },
    fetchPolicy: "cache-and-network"
  });
  const [updateStudent, {data: studentData}] = useMutation(UpdateStudentMutation);
  const [updatePersonAddress, {data: updatedData}] = useMutation(updatePersonAddressMutation);
  const handleSavePerson = async () => {
    if (data.parent_id) {
      const person = Object.assign({}, userInfo);
      delete person.address;
      delete person.phone;
      person.person_id = Number(person.person_id);
      const phone = Object.assign({}, phoneInfo);
      phone.phone_id = Number(phone.phone_id);
      const address = Object.assign({}, userInfo.address);
      address.address_id = address.address_id ? Number(address.address_id) : void 0;
      await updatePersonAddress({
        variables: {
          updatePersonAddressInput: {
            parent_id: data.parent_id === selectedParent ? +data.parent_id : void 0,
            observer_id: data.parent_id !== selectedParent ? Number(selectedParent) : void 0,
            address,
            phone,
            person,
            notes
          }
        }
      });
      handleClose();
    } else {
      const person = Object.assign({}, studentPerson);
      delete person.address;
      delete person.phone;
      person.person_id = Number(person.person_id);
      const phone = Object.assign({}, studentPerson.phone);
      phone.phone_id = Number(phone.phone_id);
      const address = Object.assign({}, studentPerson.address);
      address.address_id = +address.address_id;
      await updatePersonAddress({
        variables: {
          updatePersonAddressInput: {
            address,
            phone,
            person
          }
        }
      });
      await updateStudent({
        variables: {
          updateStudentInput: studentStatus
        }
      });
      handleClose();
    }
  };
  const handleCloseObserverModal = () => {
    setOpenObserverModal(false);
    refetch();
  };
  const handleChangeParent = (parent) => {
    if (data.parent_id) {
      if (parent.observer_id) {
        setSelectedParent(parent.observer_id);
        setUserInfo(parent.person);
        setPhoneInfo(parent.person.phone);
        setNotes(parent.notes || "");
      } else {
        setSelectedParent(currentUserData.parentDetail.parent_id);
        setUserInfo(currentUserData.parentDetail.person);
        setPhoneInfo(currentUserData.parentDetail.phone);
        setNotes(currentUserData.parentDetail.notes);
      }
    }
  };
  const handleChangeStudent = (student) => {
    if (data.student_id) {
      setSelectedStudent(student.student_id);
    }
  };
  useEffect(() => {
    if (currentUserData) {
      setSelectedParent(currentUserData.parentDetail.parent_id);
      setUserInfo(currentUserData.parentDetail.person);
      setStudents(currentUserData.parentDetail.students);
      setPhoneInfo(currentUserData.parentDetail.phone);
      setNotes(currentUserData.parentDetail.notes);
      setObservers(currentUserData.parentDetail.observers);
      if (currentUserData.parentDetail.person.user.userRegions.length) {
        setApplicationState(currentUserData.parentDetail.person.user.userRegions[0].regionDetail.name);
      }
    }
  }, [currentUserData]);
  return /* @__PURE__ */ React.createElement(Card, {
    sx: classes.content
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }
  }, /* @__PURE__ */ React.createElement(Header, {
    userData: currentUserData?.parentDetail?.person,
    setOpenObserverModal,
    observers,
    handleChangeParent,
    selectedParent,
    parentId: currentUserData?.parentDetail?.parent_id,
    isParent: data.parent_id ? true : false
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: {
      background: BUTTON_LINEAR_GRADIENT,
      textTransform: "none",
      color: "white",
      marginRight: 2,
      width: "92px",
      height: "25px"
    },
    onClick: handleSavePerson
  }, "Save"), /* @__PURE__ */ React.createElement(CloseIcon, {
    style: {color: "white", background: BLACK, borderRadius: 2, cursor: "pointer"},
    onClick: handleClose
  }))), /* @__PURE__ */ React.createElement(Students, {
    students,
    selectedStudent,
    handleChangeStudent
  }), data.parent_id && /* @__PURE__ */ React.createElement(ParentProfile, {
    userInfo,
    setUserInfo,
    phoneInfo,
    setPhoneInfo,
    notes,
    setNotes,
    applicationState
  }), data.student_id && /* @__PURE__ */ React.createElement(StudentProfile, {
    studentId: selectedStudent,
    setStudentPerson,
    setStudentStatus,
    studentStatus,
    applicationState
  }), openObserverModal && /* @__PURE__ */ React.createElement(NewUserModal, {
    handleModem: handleCloseObserverModal,
    visible: openObserverModal,
    students,
    data
  }));
};
