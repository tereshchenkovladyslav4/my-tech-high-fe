import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { diplomaAnswerGql } from '@mth/graphql/queries/diploma'

export const useDiplomaSeekingOptionsByStudentIdAndSchoolYearId = (
  schoolYearId: number,
  studentId: number,
  skip: boolean,
): {
  diplomaAnswer: number | null | undefined
  diplomaOptions: RadioGroupOption[]
  diplomaAnswerRefetch: () => void
} => {
  const [diplomaAnswer, setDiplomaAnswer] = useState<number | null | undefined>()
  const [diplomaOptions, setDiplomaOptions] = useState<RadioGroupOption[]>([
    {
      option_id: 1,
      label: 'Yes',
      value: false,
    },
    {
      option_id: 2,
      label: 'No',
      value: false,
    },
  ])

  const {
    loading: diplomaAnswerLoading,
    data: diplomaAnswerData,
    refetch,
  } = useQuery(diplomaAnswerGql, {
    variables: {
      diplomaAnswerInput: {
        schoolYearId: schoolYearId,
        studentId: studentId,
      },
    },
    skip: skip,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!diplomaAnswerLoading) {
      setDiplomaAnswer(diplomaAnswerData?.getDiplomaAnswer?.answer)
      if (diplomaAnswerData && diplomaAnswerData.getDiplomaAnswer) {
        setDiplomaOptions([
          {
            option_id: 1,
            label: 'Yes',
            value: 1 === diplomaAnswerData.getDiplomaAnswer.answer,
          },
          {
            option_id: 2,
            label: 'No',
            value: 0 === diplomaAnswerData.getDiplomaAnswer.answer,
          },
        ])
      } else {
        setDiplomaOptions([
          {
            option_id: 1,
            label: 'Yes',
            value: false,
          },
          {
            option_id: 2,
            label: 'No',
            value: false,
          },
        ])
      }
    }
  }, [diplomaAnswerLoading, diplomaAnswerData])

  return {
    diplomaAnswer,
    diplomaOptions,
    diplomaAnswerRefetch: refetch,
  }
}
