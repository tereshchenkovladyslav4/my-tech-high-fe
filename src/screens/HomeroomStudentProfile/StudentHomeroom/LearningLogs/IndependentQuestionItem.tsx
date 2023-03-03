import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box } from '@mui/material'
import { FormError } from '@mth/components/FormError'
import { CheckBoxListVM, MthCheckboxList } from '@mth/components/MthCheckboxList'
import { ChecklistEnum, RoleLevel } from '@mth/enums'
import { CheckListVM, LearningLogQuestion } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getChecklistQuery } from '@mth/screens/Admin/HomeRoom/services'
import { extractContent } from '@mth/utils/string.util'

type IndependentQuestionItemProps = {
  question: LearningLogQuestion
  schoolYearId: number
  showError?: boolean
  handleChangeValue?: (question: LearningLogQuestion) => void
}

export const IndependentQuestionItem: React.FC<IndependentQuestionItemProps> = ({
  question,
  schoolYearId,
  showError,
  handleChangeValue,
}) => {
  const { me } = useContext(UserContext)
  const roleLevel = me?.role?.level
  const { data: checkListData, loading: checkListLoading } = useQuery(getChecklistQuery, {
    variables: {
      take: -1,
      regionId: roleLevel === RoleLevel.SUPER_ADMIN ? me?.selectedRegionId : me?.userRegion?.at(0)?.region_id,
      filter: {
        status: ChecklistEnum.INDEPENDENT,
        selectedYearId: schoolYearId,
      },
    },
    skip:
      !schoolYearId ||
      (roleLevel === RoleLevel.SUPER_ADMIN && !me?.selectedRegionId) ||
      (roleLevel !== RoleLevel.SUPER_ADMIN && !me?.userRegion?.at(0)?.region_id),
    fetchPolicy: 'network-only',
  })
  const [subjectCheckList, setSubjectCheckList] = useState<CheckListVM[]>([])
  const goalList = useMemo(() => {
    return subjectCheckList.map((item) => ({ value: item.id + '', label: item.goal })) as CheckBoxListVM[]
  }, [subjectCheckList, question])

  useEffect(() => {
    if (!checkListLoading && checkListData?.checklist) {
      const { checklist } = checkListData
      setSubjectCheckList(checklist.results)
    }
  }, [checkListLoading, checkListData])

  return (
    <Box sx={{ mt: 2 }} data-testid='independent-question'>
      <MthCheckboxList
        title={`${extractContent(question.question)} ${question?.required ? '*' : ''}`}
        setValues={(values) => {
          if (handleChangeValue)
            handleChangeValue({
              ...(question as LearningLogQuestion),
              answer: JSON.stringify(values),
            })
        }}
        checkboxLists={goalList}
        haveSelectAll={false}
        values={question?.answer ? JSON.parse(question.answer as string) : []}
      />
      {showError && question?.required && question?.answer == undefined && <FormError error={'Required'} />}
    </Box>
  )
}
