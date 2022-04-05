import React, { useContext, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { StudentImmunizatiosnQuery } from '../../services'
import { useQuery } from '@apollo/client'
import ImmunizationItem from './ImmunizationItem'
import { EnrollmentPacketFormType } from '../types'
import { StudentImmunization } from './types'
import { getValidGrade } from '../helpers'
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md'
import { useFormContext } from 'react-hook-form'
import VaccinesInfoHeader from './Header'
import { studentContext } from '../providers'


export default function EnrollmentPacketVaccineView() {
    const { setValue } = useFormContext()
    const student = useContext(studentContext)

    const { data } = useQuery<{ StudentImmunizations: StudentImmunization[] }>(
        StudentImmunizatiosnQuery,
        {
            variables: {
                student_id: +student?.student_id,
            },
            fetchPolicy: 'network-only',
        },
    )

    useEffect(() => {
        if (data?.StudentImmunizations) {
            const levels = student.grade_levels
            const grade = getValidGrade(levels?.length ? levels[0]?.grade_level + '' : '')
            setValue(
                'immunizations',
                data?.StudentImmunizations.map((v) => {
                    if (v.value) return v
                    const max_grade = getValidGrade(v.immunization.max_grade_level)
                    const min_grade = getValidGrade(v.immunization.min_grade_level)
                    const isNA = grade < min_grade || grade > max_grade
                    return {
                        ...v,
                        value: isNA ? 'NA' : '',
                    }
                })
            )
        }
    }, [data])

    return (
        <VaccineView />
    )
}



const VaccineView: React.FC = () => {
    const [showImmunizations, setShowImmunizations] = useState(true)
    const { watch } = useFormContext<EnrollmentPacketFormType>()
    const immunizations = watch('immunizations')

    return (
        <>
            <Box sx={{ display: 'flex' }}>

                {showImmunizations ?
                    <VaccinesInfoHeader /> :
                    <Typography sx={{
                        width: '25rem',
                        textAlign: 'end',
                        fontWeight: 'bold',
                        fontSize: 'large',
                        paddingRight: '10px',
                    }}>
                        Vaccines
                    </Typography>
                }
                <Box sx={{ position: 'relative', top: '-23px', left: '-10px' }}
                    onClick={() => setShowImmunizations(!showImmunizations)}
                >
                    {
                        showImmunizations ?
                            <MdArrowDropUp size='70' height="30px" />
                            :
                            <MdArrowDropDown size='70' height="30px" />
                    }
                </Box>
            </Box>

            {
                showImmunizations && <Box sx={{ width: '250px' }}>
                    {immunizations.map((it) =>
                        <ImmunizationItem
                            key={it.immunization_id}
                            item={it}
                        />
                    )}
                </Box>
            }
        </>
    )

}