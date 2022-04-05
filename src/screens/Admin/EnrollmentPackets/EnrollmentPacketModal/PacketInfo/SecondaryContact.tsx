
import React from 'react'
import { Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { countries, hispanicOptions, SYSTEM_01 } from '../../../../../utils/constants'
import { Controller, useFormContext } from 'react-hook-form'

export default function SecondaryContact() {
    const { control } = useFormContext()

    return (
        <Box sx={{ paddingTop: '15px' }}>
            <Subtitle color={SYSTEM_01} size='small' fontWeight='700'>
                Secondary Contact
            </Subtitle>
            <Grid container columnSpacing={4} rowSpacing={2} sx={{ paddingTop: '15px' }}>
                <Grid item md={6} sm={6} xs={12}>
                    <Box display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            First Name
                        </Subtitle>
                        <Controller
                            name="secondary_contact_first"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='First Name'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                />}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Last Name
                        </Subtitle>
                        <Controller
                            name="secondary_contact_last"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='Last Name'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                />}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Secondary Phone
                        </Subtitle>
                        <Controller
                            name="secondary_phone"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='Secondary Phone'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                />}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Secondary Email
                        </Subtitle>
                        <Controller
                            name="secondary_email"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='Secondary Email'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                />}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Date of Birth
                        </Subtitle>
                        <Controller
                            name="date_of_birth"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    type='date'
                                    placeholder='Date of Birth'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                />}
                        />
                    </Box>

                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Birthplace
                        </Subtitle>
                        <Controller
                            name="birth_place"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='Birthplace'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                />}
                        />
                    </Box>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }}>
                        <Subtitle size='small' fontWeight='500'>
                            Country
                        </Subtitle>
                        <Controller
                            name="birth_country"
                            control={control}
                            render={({ field }) =>
                                <DropDown
                                    dropDownItems={countries}
                                    placeholder='Entry'
                                    defaultValue={field.value}
                                    size='small'
                                    setParentValue={(v) => field.onChange(v as string)}
                                />}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Hispanic / Latino
                        </Subtitle>
                        <Controller
                            name="hispanic"
                            control={control}
                            render={({ field }) =>
                                <DropDown
                                    dropDownItems={hispanicOptions}
                                    defaultValue={field.value}
                                    placeholder='Entry'
                                    size='small'
                                    setParentValue={(v) => field.onChange(v as number)}
                                />}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>

    )
}
