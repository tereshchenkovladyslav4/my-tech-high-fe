import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import CloseIcon from '@mui/icons-material/Close'
import { Grid, Modal } from '@mui/material'
import { Box } from '@mui/system'
import { omit } from 'lodash'
import moment from 'moment'
import { FormProvider, useForm } from 'react-hook-form'
import { MthColor, QUESTION_TYPE, StudentStatus } from '@mth/enums'
import { saveScheduleMutation } from '@mth/graphql/mutation/schedule'
import { Packet } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { phoneFormat } from '@mth/utils'
import { GenerateStudentPacketPDF } from '../../Records/services'
import { EnrollmentQuestionTab } from '../../SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import {
  getSettingsQuery,
  savePacketMutation,
  updateCreateStudentImmunizationMutation,
  updateStudentStatusMutation,
  getEnrollmentPacketQuery,
} from '../services'
import { PacketConfirmModals } from './modals/ConfirmModals'
import { EnrollmentPacketDocument } from './PacketDocuments'
import { EnrollmentPacketInfo } from './PacketInfo/index'
import { EnrollmentPacketNotes } from './PacketNotes'
import { PacketSaveButtons } from './PacketSaveButtons'
import { EnrollmentPacketDropDownButton } from './PacketStatusDropDown'
import { EnrollmentJobsInfo } from './PacketStudentInfo'
import { studentContext, PacketModalQuestionsContext } from './providers'
import { useStyles } from './styles'
import { EnrollmentPacketFormType } from './types'
import { EnrollmentPacketVaccineView } from './VaccineView/index'

type ProfilePacketModalProps = {
  packet_id: number
  handleModem: () => void
  refetch: () => void
}
export const getPacketQuestionsGql = gql`
  query getPacketEnrollmentQuestions($input: EnrollmentQuestionsInput) {
    getPacketEnrollmentQuestions(input: $input) {
      id
      tab_name
      is_active
      region_id
      groups {
        id
        group_name
        tab_id
        order
        questions {
          id
          question
          group_id
          order
          options
          additional_question
          required
          type
          slug
          default_question
          display_admin
          validation
        }
      }
    }
  }
`

