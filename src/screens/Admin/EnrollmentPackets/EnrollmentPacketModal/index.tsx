import { Grid, Modal, Alert } from '@mui/material'
import { Box } from '@mui/system'
import React, { useRef } from 'react'
import { EnrollmentPacketFormType } from './types'
import CloseIcon from '@mui/icons-material/Close'
import { useStyles } from './styles'
import { SYSTEM_11 } from '../../../../utils/constants'
import EnrollmentPacketDropDownButton from './PacketStatusDropDown'
import { EnrollmentJobsInfo } from './PacketStudentInfo'
import { EnrollmentPacketDocument } from './PacketDocuments'
import EnrollmentPacketNotes from './PacketNotes'
import EnrollmentPacketVaccineView from './VaccineView/index'
import EnrollmentPacketInfo from './PacketInfo/index'
import {
  getSettingsQuery,
  savePacketMutation,
  updateCreateStudentImmunizationMutation,
  updateStudentStatusMutation,
} from '../services'
import { useMutation, useQuery } from '@apollo/client'
import { Form, Formik } from 'formik'
import moment from 'moment'
import PacketSaveButtons from './PacketSaveButtons'
import PacketConfirmModals from './modals/ConfirmModals'
import { Packet } from '../../../HomeroomStudentProfile/Student/types'
import { studentContext } from './providers'

export default function EnrollmentPacketModal({
  handleModem,
  packet,
  refetch,
}: {
  packet: Packet
  handleModem: () => void
  refetch: () => void
}) {
  const classes = useStyles

  const notesTextRef = useRef<HTMLTextAreaElement>()
  const [updateCreateStudentImm] = useMutation(updateCreateStudentImmunizationMutation)
  const [updateStudentStatus] = useMutation(updateStudentStatusMutation)
  const [savePacket] = useMutation(savePacketMutation)

  const settingsQuery = useQuery(getSettingsQuery, {
    fetchPolicy: 'network-only',
  })
  let enableImmunization = settingsQuery.data?.settings?.enable_immunizations === 1

  const birthday = packet.student?.person?.date_of_birth
  const formInitVals: EnrollmentPacketFormType = {
    student: packet.student,
    immunizations: [],
    notes: packet.admin_notes || '',
    status: packet.status || '',
    preSaveStatus: packet.status || '',
    packetStatuses: [],
    showSaveWarnModal: false,
    missingInfoAlert: false,
    showMissingInfoModal: false,
    showAgeIssueModal: false,
    showValidationErrors: false,
    age_issue: false,
    saveAlert: '',
    medicalExempt: packet.medical_exemption === 1,
    exemptionDate: packet.exemption_form_date ? moment(packet.exemption_form_date).format('MM/DD/yyyy') : '',
    secondary_contact_first: packet.secondary_contact_first || '',
    secondary_contact_last: packet.secondary_contact_last || '',
    secondary_phone: packet.secondary_phone || '',
    secondary_email: packet.secondary_email || '',
    date_of_birth: birthday ? moment(birthday).format('yyyy-MM-DD') : '',
    birth_place: packet.birth_place || '',
    birth_country: packet.birth_country || '',
    last_school: packet.last_school || '',
    last_school_address: packet.last_school_address || '',
    last_school_type: packet.last_school_type,
    household_size: packet.household_size,
    household_income: packet.household_income,
    language: packet.language || '',
    language_home: packet.language_home || '',
    language_home_child: packet.language_home_child || '',
    language_friends: packet.language_friends || '',
    language_home_preferred: packet.language_home_preferred || '',
    hispanic: packet.hispanic || 0,
    school_district: packet.school_district || '',
    race: packet.race || '',
    gender: packet.student?.person?.gender || '',
    worked_in_agriculture: packet.worked_in_agriculture,
    military: packet.military,
    ferpa_agreement: packet.ferpa_agreement,
    photo_permission: packet.photo_permission,
    dir_permission: packet.dir_permission,
    signature_file_id: packet.signature_file_id || 0,
    missing_files: packet.missing_files || '',
  }

  return (
    <>
      <Formik
        initialValues={formInitVals}
        onSubmit={async (vals) => {
          const status = vals.preSaveStatus

          if (['Accepted', 'Conditional'].includes(status)) {
            updateStudentStatus({
              variables: {
                input: {
                  student_id: Number(packet.student.student_id),
                  school_year_id: packet.student.current_school_year_status.school_year_id,
                  status: 1,
                },
              },
            })
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
                missing_files: vals.missing_files,
              },
            },
          })

          updateCreateStudentImm({
            variables: {
              input: vals.immunizations.map((v) => ({
                student_id: v.student_id,
                immunization_id: v.immunization_id,
                value: v.value,
              })),
            },
          })
          refetch()
        }}
      >
        {(formik) => (
          <Form>
            <Modal
              open={true}
              onClose={() => handleModem()}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={classes.modalCard}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <EnrollmentPacketDropDownButton />
                  <CloseIcon onClick={() => handleModem()} style={classes.close} />
                </Box>
                {/*  @ts-ignore */}
                <Box sx={classes.content}>
                  <Grid container sx={{ padding: '10px 0px' }}>
                    <Grid item md={6} sm={6} xs={12}>
                      <EnrollmentJobsInfo student={packet.student} />
                      <EnrollmentPacketDocument packetData={packet} />
                      <EnrollmentPacketNotes textRef={notesTextRef} />
                      <PacketSaveButtons />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      {enableImmunization && <EnrollmentPacketVaccineView />}
                    </Grid>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12} sx={{ padding: '20px 0px' }}>
                    <hr style={{ borderTop: `solid 1px ${SYSTEM_11}`, width: '97%', borderBottom: '0' }} />
                  </Grid>
                  <EnrollmentPacketInfo />
                </Box>

                <studentContext.Provider value={packet.student}>
                  <PacketConfirmModals refetch={refetch} />
                </studentContext.Provider>
              </Box>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  )
}
