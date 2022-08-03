import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '@mth/screens/Admin/SiteManagement/services'

export const SchoolYearDropDown: FunctionComponent = () => {
  const { me } = useContext(UserContext)
  const [years, setYears] = useState<DropDownItem[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const schoolYearsArr: DropDownItem[] = []
      schoolYearData?.data?.region?.SchoolYears.forEach((schoolYear: unknown) => {
        schoolYearsArr.push({
          value: schoolYear.school_year_id,
          label: moment(schoolYear.date_begin).format('YYYY') + '-' + moment(schoolYear.end).format('YY'),
        })
      })
      setYears(schoolYearsArr)
    }
  }, [me?.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])

  return (
    <DropDown
      dropDownItems={years}
      defaultValue={years[0]?.value || ''}
      sx={{ minWidth: '250px', textAlign: 'center', alignItems: 'end' }}
      borderNone={true}
      setParentValue={() => {}}
    />
  )
}
