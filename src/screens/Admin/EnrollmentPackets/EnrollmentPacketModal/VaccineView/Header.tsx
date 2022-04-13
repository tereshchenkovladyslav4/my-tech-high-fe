import React, { useEffect, useState } from 'react'
import { SYSTEM_01 } from '../../../../../utils/constants'
import { Box, Checkbox, Typography } from '@mui/material'
import CustomDateInput from './CustomDateInput'
import { EnrollmentPacketFormType } from '../types'
import { isValidDate } from '../helpers'
import { Controller, useFormContext } from 'react-hook-form'

export default function VaccinesInfoHeader() {
    const { watch, setValue, control } = useFormContext<EnrollmentPacketFormType>()
    const [immunizations, enableExemptionDate] = watch(['immunizations', 'enableExemptionDate'])
    const [fullExempt, setFullExempt] = useState(false)

    useEffect(() => {
        let _enableExamptiondate = false
        let _fullExempt = true
        for (const im of immunizations) {
            if (im.value === 'Exempt') {
                _enableExamptiondate = true
            } else {
                _fullExempt = false
            }
        }
        setValue('enableExemptionDate', _enableExamptiondate)
        setFullExempt(_fullExempt)
    }, [immunizations])

    function toggleExempt() {
        setValue(
            'immunizations',
            immunizations.map((im) => ({
                ...im,
                value: !fullExempt ? 'Exempt' : '',
                siblings: immunizations.filter((i) => im.immunization.consecutives?.includes(+i.immunization_id))
            }))
        )
    }

    return (
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
                    <Controller
                        name="exemptionDate"
                        control={control}
                        render={({ field }) =>
                            <CustomDateInput
                                initVal={field.value}
                                onChange={(v) => field.onChange(v)}
                                disabled={!enableExemptionDate}
                                showError={enableExemptionDate && !isValidDate(field.value)}
                            />}
                    />
                </Box>
                <Box sx={{
                    width: '140px', marginLeft: '20px', textAlign: 'center',
                }}>
                    <Typography component='div' fontSize='14px' color={SYSTEM_01} fontWeight='700'>
                        Medical Exemption
                    </Typography>
                    <Controller
                        name="medicalExempt"
                        control={control}
                        render={({ field }) =>
                            <Checkbox color='primary'
                                checked={field.value}
                                onChange={() => field.onChange(!field.value)}
                                disabled={!enableExemptionDate}
                            />}
                    />
                </Box>
            </Box>
        </Box>
    )
}
