import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { find, toNumber } from 'lodash'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SchoolYearVM } from '@mth/screens/Admin/Applications/type'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/SiteManagement/services'

type SchoolYearDropDownProps = {
  setSelectedYearId: (_: number) => void
  selectedYearId?: number
  setDisableForm?: () => void
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
      sx={{ minWidth: '150px', textAlign: 'center', alignItems: align }}
      borderNone={true}
      setParentValue={(value) => {
        setSelectedYear(value)
      }}
    />
  )
}
