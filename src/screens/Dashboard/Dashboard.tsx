import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { HomeroomGrade } from './HomeroomGrade/HomeroomGrade'
import { ParentCalendar } from './ParentCalendar'
import { ToDo } from './ToDoList/ToDo'
import { Announcements } from './Announcements'
import { Box } from '@mui/system'
import { Card, Grid } from '@mui/material'
import { UserContext } from '../../providers/UserContext/UserProvider'
import { useQuery } from '@apollo/client'
import moment from 'moment'
import { getUserAnnouncements } from './services'
import { Announcement } from './Announcements/types'
import { AnnouncementSection } from './AnnouncementSection'
import { ReadMoreSection } from './ReadMoreSection'
import { getSchoolYearsByRegionId } from '../Admin/Dashboard/SchoolYear/SchoolYear'
import { SchoolYearType } from '../../utils/utils.types'
import { FullCalendar } from './FullCalendar'
import { CalendarEvent, EventResponseVM, EventTypeResponseVM, EventVM } from '../Admin/Calendar/types'
import { MultiSelectDropDownListType } from '../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import { getEventsQuery, getEventTypesQuery } from '../Admin/Calendar/services'
import { hexToRgbA } from '../../utils/utils'

export const imageA =
  'https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-facebook-1.jpg?quality=85'
export const imageB =
  'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=0hb44OrI'
export const imageC =
  'https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg'

export const Dashboard: FunctionComponent = () => {
  const { me } = useContext(UserContext)
  const students = me?.students
  const region_id = me?.userRegion?.at(-1)?.region_id
  const [sectionName, setSectionName] = useState<string>('root')
  const [inProp, setInProp] = useState<boolean>(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement>({})
  const [schoolYears, setSchoolYears] = useState<SchoolYearType[]>([])
  const [calendarEventList, setCalendarEventList] = useState<CalendarEvent[]>([])
  const [events, setEvents] = useState<EventVM[]>([])
  const [eventTypeLists, setEventTypeLists] = useState<MultiSelectDropDownListType[]>([])

  const { loading: eventTypeLoading, data: eventTypeData } = useQuery(getEventTypesQuery, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  const {
    loading: eventsLoading,
    data: eventsData,
    refetch: refetchEvents,
  } = useQuery(getEventsQuery, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  const { data: announcementData } = useQuery(getUserAnnouncements, {
    variables: {
      request: {
        limit: 10,
        search: '',
        user_id: Number(me?.user_id),
      },
    },
    skip: me?.user_id ? false : true,
    fetchPolicy: 'network-only',
  })

  const renderPage = () => {
    switch (sectionName) {
      case 'root':
        return (
          <Box>
            <Grid
              container
              spacing={2}
              justifyContent='center'
              sx={{ margin: '0 !important', width: 'calc(100% - 16px) !important' }}
            >
              <Grid item xs={12} lg={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <HomeroomGrade schoolYears={schoolYears} />
                  </Grid>
                  <Grid item xs={12} order={{ xs: 3, lg: 2 }}>
                    <ParentCalendar
                      events={events}
                      calendarEventList={calendarEventList}
                      eventTypeLists={eventTypeLists}
                      setSectionName={setSectionName}
                    />
                  </Grid>
                  <Grid item xs={12} order={{ xs: 2, lg: 3 }}>
                    {schoolYears.length > 0 && <ToDo schoolYears={schoolYears} />}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card
                  style={{
                    width: '100%',
                    marginRight: 25,
                    borderRadius: 12,
                  }}
                >
                  <Announcements
                    announcements={announcements}
                    setAnnouncements={setAnnouncements}
                    setSectionName={setSectionName}
                    setSelectedAnnouncement={setSelectedAnnouncement}
                  />
                </Card>
              </Grid>
            </Grid>
          </Box>
        )
      case 'viewAll':
        return (
          <AnnouncementSection
            inProp={inProp}
            setSectionName={setSectionName}
            setSelectedAnnouncement={setSelectedAnnouncement}
          />
        )
      case 'readMore':
        return <ReadMoreSection inProp={inProp} setSectionName={setSectionName} announcement={selectedAnnouncement} />
      case 'fullCalendar':
        return (
          <FullCalendar
            events={events}
            calendarEventList={calendarEventList}
            setEvents={setEvents}
            eventTypeLists={eventTypeLists}
            setSectionName={setSectionName}
          />
        )
      default:
        return <></>
    }
  }

  const isApplicate = (gradesFilter: string): boolean => {
    let result = false
    const grades = JSON.parse(gradesFilter)
    students?.map((student) => {
      if (
        student?.grade_levels &&
        grades.includes(
          student?.grade_levels[0].grade_level == 'Kin' ? 'Kindergarten' : student?.grade_levels[0].grade_level,
        )
      ) {
        result = true
      }
    })
    return result
  }

  useEffect(() => {
    setInProp(!inProp)
  }, [sectionName])

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears.map((item: SchoolYearType) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
        })),
      )
    }
  }, [region_id, schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    if (announcementData?.userAnnouncements) {
      const { userAnnouncements } = announcementData
      setAnnouncements(
        userAnnouncements.map((announcement: any) => ({
          id: announcement.id,
          subject: announcement.subject,
          body: announcement.body,
          sender: announcement.sender,
          announcementId: announcement.announcement_id,
          userId: announcement.user_id,
          date: moment(announcement.date).format('MMMM DD'),
          grades: announcement.filter_grades,
          regionId: announcement.RegionId,
        })),
      )
    }
  }, [me?.user_id, announcementData])

  useEffect(() => {
    if (!eventsLoading && eventsData?.eventsByRegionId) {
      const eventLists = eventsData?.eventsByRegionId.filter((item: EventResponseVM) => isApplicate(item.filter_grades))
      setCalendarEventList(
        eventLists.map((event: EventResponseVM) => ({
          id: event.event_id,
          title: event.EventType.name,
          start: moment(new Date(event.start_date)).format('yyyy-MM-DD'),
          end: moment(new Date(event.end_date).setDate(new Date(event.end_date).getDate() + 1)).format('yyyy-MM-DD'),
          color: event.EventType.color,
          backgroundColor: hexToRgbA(event.EventType.color || ''),
          allDay: true,
        })),
      )
      setEvents(
        eventLists.map((event: EventResponseVM) => ({
          eventId: event.event_id,
          title: event.title,
          eventTypeId: event.TypeId,
          eventTypeColor: event.EventType.color,
          eventTypeName: event.EventType.name,
          startDate: new Date(event.start_date),
          endDate: new Date(event.end_date),
          time: moment(new Date(event.start_date)).format('HH:mm'),
          allDay: event.all_day,
          description: event.description,
          filters: {
            grades: event.filter_grades,
            other: event.filter_other,
            programYear: event.filter_program_year,
            provider: event.filter_provider,
            schoolOfEnrollment: event.filter_school_of_enrollment,
            users: event.filter_users,
          },
        })),
      )
    }
  }, [eventsData])

  useEffect(() => {
    if (!eventTypeLoading && eventTypeData?.eventTypes) {
      setEventTypeLists(
        eventTypeData?.eventTypes
          ?.filter((item: EventTypeResponseVM) => !item.archived)
          ?.map((eventType: EventTypeResponseVM) => ({
            name: eventType.name,
            color: eventType.color,
          })),
      )
    }
  }, [eventTypeData])

  return renderPage()
}
