import React, { FunctionComponent } from 'react'
import { Box, Card } from '@mui/material'
import { Table } from '../../../../components/Table/Table'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../../utils/constants'

export const StudentSchedule: FunctionComponent = () => {
  const tableHeaders = [
    <Paragraph size='large' key='period'>
      Period
    </Paragraph>,
    <Paragraph size='large' key='course'>
      Course
    </Paragraph>,
  ]
  const data = [
    {
      period: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          01
        </Paragraph>
      ),
      course: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          Homeroom
        </Paragraph>
      ),
    },
    {
      period: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          02
        </Paragraph>
      ),
      course: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          Middle School Math
        </Paragraph>
      ),
    },
    {
      period: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          03
        </Paragraph>
      ),
      course: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          Middle School Language
        </Paragraph>
      ),
    },
    {
      period: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          04
        </Paragraph>
      ),
      course: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          Middle School Science
        </Paragraph>
      ),
    },
    {
      period: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          05
        </Paragraph>
      ),
      course: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          Exploring Technology
        </Paragraph>
      ),
    },
    {
      period: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          06
        </Paragraph>
      ),
      course: (
        <Paragraph size='large' color='#A1A1A1' sx={{ padding: 0.8 }}>
          Exploring Technology
        </Paragraph>
      ),
    },
  ]
  return (
    <Card sx={{ borderRadius: 4, alignSelf: 'center', width: '95%', paddingY: 2, paddingX: 4, marginLeft: 2 }}>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        marginTop={2}
        marginBottom={1}
      >
        <Subtitle fontWeight='700'>Schedule</Subtitle>
        <Paragraph sx={{ textDecoration: 'underline' }} color={MTHBLUE}>
          Edit/View All
        </Paragraph>
      </Box>
      <Table tableHeaders={tableHeaders} tableBody={data} />
    </Card>
  )
}
