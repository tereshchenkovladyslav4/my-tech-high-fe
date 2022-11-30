import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { CommonSelectList } from '@mth/components/CommonSelect'
import { CommonSelectType } from '@mth/components/CommonSelect/types'
import { MthTitle, ReduceFunds } from '@mth/enums'
import { MidYearSelect } from '../MidYearSelect'
import { OpenAndCloseSelect } from '../OpenAndCloseSelect'
import { PageContentProps } from './PageContentProps'

export const PageContent: React.FC<PageContentProps> = ({
  schoolYear,
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
  directOrderItem,
  setDirectOrderItem,
  reimbursementItem,
  setReimbursementItem,
  customBuiltItem,
  setCustomBuiltItem,
  requireSoftwareItem,
  setRequireSoftwareItem,
  thirdPartyItem,
  setThirdPartyItem,
  midDirectOrderItem,
  setMidDirectOrderItem,
  midReimbursementItem,
  setMidReimbursementItem,
  midCustomBuiltItem,
  setMidCustomBuiltItem,
  midRequireSoftwareItem,
  setMidRequireSoftwareItem,
  midThirdPartyItem,
  setMidThirdPartyItem,
  setIsChanged,
}) => {
  const [midYearExpended, setMidYearExpended] = useState<boolean>(true)
  const yearsSettingList: CommonSelectType[] = [
    {
      name: MthTitle.SCHOOL_YEAR,
      component: <OpenAndCloseSelect item={schoolYearItem} setItem={setSchoolYearItem} setIsChanged={setIsChanged} />,
    },
    {
      name: MthTitle.APPLICATIONS,
      component: <OpenAndCloseSelect item={applicationItem} setItem={setApplicationItem} setIsChanged={setIsChanged} />,
    },
  ]

  const midYearSetting: CommonSelectType = {
    name: MthTitle.MID_YEAR,
    component: (
      <MidYearSelect
        midYearItem={midYearItem}
        setMidYearItem={setMidYearItem}
        midYearExpended={midYearExpended}
        setMidYearExpended={setMidYearExpended}
        setIsChanged={setIsChanged}
      />
    ),
    mergedItems: [],
  }
  if (midYearExpended && midYearItem?.status) {
    midYearSetting.mergedItems?.push({
      name: MthTitle.MID_YEAR_APPLICATION,
      component: <OpenAndCloseSelect item={midYearItem} setItem={setMidYearItem} setIsChanged={setIsChanged} />,
    })
    if (enableSchedule)
      midYearSetting.mergedItems?.push({
        name: MthTitle.MID_YEAR_SCHEDULES,
        component: (
          <OpenAndCloseSelect item={midYearScheduleItem} setItem={setMidYearScheduleItem} setIsChanged={setIsChanged} />
        ),
      })

    if (
      schoolYear?.direct_orders === ReduceFunds.SUPPLEMENTAL ||
      schoolYear?.direct_orders === ReduceFunds.TECHNOLOGY
    ) {
      midYearSetting.mergedItems?.push({
        name: (
          <Typography component='span' sx={{ fontSize: '16px', fontWeight: '700' }}>
            {MthTitle.DIRECT_ORDERS}
          </Typography>
        ),
        component: <Box></Box>,
      })
      if (schoolYear?.direct_orders === ReduceFunds.SUPPLEMENTAL) {
        midYearSetting.mergedItems?.push({
          name: MthTitle.SUPPLEMENTAL_LEARNING_FUNDS,
          component: (
            <OpenAndCloseSelect item={midDirectOrderItem} setItem={setMidDirectOrderItem} setIsChanged={setIsChanged} />
          ),
        })
      }
      if (schoolYear?.direct_orders === ReduceFunds.TECHNOLOGY) {
        midYearSetting.mergedItems?.push({
          name: MthTitle.TECHNOLOGY,
          component: (
            <OpenAndCloseSelect item={midDirectOrderItem} setItem={setMidDirectOrderItem} setIsChanged={setIsChanged} />
          ),
        })
        if (schoolYear?.ScheduleBuilder?.custom_built) {
          midYearSetting.mergedItems?.push({
            name: MthTitle.CUSTOM_BUILT,
            component: (
              <OpenAndCloseSelect
                item={midCustomBuiltItem}
                setItem={setMidCustomBuiltItem}
                setIsChanged={setIsChanged}
              />
            ),
          })
        }
      }
    }

    if (
      schoolYear?.reimbursements === ReduceFunds.SUPPLEMENTAL ||
      schoolYear?.reimbursements === ReduceFunds.TECHNOLOGY
    ) {
      midYearSetting.mergedItems?.push({
        name: (
          <Typography component='span' sx={{ fontSize: '16px', fontWeight: '700' }}>
            {MthTitle.REIMBURSEMENTS}
          </Typography>
        ),
        component: <Box></Box>,
      })
      if (schoolYear?.reimbursements === ReduceFunds.SUPPLEMENTAL) {
        midYearSetting.mergedItems?.push({
          name: MthTitle.SUPPLEMENTAL_LEARNING_FUNDS,
          component: (
            <OpenAndCloseSelect
              item={midReimbursementItem}
              setItem={setMidReimbursementItem}
              setIsChanged={setIsChanged}
            />
          ),
        })
      }
      if (schoolYear?.reimbursements === ReduceFunds.TECHNOLOGY) {
        midYearSetting.mergedItems?.push({
          name: MthTitle.TECHNOLOGY,
          component: (
            <OpenAndCloseSelect
              item={midReimbursementItem}
              setItem={setMidReimbursementItem}
              setIsChanged={setIsChanged}
            />
          ),
        })
        if (schoolYear?.ScheduleBuilder?.custom_built) {
          midYearSetting.mergedItems?.push({
            name: MthTitle.CUSTOM_BUILT,
            component: (
              <OpenAndCloseSelect
                item={midCustomBuiltItem}
                setItem={setMidCustomBuiltItem}
                setIsChanged={setIsChanged}
              />
            ),
          })
        }
        if (schoolYear?.ScheduleBuilder?.third_party_provider) {
          midYearSetting.mergedItems?.push({
            name: '3rd Party Provider',
            component: (
              <OpenAndCloseSelect item={midThirdPartyItem} setItem={setMidThirdPartyItem} setIsChanged={setIsChanged} />
            ),
          })
        }
      }
      if (schoolYear?.require_software) {
        midYearSetting.mergedItems?.push({
          name: 'Required Software',
          component: (
            <OpenAndCloseSelect
              item={midRequireSoftwareItem}
              setItem={setMidRequireSoftwareItem}
              setIsChanged={setIsChanged}
            />
          ),
        })
      }
    }
  }
  yearsSettingList.push(midYearSetting)

  if (enableSchedule) {
    yearsSettingList.push({
      name: MthTitle.SCHEUDLE_BUILDER,
      component: (
        <OpenAndCloseSelect item={scheduleBuilderItem} setItem={setScheduleBuilderItem} setIsChanged={setIsChanged} />
      ),
      mergedItems: [
        {
          name: MthTitle.SECOND_SEMESTER,
          component: (
            <OpenAndCloseSelect item={secondSemesterItem} setItem={setSecondSemesterItem} setIsChanged={setIsChanged} />
          ),
        },
      ],
    })
  }

  yearsSettingList.push({
    name: MthTitle.HOMEROOM_RESOURCES,
    component: (
      <OpenAndCloseSelect item={homeroomResourceItem} setItem={setHomeroomResourceItem} setIsChanged={setIsChanged} />
    ),
  })

  if (schoolYear?.direct_orders === ReduceFunds.SUPPLEMENTAL || schoolYear?.direct_orders === ReduceFunds.TECHNOLOGY) {
    const directOrderSetting: CommonSelectType = {
      name: (
        <Typography component='span' sx={{ fontSize: '18px', fontWeight: '700' }}>
          {MthTitle.DIRECT_ORDERS}
        </Typography>
      ),
      component: <Box sx={{ height: '48px' }}></Box>,
      mergedItems: [],
    }
    if (schoolYear?.direct_orders === ReduceFunds.SUPPLEMENTAL) {
      directOrderSetting.mergedItems?.push({
        name: MthTitle.SUPPLEMENTAL_LEARNING_FUNDS,
        component: (
          <OpenAndCloseSelect item={directOrderItem} setItem={setDirectOrderItem} setIsChanged={setIsChanged} />
        ),
      })
    }
    if (schoolYear?.direct_orders === ReduceFunds.TECHNOLOGY) {
      directOrderSetting.mergedItems?.push({
        name: MthTitle.TECHNOLOGY,
        component: (
          <OpenAndCloseSelect item={directOrderItem} setItem={setDirectOrderItem} setIsChanged={setIsChanged} />
        ),
      })
      if (schoolYear?.ScheduleBuilder?.custom_built) {
        directOrderSetting.mergedItems?.push({
          name: MthTitle.CUSTOM_BUILT,
          component: (
            <OpenAndCloseSelect item={customBuiltItem} setItem={setCustomBuiltItem} setIsChanged={setIsChanged} />
          ),
        })
      }
    }
    yearsSettingList.push(directOrderSetting)
  }

  if (
    schoolYear?.reimbursements === ReduceFunds.SUPPLEMENTAL ||
    schoolYear?.reimbursements === ReduceFunds.TECHNOLOGY
  ) {
    const reimbursementSetting: CommonSelectType = {
      name: (
        <Typography component='span' sx={{ fontSize: '18px', fontWeight: '700' }}>
          {MthTitle.REIMBURSEMENTS}
        </Typography>
      ),
      component: <Box sx={{ height: '48px' }}></Box>,
      mergedItems: [],
    }
    if (schoolYear?.reimbursements === ReduceFunds.SUPPLEMENTAL) {
      reimbursementSetting.mergedItems?.push({
        name: MthTitle.SUPPLEMENTAL_LEARNING_FUNDS,
        component: (
          <OpenAndCloseSelect item={reimbursementItem} setItem={setReimbursementItem} setIsChanged={setIsChanged} />
        ),
      })
    }
    if (schoolYear?.reimbursements === ReduceFunds.TECHNOLOGY) {
      reimbursementSetting.mergedItems?.push({
        name: MthTitle.TECHNOLOGY,
        component: (
          <OpenAndCloseSelect item={reimbursementItem} setItem={setReimbursementItem} setIsChanged={setIsChanged} />
        ),
      })
      if (schoolYear?.ScheduleBuilder?.custom_built) {
        reimbursementSetting.mergedItems?.push({
          name: MthTitle.CUSTOM_BUILT,
          component: (
            <OpenAndCloseSelect item={customBuiltItem} setItem={setCustomBuiltItem} setIsChanged={setIsChanged} />
          ),
        })
      }
      if (schoolYear?.ScheduleBuilder?.third_party_provider) {
        reimbursementSetting.mergedItems?.push({
          name: '3rd Party Provider',
          component: (
            <OpenAndCloseSelect item={thirdPartyItem} setItem={setThirdPartyItem} setIsChanged={setIsChanged} />
          ),
        })
      }
    }
    if (schoolYear?.require_software) {
      reimbursementSetting.mergedItems?.push({
        name: 'Required Software',
        component: (
          <OpenAndCloseSelect item={requireSoftwareItem} setItem={setRequireSoftwareItem} setIsChanged={setIsChanged} />
        ),
      })
    }
    yearsSettingList.push(reimbursementSetting)
  }

  return <CommonSelectList settingList={yearsSettingList}></CommonSelectList>
}
