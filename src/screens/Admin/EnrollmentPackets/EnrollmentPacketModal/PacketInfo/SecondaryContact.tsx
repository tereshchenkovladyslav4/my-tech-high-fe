
import React from 'react'
import { Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFormikContext } from 'formik'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { EnrollmentPacketFormType } from '../types'
import { countries, hispanicOptions, SYSTEM_01 } from '../../../../../utils/constants'

export default function SecondaryContact() {
    const { values, setFieldValue, handleChange } = useFormikContext<EnrollmentPacketFormType>()
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
                        <TextField
                            placeholder='First Name'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='secondary_contact_first'
                            value={values.secondary_contact_first}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Last Name
                        </Subtitle>
                        <TextField
                            placeholder='Last Name'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='secondary_contact_last'
                            value={values.secondary_contact_last}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Secondary Phone
                        </Subtitle>
                        <TextField
                            placeholder='Secondary Phone'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='secondary_phone'
                            value={values.secondary_phone}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Secondary Email
                        </Subtitle>
                        <TextField
                            placeholder='Secondary Email'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='secondary_email'

                            value={values.secondary_email}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Date of Birth
                        </Subtitle>
                        <TextField
                            type='date'
                            placeholder='Date of Birth'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='date_of_birth'
                            value={values.date_of_birth}
                            onChange={handleChange}
                        />
                    </Box>

                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Birthplace
                        </Subtitle>
                        <TextField
                            placeholder='Birthplace'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='birth_place'
                            value={values.birth_place}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }}>
                        <Subtitle size='small' fontWeight='500'>
                            Country
                        </Subtitle>
                        <DropDown
                            dropDownItems={countries}
                            placeholder='Entry'
                            defaultValue={values.birth_country}
                            size='small'
                            setParentValue={(v) => setFieldValue('birth_country', v)}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column'>
                        <Subtitle size='small' fontWeight='500'>
                            Hispanic / Latino
                        </Subtitle>
                        <DropDown
                            dropDownItems={hispanicOptions}
                            defaultValue={values.hispanic}
                            placeholder='Entry'
                            size='small'
                            setParentValue={(v) => setFieldValue('hispanic', v)}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>

    )
}
