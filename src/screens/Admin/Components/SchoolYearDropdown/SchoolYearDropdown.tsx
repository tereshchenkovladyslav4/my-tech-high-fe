import React, { useContext, useEffect } from 'react'
import { find, toNumber } from 'lodash'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'

type SchoolYearDropDownProps = {
  setSelectedYearId: (_: number) => void
  selectedYearId?: number
  setSelectedYear?: (_: SchoolYear | undefined) => void
  setDisableForm?: (value: boolean) => void
  align?: 'start' | 'end'
}

export const SchoolYearDropDown: React.FC<SchoolYearDropDownProps> = ({
  selectedYearId,
  setSelectedYearId,
  setSelectedYear,
  setDisableForm,
  align = 'end',
}: SchoolYearDropDownProps) => {
  const { me } = useContext(UserContext)

  const {
    dropdownItems: schoolYearDropdownItems,
    selectedYearId: tempSelectedYearId,
    setSelectedYearId: setTempSelectedYearId,
    selectedYear: tempSelectedYear,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)

  useEffect(() => {
    if (tempSelectedYearId) {
      setSelectedYearId(tempSelectedYearId)
      if (setDisableForm) {
        const currentYear = new Date().getFullYear()
        const year = find(schoolYearDropdownItems, { value: tempSelectedYearId })
        setDisableForm(toNumber((year?.label as string).split('-')[0]) < currentYear)
      }
    }
  }, [tempSelectedYearId])

  useEffect(() => {
    if (setSelectedYear) {
      setSelectedYear(tempSelectedYear)
    }
  }, [tempSelectedYear])

  return (
    <DropDown
      dropDownItems={schoolYearDropdownItems}
      defaultValue={selectedYearId || ''}
      sx={{ width: 'fit-content', textAlign: 'left', alignItems: align }}
      borderNone={true}
      setParentValue={(value) => {
        setTempSelectedYearId(+value)
      }}
    />
  )
}
