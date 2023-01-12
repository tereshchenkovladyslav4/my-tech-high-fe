import React, { useContext, useEffect, useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Grid, Box } from '@mui/material'
import moment from 'moment-timezone'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Title } from '@mth/components/Typography/Title/Title'
import { STATES_WITH_ABBREVIATION } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { ProfileContext } from '@mth/providers/ProfileProvider/ProfileContext'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { parseGradeLevel, phoneFormat } from '@mth/utils'
import { Packet } from '../../../HomeroomStudentProfile/Student/types'
import { getPacket } from '../services'

const getSchoolYearsByRegionId = gql`
  query Region($regionId: ID!) {
    region(id: $regionId) {
      SchoolYears {
        school_year_id
        date_begin
        date_end
        grades
        birth_date_cut
        special_ed
        special_ed_options
        enrollment_packet
        date_reg_close
        date_reg_open
        midyear_application
        midyear_application_close
        midyear_application_open
      }
    }
  }
`

type EnrollmentJobsInfoProps = {
  packet: Packet
  handleModem: () => void
  refetch: () => void
}

export const EnrollmentJobsInfo: React.FC<EnrollmentJobsInfoProps> = ({ packet, handleModem, refetch }) => {
  const { showModal } = useContext(ProfileContext)
  const { me } = useContext(UserContext)
  const [specialEdOptions, setSpecialEdOptions] = useState<string[]>([])
  const [current_packet, setPacket] = useState<Packet>(packet)

  const { data: schoolYearData } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'cache-and-network',
  })

  const { data: packetData, refetch: packetRefetch } = useQuery(getPacket, {
    variables: {
      packetID: packet.packet_id,
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    setPacket(packetData?.packet)
  }, [packetData?.packet])

  useEffect(() => {
    if (schoolYearData?.region?.SchoolYears) {
      const shoolYears = schoolYearData?.region?.SchoolYears || []
      let special_ed_options = ''
      shoolYears
        .filter((item) => new Date(item.date_begin) <= new Date() && new Date(item.date_end) >= new Date())
        .map((item: { special_ed_options: string; special_ed: boolean }): void => {
          if (
            item.special_ed == true &&
            item.special_ed_options != '' &&
            item.special_ed_options != null &&
            special_ed_options == ''
          )
            special_ed_options = item.special_ed_options
        })
      if (special_ed_options == '') setSpecialEdOptions([])
      else setSpecialEdOptions(special_ed_options.split(','))
    }
  }, [schoolYearData?.region?.SchoolYears])

  const refreshModal = () => {
    refetch()
    packetRefetch()
    handleModem()
  }

  const profileClicked = (profileData) => {
    showModal(profileData, refreshModal)
  }

  const student = current_packet?.student

  const age = student?.person.date_of_birth ? moment().diff(student?.person.date_of_birth, 'years', false) : undefined

  const street = student?.parent.person.address.street
  const street2 = student?.parent.person.address.street2

  function studentSPED() {
    if (specialEdOptions.length > Number(student?.special_ed)) return specialEdOptions[Number(student?.special_ed)]
    return 'None'
  }

  const getState = (state: string | null) => {
    if (state) {
      return state + ','
    }
    const defaultState = student?.parent?.person?.user?.userRegions[0].regionDetail.name
    if (defaultState && STATES_WITH_ABBREVIATION[defaultState]) {
      return STATES_WITH_ABBREVIATION[defaultState] + ','
    }
    return ''
  }

  return (
    <Grid container columnSpacing={4}>
      {!current_packet ? (
        <Box sx={{ minHeight: '200px' }}></Box>
      ) : (
        <>
          <Grid
            sx={{
              '&.MuiGrid-root': {
                paddingRight: '3px',
              },
            }}
            item
            md={4}
            sm={12}
            xs={12}
            xl={6}
          >
            <Title
              color={MthColor.MTHBLUE}
              size='small'
              fontWeight='700'
              sx={{
                cursor: 'pointer',
              }}
            >
              <span onClick={() => profileClicked(student)}>
                {student?.person.first_name} {student?.person.last_name}
              </span>
            </Title>

            <Paragraph sx={{ marginY: '4px', fontSize: '14px' }} color={MthColor.SYSTEM_01} fontWeight='bold'>
              <b>
                {student?.person.preferred_first_name && student?.person.preferred_last_name
                  ? `${student?.person.preferred_first_name} ${student?.person.preferred_last_name}`
                  : 'Not found'}
              </b>
            </Paragraph>
            <Paragraph sx={{ marginY: '4px', fontSize: '14px' }} color={MthColor.SYSTEM_05} fontWeight='bold'>
              Gender:{' '}
              <b style={{ color: MthColor.SYSTEM_01 }}>
                {student?.person.gender ? student?.person.gender : 'Not found'}
              </b>
            </Paragraph>
            <Paragraph sx={{ fontSize: '14px' }} color={MthColor.SYSTEM_05} fontWeight='bold'>
              DOB:{' '}
              <b style={{ color: MthColor.SYSTEM_01 }}>
                {student?.person.date_of_birth
                  ? moment(student?.person.date_of_birth).tz('UTC').format('MMMM D, YYYY')
                  : 'Not found'}
                {age ? ` (${age})` : ''}
              </b>
            </Paragraph>
            <Paragraph sx={{ marginY: '4px', fontSize: '14px' }} color={MthColor.SYSTEM_01} fontWeight='bold'>
              {parseGradeLevel(student?.grade_levels?.[0]?.grade_level)}
            </Paragraph>
            <Paragraph sx={{ marginY: '4px', fontSize: '14px' }} color={MthColor.SYSTEM_05} fontWeight='bold'>
              SPED: <span style={{ color: MthColor.SYSTEM_01 }}>{studentSPED()}</span>
            </Paragraph>
          </Grid>
          <Grid
            item
            md={6}
            sm={6}
            xs={12}
            sx={{
              '&.MuiGrid-root': {
                maxWidth: '12rem',
              },
            }}
          >
            <Title
              color={MthColor.MTHBLUE}
              size='small'
              fontWeight='700'
              sx={{
                cursor: 'pointer',
              }}
            >
              <span onClick={() => profileClicked(student?.parent)}>
                {student?.parent.person.first_name} {student?.parent.person.last_name}
              </span>
            </Title>
            <Paragraph color='#7B61FF' sx={{ fontSize: '14px', marginY: '4px', marginRight: '10px' }} fontWeight='400'>
              {student?.parent.person.email ? `${student?.parent.person.email}` : 'Not found'}
            </Paragraph>
            <Paragraph color={MthColor.SYSTEM_01} sx={{ fontSize: '14px', marginY: '4px' }} fontWeight='400'>
              {student?.parent.phone.number ? phoneFormat(student?.parent.phone.number) : 'Not found'}
            </Paragraph>
            <Paragraph color={MthColor.SYSTEM_01} sx={{ fontSize: '14px', marginY: '4px' }} fontWeight='400'>
              {street ? `${street} ${street2 ? ', ' + street2 : ''}` : 'Not found'}
            </Paragraph>
            <Paragraph color={MthColor.SYSTEM_01} sx={{ fontSize: '14px', marginY: '4px' }} fontWeight='400'>
              {!student?.parent.person.address.city &&
              !student?.parent.person.address.state &&
              !student?.parent.person.address.zip
                ? 'Not found'
                : `${student?.parent.person.address.city ? student?.parent.person.address.city + ',' : ''} ${getState(
                    student?.parent.person.address.state,
                  )}
                ${student?.parent.person.address.zip || ''}`}
            </Paragraph>
          </Grid>
        </>
      )}
    </Grid>
  )
}
