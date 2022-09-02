import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Card, Grid } from '@mui/material'
import { Form, Formik } from 'formik'
import moment from 'moment'
import { Prompt, useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { CALENDAR } from '../../../../utils/constants'
import { convertDateToUTCDate } from '../../../../utils/utils'
import { CustomModal } from '../../SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { defaultEvent, defaultEventFormData } from '../defaultValue'
import { RSVPComponent } from '../RSVPComponent'
import { createOrUpdateEventMutation } from '../services'
import { AddEventProps, EventFormData, EventVM } from '../types'
import EventForm from './EventForm'
import FilterComponent from './FilterComponent'
import HeaderComponent from './HeaderComponent'
import { addEventClassess } from './styles'

const AddEvent: React.FC<AddEventProps> = ({ selectedEvent }) => {
  const history = useHistory()
  const [event, setEvent] = useState<EventVM>(defaultEvent)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<EventFormData>(defaultEventFormData)
  const [grades, setGrades] = useState<string[]>([])
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [programYears, setProgramYears] = useState<string[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [schoolofEnrollments, setSchoolofEnrollment] = useState<string[]>([])
  const [others, setOthers] = useState<string[]>([])
  const [providers, setProviders] = useState<string[]>([])
  const [showRSVPForm, setShowRSVPForm] = useState<boolean>(false)
  const [submitSave, {}] = useMutation(createOrUpdateEventMutation)

  const validationSchema = yup.object({
    title: yup.string().required('Title Required').max(100, 'Invalid Title').nullable(),
    eventTypeId: yup.number().required('Type Required').min(1, 'Type Required').nullable(),
    startDate: yup.date().required('Start Date Required').typeError('Invalid Start Date').nullable(),
    endDate: yup
      .date()
      .required('End Date Required')
      .typeError('Invalid End Date')
      .min(yup.ref('startDate'), ({ min }) => moment(min).isValid() && 'Invalid End Date')
      .nullable(),
    description: yup.string().required('Description Required').min(9, 'Invalid Description').nullable(),
    grades: yup.array().min(1, 'At least one Grade Level must be selected'),
    allDay: yup.boolean().nullable(),
    hasRSVP: yup.boolean().nullable(),
  })

  const handleCancelClick = () => {
    history.push(CALENDAR)
  }

  const onSave = async (values: EventFormData) => {
    await submitSave({
      variables: {
        createEventInput: {
          event_id: Number(event?.eventId),
          TypeId: Number(values?.eventTypeId),
          description: values?.description,
          end_date: convertDateToUTCDate(values?.endDate, values?.allDay ? '00:00' : values?.time),
          start_date: convertDateToUTCDate(values?.startDate, values?.allDay ? '00:00' : values?.time),
          all_day: values?.allDay,
          title: values?.title,
          filter_grades: JSON.stringify(values?.grades.filter((grade) => grade)),
          filter_other: JSON.stringify(others),
          filter_program_year: JSON.stringify(programYears),
          filter_provider: JSON.stringify(providers),
          filter_school_of_enrollment: JSON.stringify(schoolofEnrollments),
          filter_users: JSON.stringify(users),
          has_rsvp: values?.hasRSVP,
        },
      },
    })
    setIsChanged(false)
    history.push(CALENDAR)
  }

  useEffect(() => {
    setInitialValues({
      title: event?.title,
      eventTypeId: event?.eventTypeId,
      startDate: event?.startDate || new Date(),
      endDate: event?.endDate || new Date(),
      time: event?.time || '00:00',
      allDay: !!event?.allDay,
      description: event?.description,
      grades: grades,
      hasRSVP: !!event?.hasRSVP,
    })
  }, [event, grades])

  useEffect(() => {
    if (selectedEvent) {
      setEvent(selectedEvent)
      if (selectedEvent?.filters?.grades) setGrades(JSON.parse(selectedEvent?.filters?.grades))
      if (selectedEvent?.filters?.programYear) setProgramYears(JSON.parse(selectedEvent?.filters?.programYear))
      if (selectedEvent?.filters?.users) setUsers(JSON.parse(selectedEvent?.filters?.users))
      if (selectedEvent?.filters?.schoolOfEnrollment)
        setSchoolofEnrollment(JSON.parse(selectedEvent?.filters?.schoolOfEnrollment))
      if (selectedEvent?.filters?.other) setOthers(JSON.parse(selectedEvent?.filters?.other))
      if (selectedEvent?.filters?.provider) setProviders(JSON.parse(selectedEvent?.filters?.provider))
    }
  }, [selectedEvent])

  return (
    <Card sx={addEventClassess.cardBody}>
      {!showRSVPForm ? (
        <>
          <Prompt
            when={isChanged ? true : false}
            message={JSON.stringify({
              header: 'Unsaved Changes',
              content: 'Are you sure you want to leave without saving changes?',
            })}
          />
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSave}
          >
            <Form>
              <HeaderComponent
                title={selectedEvent?.eventId ? 'Edit Event' : 'Add Event'}
                handleCancelClick={handleCancelClick}
                setShowCancelModal={setShowCancelModal}
              />
              <Box sx={{ width: '100%', padding: 3 }}>
                <Grid container justifyContent='center'>
                  <Grid item xs={6} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
                    <EventForm setIsChanged={setIsChanged} handleAddRSVPClick={() => setShowRSVPForm(true)} />
                  </Grid>
                  <Grid item xs={5}>
                    <FilterComponent
                      grades={grades}
                      programYears={programYears}
                      users={users}
                      schoolofEnrollments={schoolofEnrollments}
                      others={others}
                      providers={providers}
                      setGrades={setGrades}
                      setProgramYears={setProgramYears}
                      setUsers={setUsers}
                      setSchoolofEnrollment={setSchoolofEnrollment}
                      setOthers={setOthers}
                      setProviders={setProviders}
                      setIsChanged={setIsChanged}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Form>
          </Formik>
        </>
      ) : (
        <RSVPComponent setShowRSVPForm={setShowRSVPForm} />
      )}
      {showCancelModal && (
        <CustomModal
          title='Cancel Changes'
          description='Are you sure you want to cancel changes?'
          cancelStr='No'
          confirmStr='Yes'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowCancelModal(false)
          }}
          onConfirm={() => {
            setShowCancelModal(false)
            setIsChanged(false)
            setTimeout(() => history.push(CALENDAR), 300)
          }}
        />
      )}
    </Card>
  )
}

export default AddEvent
