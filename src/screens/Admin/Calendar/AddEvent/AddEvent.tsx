import { Box, Card, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CALENDAR } from '../../../../utils/constants'
import { Prompt, useHistory } from 'react-router-dom'
import { useStyles } from './styles'
import EditEventComponent from './EventForm'
import FilterComponent from './FilterComponent'
import { AddEventProps, EventInvalidOption, EventVM } from '../types'
import CustomModal from '../../SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { useMutation } from '@apollo/client'
import { createOrUpdateEventMutation } from '../services'
import { RSVPComponent } from '../RSVPComponent'
import { convertDateToUTCDate } from '../../../../utils/utils'
import { defaultEvent, defaultInvalidOption } from '../defaultValue'
import HeaderComponent from './HeaderComponent'
import moment from 'moment'

const AddEvent = ({ selectedEvent }: AddEventProps) => {
  const classes = useStyles
  const history = useHistory()
  const [event, setEvent] = useState<EventVM>(defaultEvent)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [invalidOption, setInvalidOption] = useState<EventInvalidOption>(defaultInvalidOption)
  const [grades, setGrades] = useState<string[]>([])
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [programYears, setProgramYears] = useState<string[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [schoolofEnrollments, setSchoolofEnrollment] = useState<string[]>([])
  const [others, setOthers] = useState<string[]>([])
  const [providers, setProviders] = useState<string[]>([])
  const [showRSVPForm, setShowRSVPForm] = useState<boolean>(false)
  const [submitSave, {}] = useMutation(createOrUpdateEventMutation)
  const validation = (): boolean => {
    if (
      event?.title?.length < 100 &&
      event.eventTypeId &&
      event.startDate &&
      event.endDate &&
      moment(event.startDate).format('yyyy-MM-DD') <= moment(event.endDate).format('yyyy-MM-DD') &&
      event.description?.length > 9 &&
      grades?.length > 0
    ) {
      return true
    } else {
      setInvalidOption({
        title: {
          status: event?.title?.length < 100 && event?.title?.length > 0 ? false : true,
          message:
            event?.title?.length < 100 && event?.title?.length > 0
              ? ''
              : event?.title
              ? 'Invalid Title'
              : 'Title Required',
        },
        type: {
          status: event?.eventTypeId ? false : true,
          message: event?.eventTypeId ? '' : 'Type Required',
        },
        startDate: {
          status: event?.startDate ? false : true,
          message: event?.startDate ? '' : 'Invalid Start Date',
        },
        endDate: {
          status:
            moment(event.startDate).format('yyyy-MM-DD') <= moment(event.endDate).format('yyyy-MM-DD') ? false : true,
          message:
            moment(event.startDate).format('yyyy-MM-DD') <= moment(event.endDate).format('yyyy-MM-DD')
              ? ''
              : 'Invalid End Date',
        },
        description: {
          status: event?.description?.length > 9 ? false : true,
          message: event?.description?.length > 9 ? '' : 'Description Required',
        },
        gradeFilter: {
          status: grades?.length > 0 ? false : true,
          message: grades?.length > 0 ? '' : 'At least one Grade Level must be selected',
        },
      })
      return false
    }
  }
  const handleCancelClick = () => {
    history.push(CALENDAR)
  }

  const handleSaveClick = async () => {
    if (validation()) {
      await submitSave({
        variables: {
          createEventInput: {
            event_id: Number(event?.eventId),
            TypeId: Number(event?.eventTypeId),
            description: event?.description,
            end_date: convertDateToUTCDate(event?.endDate, event?.time),
            start_date: convertDateToUTCDate(event?.startDate, event?.time),
            title: event?.title,
            filter_grades: JSON.stringify(grades.filter((grade) => grade)),
            filter_other: JSON.stringify(others),
            filter_program_year: JSON.stringify(programYears),
            filter_provider: JSON.stringify(providers),
            filter_school_of_enrollment: JSON.stringify(schoolofEnrollments),
            filter_users: JSON.stringify(users),
            all_day: event?.allDay,
          },
        },
      })
      setIsChanged(false)
      history.push(CALENDAR)
    }
  }

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
    <Card sx={classes.cardBody}>
      {!showRSVPForm ? (
        <>
          <Prompt
            when={isChanged ? true : false}
            message={JSON.stringify({
              header: 'Unsaved Changes',
              content: 'Are you sure you want to leave without saving changes?',
            })}
          />
          <HeaderComponent
            title={selectedEvent?.eventId ? 'Edit Event' : 'Add Event'}
            handleCancelClick={handleCancelClick}
            setShowCancelModal={setShowCancelModal}
            handleSaveClick={handleSaveClick}
          />
          <Box sx={{ width: '100%', padding: 3 }}>
            <Grid container justifyContent='center'>
              <Grid item xs={6} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
                <EditEventComponent
                  event={event}
                  setEvent={setEvent}
                  setIsChanged={setIsChanged}
                  invalidOption={invalidOption}
                  setInvalidOption={setInvalidOption}
                  handleAddRSVPClick={() => setShowRSVPForm(true)}
                />
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
                  invalidOption={invalidOption}
                  setInvalidOption={setInvalidOption}
                  setIsChanged={setIsChanged}
                />
              </Grid>
            </Grid>
          </Box>
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
