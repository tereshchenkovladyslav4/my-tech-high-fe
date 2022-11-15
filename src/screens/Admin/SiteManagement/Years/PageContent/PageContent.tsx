import React, { useState } from 'react'
import { CommonSelect } from '@mth/components/CommonSelect'
import { MthTitle } from '@mth/enums'
import { CommonSelectType } from '../../types'
import { MidYearSelect } from '../MidYearSelect'
import { OpenAndCloseSelect } from '../OpenAndCloseSelect'
import { PageContentProps } from './PageContentProps'

export const PageContent: React.FC<PageContentProps> = ({
  enableSchedule,
  schoolYearItem,
  setSchoolYearItem,
  applicationItem,
  setApplicationItem,
  midYearItem,
  setMidYearItem,
  scheduleBuilderItem,
  setScheduleBuilderItem,
  secondSemesterItem,
  setSecondSemesterItem,
  midYearScheduleItem,
  setMidYearScheduleItem,
  homeroomResourceItem,
  setHomeroomResourceItem,
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
    yearsSettingList.push({
      name: MthTitle.MID_YEAR_APPLICATION,
      component: <OpenAndCloseSelect item={midYearItem} setItem={setMidYearItem} setIsChanged={setIsChanged} />,
    })
    if (enableSchedule)
      yearsSettingList.push({
        name: MthTitle.MID_YEAR_SCHEDULES,
        component: (
          <OpenAndCloseSelect item={midYearScheduleItem} setItem={setMidYearScheduleItem} setIsChanged={setIsChanged} />
        ),
      })
  }
  if (enableSchedule) {
    yearsSettingList.push({
      name: MthTitle.SCHEUDLE_BUILDER,
      component: (
        <OpenAndCloseSelect item={scheduleBuilderItem} setItem={setScheduleBuilderItem} setIsChanged={setIsChanged} />
      ),
    })

    yearsSettingList.push({
      name: MthTitle.SECOND_SEMESTER,
      component: (
        <OpenAndCloseSelect item={secondSemesterItem} setItem={setSecondSemesterItem} setIsChanged={setIsChanged} />
      ),
    })
  }

  yearsSettingList.push({
    name: MthTitle.HOMEROOM_RESOURCES,
    component: (
      <OpenAndCloseSelect item={homeroomResourceItem} setItem={setHomeroomResourceItem} setIsChanged={setIsChanged} />
    ),
  })

  const filteredList = yearsSettingList?.filter(
    (list) =>
      !midYearExpend ||
      (midYearExpend && list.name != MthTitle.MID_YEAR_APPLICATION && list.name != MthTitle.MID_YEAR_SCHEDULES),
  )

  return (
    <>
      {filteredList.map((yearsSetting, index) => {
        let dividerStyle = {}
        switch (yearsSetting.name) {
          case MthTitle.SCHOOL_YEAR:
          case MthTitle.APPLICATIONS:
          case MthTitle.HOMEROOM_RESOURCES:
          case MthTitle.MID_YEAR_APPLICATION:
            dividerStyle = { height: 'auto' }
            break
          case MthTitle.MID_YEAR:
            if (midYearExpend) {
              dividerStyle = { height: 'auto' }
            } else {
              dividerStyle = { top: '24px', height: '100%' }
            }
            break
          case MthTitle.SCHEUDLE_BUILDER:
            dividerStyle = { top: '24px', height: '100%' }
            break
          case MthTitle.MID_YEAR_SCHEDULES:
          case MthTitle.SECOND_SEMESTER:
            dividerStyle = { bottom: '24px', height: '100%' }
            break
        }

        return (
          <CommonSelect
            key={index}
            index={
              yearsSetting.name == MthTitle.MID_YEAR_APPLICATION || yearsSetting.name == MthTitle.SECOND_SEMESTER
                ? index + 1
                : yearsSetting.name == MthTitle.MID_YEAR_SCHEDULES
                ? index + 2
                : yearsSetting.name == MthTitle.HOMEROOM_RESOURCES
                ? index + 1
                : index
            }
            selectItem={yearsSetting}
            dividerStyle={dividerStyle}
          />
        )
      })}
    </>
  )
}
