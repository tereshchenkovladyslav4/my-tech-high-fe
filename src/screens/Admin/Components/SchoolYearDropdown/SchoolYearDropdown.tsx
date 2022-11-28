import React, { useContext, useEffect } from 'react'
import { find, toNumber } from 'lodash'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'

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

  const {
    dropdownItems: schoolYearDropdownItems,
    selectedYearId: selectedYear,
    setSelectedYearId: setSelectedYear,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)

  useEffect(() => {
    if (selectedYear) {
      setSelectedYearId(selectedYear)
      if (setDisableForm) {
        const currentYear = new Date().getFullYear()
        const year = find(schoolYearDropdownItems, { value: selectedYear })
        setDisableForm(toNumber((year?.label as string).split('-')[0]) < currentYear)
      }
    }
  }, [selectedYear])

  return (
    <DropDown
      dropDownItems={schoolYearDropdownItems}
      defaultValue={selectedYearId || ''}
      sx={{ width: '120px', textAlign: 'left', alignItems: align }}
      borderNone={true}
      setParentValue={(value) => {
        setSelectedYear(+value)
      }}
    />
  )
}
