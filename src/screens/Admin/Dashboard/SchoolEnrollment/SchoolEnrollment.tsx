import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Link } from '@mui/material'
import { Box } from '@mui/system'
import { map, toNumber } from 'lodash'
import { StudentStatus } from '@mth/enums'
import { DataRow } from '../../../../components/DataRow/DataRow'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { GetSchoolsOfEnrollment, getStudents } from './service'

type SchoolEnrollmentProps = {
  selectedYear: string | number
  regionId: number
}

type Partner = {
  abbreviation: string
  active: number
  name: string
  school_partner_id: string
}

type PartnerStudentMap = {
  [key: string]: number
}

type CurrentSOE = {
  school_partner_id: number
}

type StudentOfStatus = {
  status: number
}

type StudentforSOE = {
  currentSoe: CurrentSOE[]
  status: StudentOfStatus[]
}

export const SchoolEnrollment: React.FC<SchoolEnrollmentProps> = ({ selectedYear, regionId }) => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [partnerCountMap, setPartnerCountMap] = useState<PartnerStudentMap>([])

  const { data: schoolsOfEnrollmentData, loading: schoolPartnerLoading } = useQuery(GetSchoolsOfEnrollment, {
    variables: {
      schoolPartnerArgs: {
        region_id: regionId,
        school_year_id: toNumber(selectedYear),
        sort: {
          column: 'name',
          direction: 'ASC',
        },
      },
    },
    skip: !selectedYear || !regionId,
    fetchPolicy: 'network-only',
  })

  const { data: students, loading: studentsLoading } = useQuery(getStudents, {
    variables: {
      sort: 'student|desc',
      take: -1,
      filter: {
        schoolYear: toNumber(selectedYear),
      },
    },
    skip: selectedYear ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!schoolPartnerLoading && !studentsLoading && schoolsOfEnrollmentData && students) {
      const studentForSOE = students.studentsForSOE.results
      const partnersForSOE = schoolsOfEnrollmentData.getSchoolsOfEnrollmentByRegion
      setPartners(partnersForSOE.filter((item: Partner) => item.active !== 0))

      const partnerStudentMap: PartnerStudentMap = {}
      studentForSOE.map((student: StudentforSOE) => {
        const currentSoe = student.currentSoe
        const studentStatus = student.status[0].status
        if (currentSoe.length === 0) {
          if (studentStatus === StudentStatus.ACTIVE) {
            if (partnerStudentMap['unassign-active']) {
              partnerStudentMap['unassign-active'] = partnerStudentMap['unassign-active'] + 1
            } else {
              partnerStudentMap['unassign-active'] = 1
            }
          } else if (studentStatus === StudentStatus.PENDING) {
            if (partnerStudentMap['unassign-pending']) {
              partnerStudentMap['unassign-pending'] = partnerStudentMap['unassign-pending'] + 1
            } else {
              partnerStudentMap['unassign-pending'] = 1
            }
          }
        } else {
          if (studentStatus === StudentStatus.ACTIVE) {
            if (partnerStudentMap['active-' + currentSoe[0]['school_partner_id']]) {
              partnerStudentMap['active-' + currentSoe[0]['school_partner_id']] =
                partnerStudentMap['active-' + currentSoe[0]['school_partner_id']] + 1
            } else {
              partnerStudentMap['active-' + currentSoe[0]['school_partner_id']] = 1
            }
          } else if (studentStatus === StudentStatus.PENDING) {
            if (partnerStudentMap['pending-' + currentSoe[0]['school_partner_id']]) {
              partnerStudentMap['pending-' + currentSoe[0]['school_partner_id']] =
                partnerStudentMap['pending-' + currentSoe[0]['school_partner_id']] + 1
            } else {
              partnerStudentMap['pending-' + currentSoe[0]['school_partner_id']] = 1
            }
          }
        }
      })
      setPartnerCountMap(partnerStudentMap)
    }
  }, [schoolPartnerLoading, studentsLoading, schoolsOfEnrollmentData, students])

  const renderRows = () =>
    map(partners, (el, idx) => {
      const backgroundColor = idx === 0 || idx % 2 == 0 ? 'white' : '#FAFAFA'
      return (
        <DataRow
          key={idx}
          backgroundColor={backgroundColor}
          label={
            <Box sx={{ display: 'flex' }}>
              <Paragraph size='medium' fontWeight='500'>
                {el.name}
              </Paragraph>
              <Paragraph size='medium' fontWeight='700' sx={{ marginLeft: '8px' }}>
                {partnerCountMap['pending-' + el.school_partner_id]
                  ? partnerCountMap['pending-' + el.school_partner_id]
                  : 0}
              </Paragraph>
            </Box>
          }
          value={
            <Paragraph size='medium' fontWeight='700'>
              {partnerCountMap['active-' + el.school_partner_id]
                ? partnerCountMap['active-' + el.school_partner_id]
                : 0}
            </Paragraph>
          }
        />
      )
    })

  return (
    <Box>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' paddingX={3}>
        <Subtitle size='large' fontWeight='700'>
          School of Enrollment
        </Subtitle>
        <Link color='#4145FF' fontWeight={600} fontSize={12}>
          Assign
        </Link>
      </Box>
      <DataRow
        backgroundColor='#FAFAFA'
        label={
          <Box sx={{ display: 'flex' }}>
            <Paragraph size='medium' fontWeight='500'>
              Unassigned
            </Paragraph>
            <Paragraph size='medium' fontWeight='700' sx={{ marginLeft: '8px' }}>
              {partnerCountMap['unassign-pending'] ? partnerCountMap['unassign-pending'] : 0}
            </Paragraph>
          </Box>
        }
        value={
          <Paragraph size='medium' fontWeight='700'>
            {partnerCountMap['unassign-active'] ? partnerCountMap['unassign-active'] : 0}
          </Paragraph>
        }
      />
      {renderRows()}
    </Box>
  )
}
