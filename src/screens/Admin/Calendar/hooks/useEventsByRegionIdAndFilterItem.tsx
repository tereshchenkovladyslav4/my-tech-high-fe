import { useQuery } from '@apollo/client'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { hexToRgbA } from '../../../../utils/utils'
import { getEventsQuery } from '../services'
import { CalendarEvent, EventResponseVM, EventVM } from '../types'

export const useEventsByRegionIdAndFilterItem = (
  regionId: number = 0,
  parent_id: number = 0,
  searchField: string = '',
) => {
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
      const eventLists =
        parent_id > 0
          ? data?.eventsByRegionId.filter((item: EventResponseVM) => isApplicate(item.filter_grades))
          : data?.eventsByRegionId
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
