import { Box, Grid, IconButton, outlinedInputClasses, Radio, TextField, List } from '@mui/material'

import React, { useContext, useState } from 'react'
import { EnrollmentQuestionGroup } from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import EnrollmentQuestionItem from './Question'
import { Subtitle } from '../../components/Typography/Subtitle/Subtitle'


export default function GroupItem({
  group,
  formik,
}: {
    group: EnrollmentQuestionGroup
    formik: any
}) {

  return (
    <>
        <Box display='flex' mt='20px' alignItems='center' justifyContent='start'>
            <Subtitle fontWeight='700'>{group.group_name}</Subtitle>        
        </Box>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {group.questions.map((item, index) => (
                <EnrollmentQuestionItem key={index} item={item} group={group.group_name} formik={formik}/>
            ))}
        </Grid>
    </>
  )
}
