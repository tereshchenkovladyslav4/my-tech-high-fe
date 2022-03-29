import React, { useEffect, useState } from 'react'
import { SYSTEM_01 } from '../../../../../utils/constants'
import { Box, Checkbox, Typography } from '@mui/material'
import { StudentImmunizatiosnQuery } from '../../services'
import { useQuery } from '@apollo/client'
import ImmunizationItem from './ImmunizationItem'
import CustomDateInput from './CustomDateInput'
import { useFormikContext } from 'formik'
import { EnrollmentPacketFormType } from '../types'
import { StudentImmunization } from './types'
import { getValidGrade, isValidDate } from '../helpers'
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md'


export default function EnrollmentPacketVaccineView() {
    const { values, setFieldValue } = useFormikContext<EnrollmentPacketFormType>()

    const { data } = useQuery<{ StudentImmunizations: StudentImmunization[] }>(
        StudentImmunizatiosnQuery,
        {
            variables: {
                student_id: +values.student.student_id,
            },
            fetchPolicy: 'network-only',
        },
    )

    useEffect(() => {
        if (data?.StudentImmunizations && !values.immunizations.length) {
            setFieldValue(
                'immunizations',
                data?.StudentImmunizations.map((v) => {
                    const grade = getValidGrade(values.student.grade_level + '')
                    const max_grade = getValidGrade(v.immunization.max_grade_level)
                    const min_grade = getValidGrade(v.immunization.min_grade_level)
                    const isNA = grade < min_grade || grade > max_grade
                    if (v.value) return v
                    return {
                        ...v,
                        value: isNA ? 'NA' : ''
                    }
                })
            )
        }
    }, [data])
    return (<VaccineView />)
}



const VaccineView: React.FC = () => {
    const { values, setFieldValue } = useFormikContext<EnrollmentPacketFormType>()
    const [showImmunizations, setShowImmunizations] = useState(true)
    const enableExamptiondate = values.immunizations.some(v => v.value === 'Exempt')
    const fullExempt = values.immunizations.every(v => v.value === 'Exempt')
    function toggleExempt() {
        setFieldValue('immunizations', values.immunizations.map((im) => {
            return {
                ...im,
                value: !fullExempt ? 'Exempt' : '',
            }
        }))
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>

                {showImmunizations ?
                    <Box sx={{ display: 'flex', width: '25rem' }}>
                        <Box>
                            <Typography fontSize='14px' color={SYSTEM_01} fontWeight='700'>
                                Exempt
                            </Typography>
                            <Checkbox
                                color='primary'
                                checked={fullExempt}
                                onChange={toggleExempt}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            paddingBottom: '5px',
                            borderBottom: '0.5px solid #A3A3A4',
                        }}>

                            <Box sx={{
                                paddingLeft: '54px'
                            }}>
                                <Typography sx={{ marginBottom: '5px' }} component='div' fontSize='14px' color={SYSTEM_01} fontWeight='700'>
                                    Exemption Date
                                </Typography>
                                <CustomDateInput
                                    initVal={values.exemptionDate}
                                    onChange={(v) => setFieldValue('exemptionDate', v)}
                                    disabled={!enableExamptiondate}
                                    showError={!isValidDate(values.exemptionDate) && values.showValidationErrors}
                                />
                            </Box>
                            <Box sx={{
                                width: '140px', marginLeft: '20px', textAlign: 'center',
                            }}>
                                <Typography component='div' fontSize='14px' color={SYSTEM_01} fontWeight='700'>
                                    Medical Exemption
                                </Typography>
                                <Checkbox color='primary'
                                    checked={values.medicalExempt}
                                    onChange={() => setFieldValue('medicalExempt', !values.medicalExempt)}
                                    disabled={!enableExamptiondate}
                                />
                            </Box>
                        </Box>
                    </Box> :
                    <Typography sx={{
                        width: '25rem',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 'large',
                    }}>
                        Vaccines
                    </Typography>
                }
                <Box sx={{ position: 'relative', top: '-25px', left: '-10px' }}
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
                    {values.immunizations.map((it) =>
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