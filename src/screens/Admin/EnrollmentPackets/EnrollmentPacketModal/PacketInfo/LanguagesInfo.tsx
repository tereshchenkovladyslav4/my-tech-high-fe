import React from 'react'
import { Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { EnrollmentPacketFormType } from '../types'
import { languages } from '../../../../../utils/languages'


export default function LanguagesInfo() {
    const { values, setFieldValue } = useFormikContext<EnrollmentPacketFormType>()

    return (
        <Grid container columnSpacing={2} sx={{ paddingTop: '20px' }}>
            <Grid item xs={9}>
                <Subtitle fontWeight='500'>First Language learned by child</Subtitle>
                <DropDown
                    dropDownItems={languages}
                    placeholder='Entry'
                    defaultValue={values.language}
                    setParentValue={(v) => setFieldValue('language', v)}
                    size='small'
                />
            </Grid>
            <Grid item xs={9}>
                <Subtitle fontWeight='500'>Language used most often by child in home</Subtitle>
                <DropDown
                    dropDownItems={languages}
                    placeholder='Entry'
                    defaultValue={values.language_home_child}
                    setParentValue={(v) => setFieldValue('language_home_child', v)}
                    size='small'
                />
            </Grid>
            <Grid item xs={9}>
                <Subtitle fontWeight='500'>Preferred correspondence language for adults in the home</Subtitle>
                <DropDown
                    dropDownItems={languages}
                    placeholder='Entry'
                    defaultValue={values.language_home_preferred}
                    setParentValue={(v) => setFieldValue('language_home_preferred', v)}
                    size='small'
                />
            </Grid>
            <Grid item xs={9}>
                <Subtitle fontWeight='500'>Language used most often by adults in the home</Subtitle>
                <DropDown
                    dropDownItems={languages}
                    placeholder='Entry'
                    defaultValue={values.language_home}
                    setParentValue={(v) => setFieldValue('language_home', v)}
                    size='small'
                />
            </Grid>
            <Grid item xs={9}>
                <Subtitle fontWeight='500'>Language used most often by child with friends outside </Subtitle>
                <DropDown
                    dropDownItems={languages}
                    placeholder='Entry'
                    defaultValue={values.language_friends}
                    setParentValue={(v) => setFieldValue('language_friends', v)}
                    size='small'
                />
            </Grid>

        </Grid>
    )
}
