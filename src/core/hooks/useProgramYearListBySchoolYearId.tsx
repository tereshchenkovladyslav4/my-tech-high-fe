import { useContext, useEffect, useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import moment from 'moment'
import { CheckBoxListVM } from '@mth/components/MthCheckBoxList/MthCheckboxList'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/SiteManagement/services'
import { toOrdinalSuffix } from '../../utils/stringHelpers'
import { sortGrades } from '../utils'

type SchoolYearType = {
  school_year_id: number
  date_begin: string
  date_end: string
  label?: string
  midyear_application: boolean
  midyear_application_open: string
  midyear_application_close: string
  grades: string
  special_ed: boolean
  special_ed_options: string
}

export const useProgramYearListBySchoolYearId = (
  school_year_id: number,
): {
  loading: boolean
  programYearList: CheckBoxListVM[]
  gradeList: CheckBoxListVM[]
  specialEdList: CheckBoxListVM[]
  error: ApolloError | undefined
} => {
  const { me } = useContext(UserContext)
  const [programYearList, setProgramYearList] = useState<CheckBoxListVM[]>([])
  const [availableGrades, setAvailableGrades] = useState<CheckBoxListVM[]>([])
  const [specialEdOptions, setSpecialEdOptions] = useState<CheckBoxListVM[]>([])

  const { loading, data, error } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: !me?.selectedRegionId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.region?.SchoolYears) {
      const { SchoolYears } = data?.region
      SchoolYears?.map((schoolYear: SchoolYearType) => {
        if (schoolYear?.school_year_id == Number(school_year_id)) {
          if (schoolYear?.grades) {
            const sortedGrades = sortGrades(schoolYear?.grades)
            const availGrades = sortedGrades?.split(',').map((item: string) => {
              if (item.includes('K'))
                return {
                  label: 'Kindergarten',
                  value: 'Kindergarten',
                }
              else
                return {
                  label: `${toOrdinalSuffix(Number(item))} Grade`,
                  value: item.toString(),
                }
            })
            setAvailableGrades(availGrades)
          } else {
            setAvailableGrades([])
          }
          if (schoolYear?.special_ed) {
            const specialEds = schoolYear?.special_ed_options?.split(',').map((item: string, index) => {
              return {
                label: item,
                value: `${index}`,
              }
            })
            setSpecialEdOptions(specialEds || [])
          }

          const schoolYear_date_begin = moment(schoolYear?.date_begin?.substring(0, 10)).toISOString()
          const schoolYear_date_end = moment(schoolYear?.date_end?.substring(0, 10)).toISOString()
          const schoolYear_midyear_application_open = moment(
            schoolYear?.midyear_application_open?.substring(0, 10),
          ).toISOString()
          const schoolYear_midyear_application_close = moment(
            schoolYear?.midyear_application_close?.substring(0, 10),
          ).toISOString()
          if (schoolYear?.midyear_application) {
            setProgramYearList([
              {
                label: `${moment(schoolYear_date_begin).format('YYYY')} - ${moment(schoolYear_date_end).format('YY')}`,
                value: 'schoolYear',
              },
              {
                label: `${moment(schoolYear_midyear_application_open).format('YYYY')} - ${moment(
                  schoolYear_midyear_application_close,
                ).format('YY')} Mid-year`,
                value: 'midYear',
              },
            ])
          } else {
            setProgramYearList([])
          }
        }
      })
    }
  }, [loading, data, school_year_id])

  return {
    loading: loading,
    programYearList: programYearList,
    gradeList: availableGrades,
    specialEdList: specialEdOptions,
    error: error,
  }
}
