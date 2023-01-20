import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { find } from 'lodash'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SchoolYearVM } from '@mth/screens/Admin/Applications/type'
import { getSchoolYearsByRegionId } from '../../services'

type SchoolYearDropDownProps = {
  setSelectedYearId: (_: number) => void
  selectedYearId?: number
  setDisableForm?: (value: boolean) => void
  align?: 'start' | 'end'
}

export const SchoolYearDropDown: React.FC<SchoolYearDropDownProps> = ({
  selectedYearId,
  setSelectedYearId,
  setDisableForm,
  align = 'end',
}: SchoolYearDropDownProps) => {
  const { me } = useContext(UserContext)
  const [years, setYears] = useState<DropDownItem[]>([])
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const [selectedYear, setSelectedYear] = useState<number>(0)

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const schoolYearsArr: DropDownItem[] = []
      schoolYearData?.data?.region?.SchoolYears.sort(
        (d1: { date_begin: string | number | Date }, d2: { date_begin: string | number | Date }) =>
          new Date(d1.date_begin).getTime() - new Date(d2.date_begin).getTime(),
      )

      schoolYearData?.data?.region?.SchoolYears.forEach((schoolYear: SchoolYearVM) => {
        const dateBegin = new Date(schoolYear.date_begin),
          dateEnd = new Date(schoolYear.date_end)

        if (new Date() >= dateBegin && new Date() < dateEnd) {
          setSelectedYear(+schoolYear.school_year_id)
        }

        schoolYearsArr.push({
          value: schoolYear.school_year_id,
          label: moment(dateBegin).format('YYYY') + '-' + moment(dateEnd).format('YY'),
        })
      })
      setSchoolYears(schoolYearData?.data?.region?.SchoolYears)
      setYears(schoolYearsArr)
    }
  }, [me?.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    if (selectedYear) {
      setSelectedYearId(selectedYear)
      if (setDisableForm) {
        const year = find(schoolYears, { school_year_id: selectedYear })
        if (new Date() >= new Date(year?.date_begin || '') && new Date() < new Date(year?.date_end || '')) {
          setDisableForm(false)
        } else {
          setDisableForm(true)
        }
      }
    }
  }, [selectedYear])

  return (
    <DropDown
      dropDownItems={years}
      defaultValue={selectedYearId || ''}
      sx={{ minWidth: '250px', textAlign: 'center', alignItems: align }}
      borderNone={true}
      setParentValue={(value) => {
        setSelectedYear(+value)
      }}
    />
  )
}
