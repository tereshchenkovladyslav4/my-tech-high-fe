import React, { useState } from 'react'
import { PageContentProps } from './PageContentProps'
import { CommonSelectType } from '../../types'
import { CommonSelect } from '../../components/CommonSelect'
import { MidYearSelect } from '../MidYearSelect'
import { OpenAndCloseSelect } from '../OpenAndCloseSelect'

export default function PageContent({
  schoolYearItem,
  setSchoolYearItem,
  applicationItem,
  setApplicationItem,
  midYearItem,
  setMidYearItem,
  setIsChanged,
}: PageContentProps) {
  const [midYearExpend, setMidYearExpend] = useState<boolean | undefined>(false)
  let yearsSettingList: CommonSelectType[] = [
    {
      name: 'School Year',
      component: <OpenAndCloseSelect item={schoolYearItem} setItem={setSchoolYearItem} setIsChanged={setIsChanged} />,
    },
    {
      name: 'Applications',
      component: <OpenAndCloseSelect item={applicationItem} setItem={setApplicationItem} setIsChanged={setIsChanged} />,
    },
    {
      name: 'Mid-Year',
      component: (
        <MidYearSelect
          midYearItem={midYearItem}
          setMidYearItem={setMidYearItem}
          setMidYearExpend={setMidYearExpend}
          setIsChanged={setIsChanged}
        />
      ),
    },
  ]

  if (midYearItem?.status) {
    const setting: CommonSelectType = {
      name: 'Mid-Year Application',
      component: <OpenAndCloseSelect item={midYearItem} setItem={setMidYearItem} setIsChanged={setIsChanged} />,
    }
    yearsSettingList.push(setting)
  }

  return (
    <>
      {yearsSettingList
        ?.filter((list) => !midYearExpend || (midYearExpend && list.name != 'Mid-Year Application'))
        .map((yearsSetting, index) => (
          <CommonSelect key={index} index={index > 2 ? index + 1 : index} selectItem={yearsSetting} />
        ))}
    </>
  )
}
