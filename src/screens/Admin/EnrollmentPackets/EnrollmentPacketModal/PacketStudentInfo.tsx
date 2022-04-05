import React, { useContext } from 'react'
import { Grid } from '@mui/material'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../../components/Typography/Title/Title'
import { MTHBLUE, SYSTEM_06 } from '../../../../utils/constants'
import moment from 'moment'
import { Packet } from '../../../HomeroomStudentProfile/Student/types'
import { parseGradeLevel } from '../../../../utils/stringHelpers'
import { ProfileContext } from '../../../../providers/ProfileProvider/ProfileContext'

export function EnrollmentJobsInfo({ packet }: { packet: Packet }) {
  const { showModal } = useContext(ProfileContext)
  const student = packet.student
  const phoneFormat = (phone: string) => {
    phone = phone.replaceAll('-', '')
    return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
  }

  const age = student.person.date_of_birth ? moment().diff(student.person.date_of_birth, 'years', false) : undefined

  const street = student.parent.person.address.street
  const street2 = student.parent.person.address.street2

  function studentSPED() {
    switch (packet.special_ed) {
      case '0':
        return 'No'
      case '1':
        return 'IEP'
      case '2':
        return '504'
      case '3':
        return 'EXIT'
      default:
        return ''
    }

  }

  return (
    <Grid container>
      <Grid
        sx={{
          '&.MuiGrid-root': {
            maxWidth: '12rem',
            paddingRight: '3px',
          },
        }}
        item
        md={6}
        sm={6}
        xs={12}
      >
        <Title
          color={MTHBLUE} size='small' fontWeight='700'
          sx={{
            cursor: 'pointer',
          }}
        >
          <span
            onClick={() => showModal(student)}
          >
            {student.person.first_name} {student.person.last_name}
          </span>

        </Title>
        <Paragraph sx={{ marginY: '4px', fontSize: '14px' }} color={SYSTEM_06} fontWeight='400'>
          <b>
            {student.person.preferred_first_name && student.person.preferred_last_name
              ? `${student.person.preferred_first_name} ${student.person.preferred_last_name}`
              : 'Not found'}
          </b>
        </Paragraph>
        <Paragraph sx={{ marginY: '4px', fontSize: '14px' }} color={SYSTEM_06} fontWeight='400'>
          Gender: <b>{student.person.gender ? student.person.gender : 'Not found'}</b>
        </Paragraph>
        <Paragraph sx={{ fontSize: '14px' }} color={SYSTEM_06} fontWeight='400'>
          DOB:{' '}
          <b>
            {student.person.date_of_birth
              ? moment(student.person.date_of_birth).format('MMMM D, YYYY')
              : 'Not found'}
            {age ? ` (${age})` : ''}

          </b>
        </Paragraph>
        <Paragraph sx={{ marginY: '4px', fontSize: '14px' }} color={SYSTEM_06} fontWeight='400'>
          {parseGradeLevel(student.grade_levels?.[0]?.grade_level)}
        </Paragraph>
        <Paragraph sx={{ marginY: '4px', fontSize: '14px' }} color={SYSTEM_06} fontWeight='400'>
          SPED: {studentSPED()}
        </Paragraph>
      </Grid>
      <Grid item md={6} sm={6} xs={12}
        sx={{
          '&.MuiGrid-root': {
            maxWidth: '12rem',
          },
        }}
      >
        <Title color={MTHBLUE} size='small' fontWeight='700'
          sx={{
            cursor: 'pointer',
          }}
        >
          <span
            onClick={() => showModal(student.parent)}
          >
            {student.parent.person.first_name} {student.parent.person.last_name}
          </span>
        </Title>
        <Paragraph color='#7B61FF' sx={{ fontSize: '14px', marginY: '4px' }} fontWeight='400'>
          {student.parent.person.email ? `${student.parent.person.email}` : 'Not found'}
        </Paragraph>
        <Paragraph color={SYSTEM_06} sx={{ fontSize: '14px', marginY: '4px' }} fontWeight='400'>
          {student.parent.phone.number ? phoneFormat(student.parent.phone.number) : 'Not found'}
        </Paragraph>
        <Paragraph color={SYSTEM_06} sx={{ fontSize: '14px', marginY: '4px' }} fontWeight='400'>
          {street ? `${street} ${street2 ? street2 : ''}` : 'Not found'}
        </Paragraph>
        <Paragraph color={SYSTEM_06} sx={{ fontSize: '14px', marginY: '4px' }} fontWeight='400'>
          {!student.parent.person.address.city &&
            !student.parent.person.address.state &&
            !student.parent.person.address.zip
            ? 'Not found'
            : `${student.parent.person.address.city + ',' || ''} ${student.parent.person.address.state || ''}
            ${student.parent.person.address.zip || ''}`}.
        </Paragraph>
      </Grid>
    </Grid>
  )
}
