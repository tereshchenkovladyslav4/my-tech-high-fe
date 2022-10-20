import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { Grid, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { groupBy } from 'lodash'
import { Prompt } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { NestedDropdown } from '@mth/components/NestedDropdown'
import { MenuItemData } from '@mth/components/NestedDropdown/types'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { COURSE_TYPE_ITEMS } from '@mth/constants'
import { CourseType, MthColor, MthTitle, ReduceFunds } from '@mth/enums'
import { getStudentPeriodsQuery } from '@mth/screens/Homeroom/Schedule/services'
import { extractContent } from '@mth/utils'
import { Course, Period, ScheduleBuilderProps, ScheduleData, Subject, Title } from '../types'
import { scheduleBuilderClasses } from './styles'

const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({
  studentId,
  selectedYear,
  isDraftSaved = false,
  showUnsavedModal = false,
  setIsChanged,
  onWithoutSaved,
  confirmSubmitted,
}) => {
  const [tableData, setTableData] = useState<MthTableRowItem<ScheduleData>[]>([])
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [periodNotification, setPeriodNotification] = useState<string | undefined>()
  const [subjectNotification, setSubjectNotification] = useState<string | undefined>()
  const [subjectReduceFundsNotification, setSubjectReduceFundsNotification] = useState<string | undefined>()

  const { loading, data: periodsData } = useQuery(getStudentPeriodsQuery, {
    variables: { studentId: studentId, schoolYearId: selectedYear },
    skip: !studentId && !selectedYear,
    fetchPolicy: 'network-only',
  })

  const createPeriodMenuItems = (schedule: ScheduleData): MenuItemData => {
    const menuItemsData: MenuItemData = {
      label: schedule.Period?.category || (
        <Typography sx={{ ...scheduleBuilderClasses.tableContent, color: MthColor.MTHBLUE }}>Select</Typography>
      ),
      items: [],
    }
    schedule.Periods?.forEach((period) => {
      const subMenu: MenuItemData = {
        label: period.category,
        callback: () => handleSelectPeriod(schedule, period),
      }
      menuItemsData.items?.push(subMenu)
    })
    return menuItemsData
  }

  const createSubjectMenuItems = (schedule: ScheduleData): MenuItemData => {
    const menuItemsData: MenuItemData = {
      label: schedule.Subject?.name || schedule.Title?.name || (
        <Typography sx={{ ...scheduleBuilderClasses.tableContent, color: MthColor.MTHBLUE }}>Select Subject</Typography>
      ),
      items: [],
    }
    schedule.Period?.Subjects?.forEach((subject) => {
      const subMenu: MenuItemData = {
        label: subject.name,
        items: [],
      }
      subject.Titles?.forEach((title) => {
        subMenu.items?.push({
          label: title.name,
          callback: () => handleSelectTitle(schedule, title),
        })
      })

      if (subject.AltTitles?.length) {
        subMenu.moreItems = []
        subMenu.showMoreLabel = 'Show options for other grades'
        subMenu.showLessLabel = 'Hide options for other grades'
        subject.AltTitles?.forEach((title) => {
          subMenu.moreItems?.push({
            label: `${title.name} (${title.min_alt_grade}-${title.max_alt_grade})`,
            callback: () => handleSelectTitle(schedule, title),
          })
        })
      }
      if (!subject.Titles?.length) {
        // For the subject with no titles available
        subMenu.callback = () => handleSelectSubject(schedule, subject)
      }

      menuItemsData.items?.push(subMenu)
    })
    return menuItemsData
  }

  const createCourseTypeMenuItems = (schedule: ScheduleData): MenuItemData => {
    const menuItemsData: MenuItemData = {
      label: COURSE_TYPE_ITEMS.find((item) => item.value === schedule.CourseType)?.label || (
        <Typography sx={{ ...scheduleBuilderClasses.tableContent, color: MthColor.MTHBLUE }}>Select Type</Typography>
      ),
      items: [],
    }
    schedule.Title?.CourseTypes?.forEach((courseType) => {
      const subMenu: MenuItemData = {
        label: courseType.label,
        callback: () => handleSelectCourseType(schedule, courseType.value as CourseType),
      }
      menuItemsData.items?.push(subMenu)
    })
    return menuItemsData
  }

  const createDescriptionMenuItems = (schedule: ScheduleData): MenuItemData => {
    const menuItemsData: MenuItemData = {
      label: schedule.Course?.name || (
        <Typography sx={{ ...scheduleBuilderClasses.tableContent, color: MthColor.MTHBLUE }}>Select</Typography>
      ),
      items: [],
    }
    schedule.Title?.Providers?.forEach((provider) => {
      const subMenu: MenuItemData = {
        label: provider.name,
        items: [],
      }
      provider.Courses?.forEach((course) => {
        subMenu.items?.push({
          label: course.name,
          callback: () => handleSelectCourse(schedule, course),
        })
      })

      if (provider.AltCourses?.length) {
        subMenu.moreItems = []
        subMenu.showMoreLabel = 'Show options for other grades'
        subMenu.showLessLabel = 'Hide options for other grades'
        provider.AltCourses?.forEach((course) => {
          subMenu.moreItems?.push({
            label: `${course.name} (${course.min_alt_grade}-${course.max_alt_grade})`,
            callback: () => handleSelectCourse(schedule, course),
          })
        })
      }

      menuItemsData.items?.push(subMenu)
    })
    return menuItemsData
  }

  const handleSelectPeriod = (schedule: ScheduleData, period: Period) => {
    const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule.period)
    if (scheduleIdx > -1) {
      if (schedule.Period?.id === period.id) return
      schedule.Period = period
      delete schedule.Subject
      delete schedule.Title
      delete schedule.CourseType
      delete schedule.Course
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
      if (period.notify_period) {
        setPeriodNotification(period.message_period)
      }
    }
  }

  const handleSelectSubject = (schedule: ScheduleData, subject: Subject) => {
    const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule.period)
    if (scheduleIdx > -1) {
      if (schedule.Subject?.subject_id === subject.subject_id) return
      schedule.Subject = subject
      delete schedule.Title
      delete schedule.CourseType
      delete schedule.Course
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
    }
    setIsChanged(true)
  }

  const handleSelectTitle = (schedule: ScheduleData, title: Title) => {
    const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule.period)
    if (scheduleIdx > -1) {
      if (schedule.Title?.title_id === title.title_id) return
      schedule.Title = title
      delete schedule.Subject
      delete schedule.CourseType
      delete schedule.Course
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
      if (title.display_notification) {
        setSubjectNotification(title.subject_notification)
      }
      if (title.reduce_funds !== ReduceFunds.NONE) {
        setSubjectReduceFundsNotification(title.reduce_funds_notification)
      }
    }
  }

  const handleSelectCourseType = (schedule: ScheduleData, courseType: CourseType) => {
    const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule.period)
    if (scheduleIdx > -1) {
      if (schedule.CourseType === courseType) return
      schedule.CourseType = courseType
      delete schedule.Course
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
    }
  }

  const handleSelectCourse = (schedule: ScheduleData, course: Course) => {
    const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule.period)
    if (scheduleIdx > -1) {
      if (schedule.Course?.id === course.id) return
      schedule.Course = course
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
    }
  }

  const fields: MthTableField<ScheduleData>[] = [
    {
      key: 'Period',
      label: 'Period',
      sortable: false,
      tdClass: '',
      width: '25%',
      formatter: (item: MthTableRowItem<ScheduleData>) => {
        return (
          <Box>
            <Grid container alignItems='center' sx={{ display: 'flex' }}>
              <Typography
                sx={{ ...scheduleBuilderClasses.tableContent, width: '20px', paddingY: '24px' }}
                component={'span'}
              >
                {('0' + item.rawData.period).slice(-2)}
              </Typography>
              <Box sx={{ marginLeft: '20px' }}>
                {item.rawData.Periods?.length > 1 ? (
                  <NestedDropdown
                    menuItemsData={createPeriodMenuItems(item.rawData)}
                    MenuProps={{ elevation: 3 }}
                    ButtonProps={{
                      variant: 'outlined',
                      sx: scheduleBuilderClasses.nestedDropdownButton,
                    }}
                  />
                ) : (
                  <Typography sx={scheduleBuilderClasses.tableContent}>{item.rawData.Period?.category}</Typography>
                )}
              </Box>
            </Grid>
          </Box>
        )
      },
    },
    {
      key: 'Subject',
      label: 'Subject',
      sortable: false,
      tdClass: '',
      width: '25%',
      formatter: (item: MthTableRowItem<ScheduleData>) => {
        return (
          <Box>
            {!!item.rawData.Period &&
              (item.rawData.Period.Subjects?.length > 1 ||
              (item.rawData.Period.Subjects?.length === 1 && item.rawData.Period.Subjects?.[0]?.Titles?.length > 1) ? (
                <NestedDropdown
                  menuItemsData={createSubjectMenuItems(item.rawData)}
                  MenuProps={{ elevation: 3 }}
                  ButtonProps={{
                    variant: 'outlined',
                    sx: scheduleBuilderClasses.nestedDropdownButton,
                  }}
                />
              ) : (
                <Typography sx={scheduleBuilderClasses.tableContent}>
                  {item.rawData.Subject?.name || item.rawData.Title?.name}
                </Typography>
              ))}
          </Box>
        )
      },
    },
    {
      key: 'Type',
      label: 'Course Type',
      sortable: false,
      tdClass: '',
      width: '25%',
      formatter: (item: MthTableRowItem<ScheduleData>) => {
        return (
          <Box>
            {!!item.rawData.Title && item.rawData.Title.CourseTypes?.length > 1 ? (
              <NestedDropdown
                menuItemsData={createCourseTypeMenuItems(item.rawData)}
                MenuProps={{ elevation: 3 }}
                ButtonProps={{
                  variant: 'outlined',
                  sx: scheduleBuilderClasses.nestedDropdownButton,
                }}
              />
            ) : (
              <Typography sx={scheduleBuilderClasses.tableContent}>
                {COURSE_TYPE_ITEMS.find((x) => x.value === item.rawData.CourseType)?.label}
              </Typography>
            )}
          </Box>
        )
      },
    },
    {
      key: 'Description',
      label: 'Description',
      sortable: false,
      tdClass: '',
      width: '25%',
      formatter: (item: MthTableRowItem<ScheduleData>) => {
        return (
          <Box>
            {item.rawData.CourseType === CourseType.MTH_DIRECT &&
              !!item.rawData.Title &&
              (item.rawData.Title.Providers?.length > 1 ||
              (item.rawData.Title.Providers?.length === 1 && item.rawData.Title.Providers?.[0]?.Courses?.length > 1) ? (
                <NestedDropdown
                  menuItemsData={createDescriptionMenuItems(item.rawData)}
                  MenuProps={{ elevation: 3 }}
                  ButtonProps={{
                    variant: 'outlined',
                    sx: scheduleBuilderClasses.nestedDropdownButton,
                  }}
                />
              ) : (
                <Typography sx={scheduleBuilderClasses.tableContent}>
                  {item.rawData.Course?.name || item.rawData.Course?.name}
                </Typography>
              ))}
          </Box>
        )
      },
    },
  ]

  const preSelect = (schedule: ScheduleData): ScheduleData => {
    if (schedule.Periods?.length === 1) {
      schedule.Period = schedule.Periods[0]
    }
    if (schedule.Period?.Subjects?.length === 1) {
      const subject = schedule.Period.Subjects[0]
      if (!subject.Titles?.length) {
        schedule.Subject = subject
      } else if (subject.Titles?.length === 1) {
        schedule.Title = subject.Titles[0]
      }
    }

    if (schedule.Title?.CourseTypes?.length === 1) {
      schedule.CourseType = schedule.Title.CourseTypes[0].value as CourseType
    }
    return schedule
  }

  const createData = (schedule: ScheduleData): MthTableRowItem<ScheduleData> => {
    schedule = preSelect(schedule)
    return {
      columns: {
        Type: 'Lorem',
        Description: 'Lorem',
      },
      rawData: schedule,
    }
  }
  const handleCancelUnsavedModal = () => {
    onWithoutSaved(false)
  }
  const handleConfirmUnsavedModal = () => {
    onWithoutSaved(true)
  }
  const handleConfirmSavedModal = () => {
    confirmSubmitted()
  }

  useEffect(() => {
    if (scheduleData?.length) {
      setTableData(
        scheduleData.map((item) => {
          return createData(item)
        }),
      )
    }
  }, [scheduleData])

  useEffect(() => {
    if (!loading) {
      if (periodsData?.studentPeriods) {
        const { studentPeriods } = periodsData
        studentPeriods.map((period: Period) => {
          period.Subjects.map((subject) => {
            subject.Titles.concat(subject.AltTitles || []).map((title) => {
              title.CourseTypes = COURSE_TYPE_ITEMS.filter(
                (item) =>
                  (item.value === CourseType.CUSTOM_BUILT && title.custom_built) ||
                  item.value === CourseType.MTH_DIRECT ||
                  (item.value === CourseType.THIRD_PARTY_PROVIDER && title.third_party_provider),
              )

              title.Providers = []
              const providersData = groupBy(title.Courses, 'provider_id')
              for (const key in providersData) {
                title.Providers.push({
                  id: +key,
                  name: providersData[key]?.[0].Provider?.name,
                  Courses: providersData[key],
                })
              }
              const altProvidersData = groupBy(title.AltCourses, 'provider_id')
              for (const key in altProvidersData) {
                const index = title.Providers.findIndex((item) => item.id === +key)
                if (index > -1) {
                  title.Providers[index].AltCourses = altProvidersData[key]
                } else {
                  title.Providers.push({
                    id: +key,
                    name: altProvidersData[key]?.[0].Provider?.name,
                    Courses: [],
                    AltCourses: altProvidersData[key],
                  })
                }
              }
            })
          })
        })

        const scheduleData = groupBy(studentPeriods, 'period')
        const scheduleDataArray: ScheduleData[] = []
        for (const key in scheduleData) {
          scheduleDataArray.push({
            period: +key,
            Periods: scheduleData[key],
          })
        }

        setScheduleData(scheduleDataArray)
      }
    }
  }, [loading, periodsData])

  const questionClick = () => {}

  return (
    <>
      <Box sx={scheduleBuilderClasses.main}>
        <MthTable
          items={tableData}
          fields={fields}
          isDraggable={false}
          checkBoxColor='secondary'
          sx={scheduleBuilderClasses.customTable}
        />
        <IconButton
          size='large'
          edge='start'
          aria-label='open drawer'
          onClick={questionClick}
          sx={[{ mr: 2 }, scheduleBuilderClasses.questionButton]}
        >
          <QuestionMarkIcon sx={{ fontSize: '15px', color: MthColor.BLACK }} />
        </IconButton>
      </Box>
      {showUnsavedModal && (
        <CustomModal
          title={MthTitle.UNSAVED_TITLE}
          description={MthTitle.UNSAVED_DESCRIPTION}
          cancelStr='Cancel'
          confirmStr='Yes'
          backgroundColor={MthColor.WHITE}
          onClose={() => handleCancelUnsavedModal()}
          onConfirm={() => handleConfirmUnsavedModal()}
        />
      )}
      {isDraftSaved && (
        <SuccessModal
          title='Saved'
          subtitle={
            <Paragraph size='large' color={MthColor.SYSTEM_01} textAlign='center'>
              {' '}
              Great start! <br /> Your student&apos;s schedule has been saved. <br /> Please return to submit the
              schedule before the deadline.
            </Paragraph>
          }
          btntitle='Ok'
          handleSubmit={handleConfirmSavedModal}
        />
      )}
      {!!periodNotification && (
        <CustomModal
          title={MthTitle.NOTIFICATION}
          description={extractContent(periodNotification || '')}
          confirmStr='Ok'
          showIcon={false}
          showCancel={false}
          backgroundColor={MthColor.WHITE}
          onClose={() => setPeriodNotification(undefined)}
          onConfirm={() => setPeriodNotification(undefined)}
        />
      )}
      {!!subjectNotification && (
        <CustomModal
          title={MthTitle.NOTIFICATION}
          description={extractContent(subjectNotification || '')}
          confirmStr='Ok'
          showIcon={false}
          showCancel={false}
          backgroundColor={MthColor.WHITE}
          onClose={() => setSubjectNotification(undefined)}
          onConfirm={() => setSubjectNotification(undefined)}
        />
      )}
      {!subjectNotification && !!subjectReduceFundsNotification && (
        <CustomModal
          title={MthTitle.REDUCES_FUNDS}
          description={extractContent(subjectReduceFundsNotification || '')}
          confirmStr='Ok'
          showIcon={false}
          showCancel={false}
          backgroundColor={MthColor.WHITE}
          onClose={() => setSubjectReduceFundsNotification(undefined)}
          onConfirm={() => setSubjectReduceFundsNotification(undefined)}
        />
      )}
      <Prompt
        when={showUnsavedModal}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
    </>
  )
}

export default ScheduleBuilder
