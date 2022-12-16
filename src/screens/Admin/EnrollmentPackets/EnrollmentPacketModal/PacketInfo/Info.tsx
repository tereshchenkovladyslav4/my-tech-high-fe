import React, { useContext } from 'react'
import { Box, Grid } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { PacketModalQuestionsContext } from '../providers'
import { PacketQuestionItem } from './PacketQuestionItem'

export const Info: () => React.ReactElement | React.ReactElement[][] = () => {
  const questions = useContext(PacketModalQuestionsContext)

  return questions?.length > 0 ? (
    questions?.map((tab, tab_index) => {
      return tab?.groups
        ?.filter((group) => group.questions.filter((q) => q.display_admin).length > 0)
        .map((group, group_index) => {
          const questionsArr = group.questions.map((q) => {
            const arr = [q]
            let current = q,
              child
            while ((child = group.questions.find((x) => x.additional_question == current.slug))) {
              arr.push(child)
              current = child
            }
            return arr
          })
          const questionsLists = questionsArr.filter((item) => !item[0].additional_question)
          return (
            <Box key={`${tab_index}_${group_index}`}>
              <Subtitle color={MthColor.SYSTEM_01} size='small' fontWeight='700' sx={{ marginTop: 2 }}>
                {group?.group_name !== 'root' && group?.group_name}
              </Subtitle>
              <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {questionsLists?.map(
                  (item, index) => item[0].display_admin && <PacketQuestionItem key={index} item={item} />,
                )}
              </Grid>
            </Box>
          )
        })
    })
  ) : (
    <></>
  )
}
