
import React from 'react'
import { Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFormikContext } from 'formik'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { EnrollmentPacketFormType } from '../types'


export default function VoluntaryIncomeInfo() {
    const { values, handleChange } = useFormikContext<EnrollmentPacketFormType>()

    return (
        <Box sx={{ paddingTop: '15px' }}>
            <Subtitle size='small' fontWeight='700'>
                Voluntary Income Information
            </Subtitle>
            <Grid container columnSpacing={4} rowSpacing={2} sx={{ paddingTop: '15px' }}>
                <Grid item md={6} xs={12} >
                    <Box display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Household Size
                        </Subtitle>
                        <TextField
                            placeholder='Household Size'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='household_size'
                            value={values.household_size || ''}
                            onChange={handleChange}

                        />
                    </Box>
                </Grid>
                <Grid item md={6} xs={12} >
                    <Box display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Household Gross Monthly Income
                        </Subtitle>
                        <TextField
                            placeholder='Household Gross Monthly Income'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='household_income'
                            value={values.household_income || ''}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>

    )
}
