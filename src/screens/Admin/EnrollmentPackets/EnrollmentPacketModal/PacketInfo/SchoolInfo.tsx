import React, { useState } from 'react'
import { Checkbox, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { EnrollmentPacketFormType } from '../types'
import { schoolDistricts } from '../../../../../utils/constants'
import { Controller, useFormContext } from 'react-hook-form'


export default function SchoolInfo() {
    const { watch, control } = useFormContext<EnrollmentPacketFormType>()

    // @ts-ignore
    const [last_school_type] = watch(['last_school_type'])

    const [isDisableSchoolPart, setIsDisableSchoolPart] = useState(last_school_type === 1 ? true : false)

    return (
        <Box sx={{ paddingTop: '15px' }}>
            <Box display='flex' alignItems='center' paddingLeft={0} >
                <Controller
                    name="last_school_type"
                    control={control}
                    render={({ field }) =>
                        <Checkbox
                            sx={{ paddingLeft: 0 }}
                            checked={field.value === 1 ? true : false}
                            onChange={(e) => {
                                field.onChange(e.target.checked ? 1 : 0)
                                setIsDisableSchoolPart(e.target.checked)
                            }}
                        />}
                />
                <Subtitle sx={{ fontSize: '12px' }}>None - Student has always been homeschooled</Subtitle>
            </Box>
            <Grid container columnSpacing={4} rowSpacing={2} sx={{ paddingTop: '15px' }}>
                <Grid item md={6} sm={6} xs={12}>
                    <Box >
                        <Subtitle size='small' fontWeight='500'>
                            Name of School
                        </Subtitle>
                        <Controller
                            name="last_school"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='Name of School'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                    disabled={isDisableSchoolPart}
                                />}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box sx={{ width: 200 }} >
                        <Subtitle size='small' fontWeight='500'>
                            School District of Residence
                        </Subtitle>
                        <Controller
                            name="school_district"
                            control={control}
                            render={({ field }) =>
                                <Box >
                                    {/* {isDisableSchoolPart ? (
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
                            ) : ( */}
                                    <Box>
                                        <DropDown
                                            dropDownItems={schoolDistricts}
                                            placeholder='Entry'
                                            defaultValue={field.value}
                                            size='small'
                                            setParentValue={(v) => field.onChange(v as string)}
                                        />
                                    </Box>
                                </Box>
                            }
                        />
                    </Box>
                </Grid>
                <Grid item md={8} sm={8} xs={12}>
                    <Box >
                        <Subtitle size='small' fontWeight='500'>
                            Address of School
                        </Subtitle>
                        <Controller
                            name="last_school_address"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    placeholder='Address of School'
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                    disabled={isDisableSchoolPart}
                                />}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>

    )
}
