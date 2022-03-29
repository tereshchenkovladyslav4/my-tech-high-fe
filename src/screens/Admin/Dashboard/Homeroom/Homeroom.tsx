import { Link, TextField, Theme } from '@mui/material';
import { Box } from '@mui/system'
import { map } from 'lodash'
import React from 'react'
import { DataRow } from '../../../../components/DataRow/DataRow'
import { Table } from '../../../../components/Table/Table'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';



export const Homeroom = () => {
  const [value, setValue] = React.useState<Date | null | "">(new Date());
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };
  const data = [
    {
      label: 'Unassigned Students',
      value: '10',
    },
    {
      label: 'Assigned Students',
      value: '10',
    },
    {
      label: 'Ungraded Logs',
      value: '10',
    },
    {
      label: 'Graded Logs',
      value: '10',
    },
    {
      label: 'Not Submitted Logs',
      value: '10',
    },
  ]

  const renderRows = () =>
    map(data, (el, idx) => {
      const backgroundColor = idx === 0 || idx % 2 == 0 ? '#FAFAFA' : 'white'
      return (
        <DataRow
          backgroundColor={backgroundColor}
          label={
            <Paragraph size='medium' fontWeight='500'>
              {el.label}
            </Paragraph>
          }
          value={<Paragraph size='medium'>{el.value}</Paragraph>}
        />
      )
    })

  return (
    <Box>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' paddingX={3}>
        <Subtitle size='large' fontWeight='700'>
          Homeroom
        </Subtitle>
        <Link color='#4145FF' fontWeight={600} fontSize={12}>
          View All
        </Link>
      </Box>
      <Box sx={{ width: 220, px: 3, mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Due Date"
            inputFormat="MM/dd/yyyy"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField
              color="primary"
              size="small"
              {...params}
            />}
          />
        </LocalizationProvider>
      </Box>
      {renderRows()}
    </Box>
  )
}
