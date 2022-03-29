
import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { directoryPermissionptions, militaryOptions, otherPermissionptions, picturePermissionptions, workInAgricultureOptions } from '../../../../../utils/constants'
import { useFormikContext } from 'formik'
import { EnrollmentPacketFormType } from '../types'


export default function OtherInfo() {
    const { values, setFieldValue } = useFormikContext<EnrollmentPacketFormType>()

    return (
        <Box sx={{ paddingTop: '15px' }}>
            <Subtitle size='small' fontWeight='700'>
                Other
            </Subtitle>
            <Grid container columnSpacing={2} sx={{ paddingTop: '20px' }}>

                <Grid item sm={6} xs={12}>
                    <Box display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Has the parent or spouse worked in Agriculture?
                        </Subtitle>
                        <DropDown
                            dropDownItems={workInAgricultureOptions}
                            placeholder='Entry'
                            defaultValue={values.worked_in_agriculture}
                            size='small'
                            setParentValue={(v) => setFieldValue('worked_in_agriculture', v)}
                        />
                    </Box>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Box display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Is a parent or legal guardian on active duty in the military
                        </Subtitle>
                        <DropDown
                            dropDownItems={militaryOptions}
                            placeholder='Entry'
                            defaultValue={values.military}
                            size='small'
                            setParentValue={(v) => setFieldValue('military', v)}
                        />
                    </Box>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            FERPA Agreement Options
                        </Subtitle>
                        <DropDown
                            dropDownItems={otherPermissionptions}
                            placeholder='Entry'
                            defaultValue={values.ferpa_agreement}
                            size='small'
                            setParentValue={(v) => setFieldValue('ferpa_agreement', v)}
                        />
                    </Box>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Student Photo Permissions
                        </Subtitle>
                        <DropDown
                            dropDownItems={picturePermissionptions}
                            placeholder='Entry'
                            defaultValue={values.photo_permission}
                            size='small'
                            setParentValue={(v) => setFieldValue('photo_permission', v)}

                        />
                    </Box>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            School Student Directory Premissions
                        </Subtitle>
                        <DropDown
                            dropDownItems={directoryPermissionptions}
                            placeholder='Entry'
                            defaultValue={values.dir_permission}
                            size='small'
                            setParentValue={(v) => setFieldValue('dir_permission', v)}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
