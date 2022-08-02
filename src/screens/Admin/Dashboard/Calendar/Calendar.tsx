import React, { FunctionComponent } from 'react'
import DateRangeIcon from '@mui/icons-material/DateRange'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { DataRow } from '../../../../components/DataRow/DataRow'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'

export const AdminCalendar: FunctionComponent = () => {
  const data = [
    {
      date: 'November 09',
      event: 'Virtual Event',
    },
    {
      date: 'November 10',
      event: 'Field Trip',
    },
    {
      date: 'November 09',
      event: 'Virtual Event',
    },
    {
      date: 'November 10',
      event: 'Field Trip',
    },
    {
      date: 'November 09',
      event: 'Virtual Event',
    },
    {
      date: 'November 10',
      event: 'Field Trip',
    },
  ]
  const renderRows = () =>
    map(data, (el, idx) => {
      const backgroundColor = idx === 0 || idx % 2 == 0 ? '#FAFAFA' : 'white'
      return (
        <DataRow
          backgroundColor={backgroundColor}
          label={
            <Paragraph size='medium' fontWeight='600'>
              {el.date}
            </Paragraph>
          }
          value={
            <Paragraph size='medium' fontWeight='500'>
              {el.event}
            </Paragraph>
          }
        />
      )
    })

  return (
    <Box>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' paddingX={3}>
        <Paragraph size='large' fontWeight='700'>
          Calendar
        </Paragraph>
        <DateRangeIcon sx={{ color: '#CCCCCC' }} />
      </Box>
      {renderRows()}
    </Box>
  )
}
