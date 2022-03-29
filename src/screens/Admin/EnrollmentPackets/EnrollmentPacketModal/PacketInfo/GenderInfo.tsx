import React from 'react'
import { Grid, Radio } from '@mui/material'
import { Box } from '@mui/system'
import { useFormikContext } from 'formik'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { EnrollmentPacketFormType } from '../types'


export default function GenderInfo() {
    const { values: { gender }, setFieldValue } = useFormikContext<EnrollmentPacketFormType>()
    return (
        <Box sx={{ paddingTop: '15px' }}>
            <Subtitle size='small' fontWeight='700'>
                Gender
            </Subtitle>
            <Grid container sx={{ paddingTop: '15px' }}>
                <Grid item xs={6}>
                    <Box sx={{ minWidth: '96px' }} display='flex' alignItems='center'>
                        <Radio
                            checked={gender === 'Male' ? true : false}
                            onChange={(v) => v && setFieldValue('gender', 'Male')}
                        />
                        <Subtitle size='small'>Male</Subtitle>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box display='flex' alignItems='center'>
                        <Radio
                            checked={gender === 'Non Binary' ? true : false}
                            onChange={(v) => v && setFieldValue('gender', 'Non Binary')}

                        />
                        <Subtitle size='small'>Non Binary</Subtitle>
                    </Box>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={6}>
                    <Box display='flex' alignItems='center'>
                        <Radio
                            checked={gender === 'Female' ? true : false}
                            onChange={(v) => v && setFieldValue('gender', 'Female')}
                        />
                        <Subtitle size='small'>Female</Subtitle>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box display='flex' alignItems='center'>
                        <Radio
                            checked={gender === 'Undeclared' ? true : false}
                            onChange={(v) => v && setFieldValue('gender', 'Undeclared')}

                        />
                        <Subtitle size='small'>Undeclared </Subtitle>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
