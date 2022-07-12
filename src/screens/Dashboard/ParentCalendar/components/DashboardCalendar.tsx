import React, { useState } from 'react'
import leftArrowCalendar from '../../../../assets/leftArrowCalendar.svg'
import rightArrowCalendar from '../../../../assets/rightArrowCalendar.svg'
import { MultiSelectDropDown } from '../../../Admin/Calendar/components/MultiSelectDropDown'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { MultiSelectDropDownListType } from '../../../Admin/Calendar/components/MultiSelectDropDown/MultiSelectDropDown'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'
import { Box } from '@mui/material'
import { CalendarDays } from './CalendarDay'
import { WEEKDAYS } from '../../../../utils/constants'
import { CalendarEvent, EventVM } from '../../../Admin/Calendar/types'

type DashboardCalendarProps = {
  selectedEvent: EventVM | undefined
  calendarEventList: CalendarEvent[]
  selectedEventTypes: string[]
  selectedDate: Date | undefined
  setSelectedDate: (value: Date | undefined) => void
  eventTypeLists: MultiSelectDropDownListType[]
  handleSelectedEvent: (value: CalendarEvent, date: Date) => void
  setSelectedEventTypes: (value: string[]) => void
}

export const DashboardCalendar = ({
  selectedEvent,
  calendarEventList,
  selectedEventTypes,
  eventTypeLists,
  selectedDate,
  setSelectedDate,
  handleSelectedEvent,
  setSelectedEventTypes,
}: DashboardCalendarProps) => {
  const [currentDay, setCurrentDay] = useState<Date>(new Date())

  return (
    <Box className='calendar-wrapper'>
      <Box style={{ fontSize: 14, width: '100%' }} className='calendar'>
        <Box className='toolbar-container'>
          <Box style={{ display: 'flex' }} justifyContent={{ xs: 'space-evenly', md: 'end' }}>
            <Box
              className='calender-year'
              onClick={() => {
                if (currentDay.getMonth() == 0) {
                  setCurrentDay(new Date(currentDay.getFullYear() - 1, 11, 1))
                } else {
                  setCurrentDay(new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1))
                }
              }}
            >
              <img className='arrow' src={leftArrowCalendar} />
            </Box>
            <Subtitle textAlign='center' fontWeight='bold' className='label'>
              {moment(currentDay).format('MMMM YYYY')}
            </Subtitle>
            <Box
              className='calender-year'
              onClick={() => {
                if (currentDay.getMonth() == 11) {
                  setCurrentDay(new Date(currentDay.getFullYear() + 1, 0, 1))
                } else {
                  setCurrentDay(new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1))
                }
              }}
            >
              <img className='arrow' src={rightArrowCalendar} />
            </Box>
            <MultiSelectDropDown
              checkBoxLists={eventTypeLists}
              selectedLists={selectedEventTypes}
              setSelectedLists={setSelectedEventTypes}
            />
          </Box>
        </Box>
        <Box className='calendar-box'>
          <Box className='table-header'>
            {WEEKDAYS.map((weekday, index) => {
              return (
                <Box key={index} className='weekday'>
                  <Subtitle sx={{ fontSize: '14px', fontWeight: 'bold' }}>{weekday}</Subtitle>
                </Box>
              )
            })}
          </Box>
          <CalendarDays
            selectedEvent={selectedEvent}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleSelectedEvent={handleSelectedEvent}
            eventList={calendarEventList.filter((item) => selectedEventTypes.includes(item.title))}
            day={currentDay}
          />
        </Box>
      </Box>
    </Box>
  )
}
