import React from 'react'
import { SYSTEM_01 } from '../../../../../utils/constants'
import { Checkbox, Box, Typography, Tooltip } from '@mui/material'
import CustomDateInput from './CustomDateInput'
import { StudentImmunization } from './types'
import { useFormikContext } from 'formik'
import { EnrollmentPacketFormType } from '../types'
import { checkImmmValueWithSpacing, isValidDate, isValidVaccInput } from '../helpers'
import { ErrorOutlineOutlined } from '@mui/icons-material'


export function ImmunizationItem({ item }: {
    item: StudentImmunization
}) {
    const { values, setFieldValue } = useFormikContext<EnrollmentPacketFormType>()
    const showError = values.showValidationErrors
    const siblings = values.immunizations.filter((i) => item.immunization.consecutives?.includes(+i.immunization_id))
    let exempt = item.value === 'Exempt' && siblings.every((v) => v.value === 'Exempt')


    const validValue = !item.immunization.is_deleted && isValidVaccInput(
        item.value,
        item.immunization?.immunity_allowed === 1
    )
    const validDateSpace = checkImmmValueWithSpacing(item, values.immunizations)

    function onExemptCheck(exempt: boolean) {
        setFieldValue('immunizations',
            values.immunizations.map((im) => {
                if (im.immunization_id === item.immunization_id ||
                    item.immunization?.consecutives?.includes(+im.immunization_id)
                ) {
                    return {
                        ...im,
                        value: exempt ? 'Exempt' : ''
                    }
                }
                return im

            })
        )
    }

    function changeImmunValue(value: string) {
        const isTopVac = item.immunization?.consecutive_vaccine === 0
        if (value === 'Exempt' && isTopVac) onExemptCheck(true)
        setFieldValue('immunizations',
            values.immunizations.map((im) => {
                if (im.immunization_id === item.immunization_id) {
                    return {
                        ...im,
                        value,
                    }
                }
                return im
            })
        )
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    background: validValue ? 'unset' : 'rgba(255, 214, 38, 0.3)',
                    border: showError && !validValue ? '2px solid red' : 'unset',
                    opacity: item.immunization.is_deleted ? .4 : 1,
                }}
            >
                {item.immunization.consecutive_vaccine === 0 ?
                    <Checkbox
                        color='primary'
                        checked={exempt}
                        sx={{
                            paddingY: '10px',

                        }}
                        disabled={isValidDate(item.value) || item.immunization.is_deleted}
                        onChange={(e) => onExemptCheck(e.target.checked)}
                    />
                    :
                    <Box sx={{ width: '42px' }} />
                }
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottom: '0.5px solid #A3A3A4',
                        paddingY: '10px',
                        marginLeft: '5px',
                    }}
                >
                    <Tooltip title={item.immunization.tooltip}>
                        <Typography
                            sx={{ width: '60px', display: 'inline-block' }}
                            component='span'
                            fontSize='12px'
                            color={SYSTEM_01}
                            fontWeight='700'
                        >
                            {item.immunization.title}
                        </Typography>
                    </Tooltip>

                    <CustomDateInput
                        initVal={item.value || ""}
                        onChange={changeImmunValue}
                        showError={(!isValidDate && showError) || !validDateSpace}
                        allowIM={item.immunization.immunity_allowed === 1}
                        disabled={item.immunization.is_deleted}
                    />
                </Box>
                {!validDateSpace &&
                    <Tooltip title="Does not fall within vaccine timeframe, school may request a new vaccine recordd">
                        <ErrorOutlineOutlined color='error' />
                    </Tooltip>
                }
            </Box >
        </>
    )
}

export default ImmunizationItem

