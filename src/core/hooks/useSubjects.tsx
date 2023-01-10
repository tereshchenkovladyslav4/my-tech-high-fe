import { useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { DropDownItem } from '@mth/components/DropDown/types'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { getSubjectsQuery } from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { Subject } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'

export const useSubjects = (
  schoolYearId: number,
  searchField = '',
  isActive = true,
  hasAllItem = false,
): {
  loading: boolean
  subjects: Subject[]
  dropdownItems: DropDownItem[]
  checkBoxItems: CheckBoxListVM[]
  error: ApolloError | undefined
  refetch: () => void
} => {
  const [dropdownItems, setDropdownItems] = useState<DropDownItem[]>([])
  const [checkBoxItems, setCheckBoxItems] = useState<CheckBoxListVM[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  const { loading, data, error, refetch } = useQuery(getSubjectsQuery, {
    variables: {
      findSubjectsInput: { schoolYearId, searchField, isActive },
    },
    skip: !schoolYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.subjects) {
      const { subjects } = data
      const subjectItems = subjects.map((item: Subject) => ({
        value: item.subject_id,
        label: item.name,
      }))
      setDropdownItems(hasAllItem ? [{ label: 'All', value: -1 }, ...subjectItems] : subjectItems)
      setCheckBoxItems(
        subjects.map((item: Subject) => ({
          value: item.subject_id.toString(),
          label: item.name,
        })),
      )
      setSubjects(subjects)
    }
  }, [loading, data])

  return {
    loading,
    subjects,
    dropdownItems,
    checkBoxItems,
    error: error,
    refetch,
  }
}
