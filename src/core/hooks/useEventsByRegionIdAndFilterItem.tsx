import { useContext, useEffect, useState } from 'react'
import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client'
import { orderBy } from 'lodash'
import moment from 'moment'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getEventsQuery } from '@mth/screens/Admin/Calendar/services'
import { CalendarEvent, EventResponseVM, EventVM } from '@mth/screens/Admin/Calendar/types'
import { hexToRgbA } from '@mth/utils'

export const useEventsByRegionIdAndFilterItem = (
  regionId = 0,
  parent_id = 0,
  searchField = '',
): {
  loading: boolean
  calendarEventList: CalendarEvent[]
  events: EventVM[]
  error: ApolloError | undefined
  refetch: (
    variables?:
      | Partial<{
          findEventsByRegionIdSearch: {
            parent_id: number
            region_id: number
            search_field: string
          }
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<unknown>>
} => {
  const { me } = useContext(UserContext)
  const [calendarEventList, setCalendarEventList] = useState<CalendarEvent[]>([])
  const [events, setEvents] = useState<EventVM[]>([])
  const isApplicate = (gradesFilter: string): boolean => {
    let result = false
    const students = me?.students
    const grades = JSON.parse(gradesFilter)
    students?.map((student) => {
      if (
        student?.status?.at(-1)?.status != 2 &&
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
  const { loading, data, error, refetch } = useQuery(getEventsQuery, {
    variables: {
      findEventsByRegionIdSearch: {
        parent_id: Number(parent_id),
        region_id: Number(regionId),
        search_field: searchField,
      },
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.eventsByRegionId) {
      let eventLists: EventResponseVM[] =
        parent_id > 0
          ? data?.eventsByRegionId.filter((item: EventResponseVM) => isApplicate(item.filter_grades))
          : data?.eventsByRegionId

      // Complex logic for event sorting
      eventLists.map(
        (item) => (
          (item.startDateOnly = moment(item.start_date).startOf('day').toDate()),
          (item.endDateOnly = moment(item.end_date).startOf('day').toDate())
        ),
      )

      eventLists = orderBy(
        eventLists,
        ['startDateOnly', 'endDateOnly', 'EventType.priority', 'start_date'],
        ['asc', 'desc', 'asc', 'asc'],
      )

      setCalendarEventList(
        eventLists.map(
          (event: EventResponseVM): CalendarEvent => ({
            id: event.event_id,
            title: event.EventType.name || '',
            start: moment(event.start_date).startOf('day').toDate(),
            end: moment(event.end_date).startOf('day').add(1, 'days').toDate(),
            color: event.EventType.color || '',
            backgroundColor: hexToRgbA(event.EventType.color || ''),
            allDay: true,
          }),
        ),
      )
      setEvents(
        eventLists.map(
          (event: EventResponseVM): EventVM => ({
            eventId: event.event_id,
            title: event.title,
            eventTypeId: event.TypeId,
            eventTypeColor: event.EventType.color || '',
            eventTypeName: event.EventType.name || '',
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
          }),
        ),
      )
    } else {
      setCalendarEventList([])
      setEvents([])
    }
  }, [loading, data])

  return {
    loading: loading,
    calendarEventList: calendarEventList,
    events: events,
    error: error,
    refetch: refetch,
  }
}
