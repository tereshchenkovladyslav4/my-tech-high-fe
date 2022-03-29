import React from 'react'
import { Grid } from '@mui/material'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../../components/Typography/Title/Title'
import { MTHBLUE, SYSTEM_06 } from '../../../../utils/constants'
import moment from 'moment'

export function EnrollmentJobsInfo({ student }) {
  const phoneFormat = (phone: string) => {
    return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
  }

  return (
    <Grid container>
      <Grid
        sx={{
          '&.MuiGrid-root': {
            maxWidth: '33%',
          },
        }}
        item
        md={6}
        sm={6}
        xs={12}
      >
        <Title color={MTHBLUE} size='small' fontWeight='700'>
          {student.person.first_name} {student.person.last_name}
        </Title>
        <Paragraph sx={{ marginY: '4px' }} color={SYSTEM_06} size='medium' fontWeight='400'>
          <b>
            {student.person.preferred_first_name && student.person.preferred_last_name
              ? `${student.person.preferred_first_name} ${student.person.preferred_last_name}`
              : 'Not found'}
          </b>
        </Paragraph>
        <Paragraph sx={{ marginY: '4px' }} color={SYSTEM_06} size='medium' fontWeight='400'>
          Gender: <b>{student.person.gender ? student.person.gender : 'Not found'}</b>
        </Paragraph>
        <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
          DOB:{' '}
          <b>
            {student.person.date_of_birth
              ? moment(student.person.date_of_birth).format('MMMM D, YYYY')
              : 'Not found'}{' '}
            {student.person.date_of_birth && (student.grade_level ? student.grade_level : '0')}
          </b>
        </Paragraph>
        <Paragraph sx={{ marginY: '4px' }} color={SYSTEM_06} size='medium' fontWeight='400'>
          Kindergarten <b>( )</b>
        </Paragraph>
        <Paragraph sx={{ marginY: '4px' }} color={SYSTEM_06} size='medium' fontWeight='400'>
          SPED: {student.special_ed === 0 ? 'No' : 'Yes'}
        </Paragraph>
      </Grid>
      <Grid item md={6} sm={6} xs={12}>
        <Title color={MTHBLUE} size='small' fontWeight='700'>
          {student.parent.person.first_name} {student.parent.person.last_name}
        </Title>
        <Paragraph color='#7B61FF' size='medium' fontWeight='400'>
          {student.parent.person.email ? `${student.parent.person.email}` : 'Not found'}
        </Paragraph>
        <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
          {student.parent.phone.number ? phoneFormat(student.parent.phone.number) : 'Not found'}
        </Paragraph>
        <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
          {student.parent.person.address.street
            ? `${student.parent.person.address.street} ${student.parent.person.address.city}`
            : 'Not found'}
        </Paragraph>
        <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
          {!student.parent.person.address.city &&
            !student.parent.person.address.state &&
            !student.parent.person.address.zip
            ? 'Not found'
            : `${student.parent.person.address.city + ',' || ''} ${student.parent.person.address.state || ''}
            ${student.parent.person.address.zip || ''}`}
        </Paragraph>
      </Grid>
    </Grid>
  )
}
