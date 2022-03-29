import React, { useState } from 'react'
import { Checkbox, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFormikContext } from 'formik'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { EnrollmentPacketFormType } from '../types'
import { schoolDistricts } from '../../../../../utils/constants'


export default function SchoolInfo() {
    const { values, setFieldValue, handleChange } = useFormikContext<EnrollmentPacketFormType>()

    const [isDisableSchoolPart, setIsDisableSchoolPart] = useState(values.last_school_type === 1 ? true : false)
    const handleHomeschooledCheck = (e: any) => {
        if (e.target.checked) {
            setFieldValue('last_school_type', 1)
            setIsDisableSchoolPart(true)
        } else {
            setFieldValue('last_school_type', 0)
            setIsDisableSchoolPart(false)
        }
    }

    return (
        <Box sx={{ paddingTop: '15px' }}>
            <Box display='flex' alignItems='center' >
                <Checkbox
                    checked={values.last_school_type === 1 ? true : false}
                    onChange={(e) => handleHomeschooledCheck(e)}
                />
                <Subtitle size='small'>None - Stundent has always been homeschooled</Subtitle>
            </Box>
            <Grid container columnSpacing={4} rowSpacing={2} sx={{ paddingTop: '15px' }}>
                <Grid item md={6} sm={6} xs={12}>
                    <Box >
                        <Subtitle size='small' fontWeight='500'>
                            Name of School
                        </Subtitle>
                        <TextField
                            placeholder='Name of School'
                            size='small'
                            variant='outlined'
                            fullWidth
                            disabled={isDisableSchoolPart}
                            name='last_school'
                            value={values.last_school}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ width: 200 }} >
                        <Subtitle size='small' fontWeight='500'>
                            School District of Residence
                        </Subtitle>
                        <Box >
                            {isDisableSchoolPart ? (
                                <FormControl fullWidth>
                                    <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        sx={{ borderRadius: 2 }}
                                        size='small'
                                        value={values.school_district}
                                        disabled
                                        placeholder={'Entry'}
                                        name='school_district'
                                        onChange={handleChange}
                                    >
                                        <MenuItem key={values.school_district} value={values.school_district}>
                                            {values.school_district}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            ) : (
                                <Box>
                                    <DropDown
                                        dropDownItems={schoolDistricts}
                                        placeholder='Entry'
                                        defaultValue={values.school_district}
                                        size='small'
                                        setParentValue={(v) => setFieldValue('school_district', v)}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={8} sm={8} xs={12}>
                    <Box >
                        <Subtitle size='small' fontWeight='500'>
                            Address of School
                        </Subtitle>
                        <TextField
                            placeholder='Address of School'
                            size='small'
                            variant='outlined'
                            fullWidth
                            name='last_school_address'
                            value={values.last_school_address}
                            disabled={isDisableSchoolPart}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>

    )
}
