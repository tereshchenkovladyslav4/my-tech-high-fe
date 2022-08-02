import React, { FunctionComponent } from 'react'
import { Link } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { DataRow } from '../../../../components/DataRow/DataRow'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'

export const SchoolEnrollment: FunctionComponent = () => {
  const data = [
    {
      label: 'Unassigned',
      value: '10',
    },
    {
      label: 'GPA',
      value: '10',
    },
    {
      label: 'Tooele',
      value: '10',
    },
    {
      label: 'Nebo',
      value: '10',
    },
    {
      label: 'ICSD/SEA',
      value: '10',
    },
  ]

  const renderRows = () =>
    map(data, (el, idx) => {
      const backgroundColor = idx === 0 || idx % 2 == 0 ? '#FAFAFA' : 'white'
      return (
        <DataRow
          key={idx}
          backgroundColor={backgroundColor}
          label={
            <Paragraph size='medium' fontWeight='500'>
              {el.label}
            </Paragraph>
          }
          value={
            <Paragraph size='medium' fontWeight='500'>
              {el.value}
            </Paragraph>
          }
        />
      )
    })

  return (
    <Box>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' paddingX={3}>
        <Subtitle size='large' fontWeight='700'>
          School Of Enrollment
        </Subtitle>
        <Link color='#4145FF' fontWeight={600} fontSize={12}>
          Assign
        </Link>
        {/*<Paragraph 
          sx={{ textDecoration: 'underline'}}
          color='#4145FF' 
          size='medium' 
        >
          Assign
        </Paragraph>*/}
      </Box>
      {renderRows()}
    </Box>
  )
}
