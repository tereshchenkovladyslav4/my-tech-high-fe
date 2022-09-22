import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { CheckBoxListVM } from '@mth/components/MthCheckBoxList/MthCheckboxList'
import { getEnrollmentQuestionsGql } from '@mth/graphql/queries/enrollment-question'

export const useEnrollmentPacketDocumentListByRegionId = (
  regionId: number,
): {
  loading: boolean
  data: CheckBoxListVM[]
  error: ApolloError | undefined
} => {
  const [enrollmentPacketDocumentList, setEnrollmentPacketDocumentList] = useState<CheckBoxListVM[]>([])
  const { data, loading, error } = useQuery(getEnrollmentQuestionsGql, {
    variables: {
      input: { region_id: regionId },
    },
    skip: regionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.getEnrollmentQuestions) {
      const documents = data?.getEnrollmentQuestions
        ?.filter((item: { tab_name: string }) => item.tab_name === 'Documents')
        ?.at(0)
      if (documents?.is_active) {
        setEnrollmentPacketDocumentList(
          documents?.groups
            ?.at(0)
            ?.questions?.filter((item: { required: boolean }) => item.required)
            ?.map((question: { required: boolean; question: string }) => {
              return {
                label: question.question,
                value: question.question,
              }
            }),
        )
      } else {
        setEnrollmentPacketDocumentList([])
      }
    } else {
      setEnrollmentPacketDocumentList([])
    }
  }, [loading, data])

  return {
    loading: loading,
    data: enrollmentPacketDocumentList,
    error: error,
  }
}
