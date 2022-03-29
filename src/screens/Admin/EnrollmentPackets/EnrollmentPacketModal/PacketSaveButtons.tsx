import { Button, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import React from 'react'
import {
    BLACK_GRADIENT,
    BUTTON_LINEAR_GRADIENT,
    GREEN_GRADIENT,
    RED_GRADIENT,
    YELLOW_GRADIENT,
} from '../../../../utils/constants'
import { isValidDate, isValidVaccInput } from './helpers'
import { EnrollmentPacketFormType, SaveButtonsType } from './types'

export default function PacketSaveButtons() {
    const { values: vals, setFieldValue, submitForm } = useFormikContext<EnrollmentPacketFormType>()
    const onlySaveButton = !['Submitted', 'Resubmitted'].includes(vals.status)

    function onClick(action: SaveButtonsType) {
        if (action === 'Missing Info') {
            setFieldValue('showMissingInfoModal', true)
        } else if (action === 'Age Issue') {
            setFieldValue('showAgeIssueModal', true)
        } else {
            let isValid = true
            for (const e of vals.immunizations) {
                if (e.immunization.is_deleted) continue
                if (!isValidVaccInput(e.value, e.immunization.immunity_allowed === 1)) {
                    isValid = false
                    break
                }
                if (e.value === 'Exempt' && !isValidDate(vals.exemptionDate)) {
                    isValid = false
                    break
                }
            }
            if (['Accepted', 'Conditional'].includes(action)) {
                setFieldValue('preSaveStatus', action)
                if (isValid) {
                    submitForm()
                    action === 'Accepted' && setFieldValue('saveAlert', 'The packet has been accepted')
                    setFieldValue('status', action)
                }
                else setFieldValue('showSaveWarnModal', true)

            }
            else {
                if (isValid) submitForm()
                else setFieldValue('showSaveWarnModal', true)
            }

        }
    }



    return (
        <>
            <Grid
                sx={{
                    '&.MuiGrid-root': {
                        width: '100%',
                        minWidth: '600px',
                    },
                }}
                container
            >
                <Grid container >
                    <Grid item md={2} sm={2} xs={12}>
                        <Button
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 25,
                                background: BUTTON_LINEAR_GRADIENT,
                                color: 'white',
                                width: '92px',
                            }}
                            onClick={() => onClick('Save')}
                        >
                            Save
                        </Button>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                        <Button
                            disabled={onlySaveButton}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 25,
                                background: GREEN_GRADIENT,
                                color: 'white',
                                width: '92px',
                            }}
                            onClick={() => onClick('Accepted')}

                        >
                            Accept
                        </Button>
                    </Grid>

                    <Grid item md={2} sm={2} xs={12}>
                        <Button
                            disabled={onlySaveButton}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 25,
                                background: RED_GRADIENT,
                                color: 'white',
                                width: '92px',
                            }}
                            onClick={() => onClick('Missing Info')}

                        >
                            Missing Info
                        </Button>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                        <Button
                            disabled={onlySaveButton}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 25,
                                background: YELLOW_GRADIENT,
                                color: 'white',
                                width: '92px',
                            }}
                            onClick={() => onClick('Age Issue')}
                        >
                            Age Issue
                        </Button>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                        <Button
                            disabled={onlySaveButton}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 25,
                                background: BLACK_GRADIENT,
                                color: 'white',
                                width: '92px',
                            }}
                            onClick={() => onClick('Conditional')}
                        >
                            Conditional
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

        </>
    )
}
