import React, { useContext, useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { DropDown } from '../../components/DropDown/DropDown'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { DropDownItem } from '../../components/DropDown/types'
import moment from 'moment'
import { useQuery } from '@apollo/client'
import { getSchoolYearsByRegionId } from '../../services'
import { SchoolYearItem, SchoolYearType } from '../../Years/types'


type SchoolYearDropDownProps = {
  setSelectedYearId: (_: number) => void
  selectedYearId?: number
  //setSchoolYearItem: (value: SchoolYearItem | undefined) => void
  //setApplicationItem: (value: SchoolYearItem | undefined) => void
  //setMidYearItem: (value: SchoolYearItem | undefined) => void
  //setSelectedYearId: (value: string) => void
  //setOldSelectedYearId: (value: string) => void
  //setAddSchoolYearDialogOpen: (value: boolean) => void
  //schoolYears: SchoolYearType[]

  //setAddSchoolYears: (value: DropDownItem[]) => void
  //selectedYearId: string
}

export const SchoolYearDropDown = ({
  selectedYearId,
  setSelectedYearId
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

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      let schoolYearsArr: DropDownItem[] = []
      schoolYearData?.data?.region?.SchoolYears.forEach((schoolYear: any) => {
        console.log(schoolYear)
        schoolYearsArr.push(({
          value: schoolYear.school_year_id,
          label: moment(schoolYear.date_begin).format('YYYY') + '-' + moment(schoolYear.end).format('YY'),
        }))
      })
      setYears(schoolYearsArr)
      setSelectedYearId(schoolYearsArr[0].value as number)
    }
  }, [me?.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])

  return (
      <DropDown
        dropDownItems={years}
        defaultValue={selectedYearId || ''}
        sx={{ minWidth: '250px', textAlign: 'center', alignItems: 'end' }}
        borderNone={true}
        setParentValue={(val) => {
          setSelectedYearId(val)
        }}
      />
  )
}
