import { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'
import moment from 'moment'
import { GRADES } from '@mth/constants'
import { useCurrentSchoolYearByRegionId } from '@mth/hooks'
import { CheckBoxListVM } from '@mth/screens/Admin/Calendar/components/CheckBoxList/CheckBoxList'
import { toOrdinalSuffix } from '@mth/utils'

type CurrentGradeAndProgramByRegionId = {
  loading: boolean
  error: ApolloError | undefined
  gradeList: CheckBoxListVM[]
  programYearList: CheckBoxListVM[]
}

export const useCurrentGradeAndProgramByRegionId = (
  regionId: number,
  grades: string[],
  setGrades: (value: string[]) => void,
): CurrentGradeAndProgramByRegionId => {
  const {
    loading: schoolYearLoading,
    data: schoolYearData,
    error: schoolYearError,
  } = useCurrentSchoolYearByRegionId(regionId)
  const [availableGrades, setAvailableGrades] = useState<CheckBoxListVM[]>([])
  const [programYearList, setProgramYearList] = useState<CheckBoxListVM[]>([])

  useEffect(() => {
    if (!schoolYearLoading && schoolYearData?.schoolyear_getcurrent) {
      const availGrades = schoolYearData?.schoolyear_getcurrent?.grades?.split(',').map((item: string) => {
        if (item == 'Kindergarten')
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
      if (grades.length == 0)
        setGrades([
          ...['all'],
          ...GRADES.map((item) => {
            if (availGrades.filter((grade: CheckBoxListVM) => grade.value == item.toString())) {
              return item.toString()
            } else {
              return ''
            }
          }).filter((item) => item),
        ])
      if (schoolYearData?.schoolyear_getcurrent?.midyear_application) {
        const schoolYear_date_begin = moment(
          schoolYearData?.schoolyear_getcurrent.date_begin?.substring(0, 10),
        ).toISOString()
        const schoolYear_date_end = moment(
          schoolYearData?.schoolyear_getcurrent.date_end?.substring(0, 10),
        ).toISOString()
        const schoolYear_midyear_application_open = moment(
          schoolYearData?.schoolyear_getcurrent.midyear_application_open?.substring(0, 10),
        ).toISOString()
        const schoolYear_midyear_application_close = moment(
          schoolYearData?.schoolyear_getcurrent.midyear_application_close?.substring(0, 10),
        ).toISOString()

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
      }
    }
  }, [schoolYearLoading, schoolYearData])

  return {
    loading: schoolYearLoading,
    error: schoolYearError,
    gradeList: availableGrades,
    programYearList: programYearList,
  }
}
