
import React from 'react'
import { Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { Controller, useFormContext } from 'react-hook-form'


export default function VoluntaryIncomeInfo() {
    const { control } = useFormContext()
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
                        <Controller
                            name="household_size"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='Household Size'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                />}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} xs={12} >
                    <Box display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Household Gross Monthly Income
                        </Subtitle>
                        <Controller
                            name="household_income"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='Household Gross Monthly Income'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                />}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>

    )
}
