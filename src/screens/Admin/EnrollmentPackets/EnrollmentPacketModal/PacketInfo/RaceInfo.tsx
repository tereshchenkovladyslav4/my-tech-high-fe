
import React from 'react'
import { Checkbox, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFormikContext } from 'formik'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { EnrollmentPacketFormType } from '../types'


const RacesTypes = {
    asian: 'Asian',
    american_indian_alaska: 'American Indian or Alaska Native',
    white: 'White',
    black_american: 'Black or African American',
    hawaiian: 'Native Hawaiian or Other Pacific Islander',
    undeclared: 'Undeclared',
}

export default function RaceInfo() {
    const { values: { race }, handleChange, setFieldValue } = useFormikContext<EnrollmentPacketFormType>()

    return (
        <Box sx={{ paddingTop: '15px', }}>
            <Subtitle size='small' fontWeight='700' >
                Race
            </Subtitle>
            <Grid container sx={{ paddingTop: '15px' }}>
                <Grid item xs={6}>
                    <Box display='flex' alignItems='center'>
                        <Checkbox
                            checked={race === RacesTypes.asian}
                            onClick={() => setFieldValue('race', RacesTypes.asian)}
                        />
                        <Subtitle size='small'>Asian</Subtitle>
                    </Box>

                    <Box display='flex' alignItems='center'>
                        <Checkbox
                            checked={race === RacesTypes.black_american}
                            onClick={() => setFieldValue('race', RacesTypes.black_american)}
                        />
                        <Subtitle size='small'>Black or African American</Subtitle>
                    </Box>

                    <Box display='flex' alignItems='center'>
                        <Checkbox
                            checked={race === RacesTypes.white}
                            onClick={() => setFieldValue('race', RacesTypes.white)}
                        />
                        <Subtitle size='small'>White</Subtitle>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box display='flex' alignItems='center'>
                        <Checkbox
                            checked={race === RacesTypes.american_indian_alaska}
                            onClick={() => setFieldValue('race', RacesTypes.american_indian_alaska)}
                        />
                        <Subtitle size='small'>American Indian or Alaska Native</Subtitle>
                    </Box>
                    <Box display='flex' alignItems='center'>
                        <Checkbox
                            checked={race === RacesTypes.hawaiian}
                            onClick={() => setFieldValue('race', RacesTypes.hawaiian)}
                        />
                        <Subtitle size='small'>Native Hawaiian or Other Pacific Islander </Subtitle>
                    </Box>
                    <Box display='flex' alignItems='center'>
                        <Checkbox
                            checked={race === RacesTypes.undeclared}
                            onClick={() => setFieldValue('race', RacesTypes.undeclared)}
                        />
                        <Subtitle size='small'>Undeclared</Subtitle>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box display='flex' alignItems='center'>
                        <Checkbox
                            checked={!Object.values(RacesTypes).includes(race)}
                            onClick={() => setFieldValue('race', '')}
                        />
                        <Subtitle size='small'>Other </Subtitle>
                        <TextField
                            sx={{ width: '300px', paddingLeft: 4 }}
                            placeholder='Other'
                            size='small'
                            variant='outlined'
                            fullWidth
                            disabled={Object.values(RacesTypes).includes(race)}
                            name='race'
                            value={Object.values(RacesTypes).includes(race) ? '' : race}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
            </Grid>

        </Box>
    )
}
