import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { find, toNumber } from 'lodash'
import moment from 'moment'
import { SchoolYearVM } from '@mth/screens/Admin/Applications/type'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { DropDown } from '../../components/DropDown/DropDown'
import { DropDownItem } from '../../components/DropDown/types'
import { getSchoolYearsByRegionId } from '../../services'

type SchoolYearDropDownProps = {
  setSelectedYearId: (_: number) => void
  selectedYearId?: number
  setDisableForm?: () => void
  align?: 'start' | 'end'
}

export const SchoolYearDropDown: FunctionComponent<SchoolYearDropDownProps> = ({
  selectedYearId,
  setSelectedYearId,
  setDisableForm,
  align = 'end',
}: SchoolYearDropDownProps) => {
  const { me } = useContext(UserContext)
  const [years, setYears] = useState<DropDownItem[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const [selectedYear, setSelectedYear] = useState<number>()

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const schoolYearsArr: DropDownItem[] = []
      schoolYearData?.data?.region?.SchoolYears.sort(
        (d1, d2) => new Date(d1.date_begin).getTime() - new Date(d2.date_begin).getTime(),
      )

      let currYear = new Date().getFullYear()

      schoolYearData?.data?.region?.SchoolYears.forEach((schoolYear: SchoolYearVM) => {
        const dateBegin = new Date(schoolYear.date_begin),
          dateEnd = new Date(schoolYear.date_end)

        if (currYear >= dateBegin.getFullYear() && currYear < dateEnd.getFullYear()) {
          currYear = schoolYear.school_year_id
          setSelectedYear(currYear)
        }

        schoolYearsArr.push({
          value: schoolYear.school_year_id,
          label: moment(dateBegin).format('YYYY') + '-' + moment(dateEnd).format('YY'),
        })
      })
      setYears(schoolYearsArr)
    }
  }, [me?.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    if (selectedYear) {
      setSelectedYearId(selectedYear)
      if (setDisableForm) {
        const currentYear = new Date().getFullYear()
        const year = find(years, { value: selectedYear })
        setDisableForm(toNumber((year?.label as string).split('-')[0]) < currentYear)
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
        setSelectedYear(value)
      }}
    />
  )
}
