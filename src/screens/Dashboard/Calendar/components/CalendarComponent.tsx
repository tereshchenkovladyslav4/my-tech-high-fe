import React, { FunctionComponent, useState } from 'react'
import moment from 'moment'
import './calendar.css'

export const CalendarComponent: FunctionComponent = () => {
  const weekdayshort = moment.weekdaysShort()
  const [dateObject] = useState(moment())
  const rows: Array<any> = []
  let cells: Array<any> = []
  const totalDaysInMonth = () => dateObject.daysInMonth()

  const currentDay = () => dateObject.format('D')
  const firstDayOfMonth = () => {
    const dateObj = dateObject
    const firstDay = moment(dateObj).startOf('month').format('d') // Day of week 0...1..5...6
    return firstDay
  }

  const weekdayshortname = weekdayshort.map((day) => <th key={day}>{day}</th>)

  const blanks = []
  for (let i = 0; i < firstDayOfMonth(); i++) {
    blanks.push(<td className='calendar-day empty'>{''}</td>)
  }
  const daysInMonth = []
  for (let d = 1; d <= totalDaysInMonth(); d++) {
    const currDay = d == currentDay() ? 'today' : ''
    daysInMonth.push(
      <td key={d} className={`calendar-day ${currDay}`}>
        <span onClick={() => {}}>{d}</span>
      </td>,
    )
  }
  const totalSlots = [...blanks, ...daysInMonth]

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row)
    } else {
      rows.push(cells)
      cells = []
      cells.push(row)
    }
    if (i === totalSlots.length - 1) {
      // let insertRow = cells.slice();
      rows.push(cells)
    }
  })

  const daysinmonth = rows.map((d, i) => <tr key={i}>{d}</tr>)

  return (
    <div style={{ fontSize: 14 }}>
      <div>
        <table>
          <thead>
            <tr>{weekdayshortname}</tr>
          </thead>
          <tbody>{daysinmonth}</tbody>
        </table>
      </div>
    </div>
  )
}
