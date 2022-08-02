import React from 'react'
import { Box } from '@mui/material'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import leftArrowCalendar from '../../../../assets/leftArrowCalendar.svg'
import rightArrowCalendar from '../../../../assets/rightArrowCalendar.svg'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { WEEKDAYS } from '../../../../utils/constants'
import { MultiSelectDropDown } from '../../../Admin/Calendar/components/MultiSelectDropDown'
import { CalendarDays } from './CalendarDay'
import { DashboardCalendarTemplateType } from './types'
import './calendar.css'

export const DashboardCalendar: DashboardCalendarTemplateType = ({
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
                if (currentMonth.getMonth() == 0) {
                  setCurrentMonth(new Date(currentMonth.getFullYear() - 1, 11, 1))
                } else {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
                }
              }}
            >
              <img className='arrow' src={leftArrowCalendar} />
            </Box>
            <Subtitle textAlign='center' fontWeight='bold' className='label'>
              {moment(currentMonth).format('MMM YYYY')}
            </Subtitle>
            <Box
              className='calender-year'
              onClick={() => {
                if (currentMonth.getMonth() == 11) {
                  setCurrentMonth(new Date(currentMonth.getFullYear() + 1, 0, 1))
                } else {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
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
            day={currentMonth}
          />
        </Box>
      </Box>
    </Box>
  )
}