export const ProfilePacketModal: React.FC<ProfilePacketModalProps> = ({ handleModem, packet_id, refetch }) => {
  const classes = useStyles
  const [updateCreateStudentImm] = useMutation(updateCreateStudentImmunizationMutation)
  const [updateStudentStatus] = useMutation(updateStudentStatusMutation)
  const [generateStudentPacketPDF] = useMutation(GenerateStudentPacketPDF)
  const [savePacket] = useMutation(savePacketMutation)
  const [saveSchedule] = useMutation(saveScheduleMutation)
  const settingsQuery = useQuery(getSettingsQuery, {
    fetchPolicy: 'network-only',
  })
  const enableImmunization = settingsQuery.data?.settings?.enable_immunizations === 1

  const { loading: packetLoading, data: packetData } = useQuery<{ packet: Packet }>(getEnrollmentPacketQuery, {
    variables: { packet_id: packet_id },
    fetchPolicy: 'network-only',
  })

  const packet = useMemo(() => packetData?.packet, [packetData?.packet])
  const { me } = useContext(UserContext)
  const { data } = useQuery(getPacketQuestionsGql, {
    variables: {
      input: {
        region_id: Number(me?.selectedRegionId),
        school_year_id: packet?.student.current_school_year_status.school_year_id
          ? packet?.student.current_school_year_status.school_year_id
          : packet?.student.applications[0].school_year.school_year_id,
        mid_year: packet?.student.current_school_year_status.midyear_application,
      },
    },
    fetchPolicy: 'network-only',
  })

  const [questionsData, setQuestionsData] = useState<EnrollmentQuestionTab[]>()

  useEffect(() => {
    if (data?.getPacketEnrollmentQuestions.length > 0) {
      const jsonTabData = data?.getPacketEnrollmentQuestions.map((t) => {
        if (t.groups.length > 0) {
          const jsonGroups = t.groups
            .map((g) => {
              if (g.questions.length > 0) {
                const jsonQuestions = g.questions
                  .map((q) => {
                    return {
                      ...q,
                      options: JSON.parse(q.options) || [],
                    }
                  })
                  .sort((a, b) => a.order - b.order)
                return { ...g, questions: jsonQuestions }
              }
              return g
            })
            .sort((a, b) => a.order - b.order)
          return { ...t, groups: jsonGroups }
        }
        return t
      })
      setQuestionsData(jsonTabData)
    } else {
      setQuestionsData([])
    }
  }, [data])

  const [dynamicValues, setDynamicValues] = useState()

  useEffect(() => {
    const temp = {
      immunizations: [],
      parent: { ...packet?.student?.parent?.person },
      notes: packet?.admin_notes || '',
      status: packet?.status || '',
      preSaveStatus: packet?.status || '',
      packetStatuses: [],
      showSaveWarnModal: false,
      missingInfoAlert: false,
      showMissingInfoModal: false,
      showAgeIssueModal: false,
      showValidationErrors: false,
      age_issue: false,
      saveAlert: '',
      medicalExempt: packet?.medical_exemption === 1,
      exemptionDate: packet?.exemption_form_date ? moment(packet?.exemption_form_date).format('MM/DD/yyyy') : '',
      enableExemptionDate: false,
      signature_file_id: packet?.signature_file_id || 0,
      missing_files: packet?.missing_files || [],
      school_year_id: packet?.student.current_school_year_status.school_year_id,
    }
    if (questionsData && (questionsData?.length || 0) > 0 && packetLoading == false && packet) {
      questionsData.map((tab) => {
        tab?.groups?.map((group) => {
          group?.questions?.map((q) => {
            // if(q.display_admin) {
            if (q.default_question) {
              if (q.slug.includes('packet_')) {
                const fieldName = q.slug.split('packet_')[1]
                temp[q.slug] = packet[fieldName]
                if (q.type === QUESTION_TYPE.CALENDAR) {
                  temp[q.slug] = moment(packet[fieldName]).tz('UTC').format('YYYY-MM-DD')
                }
              } else if (q.slug.includes('student_')) {
                const fieldName = q.slug.split('student_')[1]
                temp[q.slug] = packet.student.person[fieldName]
                temp['student_grade_level'] = packet.student.grade_levels[0]?.grade_level
                temp['student_emailConfirm'] = packet.student.person.email
                if (q.type === QUESTION_TYPE.CALENDAR) {
                  temp[q.slug] = moment(packet.student.person[fieldName]).tz('UTC').format('YYYY-MM-DD')
                }
              } else if (q.slug.includes('address_')) {
                const fieldName = q.slug.split('address_')[1]
                temp[q.slug] = packet.student.parent.person.address[fieldName]
              } else if (q.slug.includes('parent_')) {
                const fieldName = q.slug.split('parent_')[1]
                temp[q.slug] = packet.student.parent.person[fieldName]
                temp['parent_phone_number'] = phoneFormat(packet.student.parent.phone.number)
                temp['parent_emailConfirm'] = packet.student.parent.person.email
                if (q.type === QUESTION_TYPE.CALENDAR) {
                  temp[q.slug] = moment(packet.student.parent.person[fieldName]).tz('UTC').format('YYYY-MM-DD')
                }
              } else if (q.slug.includes('meta_')) {
                const fieldName = q.slug
                const metaJSON = JSON.parse(packet.meta)
                temp[q.slug] = (metaJSON && metaJSON[fieldName]) || ''
                if (q.type === QUESTION_TYPE.CALENDAR) {
                  temp[q.slug] = moment((metaJSON && metaJSON[fieldName]) || null)
                    .tz('UTC')
                    .format('YYYY-MM-DD')
                }
              }
            } else {
              const fieldName = q.slug
              const metaJSON = JSON.parse(packet.meta)
              temp[q.slug] = (metaJSON && metaJSON[fieldName]) || ''
              if (q.type === QUESTION_TYPE.CALENDAR) {
                temp[q.slug] = moment((metaJSON && metaJSON[fieldName]) || null)
                  .tz('UTC')
                  .format('YYYY-MM-DD')
              }
            }
            // }
          })
        })
      })
    }
    setDynamicValues(temp)
  }, [packet, packetLoading, questionsData])

  const methods = useForm({
    shouldUnregister: false,
    defaultValues: dynamicValues,
  })

  useEffect(() => {
    methods.reset(dynamicValues)
    // if (!packetLoading) setDynamicValueStatus(true)
  }, [dynamicValues, methods])

  async function onSubmit(vals: EnrollmentPacketFormType) {
    const status = vals.preSaveStatus
    const temp = {
      packet: {},
      student: {
        first_name: packet?.student?.person?.first_name,
        last_name: packet?.student?.person?.last_name,
        address: {},
      },
      parent: { ...omit(packet?.student?.parent?.person, ['person_id', 'address', 'emailConfirm', 'user']) },
      meta: {},
      student_person_id: Number(packet?.student?.person?.person_id),
      parent_person_id: Number(packet?.student?.parent?.person?.person_id),
      packet_id: Number(packet?.packet_id),
      admin_notes: vals.notes,
      status,
      is_age_issue: vals.age_issue,
      exemption_form_date: vals.exemptionDate,
      medical_exemption: vals.medicalExempt ? 1 : 0,
      missing_files: status === 'Missing Info' ? JSON.stringify(vals.missing_files) : '',
      school_year_id: packet?.student.current_school_year_status.school_year_id,
      student_id: Number(packet?.student.student_id),
    }
    if (questionsData?.length > 0) {
      questionsData.map((tab) => {
        tab?.groups?.map((group) => {
          group?.questions?.map((q) => {
            // if(q.display_admin) {
            if (q.default_question) {
              if (q.slug.includes('packet_')) {
                const fieldName = q.slug.split('packet_')[1]
                temp.packet[fieldName] = vals[q.slug]
              } else if (q.slug.includes('student_')) {
                const fieldName = q.slug.split('student_')[1]
                if (fieldName !== 'student_emailConfirm') {
                  temp.student[fieldName] = vals[q.slug]
                }
              } else if (q.slug.includes('address_')) {
                const fieldName = q.slug.split('address_')[1]
                temp.student.address[fieldName] = vals[q.slug]
              } else if (q.slug.includes('parent_')) {
                const fieldName = q.slug.split('parent_')[1]
                if (fieldName !== 'parent_emailConfirm') {
                  temp.parent[fieldName] = vals[q.slug]
                }
              } else if (q.slug == 'meta_special_education') {
                temp.meta[q.slug] = Number(vals[q.slug])
              } else {
                temp.meta[q.slug] = vals[q.slug]
              }
            } else {
              temp.meta[q.slug] = vals[q.slug]
            }
            // }
          })
        })
      })
    }
    const metaData = JSON.parse(packet?.meta) || []
    const parentLegalName = metaData?.meta_parentlegalname ? metaData.meta_parentlegalname : ''
    temp.meta['meta_parentlegalname'] = parentLegalName

    await savePacket({
      variables: {
        enrollmentPacketInput: {
          ...temp,
          student: omit(temp.student, ['emailConfirm']),
          parent: omit(temp.parent, ['emailConfirm']),
          meta: JSON.stringify(temp.meta),
        },
      },
    })

    await updateCreateStudentImm({
      variables: {
        input: vals.immunizations.map((v) => ({
          student_id: v.student_id,
          immunization_id: v.immunization_id,
          value: v.value,
        })),
      },
    })
    if (['Accepted', 'Conditional'].includes(status)) {
      await updateStudentStatus({
        variables: {
          input: {
            student_id: Number(packet?.student.student_id),
            school_year_id: packet?.student.current_school_year_status.school_year_id,
            status: StudentStatus.ACTIVE,
            packet_id: Number(packet?.packet_id),
          },
        },
      })

      //create schedule with Not submit status
      await saveSchedule({
        variables: {
          createScheduleInput: {
            SchoolYearId: Number(packet?.student.current_school_year_status.school_year_id),
            StudentId: Number(packet?.student.student_id),
            status: 'Not Submitted',
          },
        },
      })
      ///////////////////////////////////////
      await generateStudentPacketPDF({
        variables: {
          generatePacketPdfInput: {
            student_id: Number(packet?.student?.student_id),
            school_year_id: Number(
              packet?.student?.current_school_year_status?.school_year_id ||
                packet?.student.applications?.[0].school_year.school_year_id,
            ),
            mid_year: Boolean(packet?.student?.current_school_year_status?.midyear_application),
          },
        },
      })
    }
    refetch()
    if (status === 'Accepted') {
      methods.setValue('saveAlert', 'The packet has been accepted')
      setTimeout(() => methods.setValue('saveAlert', ''), 5000)
    } else if (!['Age Issue', 'Missing Info'].includes(status)) {
      methods.setValue('saveAlert', 'Packet Saved')
      setTimeout(() => methods.setValue('saveAlert', ''), 5000)
    }
  }

  if (packetLoading) {
    return <p>Packet is Loading</p>
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Modal
          open={true}
          onClose={() => handleModem()}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <studentContext.Provider value={packet.student}>
            <Box sx={classes.modalCard}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <EnrollmentPacketDropDownButton />
                <CloseIcon onClick={() => handleModem()} style={classes.close} />
              </Box>
              <PacketModalQuestionsContext.Provider value={questionsData}>
                <Box sx={classes.content}>
                  <Grid container sx={{ padding: '10px 0px' }}>
                    <Grid item md={6} sm={6} xs={12}>
                      <EnrollmentJobsInfo packet={packet} handleModem={handleModem} refetch={refetch} />
                      <EnrollmentPacketDocument packetData={packet} />
                      <EnrollmentPacketNotes />
                      <PacketSaveButtons submitForm={methods.handleSubmit(onSubmit)} />
                    </Grid>
                    <Grid item md={5} sm={5} xs={5}>
                      {enableImmunization && <EnrollmentPacketVaccineView />}
                    </Grid>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12} sx={{ padding: '20px 0px' }}>
                    <hr style={{ borderTop: `solid 1px ${MthColor.SYSTEM_11}`, width: '97%', borderBottom: '0' }} />
                  </Grid>
                  <EnrollmentPacketInfo />
                </Box>
              </PacketModalQuestionsContext.Provider>
              <PacketConfirmModals packet={packet} refetch={refetch} submitForm={methods.handleSubmit(onSubmit)} />
            </Box>
          </studentContext.Provider>
        </Modal>
      </form>
    </FormProvider>
  )
}
