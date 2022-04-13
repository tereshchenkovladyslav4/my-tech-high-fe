import {Grid, Modal} from "../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../_snowpack/pkg/@mui/system.js";
import React from "../../../../../_snowpack/pkg/react.js";
import CloseIcon from "../../../../../_snowpack/pkg/@mui/icons-material/Close.js";
import {useStyles} from "./styles.js";
import {SYSTEM_11} from "../../../../utils/constants.js";
import EnrollmentPacketDropDownButton from "./PacketStatusDropDown.js";
import {EnrollmentJobsInfo} from "./PacketStudentInfo.js";
import {EnrollmentPacketDocument} from "./PacketDocuments.js";
import EnrollmentPacketNotes from "./PacketNotes.js";
import EnrollmentPacketVaccineView from "./VaccineView/index.js";
import EnrollmentPacketInfo from "./PacketInfo/index.js";
import {
  getSettingsQuery,
  savePacketMutation,
  updateCreateStudentImmunizationMutation,
  updateStudentStatusMutation
} from "../services.js";
import {useMutation, useQuery} from "../../../../../_snowpack/pkg/@apollo/client.js";
import {FormProvider, useForm} from "../../../../../_snowpack/pkg/react-hook-form.js";
import {DevTool} from "../../../../../_snowpack/pkg/@hookform/devtools.js";
import moment from "../../../../../_snowpack/pkg/moment.js";
import PacketSaveButtons from "./PacketSaveButtons.js";
import PacketConfirmModals from "./modals/ConfirmModals.js";
import {studentContext} from "./providers.js";
export default function EnrollmentPacketModal({
  handleModem,
  packet,
  refetch
}) {
  const classes = useStyles;
  const [updateCreateStudentImm] = useMutation(updateCreateStudentImmunizationMutation);
  const [updateStudentStatus] = useMutation(updateStudentStatusMutation);
  const [savePacket] = useMutation(savePacketMutation);
  const settingsQuery = useQuery(getSettingsQuery, {
    fetchPolicy: "network-only"
  });
  let enableImmunization = settingsQuery.data?.settings?.enable_immunizations === 1;
  const birthday = packet.student?.person?.date_of_birth;
  const methods = useForm({
    shouldUnregister: false,
    defaultValues: {
      immunizations: [],
      notes: packet.admin_notes || "",
      status: packet.status || "",
      preSaveStatus: packet.status || "",
      packetStatuses: [],
      showSaveWarnModal: false,
      missingInfoAlert: false,
      showMissingInfoModal: false,
      showAgeIssueModal: false,
      showValidationErrors: false,
      age_issue: false,
      saveAlert: "",
      medicalExempt: packet.medical_exemption === 1,
      exemptionDate: packet.exemption_form_date ? moment(packet.exemption_form_date).format("MM/DD/yyyy") : "",
      secondary_contact_first: packet.secondary_contact_first || "",
      secondary_contact_last: packet.secondary_contact_last || "",
      secondary_phone: packet.secondary_phone || "",
      secondary_email: packet.secondary_email || "",
      date_of_birth: birthday ? moment(birthday).format("yyyy-MM-DD") : "",
      birth_place: packet.birth_place || "",
      birth_country: packet.birth_country || "",
      last_school: packet.last_school || "",
      last_school_address: packet.last_school_address || "",
      last_school_type: packet.last_school_type,
      household_size: packet.household_size,
      household_income: packet.household_income,
      language: packet.language || "",
      language_home: packet.language_home || "",
      language_home_child: packet.language_home_child || "",
      language_friends: packet.language_friends || "",
      language_home_preferred: packet.language_home_preferred || "",
      hispanic: packet.hispanic || 0,
      school_district: packet.school_district || "",
      race: packet.race || "",
      gender: packet.student?.person?.gender || "",
      worked_in_agriculture: packet.worked_in_agriculture,
      military: packet.military,
      ferpa_agreement: packet.ferpa_agreement,
      photo_permission: packet.photo_permission,
      dir_permission: packet.dir_permission,
      signature_file_id: packet.signature_file_id || 0,
      missing_files: packet.missing_files || []
    }
  });
  async function onSubmit(vals) {
    const status = vals.preSaveStatus;
    if (status === "Accepted") {
      methods.setValue("saveAlert", "The packet has been accepted");
      setTimeout(() => methods.setValue("saveAlert", ""), 5e3);
    } else if (!["Age Issue", "Missing Info"].includes(status)) {
      methods.setValue("saveAlert", "Packet Saved");
      setTimeout(() => methods.setValue("saveAlert", ""), 5e3);
    }
    if (["Accepted", "Conditional"].includes(status)) {
      updateStudentStatus({
        variables: {
          input: {
            student_id: Number(packet.student.student_id),
            school_year_id: packet.student.current_school_year_status.school_year_id,
            status: 1
          }
        }
      });
    }
    await savePacket({
      variables: {
        enrollmentPacketInput: {
          student_person_id: Number(packet.student?.person?.person_id),
          parent_person_id: Number(packet.student?.parent?.person?.person_id),
          packet_id: Number(packet.packet_id),
          admin_notes: vals.notes,
          status,
          is_age_issue: vals.age_issue,
          exemption_form_date: vals.exemptionDate,
          medical_exemption: vals.medicalExempt ? 1 : 0,
          secondary_contact_first: vals.secondary_contact_first,
          secondary_contact_last: vals.secondary_contact_last,
          secondary_phone: vals.secondary_phone,
          secondary_email: vals.secondary_email,
          date_of_birth: vals.date_of_birth,
          birth_country: vals.birth_country,
          birth_place: vals.birth_place,
          hispanic: Number(vals.hispanic),
          race: vals.race,
          gender: vals.gender,
          language: vals.language,
          language_home: vals.language_home,
          language_home_child: vals.language_home_child,
          language_friends: vals.language_friends,
          language_home_preferred: vals.language_home_preferred,
          last_school_type: vals.last_school_type,
          last_school: vals.last_school,
          last_school_address: vals.last_school_address,
          school_district: vals.school_district,
          household_size: Number(vals.household_size),
          household_income: Number(vals.household_income),
          worked_in_agriculture: Number(vals.worked_in_agriculture),
          military: Number(vals.military),
          ferpa_agreement: Number(vals.ferpa_agreement),
          dir_permission: Number(vals.dir_permission),
          photo_permission: Number(vals.photo_permission),
          missing_files: JSON.stringify(vals.missing_files)
        }
      }
    });
    updateCreateStudentImm({
      variables: {
        input: vals.immunizations.map((v) => ({
          student_id: v.student_id,
          immunization_id: v.immunization_id,
          value: v.value
        }))
      }
    });
    refetch();
  }
  return /* @__PURE__ */ React.createElement(FormProvider, {
    ...methods
  }, /* @__PURE__ */ React.createElement("form", {
    onSubmit: methods.handleSubmit(onSubmit)
  }, /* @__PURE__ */ React.createElement(Modal, {
    open: true,
    onClose: () => handleModem(),
    "aria-labelledby": "modal-modal-title",
    "aria-describedby": "modal-modal-description"
  }, /* @__PURE__ */ React.createElement(studentContext.Provider, {
    value: packet.student
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: classes.modalCard
  }, /* @__PURE__ */ React.createElement(Box, {
    sx: {display: "flex", justifyContent: "space-between"}
  }, /* @__PURE__ */ React.createElement(EnrollmentPacketDropDownButton, null), /* @__PURE__ */ React.createElement(CloseIcon, {
    onClick: () => handleModem(),
    style: classes.close
  })), /* @__PURE__ */ React.createElement(Box, {
    sx: classes.content
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    sx: {padding: "10px 0px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, /* @__PURE__ */ React.createElement(EnrollmentJobsInfo, {
    packet
  }), /* @__PURE__ */ React.createElement(EnrollmentPacketDocument, {
    packetData: packet
  }), /* @__PURE__ */ React.createElement(EnrollmentPacketNotes, null), /* @__PURE__ */ React.createElement(PacketSaveButtons, {
    submitForm: methods.handleSubmit(onSubmit)
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 6,
    sm: 6,
    xs: 12
  }, enableImmunization && /* @__PURE__ */ React.createElement(EnrollmentPacketVaccineView, null))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 12,
    sm: 12,
    xs: 12,
    sx: {padding: "20px 0px"}
  }, /* @__PURE__ */ React.createElement("hr", {
    style: {borderTop: `solid 1px ${SYSTEM_11}`, width: "97%", borderBottom: "0"}
  })), /* @__PURE__ */ React.createElement(EnrollmentPacketInfo, null)), /* @__PURE__ */ React.createElement(PacketConfirmModals, {
    refetch,
    submitForm: methods.handleSubmit(onSubmit)
  }))))), /* @__PURE__ */ React.createElement(DevTool, {
    control: methods.control
  }));
}
