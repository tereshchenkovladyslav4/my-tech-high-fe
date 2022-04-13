import {useMutation, useQuery} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import React, {useState, useEffect, useContext} from "../../../../../../_snowpack/pkg/react.js";
import {EmailModal} from "../../../../../components/EmailModal/EmailModal.js";
import {AGE_ISSUE_OPTIONS, MISSING_INFO_OPTIONS} from "../../../../../utils/constants.js";
import {sendEmailMutation} from "../../services.js";
import EnrollmentWarnSaveModal from "./ConfirmSaveModal.js";
import {Alert} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {getEmailTemplateQuery} from "../../../../../graphql/queries/email-template.js";
import {useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
import {studentContext} from "../providers.js";
export default function PacketConfirmModals({refetch, submitForm}) {
  const student = useContext(studentContext);
  const {watch, setValue} = useFormContext();
  const [emailTemplate, setEmailTemplate] = useState(null);
  const [sendPacketEmail] = useMutation(sendEmailMutation);
  const [
    notes,
    showMissingInfoModal,
    showAgeIssueModal,
    showSaveWarnModal,
    missingInfoAlert,
    saveAlert,
    preSaveStatus
  ] = watch([
    "notes",
    "showMissingInfoModal",
    "showAgeIssueModal",
    "showSaveWarnModal",
    "missingInfoAlert",
    "saveAlert",
    "preSaveStatus"
  ]);
  const {data: emailTemplateData} = useQuery(getEmailTemplateQuery, {
    variables: {
      template: "Missing Information"
    },
    fetchPolicy: "network-only"
  });
  useEffect(() => {
    if (emailTemplateData !== void 0) {
      const {emailTemplateName} = emailTemplateData;
      if (emailTemplateName)
        setEmailTemplate(emailTemplateName);
    }
  }, [emailTemplateData]);
  function onSubmit(status) {
    setValue("status", status || preSaveStatus);
    submitForm();
  }
  const handleEmailSend = (subject, body, options) => {
    try {
      sendPacketEmail({
        variables: {
          emailInput: {
            content: body,
            email: student?.parent.person.email,
            subject,
            recipients: null,
            from: emailTemplate && emailTemplate?.from ? emailTemplate?.from : null,
            bcc: emailTemplate && emailTemplate?.bcc ? emailTemplate?.bcc : null
          }
        }
      });
      refetch();
      setValue("notes", constructPacketNotes(notes || "", options, options.type, body));
      if (options.type === "AGE_ISSUE") {
        setValue("showAgeIssueModal", false);
        onSubmit();
        setValue("age_issue", true);
      } else if (options.type === "MISSING_INFO") {
        setValue("showMissingInfoModal", false);
        setValue("missingInfoAlert", true);
        setTimeout(() => setValue("missingInfoAlert", false), 5e3);
        setValue("preSaveStatus", "Missing Info");
        setValue("missing_files", options.values.filter((v) => v.checked).map((v) => v.abbr));
        onSubmit("Missing Info");
      }
    } catch (e) {
      console.error("handleEmailSend", e);
    }
  };
  const constructPacketNotes = (oldNotes, options, type, body) => {
    const date = new Date().toLocaleDateString();
    let newNotes = `${date} - ${type === "AGE_ISSUE" ? "Age Issue" : "Missing Info"}
`;
    const newNotesLines = ["<SEP>"];
    const setStudentInfo = (email, student2) => {
      const yearbegin = new Date(student2.grade_levels[0].school_year.date_begin).getFullYear().toString();
      const yearend = new Date(student2.grade_levels[0].school_year.date_end).getFullYear().toString();
      return email.replace(/<STUDENT NAME>/g, student2.person.first_name).replace(/<PARENT>/g, student2.parent.person.first_name).replace(/<STUDENT GRADE>/g, student2.grade_level).replace(/<SCHOOL YEAR>/g, `${yearbegin}-${yearend.substring(2, 4)}`);
    };
    const replaceBlank = (text, body2) => {
      const startIdx = body2.indexOf("but age-wise they could be in");
      const endIdx = body2.indexOf("\n", startIdx);
      if (startIdx < 0 || endIdx < 0 || text.indexOf("[BLANK]") < 0)
        return text;
      const skipStart = "but age-wise they could be in ".length;
      const skipEnd = body2[endIdx - 1] === "." ? 1 : 0;
      const newBlank = body2.substring(startIdx + skipStart, endIdx - skipEnd).replace(".</p>", "").replace("</p>", "");
      return text.replace("[BLANK]", newBlank);
    };
    options.values.slice().reverse().forEach((option) => {
      if (!option.checked)
        return;
      const indexOfSeparator = newNotesLines.indexOf("<SEP>");
      newNotesLines.splice(0, 0, `- ${option.title}`);
      if (option.extraText) {
        newNotesLines.splice(indexOfSeparator + 1, 0, replaceBlank(option.extraText.replace("\n\n", "\n"), body));
      }
    });
    newNotesLines.splice(newNotesLines.indexOf("<SEP>"), 1);
    newNotes += newNotesLines.join("\n");
    if (oldNotes.length)
      return setStudentInfo(newNotes, student) + "\n\n" + oldNotes;
    return setStudentInfo(newNotes, student) + "\n";
  };
  if (showMissingInfoModal)
    return /* @__PURE__ */ React.createElement(EmailModal, {
      handleModem: () => setValue("showMissingInfoModal", false),
      title: `Missing Information on ${student.person.first_name}\u2019s Enrollment Packet`,
      options: MISSING_INFO_OPTIONS,
      handleSubmit: handleEmailSend,
      template: emailTemplate
    });
  if (showAgeIssueModal)
    return /* @__PURE__ */ React.createElement(EmailModal, {
      handleModem: () => setValue("showAgeIssueModal", false),
      title: `Age Issue on ${student.person.first_name}\u2019s Enrollment Packet`,
      options: AGE_ISSUE_OPTIONS,
      handleSubmit: handleEmailSend,
      template: emailTemplate
    });
  if (showSaveWarnModal)
    return /* @__PURE__ */ React.createElement(EnrollmentWarnSaveModal, {
      onClose: () => {
        setValue("showValidationErrors", true);
        setValue("showSaveWarnModal", false);
      },
      onSave: () => {
        onSubmit();
        setValue("showSaveWarnModal", false);
        setValue("showValidationErrors", false);
      }
    });
  if (missingInfoAlert) {
    return /* @__PURE__ */ React.createElement(Alert, {
      sx: {
        position: "relative",
        bottom: "25px",
        marginBottom: "15px"
      },
      onClose: () => {
        setValue("missingInfoAlert", false);
      },
      severity: "error"
    }, "This packet has not yet been submitted");
  }
  if (saveAlert.length) {
    return /* @__PURE__ */ React.createElement(Alert, {
      sx: {
        position: "relative",
        bottom: "25px",
        marginBottom: "15px"
      },
      onClose: () => {
        setValue("saveAlert", "");
      },
      severity: "success"
    }, saveAlert);
  }
  return /* @__PURE__ */ React.createElement("div", null);
}
