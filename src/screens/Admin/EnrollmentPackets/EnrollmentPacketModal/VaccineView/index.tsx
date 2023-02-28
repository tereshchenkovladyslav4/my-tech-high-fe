import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md'
import { Packet } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { StudentImmunizatiosnQuery } from '../../services'
import { getValidGrade } from '../helpers'
import { EnrollmentPacketFormType } from '../types'
import { VaccinesInfoHeader } from './Header'
import ImmunizationItem from './ImmunizationItem'
import { StudentImmunization } from './types'

type EnrollmentVaccineInfoProps = {
  packet: Packet
}

export const EnrollmentPacketVaccineView: React.FC<EnrollmentVaccineInfoProps> = ({ packet }) => {
  const { setValue } = useFormContext()
  const student = packet?.student

  const { data, refetch } = useQuery<{ StudentImmunizations: StudentImmunization[] }>(StudentImmunizatiosnQuery, {
    variables: {
      student_id: +(student?.student_id || 0),
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    refetch()
  }, [packet])

  useEffect(() => {
    if (data?.StudentImmunizations) {
      const levels = student?.grade_levels
      const grade = getValidGrade(levels?.length ? levels[0]?.grade_level + '' : '')
      setValue(
        'immunizations',
        data?.StudentImmunizations.map((v) => {
          if (v.value) return v
          const max_grade = getValidGrade(v?.immunization?.max_grade_level || '')
          const min_grade = getValidGrade(v?.immunization?.min_grade_level || '')
          const isNA = grade < min_grade || grade > max_grade
          return {
            ...v,
            value: isNA ? 'NA' : '',
          }
        }),
      )
    }
  }, [data])

  return <VaccineView />
}

const VaccineView: React.FC = () => {
  const [showImmunizations, setShowImmunizations] = useState<boolean>(true)
  const { watch } = useFormContext<EnrollmentPacketFormType>()
  const immunizations = watch('immunizations')

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        {showImmunizations ? (
          <VaccinesInfoHeader />
        ) : (
          <Typography
            sx={{
              width: '25rem',
              textAlign: 'end',
              fontWeight: 'bold',
              fontSize: 'large',
              paddingRight: '10px',
            }}
          >
            Vaccines
          </Typography>
        )}
        <Box onClick={() => setShowImmunizations(!showImmunizations)}>
          {showImmunizations ? <MdArrowDropUp size='70' height='30px' /> : <MdArrowDropDown size='70' height='30px' />}
        </Box>
      </Box>

      {showImmunizations && (
        <Box display={'flex'}>
          <Box sx={{ width: '250px' }}>
            {immunizations &&
              immunizations
                .slice(0, Math.ceil(immunizations.length / 2))
                .map((it) => <ImmunizationItem key={it.immunization_id} item={it} />)}
          </Box>
          <Box sx={{ width: '250px' }}>
            {immunizations &&
              immunizations
                .slice(Math.ceil(immunizations.length / 2), immunizations.length)
                .map((it) => <ImmunizationItem key={it.immunization_id} item={it} />)}
          </Box>
        </Box>
      )}
    </>
  )
}
