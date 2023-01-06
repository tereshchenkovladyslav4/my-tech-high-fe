import React from 'react'
import { Box, Grid } from '@mui/material'

import { Subtitle } from '../../components/Typography/Subtitle/Subtitle'
import { EnrollmentQuestionItem } from './Question'
import { GroupTemplateType } from './types'

export const GroupItem: GroupTemplateType = ({ group, formik }) => {
  const questionsArr = group?.questions?.map((q) => {
    let current = q,
      child
    const arr = [q]
    while ((child = group?.questions?.find((x) => x.additional_question == current.slug))) {
      arr.push(child)
      current = child
    }
    return arr
  })
  const questionsLists = questionsArr?.filter((item) => !item[0].additional_question)
  return (
    <>
      <Box display='flex' mt='20px' alignItems='center' justifyContent='start'>
        <Subtitle fontWeight='700'>{group.group_name}</Subtitle>
      </Box>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {questionsLists?.map((item, index) => (
          <EnrollmentQuestionItem key={index} item={item} group={group.group_name} formik={formik} />
        ))}
      </Grid>
    </>
  )
}
