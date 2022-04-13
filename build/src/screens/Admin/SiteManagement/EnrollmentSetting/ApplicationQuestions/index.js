import {Alert, Box, Button, Card, Grid, IconButton, List, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import React, {useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import BGSVG from "../../../../../assets/ApplicationBG.svg.proxy.js";
import {useStyles} from "./styles.js";
import {initQuestions} from "./types.js";
import ApplicationQuestionItem from "./Question.js";
import {Form, Formik} from "../../../../../../_snowpack/pkg/formik.js";
import {arrayMove, SortableContainer, SortableElement} from "../../../../../../_snowpack/pkg/react-sortable-hoc.js";
import AddQuestionModal from "./AddQuestion/index.js";
import {useMutation, useQuery} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import {getQuestionsGql, saveQuestionsGql} from "./services.js";
import AddStudentButton from "./AddStudentButton.js";
import CustomModal from "./CustomModals.js";
import {useHistory} from "../../../../../../_snowpack/pkg/react-router-dom.js";
import ArrowBackIosRoundedIcon from "../../../../../../_snowpack/pkg/@mui/icons-material/ArrowBackIosRounded.js";
import {useRecoilValue} from "../../../../../../_snowpack/pkg/recoil.js";
import {userRegionState} from "../../../../../providers/UserContext/UserProvider.js";
const SortableItem = SortableElement(ApplicationQuestionItem);
const SortableListContainer = SortableContainer(({items}) => /* @__PURE__ */ React.createElement(List, null, items.map((item, index) => /* @__PURE__ */ React.createElement(SortableItem, {
  index,
  key: index,
  item
}))));
export default function ApplicationQuestions() {
  const [questions, setQuestions] = useState([]);
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [unSaveChangeModal, setUnSaveChangeModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [sucessAlert, setSucessAlert] = useState(false);
  const region = useRecoilValue(userRegionState);
  const [saveQuestionsMutation] = useMutation(saveQuestionsGql);
  const {data, refetch} = useQuery(getQuestionsGql, {
    variables: {input: {region_id: +region?.regionDetail?.id}},
    fetchPolicy: "network-only"
  });
  const history = useHistory();
  useEffect(() => {
    if (data?.getApplicationQuestions) {
      setQuestions(data.getApplicationQuestions.map((v) => ({...v, options: v.options ? JSON.parse(v.options) : []})).sort((a, b) => a.order - b.order));
    }
  }, [data]);
  return /* @__PURE__ */ React.createElement(Grid, {
    sx: {
      padding: "1rem 2.5rem"
    }
  }, /* @__PURE__ */ React.createElement(Formik, {
    initialValues: questions,
    enableReinitialize: true,
    onSubmit: async (vals) => {
      await saveQuestionsMutation({
        variables: {
          input: vals.map((v) => ({
            id: v.id,
            type: v.type,
            question: v.question,
            required: v.required,
            options: v.options?.length ? JSON.stringify(v.options) : void 0,
            order: v.order,
            region_id: +region?.regionDetail?.id
          }))
        }
      });
      refetch();
      setSucessAlert(true);
      setTimeout(() => setSucessAlert(false), 5e3);
    }
  }, ({values, setValues, submitForm}) => /* @__PURE__ */ React.createElement(Form, null, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      textAlign: "left",
      marginBottom: "12px",
      marginLeft: "32px"
    }
  }, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => {
      if (JSON.stringify(values) === JSON.stringify(questions)) {
        history.goBack();
      } else {
        setUnSaveChangeModal(true);
      }
    },
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
  }, "Application Questions")), /* @__PURE__ */ React.createElement(Card, {
    sx: styles.card
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      height: "40px",
      width: "100%",
      justifyContent: "end"
    }
  }, /* @__PURE__ */ React.createElement(Button, {
    sx: styles.cancelButton,
    onClick: () => {
      if (JSON.stringify(values) === JSON.stringify(questions)) {
        history.goBack();
      } else {
        setCancelModal(true);
      }
    }
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    sx: styles.actionButtons,
    type: "submit"
  }, "Save")), /* @__PURE__ */ React.createElement(Box, {
    paddingY: 10,
    sx: {
      backgroundImage: `url(${BGSVG})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    sx: {color: "#4145FF", fontWeight: 700, fontSize: "24.1679px"}
  }, "Info Center"), /* @__PURE__ */ React.createElement(Typography, {
    sx: {color: "#1A1A1A", fontWeight: 500, fontSize: "24.1679px"}
  }, "Apply"), /* @__PURE__ */ React.createElement(Box, {
    width: "600px"
  }, initQuestions.map((it, index) => /* @__PURE__ */ React.createElement(ApplicationQuestionItem, {
    key: index,
    item: it,
    mainQuestion: true
  })), /* @__PURE__ */ React.createElement(SortableListContainer, {
    items: values,
    useDragHandle: true,
    onSortEnd: ({oldIndex, newIndex}) => {
      const newData = arrayMove(values, oldIndex, newIndex).map((v, i) => ({
        ...v,
        order: i
      }));
      setValues(newData);
    }
  })), openAddQuestion && /* @__PURE__ */ React.createElement(AddQuestionModal, {
    onClose: () => setOpenAddQuestion(false)
  }), /* @__PURE__ */ React.createElement(Button, {
    sx: {...useStyles.submitButton, color: "white"},
    onClick: () => setOpenAddQuestion(true)
  }, "Add Question")), /* @__PURE__ */ React.createElement(AddStudentButton, null), unSaveChangeModal && /* @__PURE__ */ React.createElement(CustomModal, {
    title: "Unsaved Changes",
    description: "Are you sure you want to leave without saving changes?",
    onClose: () => {
      setUnSaveChangeModal(false);
      history.goBack();
    },
    onConfirm: () => {
      setUnSaveChangeModal(false);
      submitForm();
      history.goBack();
    }
  }), cancelModal && /* @__PURE__ */ React.createElement(CustomModal, {
    title: "Cancel Changes",
    description: "Are you sure you want to cancel changes made?",
    cancelStr: "No",
    confirmStr: "Yes",
    onClose: () => {
      setCancelModal(false);
    },
    onConfirm: () => {
      setCancelModal(false);
      history.goBack();
    }
  }), sucessAlert && /* @__PURE__ */ React.createElement(Alert, {
    sx: {
      position: "absolute",
      bottom: "25px",
      marginBottom: "15px",
      right: "0"
    },
    onClose: () => setSucessAlert(false),
    severity: "success"
  }, "Questions saved successfully")))));
}
const styles = {
  card: {
    padding: "20px",
    background: "#EEF4F8"
  },
  actionButtons: {
    borderRadius: 10,
    mr: "20px",
    background: "linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF",
    fontWeight: "bold",
    paddingX: "20px",
    color: "white"
  },
  cancelButton: {
    borderRadius: 10,
    mr: "20px",
    background: "linear-gradient(90deg, #D23C33 0%, rgba(62, 39, 131, 0) 100%) #D23C33",
    fontWeight: "bold",
    paddingX: "20px",
    color: "white"
  },
  addButton: {
    textAlign: "center",
    color: "#1A1A1A"
  }
};
