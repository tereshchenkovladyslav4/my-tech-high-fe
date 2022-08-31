import React, { useState } from 'react'
import { MthTitle } from '@mth/enums'
import { CommonSelect } from '../../components/CommonSelect'
import { CommonSelectType } from '../../types'
import { MidYearSelect } from '../MidYearSelect'
import { OpenAndCloseSelect } from '../OpenAndCloseSelect'
import { PageContentProps } from './PageContentProps'

export const PageContent: React.FC<PageContentProps> = ({
  schoolYearItem,
  setSchoolYearItem,
  applicationItem,
  setApplicationItem,
  midYearItem,
  setMidYearItem,
  setIsChanged,
}) => {
  const [midYearExpend, setMidYearExpend] = useState<boolean | undefined>(false)
  const yearsSettingList: CommonSelectType[] = [
    {
      name: MthTitle.SCHOOL_YEAR,
      component: <OpenAndCloseSelect item={schoolYearItem} setItem={setSchoolYearItem} setIsChanged={setIsChanged} />,
    },
    {
      name: MthTitle.APPLICATIONS,
      component: <OpenAndCloseSelect item={applicationItem} setItem={setApplicationItem} setIsChanged={setIsChanged} />,
    },
    {
      name: MthTitle.MID_YEAR,
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
      name: MthTitle.MID_YEAR_APPLICATION,
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
