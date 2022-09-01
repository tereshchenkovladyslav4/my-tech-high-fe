import React, { useEffect, useState, useContext } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import CloseIcon from '@mui/icons-material/Close'
import { Grid, Modal } from '@mui/material'
import { Box } from '@mui/system'
import { omit } from 'lodash'
import moment from 'moment'
import { FormProvider, useForm } from 'react-hook-form'
import { QUESTION_TYPE } from '@mth/components/QuestionItem/QuestionItemProps'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SYSTEM_11 } from '../../../../utils/constants'
import { Packet } from '../../../HomeroomStudentProfile/Student/types'
import { CreateStudentRecordMutation } from '../../Records/services'
import { EnrollmentQuestionTab } from '../../SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import {
  getSettingsQuery,
  savePacketMutation,
  updateCreateStudentImmunizationMutation,
  updateStudentStatusMutation,
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

type EnrollmentPacketModalProps = {
  packet: Packet
  handleModem: () => void
  refetch: () => void
}

export const EnrollmentPacketModal: React.FC<EnrollmentPacketModalProps> = ({ handleModem, packet, refetch }) => {
  const classes = useStyles
  const [updateCreateStudentImm] = useMutation(updateCreateStudentImmunizationMutation)
  const [updateStudentStatus] = useMutation(updateStudentStatusMutation)
  const [createStudentRecord] = useMutation(CreateStudentRecordMutation)
  const [savePacket] = useMutation(savePacketMutation)
  const settingsQuery = useQuery(getSettingsQuery, {
    fetchPolicy: 'network-only',
  })
  const enableImmunization = settingsQuery.data?.settings?.enable_immunizations === 1

  const { me } = useContext(UserContext)
  const { data } = useQuery(getPacketQuestionsGql, {
    variables: { input: { region_id: Number(me?.selectedRegionId) } },
    fetchPolicy: 'network-only',
  })

  const initValues = {
    immunizations: [],
    parent: { ...packet.student.parent.person },
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
    enableExemptionDate: false,
    signature_file_id: packet.signature_file_id || 0,
    missing_files: packet.missing_files || [],
    school_year_id: packet.student.current_school_year_status.school_year_id,
  }
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

  const [dynamicValues, setDynamicValues] = useState(initValues)

  useEffect(() => {
    if (questionsData?.length > 0) {
      const temp = { ...dynamicValues }
      questionsData.map((tab) => {
        tab?.groups?.map((group) => {
          group?.questions?.map((q) => {
            // if(q.display_admin) {
            if (q.default_question) {
              if (q.slug.includes('packet_')) {
                const fieldName = q.slug.split('packet_')[1]
                temp[q.slug] = packet[fieldName]
                if (q.type === QUESTION_TYPE.CALENDAR) {
                  temp[q.slug] = moment(packet[fieldName]).format('YYYY-MM-DD')
                }
              } else if (q.slug.includes('student_')) {
                const fieldName = q.slug.split('student_')[1]
                temp[q.slug] = packet.student.person[fieldName]
                temp['student_grade_level'] = packet.student.grade_levels[0]?.grade_level
                temp['student_emailConfirm'] = packet.student.person.email
                if (q.type === QUESTION_TYPE.CALENDAR) {
                  temp[q.slug] = moment(packet.student.person[fieldName]).format('YYYY-MM-DD')
                }
              } else if (q.slug.includes('address_')) {
                const fieldName = q.slug.split('address_')[1]
                temp[q.slug] = packet.student.person.address[fieldName]
              } else if (q.slug.includes('parent_')) {
                const fieldName = q.slug.split('parent_')[1]
                temp[q.slug] = packet.student.parent.person[fieldName]
                temp['parent_phone_number'] = packet.student.parent.phone.number
                temp['parent_emailConfirm'] = packet.student.parent.person.email
                if (q.type === QUESTION_TYPE.CALENDAR) {
                  temp[q.slug] = moment(packet.student.parent.person[fieldName]).format('YYYY-MM-DD')
                }
              } else if (q.slug.includes('meta_')) {
                const fieldName = q.slug
                const metaJSON = JSON.parse(packet.meta)
                temp[q.slug] = (metaJSON && metaJSON[fieldName]) || ''
                if (q.type === QUESTION_TYPE.CALENDAR) {
                  temp[q.slug] = moment((metaJSON && metaJSON[fieldName]) || null).format('YYYY-MM-DD')
                }
              }
            } else {
              const fieldName = q.slug
              const metaJSON = JSON.parse(packet.meta)
              temp[q.slug] = (metaJSON && metaJSON[fieldName]) || ''
              if (q.type === QUESTION_TYPE.CALENDAR) {
                temp[q.slug] = moment((metaJSON && metaJSON[fieldName]) || null).format('YYYY-MM-DD')
              }
            }
            // }
          })
        })
      })
      setDynamicValues(temp)
    } else {
      setDynamicValues(initValues)
    }
  }, [questionsData])
  const methods = useForm({
    shouldUnregister: false,
    defaultValues: dynamicValues,
  })

  useEffect(() => {
    methods.reset(dynamicValues)
  }, [dynamicValues])

  async function onSubmit(vals: EnrollmentPacketFormType) {
    const status = vals.preSaveStatus

    if (status === 'Accepted') {
      methods.setValue('saveAlert', 'The packet has been accepted')
      setTimeout(() => methods.setValue('saveAlert', ''), 5000)
    } else if (!['Age Issue', 'Missing Info'].includes(status)) {
      methods.setValue('saveAlert', 'Packet Saved')
      setTimeout(() => methods.setValue('saveAlert', ''), 5000)
    }
    if (['Accepted', 'Conditional'].includes(status)) {
      updateStudentStatus({
        variables: {
          input: {
            student_id: Number(packet.student.student_id),
            school_year_id: packet.student.current_school_year_status.school_year_id,
            status: 1,
            packet_id: Number(packet.packet_id),
          },
        },
      })
      createStudentRecord({
        variables: {
          regionId: Number(me?.selectedRegionId),
          studentId: Number(packet.student.student_id),
        },
      })
    }
    const temp = {
      packet: {},
      student: {
        first_name: packet.student?.person?.first_name,
        last_name: packet.student?.person?.last_name,
        address: {},
      },
      parent: { ...omit(packet.student.parent.person, ['person_id', 'address', 'emailConfirm']) },
      meta: {},
      student_person_id: Number(packet.student?.person?.person_id),
      parent_person_id: Number(packet.student?.parent?.person?.person_id),
      packet_id: Number(packet.packet_id),
      admin_notes: vals.notes,
      status,
      is_age_issue: vals.age_issue,
      exemption_form_date: vals.exemptionDate,
      medical_exemption: vals.medicalExempt ? 1 : 0,
      missing_files: status === 'Missing Info' ? JSON.stringify(vals.missing_files) : '',
      school_year_id: packet.student.current_school_year_status.school_year_id,
      student_id: Number(packet.student.student_id),
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
              }
            } else {
              temp.meta[q.slug] = vals[q.slug]
            }
            // }
          })
        })
      })
    }
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
  }

  const tempFunction = () => {}

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
                      <EnrollmentJobsInfo packet={packet} handleModem={tempFunction} />
                      <EnrollmentPacketDocument packetData={packet} />
                      <EnrollmentPacketNotes />
                      <PacketSaveButtons submitForm={methods.handleSubmit(onSubmit)} />
                    </Grid>
                    <Grid item md={5} sm={5} xs={5}>
                      {enableImmunization && <EnrollmentPacketVaccineView />}
                    </Grid>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12} sx={{ padding: '20px 0px' }}>
                    <hr style={{ borderTop: `solid 1px ${SYSTEM_11}`, width: '97%', borderBottom: '0' }} />
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
