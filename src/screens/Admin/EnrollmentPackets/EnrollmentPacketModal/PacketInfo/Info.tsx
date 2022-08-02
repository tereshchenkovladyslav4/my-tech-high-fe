import React, { ReactElement, useContext } from 'react'
import { Grid } from '@mui/material'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_01 } from '../../../../../utils/constants'
import { PacketModalQuestionsContext } from '../providers'
import { PacketQuestionItem } from './PacketQuestionItem'

export const Info: () => ReactElement | ReactElement[][] = () => {
  const questions = useContext(PacketModalQuestionsContext)

  return questions?.length > 0 ? (
    questions?.map((tab) => {
      return tab?.groups
        ?.filter((group) => group.questions.filter((q) => q.display_admin).length > 0)
        .map((group) => {
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
            <>
              <Subtitle color={SYSTEM_01} size='small' fontWeight='700' sx={{ marginTop: 2 }}>
                {group?.group_name !== 'root' && group?.group_name}
              </Subtitle>
              <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {questionsLists?.map(
                  (item, index) => item[0].display_admin && <PacketQuestionItem key={index} item={item} />,
                )}
              </Grid>
            </>
          )
        })
    })
  ) : (
    <></>
  )
}
