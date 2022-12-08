import React from 'react'
import { Box } from '@mui/material'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import leftArrowCalendar from '@mth/assets/leftArrowCalendar.svg'
import rightArrowCalendar from '@mth/assets/rightArrowCalendar.svg'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WEEKDAYS } from '@mth/constants'
import { MultiSelectDropDown } from '../../../Admin/Calendar/components/MultiSelectDropDown'
import { CalendarDays } from './CalendarDay'
import './calendar.css'
import { DashboardCalendarProps } from './types'

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  selectedEvent,
  calendarEventList,
  selectedEventTypes,
  eventTypeLists,
  selectedDate,
  currentMonth,
  setCurrentMonth,
  setSelectedDate,
  handleSelectedEvent,
  setSelectedEventTypes,
}) => {
  return (
    <Box className='calendar-wrapper'>
      <Box style={{ fontSize: 14, width: '100%' }} className='calendar'>
        <Box className='toolbar-container'>
          <Box style={{ display: 'flex' }} justifyContent={{ xs: 'space-evenly', md: 'end' }}>
            <Box
              className='calender-year'
              onClick={() => {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 3))
              }}
            >
              <img className='arrow' src={leftArrowCalendar} />
            </Box>
            <Subtitle textAlign='center' fontWeight='bold' className='label' sx={{ mx: { xs: '40px', md: 0 } }}>
              {moment(currentMonth).format('MMM YYYY')}
            </Subtitle>
            <Box
              className='calender-year'
              onClick={() => {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 3))
              }}
            >
              <img className='arrow' src={rightArrowCalendar} />
            </Box>
            <Box display={{ xs: 'none', sm: 'none', md: 'block' }}>
              <MultiSelectDropDown
                checkBoxLists={eventTypeLists}
                selectedLists={selectedEventTypes}
                setSelectedLists={setSelectedEventTypes}
              />
            </Box>
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
            day={currentMonth}
          />
        </Box>
      </Box>
    </Box>
  )
}
