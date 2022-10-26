import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { ClickAwayListener, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import parse from 'html-react-parser'
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
import { getAllScheduleBuilderQuery } from '@mth/graphql/queries/schedule-builder'
import { CustomBuiltDescriptionEdit } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/CustomBuiltDescription'
import { getStudentPeriodsQuery } from '@mth/screens/Homeroom/Schedule/services'
import { extractContent, gradeShortText } from '@mth/utils'
import { Course, Period, ScheduleBuilderProps, ScheduleData, Subject, Title } from '../types'
import { OnSiteSplitEnrollmentEdit } from './OnSiteSplitEnrollmentEdit'
import { OnSiteSplitEnrollment } from './OnSiteSplitEnrollmentEdit/types'
import { scheduleBuilderClasses } from './styles'
import { ThirdPartyProviderEdit } from './ThirdPartyProviderEdit'
import { ThirdPartyProvider } from './ThirdPartyProviderEdit/types'

const StyledTooltipBgDiv = styled('div')(({}) => ({
  '&': {
    backgroundColor: MthColor.LIGHTGRAY,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 10,
    opacity: 0.5,
  },
}))
const StyledTooltip = styled(Tooltip)(({}) => ({
  '& .MuiTooltip-tooltip a': {
    color: `${MthColor.BLUE_GRDIENT} !important`,
  },
}))

const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({
  studentId,
  selectedYear,
  isDraftSaved = false,
  showUnsavedModal = false,
  splitEnrollment = false,
  diplomaSeekingPath,
  setIsChanged,
  onWithoutSaved,
  confirmSubmitted,
}) => {
  const [tableData, setTableData] = useState<MthTableRowItem<ScheduleData>[]>([])
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [periodNotification, setPeriodNotification] = useState<string | undefined>()
  const [subjectNotification, setSubjectNotification] = useState<string | undefined>()
  const [subjectReduceFundsNotification, setSubjectReduceFundsNotification] = useState<string | undefined>()
  const [courseNotification, setCourseNotification] = useState<string | undefined>()
  const [courseReduceFundsNotification, setCourseReduceFundsNotification] = useState<string | undefined>()
  const [showThirdPartyProviderModal, setShowThirdPartyProviderModal] = useState<boolean>(false)
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData>()
  const [selectedCourseType, setSelectedCourseType] = useState<CourseType>()
  const [selectedThridPartyProvider, setSelectedThridPartyProvider] = useState<ThirdPartyProvider>()
  const [showOnSiteSplitEnrollmentModal, setShowOnSiteSplitEnrollmentModal] = useState<boolean>(false)
  const [selectedOnSiteSplitEnrollemnt, setSelectedOnSiteSplitEnrollment] = useState<OnSiteSplitEnrollment>()
  const [showCustomBuilt, setShowCustomBuilt] = useState<boolean>(false)
  const [enableQuestionTooltip, setEnableQuestionTooltip] = useState<boolean>(false)

  const { loading, data: periodsData } = useQuery(getStudentPeriodsQuery, {
    variables: { studentId: studentId, schoolYearId: selectedYear, diplomaSeekingPath: diplomaSeekingPath },
    skip: !studentId && !selectedYear,
    fetchPolicy: 'network-only',
  })
  const { loading: scheduleBuilderSettingLoading, data: scheduleBuilderSettingData } = useQuery(
    getAllScheduleBuilderQuery,
    {
      variables: { schoolYearId: selectedYear },
      fetchPolicy: 'network-only',
    },
  )

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
            label: `${title.name} (${gradeShortText(title.min_alt_grade)}-${gradeShortText(title.max_alt_grade)})`,
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
      // This is need to prevent the cascading menu from closing when open modal.
      if (provider.reduce_funds !== ReduceFunds.NONE && provider.reduce_funds_notification?.length > 8) {
        subMenu.customModalProps = {
          title: MthTitle.REDUCES_FUNDS,
          description: extractContent(provider.reduce_funds_notification),
          confirmStr: 'Ok',
          showIcon: false,
          showCancel: false,
          backgroundColor: MthColor.WHITE,
        }
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
            label: `${course.name} (${gradeShortText(course.min_alt_grade)}-${gradeShortText(course.max_alt_grade)})`,
            callback: () => handleSelectCourse(schedule, course),
          })
        })
      }

      menuItemsData.items?.push(subMenu)
      if (splitEnrollment) {
        menuItemsData.items?.push({
          label: MthTitle.ON_SITE_SPLIT_ENROLLMENT,
          callback: () => {
            setShowOnSiteSplitEnrollmentModal(true)
            setSelectedSchedule(schedule)
          },
        })
      }
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
      switch (courseType) {
        case CourseType.THIRD_PARTY_PROVIDER:
          setShowThirdPartyProviderModal(true)
          setSelectedSchedule(schedule)
          setSelectedCourseType(courseType)
          break
        case CourseType.CUSTOM_BUILT:
          setSelectedSchedule(schedule)
          setShowCustomBuilt(true)
          break
        case CourseType.MTH_DIRECT:
          schedule.CourseType = courseType
          delete schedule.Course
          delete schedule.OnSiteSplitEnrollment
          scheduleData[scheduleIdx] = schedule
          setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
          break
      }
    }
  }

  const handleCancelThirdPartyModal = () => {
    setSelectedSchedule(undefined)
    setSelectedCourseType(undefined)
    setShowThirdPartyProviderModal(false)
    setSelectedThridPartyProvider(undefined)
  }

  const handleSaveThirdPartyModal = (item: ThirdPartyProvider) => {
    setShowThirdPartyProviderModal(false)
    if (selectedSchedule) {
      const schedule = { ...selectedSchedule }
      const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule?.period)
      schedule.CourseType = selectedCourseType
      schedule.ThirdParty = item
      delete schedule.OnSiteSplitEnrollment
      delete schedule.Course
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
    }
    setSelectedSchedule(undefined)
    setSelectedCourseType(undefined)
    setSelectedThridPartyProvider(undefined)
  }

  const handleCancelOnSplitEnrollmentModal = () => {
    setSelectedSchedule(undefined)
    setShowOnSiteSplitEnrollmentModal(false)
    setSelectedOnSiteSplitEnrollment(undefined)
  }

  const handleSaveOnSplitEnrollmentModal = (item: OnSiteSplitEnrollment) => {
    if (selectedSchedule) {
      const schedule = { ...selectedSchedule }
      const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule?.period)
      schedule.OnSiteSplitEnrollment = item
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
    }
    setSelectedSchedule(undefined)
    setShowOnSiteSplitEnrollmentModal(false)
    setSelectedOnSiteSplitEnrollment(undefined)
  }

  const handleSaveCustomBuiltDescription = (description: string) => {
    if (selectedSchedule) {
      const scheduleIdx = scheduleData.findIndex((item) => item.period === selectedSchedule.period)
      selectedSchedule.CourseType = CourseType.CUSTOM_BUILT
      selectedSchedule.CustomBuiltDescription = description
      delete selectedSchedule.Course
      scheduleData[scheduleIdx] = selectedSchedule
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
      if (course.display_notification) {
        setCourseNotification(course.course_notification)
      }
      if (course.reduce_funds !== ReduceFunds.NONE) {
        setCourseReduceFundsNotification(course.reduce_funds_notification)
      }
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
              !item.rawData.OnSiteSplitEnrollment &&
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
            {item.rawData.CourseType === CourseType.MTH_DIRECT && item.rawData.OnSiteSplitEnrollment && (
              <Box sx={scheduleBuilderClasses.descriptionWrap}>
                <Box>
                  <Typography sx={scheduleBuilderClasses.tableContent}>
                    {item.rawData.OnSiteSplitEnrollment.districtSchool}
                  </Typography>
                  <Typography sx={scheduleBuilderClasses.tableContent}>
                    {item.rawData.OnSiteSplitEnrollment.schoolDistrictName}
                  </Typography>
                  <Typography sx={scheduleBuilderClasses.tableContent}>
                    {item.rawData.OnSiteSplitEnrollment.courseName}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title='Edit' placement='top'>
                    <IconButton
                      sx={scheduleBuilderClasses.editButton}
                      onClick={() => {
                        setShowOnSiteSplitEnrollmentModal(true)
                        setSelectedOnSiteSplitEnrollment(item.rawData.OnSiteSplitEnrollment)
                        setSelectedSchedule(item.rawData)
                      }}
                    >
                      <ModeEditIcon sx={scheduleBuilderClasses.editIcon} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
            {item.rawData.CourseType === CourseType.THIRD_PARTY_PROVIDER && item.rawData.ThirdParty && (
              <Box sx={scheduleBuilderClasses.descriptionWrap}>
                <Box>
                  <Typography sx={scheduleBuilderClasses.tableContent}>
                    {item.rawData.ThirdParty?.providerName}
                  </Typography>
                  <Typography sx={scheduleBuilderClasses.tableContent}>
                    {item.rawData.ThirdParty?.courseName}
                  </Typography>
                  <Typography sx={scheduleBuilderClasses.tableContent}>
                    {item.rawData.ThirdParty?.phoneNumber}
                  </Typography>
                  <Typography sx={scheduleBuilderClasses.tableContent}>
                    {item.rawData.ThirdParty?.specificCourseWebsite}
                  </Typography>
                  {item.rawData.ThirdParty?.additionalWebsite?.map((item, index) => (
                    <Typography key={index} sx={scheduleBuilderClasses.tableContent}>
                      {item.value}
                    </Typography>
                  ))}
                </Box>
                <Box>
                  <Tooltip title='Edit' placement='top'>
                    <IconButton
                      sx={scheduleBuilderClasses.editButton}
                      onClick={() => {
                        setShowThirdPartyProviderModal(true)
                        setSelectedThridPartyProvider(item.rawData.ThirdParty)
                        setSelectedSchedule(item.rawData)
                        setSelectedCourseType(item.rawData?.CourseType)
                      }}
                    >
                      <ModeEditIcon sx={scheduleBuilderClasses.editIcon} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
            {item.rawData.CourseType === CourseType.CUSTOM_BUILT && !!item.rawData.CustomBuiltDescription && (
              <Box sx={scheduleBuilderClasses.descriptionWrap}>
                <Typography
                  sx={scheduleBuilderClasses.tableContent}
                  component={'span'}
                  variant={'body2'}
                  dangerouslySetInnerHTML={{ __html: item.rawData.CustomBuiltDescription }}
                />
                <Tooltip title='Edit' placement='top'>
                  <IconButton
                    sx={scheduleBuilderClasses.editButton}
                    onClick={() => {
                      setSelectedSchedule(item.rawData)
                      setShowCustomBuilt(true)
                    }}
                  >
                    <ModeEditIcon sx={scheduleBuilderClasses.editIcon} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
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

    if (schedule.CourseType === CourseType.MTH_DIRECT) {
      if (schedule.Title?.Providers?.length === 1) {
        const provider = schedule.Title?.Providers[0]
        if (provider.Courses?.length === 1) {
          schedule.Course = provider.Courses[0]
        }
      }
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

  const showQuestionTooltip = () => {
    setEnableQuestionTooltip(true)
  }
  const closeQuestionTooltip = () => {
    setEnableQuestionTooltip(false)
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
                  reduce_funds: providersData[key]?.[0].Provider?.reduce_funds,
                  reduce_funds_notification: providersData[key]?.[0].Provider?.reduce_funds_notification,
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
                    reduce_funds: providersData[key]?.[0].Provider?.reduce_funds,
                    reduce_funds_notification: providersData[key]?.[0].Provider?.reduce_funds_notification,
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
        {!scheduleBuilderSettingLoading && (
          <ClickAwayListener onClickAway={closeQuestionTooltip}>
            <StyledTooltip
              title={parse(scheduleBuilderSettingData.getScheduleBuilder.parent_tooltip)}
              open={enableQuestionTooltip}
              onClose={closeQuestionTooltip}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <IconButton
                size='large'
                edge='start'
                aria-label='open drawer'
                sx={[{ mr: 2 }, scheduleBuilderClasses.questionButton]}
                onClick={showQuestionTooltip}
              >
                <QuestionMarkIcon />
              </IconButton>
            </StyledTooltip>
          </ClickAwayListener>
        )}
        {enableQuestionTooltip && <StyledTooltipBgDiv />}
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
      {!!courseNotification && (
        <CustomModal
          title={MthTitle.NOTIFICATION}
          description={extractContent(courseNotification || '')}
          confirmStr='Ok'
          showIcon={false}
          showCancel={false}
          backgroundColor={MthColor.WHITE}
          onClose={() => setCourseNotification(undefined)}
          onConfirm={() => setCourseNotification(undefined)}
        />
      )}
      {!courseNotification && !!courseReduceFundsNotification && (
        <CustomModal
          title={MthTitle.REDUCES_FUNDS}
          description={extractContent(courseReduceFundsNotification || '')}
          confirmStr='Ok'
          showIcon={false}
          showCancel={false}
          backgroundColor={MthColor.WHITE}
          onClose={() => setCourseReduceFundsNotification(undefined)}
          onConfirm={() => setCourseReduceFundsNotification(undefined)}
        />
      )}
      {showThirdPartyProviderModal && (
        <ThirdPartyProviderEdit
          thirdPartyProvider={selectedThridPartyProvider}
          handleSaveAction={handleSaveThirdPartyModal}
          handleCancelAction={handleCancelThirdPartyModal}
        />
      )}
      {showOnSiteSplitEnrollmentModal && (
        <OnSiteSplitEnrollmentEdit
          onSiteSplitEnrollment={selectedOnSiteSplitEnrollemnt}
          handleCancelAction={handleCancelOnSplitEnrollmentModal}
          handleSaveAction={handleSaveOnSplitEnrollmentModal}
        />
      )}
      {showCustomBuilt && !!selectedSchedule && (
        <CustomBuiltDescriptionEdit
          setShowEditModal={setShowCustomBuilt}
          customBuiltDescription={
            selectedSchedule?.CustomBuiltDescription || selectedSchedule?.Title?.custom_built_description
          }
          onSave={handleSaveCustomBuiltDescription}
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
