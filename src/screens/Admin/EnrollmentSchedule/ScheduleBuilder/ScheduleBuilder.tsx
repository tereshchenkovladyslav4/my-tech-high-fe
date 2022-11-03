import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Close, Check, Edit } from '@mui/icons-material'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import { Button, Card, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment'
import { Prompt, useHistory } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { NestedDropdown } from '@mth/components/NestedDropdown'
import { MenuItemData } from '@mth/components/NestedDropdown/types'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { COURSE_TYPE_ITEMS, SCHEDULE_STATUS_OPTIONS, SPECIAL_EDUCATIONS } from '@mth/constants'
import { CourseType, MthColor, MthTitle, ReduceFunds, ScheduleStatus } from '@mth/enums'
import { saveScheduleMutation } from '@mth/graphql/mutation/schedule'
import { saveSchedulePeriodMutation } from '@mth/graphql/mutation/schedule-period'
import { useCurrentSchoolYearByRegionId, useStudentSchedulePeriods } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { CustomBuiltDescriptionEdit } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/CustomBuiltDescription'
import { OnSiteSplitEnrollmentEdit } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/OnSiteSplitEnrollmentEdit'
import { OnSiteSplitEnrollment } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/OnSiteSplitEnrollmentEdit/types'
import { scheduleBuilderClasses } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/styles'
import { ThirdPartyProviderEdit } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/ThirdPartyProviderEdit'
import { ThirdPartyProvider } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/ThirdPartyProviderEdit/types'
import { Course, Period, ScheduleData, StudentScheduleInfo, Subject, Title } from '@mth/screens/Homeroom/Schedule/types'
import { StudentType } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { extractContent, gradeShortText, gradeText } from '@mth/utils'
import { ENROLLMENT_SCHEDULE } from '../../../../utils/constants'
import { getStudentDetail } from '../../UserProfile/services'
import Header from './Header/Header'
import StudentInfo from './StudentInfo/StudentInfo'
import { scheduleBuilderClass } from './styles'

type ScheduleBuilderProps = {
  studentId: number
}

const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({ studentId }) => {
  const { me } = useContext(UserContext)
  const history = useHistory()
  const [studentInfo, setStudentInfo] = useState<StudentScheduleInfo>()
  const [schoolYearItems, setSchoolYearItems] = useState<DropDownItem[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [scheduleStatus, setScheduleStatus] = useState<DropDownItem>()
  const [tableData, setTableData] = useState<MthTableRowItem<ScheduleData>[]>([])
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
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false)
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState<boolean>(false)
  const [splitEnrollment, setSplitEnrollment] = useState<boolean>(false)
  const [isChanged, setChanged] = useState(false)
  const [initScheduleStatus, setInitScheduleStatus] = useState<string>()
  const [lockedIcon, setLockedIcon] = useState(true)
  const [showReset, setShowReset] = useState(false)

  const { loading: studentInfoLoading, data: studentInfoData } = useQuery(getStudentDetail, {
    variables: {
      student_id: studentId,
    },
    fetchPolicy: 'network-only',
  })

  const { data: currentSchoolYear, loading: currentSchoolYearLoading } = useCurrentSchoolYearByRegionId(
    me?.selectedRegionId || 0,
  )

  const { scheduleData, studentScheduleId, studentScheduleStatus, setScheduleData, setStudentScheduleId } =
    useStudentSchedulePeriods(studentId, selectedYear)

  const [submitScheduleBuilder] = useMutation(saveScheduleMutation)
  const [saveDraft] = useMutation(saveSchedulePeriodMutation)

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
    })
    if (splitEnrollment) {
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
                <Box sx={{ marginTop: 'auto', marginBottom: 'auto' }}>
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
                <Box sx={{ marginTop: 'auto', marginBottom: 'auto' }}>
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
                  sx={{
                    ...scheduleBuilderClasses.tableContent,
                    width: '100%',
                    backgroundColor: item.rawData.IsChangedCustomBuiltDescription ? MthColor.LIGHTGREEN : '',
                  }}
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
    {
      key: 'EditIcon',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: () => {
        return (
          <Box sx={{ display: 'flex' }}>
            {studentScheduleStatus == ScheduleStatus.ACCEPTED && (
              <IconButton sx={{ color: MthColor.GREEN, fontSize: '18px' }}>
                <Edit />
              </IconButton>
            )}
          </Box>
        )
      },
    },
    {
      key: 'CloseIcon',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: () => {
        return (
          <Box sx={{ display: 'flex' }}>
            {studentScheduleStatus == ScheduleStatus.SUBMITTED && (
              <IconButton sx={{ color: MthColor.MTHORANGE, fontSize: '18px' }}>
                <Close />
              </IconButton>
            )}
            {studentScheduleStatus == ScheduleStatus.ACCEPTED && (
              <IconButton sx={{ color: MthColor.GREEN, fontSize: '18px' }}>
                <Check />
              </IconButton>
            )}
          </Box>
        )
      },
    },
  ]

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
          delete schedule.CustomBuiltDescription
          delete schedule.ThirdParty
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
      delete schedule.CustomBuiltDescription
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
      delete schedule.Course
      delete schedule.CustomBuiltDescription
      delete schedule.ThirdParty
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
      selectedSchedule.IsChangedCustomBuiltDescription = true
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
      delete schedule.OnSiteSplitEnrollment
      delete schedule.CustomBuiltDescription
      delete schedule.ThirdParty
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

  const preSelect = (schedule: ScheduleData): ScheduleData => {
    if (schedule.Periods?.length === 1 && !schedule.Period) {
      schedule.Period = schedule.Periods[0]
    }
    if (schedule.Period?.Subjects?.length === 1) {
      const subject = schedule.Period.Subjects[0]
      if (!subject.Titles?.length && !schedule.Subject) {
        schedule.Subject = subject
      } else if (subject.Titles?.length === 1 && !schedule.Title) {
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
      key: `schedule-${schedule.period}`,
      columns: {
        Type: 'Lorem',
        Description: 'Lorem',
      },
      rawData: schedule,
    }
  }

  const handleSave = async (kind: ScheduleStatus) => {
    if (scheduleData?.length) {
      const submitResponse = await submitScheduleBuilder({
        variables: {
          createScheduleInput: {
            SchoolYearId: Number(selectedYear),
            StudentId: Number(studentId),
            status: kind,
            schedule_id: studentScheduleId,
          },
        },
      })
      if (submitResponse) {
        const scheduleId = submitResponse.data?.createOrUpdateSchedule?.schedule_id
        setStudentScheduleId(scheduleId)
        const response = await saveDraft({
          variables: {
            createSchedulePeriodInput: {
              param: scheduleData?.map((item) => ({
                CourseId: Number(item?.Course?.id),
                PeriodId: Number(item?.Period?.id),
                ProviderId: Number(item?.Course?.Provider?.id),
                ScheduleId: Number(scheduleId),
                SubjectId: Number(item?.Subject?.subject_id),
                TitleId: Number(item?.Title?.title_id),
                course_type: item?.CourseType,
                custom_build_description: item?.CustomBuiltDescription,
                osse_coures_name: item?.OnSiteSplitEnrollment?.courseName,
                osse_district_school: item?.OnSiteSplitEnrollment?.districtSchool,
                osse_school_district_name: item?.OnSiteSplitEnrollment?.schoolDistrictName,
                schedule_period_id: item?.schedulePeriodId,
                tp_addtional_specific_course_website: item?.ThirdParty?.additionalWebsite
                  ? JSON.stringify(item.ThirdParty.additionalWebsite)
                  : '',
                tp_course_name: item?.ThirdParty?.courseName,
                tp_phone_number: item?.ThirdParty?.phoneNumber,
                tp_provider_name: item?.ThirdParty?.providerName,
                tp_specific_course_website: item?.ThirdParty?.specificCourseWebsite,
              })),
            },
          },
        })

        if (response) {
          switch (kind) {
            case ScheduleStatus.DRAFT:
              setIsDraftSaved(true)
              break
            case ScheduleStatus.SUBMITTED:
              setShowSubmitSuccessModal(true)
              break
          }
        }
      }
    }
  }

  const handleYearDropDown = (year: number) => {
    setSelectedYear(year)
  }

  const updateScheduleStatus = (num: string) => {
    const newStatus = SCHEDULE_STATUS_OPTIONS.find((item) => item.value === num) as DropDownItem
    setScheduleStatus(newStatus)
    if (num?.toLowerCase() !== initScheduleStatus?.toLowerCase()) {
      setChanged(true)
    } else {
      setChanged(false)
    }
  }

  const handleBack = () => {
    history.push(ENROLLMENT_SCHEDULE)
  }

  const handleSchedule = (status: ScheduleStatus) => {
    if (status === ScheduleStatus.ACCEPTED) {
      handleSave(ScheduleStatus.UPDATES_REQUIRED)
    } else if (status === ScheduleStatus.SUBMITTED) {
      handleSave(ScheduleStatus.ACCEPTED)
    }
  }

  const handleSaveChanges = () => {}

  const handleResetSchedule = () => {
    setShowReset(true)
  }

  useEffect(() => {
    if (!studentInfoLoading && studentInfoData) {
      const student: StudentType = studentInfoData?.student
      setStudentInfo({
        name: `${student?.person?.first_name} ${student?.person?.last_name}`,
        grade: gradeText(student),
        schoolDistrict: student?.packets?.at(-1)?.school_district || '',
        specialEd: `${SPECIAL_EDUCATIONS.find((item) => item.value == student?.special_ed)?.label}`,
      })
    }
  }, [studentInfoLoading, studentInfoData])

  useEffect(() => {
    if (!currentSchoolYearLoading && currentSchoolYear) {
      setSchoolYearItems([
        {
          value: currentSchoolYear.school_year_id,
          label: `${moment(currentSchoolYear.date_begin).format('YYYY')}-${moment(currentSchoolYear.date_end).format(
            'YY',
          )}`,
        },
      ])
      setSelectedYear(currentSchoolYear.school_year_id)
      setSplitEnrollment(currentSchoolYear?.ScheduleBuilder?.split_enrollment)
    }
  }, [currentSchoolYear, currentSchoolYearLoading])

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
    if (studentScheduleStatus) {
      setScheduleStatus(SCHEDULE_STATUS_OPTIONS.find((item) => item.value === studentScheduleStatus) as DropDownItem)
      setInitScheduleStatus(studentScheduleStatus)
    }
  }, [studentScheduleStatus])

  return (
    <Card sx={scheduleBuilderClass.main}>
      <Prompt
        when={isChanged}
        message={JSON.stringify({
          header: 'Unsaved Changes',
          content: 'Are you sure you want to leave without saving changes?',
        })}
      />
      <Header
        title={MthTitle.SCHEDULE}
        schoolYearItems={schoolYearItems}
        selectedYear={selectedYear}
        scheduleStatus={scheduleStatus}
        onSelectYear={handleYearDropDown}
        handleBack={handleBack}
      />
      <StudentInfo
        studentInfo={studentInfo}
        scheduleStatus={scheduleStatus}
        onUpdateScheduleStatus={updateScheduleStatus}
      />
      <Box sx={scheduleBuilderClass.table}>
        <MthTable items={tableData} fields={fields} isDraggable={false} checkBoxColor='secondary' />
        <IconButton sx={{ backgroundColor: MthColor.LIGHTGRAY }} onClick={() => setLockedIcon(!lockedIcon)}>
          <VpnKeyOutlinedIcon sx={{ fontSize: '20px', color: lockedIcon ? MthColor.RED : MthColor.MTHBLUE }} />
        </IconButton>
      </Box>
      <Box sx={scheduleBuilderClass.submit}>
        <Button
          variant='contained'
          sx={{
            background: `${
              scheduleStatus?.value == ScheduleStatus.ACCEPTED ? MthColor.ORANGE_GRADIENT : MthColor.GREEN_GRADIENT
            }`,
          }}
          onClick={() => handleSchedule(scheduleStatus?.value as ScheduleStatus)}
        >
          {scheduleStatus?.value == ScheduleStatus.ACCEPTED ? 'Require Updates' : MthTitle.ACCEPT}
        </Button>
        <Button variant='contained' sx={{ backgroundColor: MthColor.LIGHTGRAY }} onClick={() => handleSaveChanges()}>
          {MthTitle.SAVE_CHANGES}
        </Button>
        <Button variant='text' sx={{ fontWeight: 700, fontSize: '14px' }} onClick={() => handleResetSchedule()}>
          Reset Schedule
        </Button>
      </Box>
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
          handleSubmit={() => setIsDraftSaved(false)}
        />
      )}

      {showReset && (
        <CustomModal
          title={'Reset Schedule'}
          description={'Are you sure you want to reset this schedule?'}
          confirmStr='Reset'
          cancelStr='Cancel'
          onClose={() => {
            setShowReset(false)
          }}
          onConfirm={() => {
            setShowReset(false)
            handleSave(ScheduleStatus.NOT_SUBMITTED)
          }}
          backgroundColor='white'
        />
      )}

      {showSubmitSuccessModal && (
        <SuccessModal
          title='Success'
          subtitle={
            <Paragraph size='large' color={MthColor.SYSTEM_01} textAlign='center'>
              {`${studentInfo?.name}'s schedule has been submitted successfully and is pending approval.`}
            </Paragraph>
          }
          btntitle='Done'
          handleSubmit={() => setShowSubmitSuccessModal(false)}
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
    </Card>
  )
}

export default ScheduleBuilder
