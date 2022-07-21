import React, { useState } from 'react'
import { Box } from '@mui/material'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import leftArrowCalendar from '../../../../assets/leftArrowCalendar.svg'
import rightArrowCalendar from '../../../../assets/rightArrowCalendar.svg'
import { MultiSelectDropDown } from '../../../Admin/Calendar/components/MultiSelectDropDown'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CalendarDays } from './CalendarDay'
import { WEEKDAYS } from '../../../../utils/constants'
import { DashboardCalendarTemplateType } from './types'
import './calendar.css'

export const DashboardCalendar: DashboardCalendarTemplateType = ({
  selectedEvent,
  calendarEventList,
  selectedEventTypes,
  eventTypeLists,
  selectedDate,
  setSelectedDate,
  handleSelectedEvent,
  setSelectedEventTypes,
}) => {
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
              {moment(currentDay).format('MMM YYYY')}
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
