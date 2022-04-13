import React, {useContext, useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {Box, Typography} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {StudentImmunizatiosnQuery} from "../../services.js";
import {useQuery} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import ImmunizationItem from "./ImmunizationItem.js";
import {getValidGrade} from "../helpers.js";
import {MdArrowDropUp, MdArrowDropDown} from "../../../../../../_snowpack/pkg/react-icons/md.js";
import {useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
import VaccinesInfoHeader from "./Header.js";
import {studentContext} from "../providers.js";
export default function EnrollmentPacketVaccineView() {
  const {setValue} = useFormContext();
  const student = useContext(studentContext);
  const {data} = useQuery(StudentImmunizatiosnQuery, {
    variables: {
      student_id: +student?.student_id
    },
    fetchPolicy: "network-only"
  });
  useEffect(() => {
    if (data?.StudentImmunizations) {
      const levels = student.grade_levels;
      const grade = getValidGrade(levels?.length ? levels[0]?.grade_level + "" : "");
      setValue("immunizations", data?.StudentImmunizations.map((v) => {
        if (v.value)
          return v;
        const max_grade = getValidGrade(v.immunization.max_grade_level);
        const min_grade = getValidGrade(v.immunization.min_grade_level);
        const isNA = grade < min_grade || grade > max_grade;
        return {
          ...v,
          value: isNA ? "NA" : ""
        };
      }));
    }
  }, [data]);
  return /* @__PURE__ */ React.createElement(VaccineView, null);
}
const VaccineView = () => {
  const [showImmunizations, setShowImmunizations] = useState(true);
  const {watch} = useFormContext();
  const immunizations = watch("immunizations");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex"}
  }, showImmunizations ? /* @__PURE__ */ React.createElement(VaccinesInfoHeader, null) : /* @__PURE__ */ React.createElement(Typography, {
    sx: {
      width: "25rem",
      textAlign: "end",
      fontWeight: "bold",
      fontSize: "large",
      paddingRight: "10px"
    }
  }, "Vaccines"), /* @__PURE__ */ React.createElement(Box, {
    sx: {position: "relative", top: "-23px", left: "-10px"},
    onClick: () => setShowImmunizations(!showImmunizations)
  }, showImmunizations ? /* @__PURE__ */ React.createElement(MdArrowDropUp, {
    size: "70",
    height: "30px"
  }) : /* @__PURE__ */ React.createElement(MdArrowDropDown, {
    size: "70",
    height: "30px"
  }))), showImmunizations && /* @__PURE__ */ React.createElement(Box, {
    sx: {width: "250px"}
  }, immunizations.map((it) => /* @__PURE__ */ React.createElement(ImmunizationItem, {
    key: it.immunization_id,
    item: it
  }))));
};
