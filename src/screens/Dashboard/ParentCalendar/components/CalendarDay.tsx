import React, { useEffect, useState } from 'react'
import { Box, Button, Card, Popper } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import moment from 'moment'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { hexToRgbA } from '../../../../utils/utils'
import { CalendarDaysTemplateType, DayVM } from './types'
import { CalendarEvent } from '../../../Admin/Calendar/types'
import { BLACK, GRAY } from '../../../../utils/constants'
import { calendarDayClassess } from './styles'

export const CalendarDays: CalendarDaysTemplateType = ({
  selectedEvent,
  eventList,
  day,
  selectedDate,
  setSelectedDate,
  handleSelectedEvent,
}) => {
  const [currentDays, setCurrentDays] = useState<DayVM[]>([])
  const [showEventLstPopup, setShowEventLstPopup] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // color will use when date has only one event.
  const getEventCountsAndColor = (eventList: CalendarEvent[], date: Date) => {
    let count = 0
    let color = ''
    eventList?.forEach((event, index) => {
      if (
        moment(event.start).format('YYYY-MM-DD') <= moment(date).format('YYYY-MM-DD') &&
        moment(event.end).format('YYYY-MM-DD') > moment(date).format('YYYY-MM-DD')
      ) {
        count++
        color = event.color
      }
    })
    return { counts: count, color: color }
  }

  const handleMoreDetail = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setShowEventLstPopup(true)
  }

  const renderEventList = (eventList: CalendarEvent[], date: Date = new Date()) => {
    return eventList?.map((event, index) => {
      if (
        moment(event.start).format('YYYY-MM-DD') <= moment(date).format('YYYY-MM-DD') &&
        moment(event.end).format('YYYY-MM-DD') > moment(date).format('YYYY-MM-DD')
      ) {
        return (
          <Box key={index} display={'grid'} alignItems={'center'}>
            <Button
              sx={{
                mt: 1.5,
                background: event.backgroundColor,
                border: event.id == selectedEvent?.eventId ? `1px solid ${event.color}` : 'none',
              }}
              onClick={() => setTimeout(() => handleSelectedEvent(event, date), 100)}
            >
              <Subtitle color={event.color} fontWeight='600' sx={{ fontSize: '12px' }}>
                {event.title}
              </Subtitle>
            </Button>
          </Box>
        )
      }
    })
  }

  const getEventElement = (eventList: CalendarEvent[], date: Date = new Date()) => {
    let i = 1
    const filteredList = eventList?.filter(
      (event) =>
        moment(event.start).format('YYYY-MM-DD') <= moment(date).format('YYYY-MM-DD') &&
        moment(event.end).format('YYYY-MM-DD') > moment(date).format('YYYY-MM-DD'),
    )
    return (
      <>
        {filteredList.map((event, index) => {
          if (i < 3) {
            i++
            return (
              <Subtitle
                key={index}
                className='event overlay'
                onClick={() => setTimeout(() => handleSelectedEvent(event, date), 100)}
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
            if (filteredList.length - 1 === index) {
              const extraFields = i - 3
              return (
                <button className='event-more' onClick={(e: React.MouseEvent<HTMLElement>) => handleMoreDetail(e)}>
                  <Subtitle key={index} className='event' sx={calendarDayClassess.eventMore}>
                    {`+${extraFields}`}
                  </Subtitle>
                </button>
              )
            }
            return <></>
          }
        })}
      </>
    )
  }

  useEffect(() => {
    const calendarDays: DayVM[] = []
    let firstDayOfMonth = new Date(day.getFullYear(), day.getMonth(), 1)
    let weekdayOfFirstDay = firstDayOfMonth.getDay()
    for (let cell = 1; cell < 43; cell++) {
      if (cell === 1 && weekdayOfFirstDay === 0) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7)
      } else if (cell === 1) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (cell - weekdayOfFirstDay))
      } else {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1)
      }
      const { counts, color } = getEventCountsAndColor(eventList, new Date(firstDayOfMonth))
      const calendarDay: DayVM = {
        currentMonth: firstDayOfMonth.getMonth() === day.getMonth(),
        date: new Date(firstDayOfMonth),
        month: firstDayOfMonth.getMonth(),
        number: firstDayOfMonth.getDate(),
        selected:
          moment(firstDayOfMonth).format('YYYY-MM-DD') == moment(new Date(selectedDate || '')).format('YYYY-MM-DD'),
        year: firstDayOfMonth.getFullYear(),
        eventCount: counts,
        eventElement: getEventElement(eventList, new Date(firstDayOfMonth)),
        eventColor: color,
      }
      if (cell === 36 && !(firstDayOfMonth.getMonth() === day.getMonth())) {
        break
      }

      calendarDays.push(calendarDay)
    }
    setCurrentDays(calendarDays)
  }, [day, selectedDate, eventList])

  return (
    <Box className='table-content' sx={calendarDayClassess.relative}>
      {currentDays.map((currentDay, index) => {
        return (
          <Box key={index} sx={calendarDayClassess.relative}>
            <Box
              className={
                'calendarDay' + (currentDay.currentMonth ? ' current' : '') + (currentDay.selected ? ' selected' : '')
              }
              sx={{
                border: `1px solid ${currentDay.eventCount === 1 ? currentDay.eventColor : '#eee'}`,
                backgroundColor: currentDay.eventCount === 1 ? currentDay.eventColor : '',
              }}
              onClick={() => {
                setSelectedDate(currentDay.date)
              }}
            >
              <Subtitle
                className='date'
                color={currentDay.eventCount === 1 ? '#FFFFFF !important' : ''}
                sx={{ fontSize: '12px' }}
              >
                {currentDay.number}
              </Subtitle>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>{currentDay.eventElement}</Box>
            </Box>
          </Box>
        )
      })}

      <Popper id={'simple-popper'} open={showEventLstPopup} anchorEl={anchorEl}>
        <Card sx={calendarDayClassess.modal}>
          <Box sx={calendarDayClassess.title}>
            <Subtitle color={GRAY} sx={{ fontSize: '20px' }} fontWeight='500'>
              {moment(selectedDate).format('dddd')}
            </Subtitle>
            <CloseIcon
              sx={calendarDayClassess.closeBtn}
              onClick={() => {
                setAnchorEl(null)
                setShowEventLstPopup(false)
              }}
            />
          </Box>
          <Subtitle color={BLACK} sx={{ fontSize: '20px', textAlign: 'center' }} fontWeight='700'>
            {moment(selectedDate).format('D')}
          </Subtitle>
          {renderEventList(eventList, selectedDate)}
        </Card>
      </Popper>
    </Box>
  )
}
