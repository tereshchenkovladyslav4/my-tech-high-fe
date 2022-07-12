import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import moment from 'moment'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CalendarEvent, EventVM } from '../../../Admin/Calendar/types'
import { hexToRgbA } from '../../../../utils/utils'

type DayVM = {
  currentMonth: boolean
  date: Date
  month: number
  number: number
  selected: boolean
  year: number
}

type CalendarDaysProps = {
  selectedEvent: EventVM | undefined
  eventList: CalendarEvent[]
  day: Date
  selectedDate: Date | undefined
  handleSelectedEvent: (value: CalendarEvent, date: Date) => void
  setSelectedDate: (value: Date | undefined) => void
}

export const CalendarDays = ({
  selectedEvent,
  eventList,
  day,
  selectedDate,
  setSelectedDate,
  handleSelectedEvent,
}: CalendarDaysProps) => {
  const [currentDays, setCurrentDays] = useState<DayVM[]>([])
  const handelEventList = (dateDetail: DayVM) => {
    let i = 1
    return (
      <>
        {eventList.map((event, index) => {
          if (
            moment(event.start).format('YYYY-MM-DD') <= moment(dateDetail.date).format('YYYY-MM-DD') &&
            moment(event.end).format('YYYY-MM-DD') > moment(dateDetail.date).format('YYYY-MM-DD')
          ) {
            if (i < 4) {
              i++
              return (
                <Subtitle
                  key={index}
                  className='event overlay'
                  onClick={() => setTimeout(() => handleSelectedEvent(event, dateDetail.date), 100)}
                  sx={{
                    backgroundColor: event.id == selectedEvent?.eventId ? event.color : hexToRgbA(event.color),
                    cursor: 'pointer',
                  }}
                >
                  {''}
                </Subtitle>
              )
            } else {
              i++
              if (eventList.length - 1 === index) {
                const extraFields = i - 4
                return (
                  <Subtitle
                    key={index}
                    className='event'
                    sx={{ display: 'flex', fontSize: '11px', alignItems: 'center' }}
                  >
                    {`+${extraFields}`}
                  </Subtitle>
                )
              }
            }
          }
        })}
      </>
    )
  }

  useEffect(() => {
    const calendarDays: DayVM[] = []
    let firstDayOfMonth = new Date(day.getFullYear(), day.getMonth(), 1)
    let weekdayOfFirstDay = firstDayOfMonth.getDay()
    for (let date = 1; date < 43; date++) {
      if (date === 1 && weekdayOfFirstDay === 0) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7)
      } else if (date === 1) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (date - weekdayOfFirstDay))
      } else {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1)
      }

      const calendarDay: DayVM = {
        currentMonth: firstDayOfMonth.getMonth() === day.getMonth(),
        date: new Date(firstDayOfMonth),
        month: firstDayOfMonth.getMonth(),
        number: firstDayOfMonth.getDate(),
        selected:
          moment(firstDayOfMonth).format('YYYY-MM-DD') == moment(new Date(selectedDate || '')).format('YYYY-MM-DD'),
        year: firstDayOfMonth.getFullYear(),
      }

      calendarDays.push(calendarDay)
    }
    setCurrentDays(calendarDays)
  }, [day, selectedDate])

  return (
    <Box className='table-content'>
      {currentDays.map((currentDay, index) => {
        return (
          <Box key={index} style={{ position: 'relative' }}>
            <Box
              className={
                'calendarDay' + (currentDay.currentMonth ? ' current' : '') + (currentDay.selected ? ' selected' : '')
              }
              sx={{
                border: '1px solid #eee',
              }}
              onClick={() => {
                setSelectedDate(currentDay.date)
              }}
            >
              <Subtitle className='date' sx={{ fontSize: '12px' }}>
                {currentDay.number}
              </Subtitle>
              <Box style={{ display: 'flex', justifyContent: 'center' }}>{handelEventList(currentDay)}</Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
