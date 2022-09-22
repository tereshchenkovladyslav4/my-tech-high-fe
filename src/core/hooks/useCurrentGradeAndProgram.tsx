import { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'
import { filter, map } from 'lodash'
import moment from 'moment'
import { CheckBoxListVM } from '@mth/components/MthCheckBoxList/MthCheckboxList'
import { useCurrentSchoolYearByRegionId } from '@mth/hooks'
import { toOrdinalSuffix } from '@mth/utils'

type CurrentGradeAndProgramByRegionId = {
  loading: boolean
  error: ApolloError | undefined
  gradeList: CheckBoxListVM[]
  programYearList: CheckBoxListVM[]
  schoolPartnerList: CheckBoxListVM[]
}

export const useCurrentGradeAndProgramByRegionId = (
  regionId: number,
  setGrades?: (value: string[]) => void,
): CurrentGradeAndProgramByRegionId => {
  const {
    loading: schoolYearLoading,
    data: schoolYearData,
    error: schoolYearError,
  } = useCurrentSchoolYearByRegionId(regionId)
  const [availableGrades, setAvailableGrades] = useState<CheckBoxListVM[]>([])
  const [programYearList, setProgramYearList] = useState<CheckBoxListVM[]>([])
  const [schoolPartnerList, setSchoolPartnerList] = useState<CheckBoxListVM[]>([])

  useEffect(() => {
    if (programYearList && schoolPartnerList && availableGrades) {
      if (setGrades) setGrades(['all', ...map(availableGrades, (el) => el.value)])
    }
  }, [availableGrades])

  useEffect(() => {
    if (!schoolYearLoading && schoolYearData) {
      const availGrades = schoolYearData?.grades?.split(',').map((item: string) => {
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
      const availSchoolPartners = map(
        filter(schoolYearData?.SchoolPartners, (el) => el.active === 1),
        (el) => ({
          label: el.abbreviation,
          value: `${el.school_partner_id}`,
        }),
      )
      setSchoolPartnerList(availSchoolPartners)

      setAvailableGrades(availGrades)

      if (schoolYearData?.midyear_application) {
        const schoolYear_date_begin = moment(schoolYearData?.date_begin?.substring(0, 10)).toISOString()
        const schoolYear_date_end = moment(schoolYearData?.date_end?.substring(0, 10)).toISOString()
        const schoolYear_midyear_application_open = moment(
          schoolYearData?.midyear_application_open?.substring(0, 10),
        ).toISOString()
        const schoolYear_midyear_application_close = moment(
          schoolYearData?.midyear_application_close?.substring(0, 10),
        ).toISOString()

        setProgramYearList((prev) => [
          ...prev,
          {
            label: `${moment(schoolYear_date_begin).format('YYYY')}-${moment(schoolYear_date_end).format('YY')}`,
            value: 'schoolYear',
          },
          {
            label: `${moment(schoolYear_midyear_application_open).format('YYYY')}-${moment(
              schoolYear_midyear_application_close,
            ).format('YY')} Mid-year`,
            value: 'midYear',
          },
        ])

        //setProgramYears(['schoolYear', 'midYear'])
      } else {
        const schoolYear_date_begin = moment(schoolYearData?.date_begin?.substring(0, 10)).toISOString()
        const schoolYear_date_end = moment(schoolYearData?.date_end?.substring(0, 10)).toISOString()

        setProgramYearList((prev) => [
          ...prev,
          {
            label: `${moment(schoolYear_date_begin).format('YYYY')} - ${moment(schoolYear_date_end).format('YY')}`,
            value: 'schoolYear',
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
    schoolPartnerList: schoolPartnerList,
  }
}
