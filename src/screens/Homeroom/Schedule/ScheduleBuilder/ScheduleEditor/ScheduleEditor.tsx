import React, { useEffect, useState } from 'react'
import { Close, Check } from '@mui/icons-material'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import { ClickAwayListener, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import parse from 'html-react-parser'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { NestedDropdown } from '@mth/components/NestedDropdown'
import { MenuItemData } from '@mth/components/NestedDropdown/types'
import { COURSE_TYPE_ITEMS, RICH_TEXT_VALID_MIN_LENGTH } from '@mth/constants'
import { CourseType, MthColor, MthTitle, ReduceFunds, ScheduleStatus } from '@mth/enums'
import { makeProviderData } from '@mth/hooks'
import { CustomBuiltDescriptionEdit } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/CustomBuiltDescription'
import { extractContent, gradeShortText } from '@mth/utils'
import { Course, Period, ScheduleData, Subject, Title } from '../../types'
import { OnSiteSplitEnrollmentEdit } from '../OnSiteSplitEnrollmentEdit'
import { OnSiteSplitEnrollment } from '../OnSiteSplitEnrollmentEdit/types'
import { scheduleBuilderClasses } from '../styles'
import { ThirdPartyProviderEdit } from '../ThirdPartyProviderEdit'
import { ThirdPartyProvider } from '../ThirdPartyProviderEdit/types'
import { ScheduleEditorProps } from './types'

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

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  scheduleData,
  setScheduleData,
  isAdmin = false,
  isEditMode = false,
  setIsChanged,
  splitEnrollment,
  parentTooltip,
  scheduleStatus,
  selectedScheduleStatus,
  isUpdatePeriodRequired,
  handlePeriodUpdateRequired,
  handlePeriodUpdateEmail,
}) => {
  const [tableData, setTableData] = useState<MthTableRowItem<ScheduleData>[]>([])
  const [periodNotification, setPeriodNotification] = useState<string | undefined>()
  const [subjectNotification, setSubjectNotification] = useState<string | undefined>()
  const [subjectReduceFundsNotification, setSubjectReduceFundsNotification] = useState<string | undefined>()
  const [courseNotification, setCourseNotification] = useState<string | undefined>()
  const [courseReduceFundsNotification, setCourseReduceFundsNotification] = useState<string | undefined>()
  const [showThirdPartyProviderModal, setShowThirdPartyProviderModal] = useState<boolean>(false)
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData>()
  const [selectedPeriod, setSelectedPeriod] = useState<Period>()
  const [selectedCourseType, setSelectedCourseType] = useState<CourseType>()
  const [selectedThirdPartyProvider, setSelectedThirdPartyProvider] = useState<ThirdPartyProvider>()
  const [showOnSiteSplitEnrollmentModal, setShowOnSiteSplitEnrollmentModal] = useState<boolean>(false)
  const [selectedOnSiteSplitEnrollment, setSelectedOnSiteSplitEnrollment] = useState<OnSiteSplitEnrollment>()
  const [showCustomBuilt, setShowCustomBuilt] = useState<boolean>(false)
  const [enableQuestionTooltip, setEnableQuestionTooltip] = useState<boolean>(false)
  const [multiPeriodsNotification, setMultiPeriodsNotification] = useState<string | undefined>()
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>()
  const [fields, setFields] = useState<MthTableField<ScheduleData>[]>([])
  const [lockedIcon, setLockedIcon] = useState(true)

  const createPeriodMenuItems = (schedule: ScheduleData): MenuItemData => {
    const menuItemsData: MenuItemData = {
      label: schedule.Period?.category || (
        <Typography sx={{ ...scheduleBuilderClasses.tableContent, color: MthColor.MTHBLUE }}>Select</Typography>
      ),
      items: [],
    }
    schedule.filteredPeriods?.forEach((period) => {
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
    const providers = schedule.Title?.Providers || schedule.Subject?.Providers
    providers?.forEach((provider) => {
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
    })
    if (splitEnrollment && !schedule.Provider?.multiple_periods) {
      menuItemsData.items?.push({
        label: MthTitle.ON_SITE_SPLIT_ENROLLMENT,
        callback: () => {
          setShowOnSiteSplitEnrollmentModal(true)
          setSelectedSchedule(schedule)
        },
      })
    }
    return menuItemsData
  }

  const handleSelectPeriod = (schedule: ScheduleData, period: Period) => {
    const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule.period)
    if (scheduleIdx > -1) {
      if (schedule.Period?.id === period.id) return
      if (period.notify_period) {
        setPeriodNotification(period.message_period)
        setSelectedSchedule(schedule)
        setSelectedPeriod(period)
      } else {
        schedule.Period = period
        delete schedule.Subject
        delete schedule.Title
        delete schedule.CourseType
        delete schedule.Course
        delete schedule.OnSiteSplitEnrollment
        delete schedule.CustomBuiltDescription
        delete schedule.ThirdParty
        scheduleData[scheduleIdx] = schedule
        setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
        setIsChanged(true)
      }
    }
  }

  const handleSaveSelectedPeriod = () => {
    if (selectedSchedule && selectedPeriod) {
      const schedule = { ...selectedSchedule }
      const scheduleIdx = scheduleData.findIndex((item) => item.period === schedule.period)
      if (scheduleIdx > -1) {
        schedule.Period = selectedPeriod
        delete schedule.Subject
        delete schedule.Title
        delete schedule.CourseType
        delete schedule.Course
        delete schedule.OnSiteSplitEnrollment
        delete schedule.CustomBuiltDescription
        delete schedule.ThirdParty
        scheduleData[scheduleIdx] = schedule
        handleCancelSelectedPeriod()
        setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
        setIsChanged(true)
      }
    }
  }

  const handleCancelSelectedPeriod = () => {
    setSelectedSchedule(undefined)
    setSelectedPeriod(undefined)
    setPeriodNotification(undefined)
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
      setIsChanged(true)
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
          delete schedule.CustomBuiltDescription
          delete schedule.ThirdParty
          scheduleData[scheduleIdx] = schedule
          setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
          break
      }
      setIsChanged(true)
    }
  }

  const handleCancelThirdPartyModal = () => {
    setSelectedSchedule(undefined)
    setSelectedCourseType(undefined)
    setShowThirdPartyProviderModal(false)
    setSelectedThirdPartyProvider(undefined)
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
      delete schedule.CustomBuiltDescription
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
      setIsChanged(true)
    }
    setSelectedSchedule(undefined)
    setSelectedCourseType(undefined)
    setSelectedThirdPartyProvider(undefined)
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
      delete schedule.Course
      delete schedule.CustomBuiltDescription
      delete schedule.ThirdParty
      scheduleData[scheduleIdx] = schedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
    }
    setSelectedSchedule(undefined)
    setShowOnSiteSplitEnrollmentModal(false)
    setSelectedOnSiteSplitEnrollment(undefined)
    setIsChanged(true)
  }

  const handleSaveCustomBuiltDescription = (description: string) => {
    if (selectedSchedule) {
      const scheduleIdx = scheduleData.findIndex((item) => item.period === selectedSchedule.period)
      selectedSchedule.CourseType = CourseType.CUSTOM_BUILT
      selectedSchedule.CustomBuiltDescription = description
      delete selectedSchedule.Course
      scheduleData[scheduleIdx] = selectedSchedule
      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
      setIsChanged(true)
    }
  }

  const handleSelectCourse = (schedule: ScheduleData, course: Course, multiPeriodsConfirmed?: boolean) => {
    const scheduleIdx = scheduleData?.findIndex((item) => item.period === schedule.period)
    if (scheduleIdx > -1) {
      if (schedule.Course?.id === course.id) return
      if (
        course.Provider?.multiple_periods &&
        !multiPeriodsConfirmed &&
        course.Provider.multi_periods_notification?.length >= RICH_TEXT_VALID_MIN_LENGTH
      ) {
        // The multiple periods notification should show on the parent end
        // when they select a provider that requires multiple periods for the first time
        setSelectedSchedule(schedule)
        setSelectedCourse(course)
        setMultiPeriodsNotification(course.Provider.multi_periods_notification)
        return
      }

      schedule.Course = course
      delete schedule.OnSiteSplitEnrollment
      delete schedule.CustomBuiltDescription
      delete schedule.ThirdParty
      scheduleData[scheduleIdx] = schedule
      if (course.display_notification) {
        setCourseNotification(course.course_notification)
      }
      if (course.reduce_funds !== ReduceFunds.NONE) {
        setCourseReduceFundsNotification(course.reduce_funds_notification)
      }

      setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
      setIsChanged(true)
    }
  }

  const editable = (schedule: ScheduleData) => {
    return !scheduleStatus || scheduleStatus === ScheduleStatus.DRAFT || schedule.editable || isAdmin
  }

  const setMultiPeriods = (schedules: ScheduleData[]): ScheduleData[] => {
    schedules.forEach((schedule) => {
      if (schedule.Course?.Provider?.multiple_periods) {
        const multiProvider = schedule.Course?.Provider
        const multiPeriods = schedule.Course?.Provider?.Periods.reduce((acc: number[], cur) => {
          return acc.concat([cur.period])
        }, [])
        schedules.map((item) => {
          if (item.Provider?.id !== multiProvider.id && multiPeriods.findIndex((x) => x === item.period) > -1) {
            item.Provider = multiProvider
          }
        })
      }
    })
    return schedules
  }

  const resetMultiPeriods = (schedule: ScheduleData) => {
    const multiPeriods = (schedule.Provider?.Periods || []).reduce((acc: number[], cur) => {
      return acc.concat([cur.period])
    }, [])
    scheduleData.map((item) => {
      if (multiPeriods.findIndex((x) => x === item.period) > -1) {
        delete item.Provider
        delete item.Course
      }
    })
    setScheduleData(JSON.parse(JSON.stringify(scheduleData)))
  }

  const processScheduleData = (schedule: ScheduleData): ScheduleData => {
    // Have to filter options when multi periods provider is selected
    const multiProvider = schedule.Provider?.multiple_periods ? schedule.Provider : undefined

    schedule.filteredPeriods = (schedule.Periods || []).filter((item) =>
      multiProvider ? multiProvider.Periods.findIndex((x) => x.id === item.id) > -1 : true,
    )

    if (schedule.filteredPeriods?.length === 1) {
      //schedule.Period = schedule.filteredPeriods[0]
    } else if (!schedule.filteredPeriods?.length) {
      delete schedule.Period
    }

    if (schedule.Period) {
      // Update Period with original data
      schedule.Period = JSON.parse(
        JSON.stringify(schedule.filteredPeriods?.find((item) => item.id === schedule.Period?.id)),
      )
    }

    if (multiProvider && schedule.Period) {
      schedule.Period.Subjects = schedule.Period.Subjects.filter(
        (subject) =>
          (subject.Titles || subject.AltTitles).filter(
            (title) =>
              title.Courses.concat(title.AltCourses).findIndex((course) => course.provider_id === multiProvider.id) >
              -1,
          ).length > 0,
      )
      schedule.Period.Subjects.map((subject) => {
        subject.Titles = subject.Titles.filter(
          (title) =>
            title.Courses.concat(title.AltCourses).findIndex((course) => course.provider_id === multiProvider.id) > -1,
        )
        subject.AltTitles = subject.AltTitles.filter(
          (title) =>
            title.Courses.concat(title.AltCourses).findIndex((course) => course.provider_id === multiProvider.id) > -1,
        )
        subject.Titles.concat(subject.AltTitles).map((title) => {
          title.Courses = title.Courses.filter((course) => course.provider_id === multiProvider.id)
          title.AltCourses = title.AltCourses.filter((course) => course.provider_id === multiProvider.id)
        })
        subject.Courses = subject.Courses.filter((course) => course.provider_id === multiProvider.id)
        subject.AltCourses = subject.AltCourses.filter((course) => course.provider_id === multiProvider.id)
      })
    }

    let newSubject: Subject | undefined = undefined
    let newTitle: Title | undefined = undefined
    let newCourse: Course | undefined = undefined
    schedule.Period?.Subjects.map((subject) => {
      subject.Providers = makeProviderData(subject.Courses, subject.AltCourses)
      if (subject.subject_id === schedule.Subject?.subject_id) {
        newSubject = subject
      }
      subject.Courses.concat(subject.AltCourses).map((course) => {
        if (course.id === schedule.Course?.id) {
          schedule.Course = course
        }
      })
      subject.Titles.concat(subject.AltTitles).map((title) => {
        title.Providers = makeProviderData(title.Courses, title.AltCourses)
        if (title.title_id === schedule.Title?.title_id) {
          newTitle = title
        }
        title.Courses.concat(title.AltCourses).map((course) => {
          if (course.id === schedule.Course?.id) {
            newCourse = course
          }
        })
      })
    })
    schedule.Subject = newSubject
    schedule.Title = newTitle
    schedule.Course = newCourse

    if (schedule.Period?.Subjects?.length === 1) {
      const subject = schedule.Period.Subjects[0]
      if (!(subject.Titles || subject.AltTitles)?.length && !schedule.Subject) {
        schedule.Subject = subject
        delete schedule.Title
      } else if (subject.Titles?.length === 1 && !schedule.Title) {
        schedule.Title = subject.Titles[0]
        delete schedule.Subject
      }
    } else if (!schedule.Period?.Subjects?.length) {
      delete schedule.Subject
      delete schedule.Title
    }

    if (schedule.Title?.CourseTypes?.length === 1) {
      schedule.CourseType = schedule.Title.CourseTypes[0].value as CourseType
    }

    if ((schedule.Subject || schedule.Title) && multiProvider) {
      schedule.CourseType = CourseType.MTH_DIRECT
    }

    if (schedule.CourseType === CourseType.MTH_DIRECT) {
      const providers = schedule.Title?.Providers || schedule.Subject?.Providers
      if (providers?.length === 1) {
        const provider = providers[0]
        if (provider.Courses?.length === 1 && !provider.AltCourses?.length) {
          schedule.Course = provider.Courses[0]
        }
      }
    }

    return schedule
  }

  const createData = (schedule: ScheduleData): MthTableRowItem<ScheduleData> => {
    schedule = processScheduleData(schedule)
    return {
      key: `schedule-${schedule.period}`,
      columns: {
        Type: 'Lorem',
        Description: 'Lorem',
      },
      rawData: schedule,
      sx: isAdmin
        ? schedule?.updateRequired
          ? (scheduleStatus === ScheduleStatus.ACCEPTED ||
              selectedScheduleStatus === ScheduleStatus.UPDATES_REQUIRED) &&
            isUpdatePeriodRequired
            ? { '& .MuiTableCell-root': { background: 'rgba(236, 89, 37, 0.1) !important' } }
            : scheduleStatus === ScheduleStatus.RESUBMITTED
            ? {
                '& .MuiTableCell-root': { background: '#FFFFFF !important' },
              }
            : scheduleStatus === ScheduleStatus.UPDATES_REQUESTED
            ? {
                '& .MuiTableCell-root': { background: 'rgba(65, 69, 255, 0.2) !important' },
              }
            : {}
          : (scheduleStatus === ScheduleStatus.RESUBMITTED &&
              selectedScheduleStatus != ScheduleStatus.UPDATES_REQUIRED) ||
            scheduleStatus === ScheduleStatus.UPDATES_REQUESTED
          ? { '& .MuiTableCell-root': { background: '#F2F2F2 !important' } }
          : {}
        : isEditMode && schedule.editable
        ? { '& .MuiTableCell-root': { background: 'rgba(236, 89, 37, 0.1) !important' } }
        : {},
    }
  }

  useEffect(() => {
    const defaultFields = [
      {
        key: 'Period',
        label: 'Period',
        sortable: false,
        tdClass: '',
        width: '20%',
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
                  {editable(item.rawData) && item.rawData.filteredPeriods?.length > 0 ? (
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
        width: '20%',
        formatter: (item: MthTableRowItem<ScheduleData>) => {
          return (
            <Box>
              {!!item.rawData.Period &&
                (editable(item.rawData) &&
                (item.rawData.Period.Subjects?.length > 1 ||
                  (item.rawData.Period.Subjects?.length === 1 &&
                    (item.rawData.Period.Subjects?.[0]?.Titles?.length > 1 ||
                      item.rawData.Period.Subjects?.[0]?.AltTitles?.length))) ? (
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
        width: '20%',
        formatter: (item: MthTableRowItem<ScheduleData>) => {
          return (
            <Box>
              {editable(item.rawData) &&
              !item.rawData.Provider?.multiple_periods &&
              !!item.rawData.Title &&
              item.rawData.Title.CourseTypes?.length > 1 ? (
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
        width: '40%',
        formatter: (item: MthTableRowItem<ScheduleData>) => {
          return (
            <Box>
              {item.rawData.CourseType === CourseType.MTH_DIRECT && !item.rawData.OnSiteSplitEnrollment && (
                <>
                  {!!item.rawData.Title && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      {item.rawData.Title.Providers?.length > 1 ||
                      (editable(item.rawData) &&
                        item.rawData.Title.Providers?.length === 1 &&
                        (item.rawData.Title.Providers?.[0]?.Courses?.length > 1 ||
                          !!item.rawData.Title.Providers?.[0]?.AltCourses?.length)) ? (
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
                      )}
                      {item.rawData.Provider?.multiple_periods && (
                        <Typography
                          sx={{
                            ...scheduleBuilderClasses.tableContent,
                            color: MthColor.MTHBLUE,
                            cursor: 'pointer',
                            mt: 'auto',
                          }}
                          onClick={() => resetMultiPeriods(item.rawData)}
                        >
                          Reset Course Options
                        </Typography>
                      )}
                    </Box>
                  )}
                  {!!item.rawData.Subject && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      {item.rawData.Subject.Providers?.length > 1 ||
                      (editable(item.rawData) &&
                        item.rawData.Subject.Providers?.length === 1 &&
                        (item.rawData.Subject.Providers?.[0]?.Courses?.length > 1 ||
                          !!item.rawData.Subject.Providers?.[0]?.AltCourses?.length)) ? (
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
                      )}
                      {item.rawData.Provider?.multiple_periods && (
                        <Typography
                          sx={{
                            ...scheduleBuilderClasses.tableContent,
                            color: MthColor.MTHBLUE,
                            cursor: 'pointer',
                            mt: 'auto',
                          }}
                          onClick={() => resetMultiPeriods(item.rawData)}
                        >
                          Reset Course Options
                        </Typography>
                      )}
                    </Box>
                  )}
                </>
              )}
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
                  {editable(item.rawData) && (
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
                  )}
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
                  {editable(item.rawData) && (
                    <Box>
                      <Tooltip title='Edit' placement='top'>
                        <IconButton
                          sx={scheduleBuilderClasses.editButton}
                          onClick={() => {
                            setShowThirdPartyProviderModal(true)
                            setSelectedThirdPartyProvider(item.rawData.ThirdParty)
                            setSelectedSchedule(item.rawData)
                            setSelectedCourseType(item.rawData?.CourseType)
                          }}
                        >
                          <ModeEditIcon sx={scheduleBuilderClasses.editIcon} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
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
                  {editable(item.rawData) && (
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
                  )}
                </Box>
              )}
            </Box>
          )
        },
      },
    ]
    if (isAdmin)
      setFields([
        ...defaultFields,
        {
          key: 'CloseIcon',
          label: '',
          sortable: false,
          tdClass: '',
          formatter: (item: MthTableRowItem<ScheduleData>) => {
            return (
              <Box sx={{ display: 'flex' }}>
                {((scheduleStatus === ScheduleStatus.ACCEPTED && !item?.rawData?.updateRequired) ||
                  (scheduleStatus === ScheduleStatus.RESUBMITTED && !item?.rawData?.updateRequired) ||
                  scheduleStatus === ScheduleStatus.UPDATES_REQUESTED) && (
                  <IconButton
                    sx={{ color: MthColor.GREEN, fontSize: '18px' }}
                    onClick={() => {
                      if (handlePeriodUpdateRequired) handlePeriodUpdateRequired(`${item?.rawData?.Period?.id}`)
                    }}
                  >
                    <Check />
                  </IconButton>
                )}
                {(scheduleStatus == ScheduleStatus.SUBMITTED ||
                  (scheduleStatus == ScheduleStatus.ACCEPTED && item?.rawData?.updateRequired) ||
                  (scheduleStatus == ScheduleStatus.RESUBMITTED && item?.rawData?.updateRequired)) && (
                  <IconButton
                    sx={{ color: MthColor.MTHORANGE, fontSize: '18px' }}
                    onClick={() => {
                      if (handlePeriodUpdateEmail) {
                        handlePeriodUpdateEmail(`${item?.rawData?.Period?.id}`)
                      }
                    }}
                  >
                    <Close />
                  </IconButton>
                )}
              </Box>
            )
          },
        },
      ])
    else setFields(defaultFields)
  }, [isAdmin, scheduleStatus])

  useEffect(() => {
    if (scheduleData?.length) {
      setTableData(
        setMultiPeriods(scheduleData).map((item) => {
          return createData(item)
        }),
      )
    }
  }, [scheduleData])

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
        {parentTooltip && (
          <ClickAwayListener onClickAway={() => setEnableQuestionTooltip(false)}>
            <StyledTooltip
              title={parse(parentTooltip)}
              open={enableQuestionTooltip}
              onClose={() => setEnableQuestionTooltip(false)}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <IconButton
                size='large'
                edge='start'
                aria-label='open drawer'
                sx={[scheduleBuilderClasses.questionButton]}
                onClick={() => setEnableQuestionTooltip(true)}
              >
                <QuestionMarkIcon sx={{ fontSize: '20px', color: MthColor.BLACK }} />
              </IconButton>
            </StyledTooltip>
          </ClickAwayListener>
        )}
        {enableQuestionTooltip && <StyledTooltipBgDiv />}
        {isAdmin && (
          <IconButton
            sx={{ ...scheduleBuilderClasses.questionButton, backgroundColor: MthColor.LIGHTGRAY }}
            onClick={() => setLockedIcon(!lockedIcon)}
          >
            <VpnKeyOutlinedIcon sx={{ fontSize: '20px', color: lockedIcon ? MthColor.RED : MthColor.MTHBLUE }} />
          </IconButton>
        )}
      </Box>
      {!!periodNotification && (
        <CustomModal
          title={MthTitle.NOTIFICATION}
          description={extractContent(periodNotification || '')}
          confirmStr='Ok'
          cancelStr='Cancel'
          showIcon={false}
          backgroundColor={MthColor.WHITE}
          onClose={() => handleCancelSelectedPeriod()}
          onConfirm={() => handleSaveSelectedPeriod()}
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
      {!!selectedSchedule && !!selectedCourse && !!multiPeriodsNotification && (
        <CustomModal
          title='Multiple Periods Required'
          description={extractContent(multiPeriodsNotification || '')}
          confirmStr='Ok'
          showIcon={false}
          backgroundColor={MthColor.WHITE}
          onClose={() => setMultiPeriodsNotification(undefined)}
          onConfirm={() => {
            setMultiPeriodsNotification(undefined)
            handleSelectCourse(selectedSchedule, selectedCourse, true)
          }}
        />
      )}
      {showThirdPartyProviderModal && (
        <ThirdPartyProviderEdit
          thirdPartyProvider={selectedThirdPartyProvider}
          handleSaveAction={handleSaveThirdPartyModal}
          handleCancelAction={handleCancelThirdPartyModal}
        />
      )}
      {showOnSiteSplitEnrollmentModal && (
        <OnSiteSplitEnrollmentEdit
          onSiteSplitEnrollment={selectedOnSiteSplitEnrollment}
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
    </>
  )
}

export default ScheduleEditor
