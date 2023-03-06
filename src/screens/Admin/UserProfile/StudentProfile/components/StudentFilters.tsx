import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment-timezone'
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthDatePicker } from '@mth/components/MthDatePicker/MthDatePicker'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { ActivateOption, ApplicationStatus, MthColor, StudentStatus, WithdrawalOption } from '@mth/enums'
import { useDiplomaSeekingOptionsByStudentIdAndSchoolYearId } from '@mth/hooks'
import { Application, Student, Withdrawal } from '@mth/models'
import { calcAge, gradeText, showDate } from '@mth/utils'
import { StudentTemp } from '../StudentProfile'
import { ActiveModal } from './ActiveModal'
import { WithdrawModal } from './WithdrawModal'

type StudentFiltersProps = {
  student: Student
  setStudentStatuData: (value: StudentTemp) => void
  originStudentStatus: StudentTemp
  studentStatusData: StudentTemp
  withdrawalStatus: Withdrawal
  specialEdOptions: string[]
  setWithdrawalStatus: (value: Withdrawal | undefined) => void
  setIsChanged: (_: boolean) => void
}

const selectStyles = makeStyles({
  backgroundSelect: {
    fontSize: '12px',
    borderRadius: '8px!important',
    minWidth: '135px',
    height: '29px',
    textAlign: 'center',
    background: MthColor.BUTTON_LINEAR_GRADIENT,
    color: '#F2F2F2 !important',
    '&:before': {
      borderColor: MthColor.BUTTON_LINEAR_GRADIENT,
    },
    '&:after': {
      borderColor: MthColor.BUTTON_LINEAR_GRADIENT,
    },
    '& .MuiInputBase-input': {
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  withdrawBackgroundSelect: {
    fontSize: '12px',
    borderRadius: '8px!important',
    minWidth: '135px',
    height: '29px',
    textAlign: 'center',
    background: MthColor.RED_GRADIENT,
    color: '#F2F2F2 !important',
    '&:before': {
      borderColor: MthColor.RED_GRADIENT,
    },
    '&:after': {
      borderColor: MthColor.RED_GRADIENT,
    },
    '& .MuiInputBase-input': {
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  yellowBackgroundSelect: {
    fontSize: '12px',
    borderRadius: '8px!important',
    minWidth: '135px',
    height: '29px',
    textAlign: 'center',
    background: MthColor.YELLOW_GRADIENT,
    color: '#F2F2F2 !important',
    '&:before': {
      borderColor: MthColor.YELLOW_GRADIENT,
    },
    '&:after': {
      borderColor: MthColor.YELLOW_GRADIENT,
    },
    '& > div': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '& .MuiInputBase-input': {
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  selectIcon: {
    fill: '#F2F2F2 !important',
    color: '#F2F2F2 !important',
  },
  selectRoot: {
    color: '#F2F2F2 !important',
  },
})

const useStyles = {
  modalCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 850,
    backgroundColor: '#EEF4F8',
    boxShadow: 24,
    padding: '16px 32px',
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '200px',
  },
  close: {
    background: 'black',
    borderRadius: 1,
    color: 'white',
    cursor: 'pointer',
  },
  errorOutline: {
    background: '#FAFAFA',
    borderRadius: 1,
    color: MthColor.BLACK,
    marginBottom: 12,
    height: 42,
    width: 42,
  },
  content: {
    padding: '10px 0',
  },
  submitButton: {
    borderRadius: '8px',
    width: '90px',
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    paddingY: '10px',
    background: '#FAFAFA',
    '&:nth-child(even)': {
      background: '#fff',
      borderRadius: '8px',
    },
  },
  formLabel: {
    width: '155px',
    textAlign: 'center',
    position: 'relative',
    color: '#000000',
  },
  formValue: {
    padding: '0 30px',
    color: '#7b61ff',
    position: 'relative',
  },
  labelAfter: {
    width: 0,
    height: '23px',
    borderRight: '1px solid #000000',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  modalEmailCard: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 441,
    backgroundColor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  },
  emailRowHead: {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
  },
  emailRow: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
  },
  emailLabel: {
    width: '150px',
    display: 'flex',
    alignItems: 'center',
  },
  ok: {
    borderRadius: 10,
    width: '9px',
    height: '19px',
    marginTop: 4,
  },
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  student,
  setStudentStatuData,
  originStudentStatus,
  studentStatusData,
  withdrawalStatus,
  specialEdOptions,
  setWithdrawalStatus,
  setIsChanged,
}) => {
  const classes = useStyles
  const selectClasses = selectStyles()
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [originalStudentStatus, setOriginalStudentStatus] = useState<StudentStatus | undefined>()
  const [, setSpecialEd] = useState<number>()
  const [showWithdrawalModal, setShowWithdrawalModal] = useState<boolean>(false)
  const [showActiveModal, setShowActiveModal] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [diplomaSeeking, setDiplomaSeeking] = useState<number | null | undefined>()
  const [editingDOB, setEditingDOB] = useState<boolean>(false)
  const [status, setStatus] = useState<DropDownItem[]>([
    {
      label: ' ',
      value: 4,
    },
    {
      label: 'Applied',
      value: StudentStatus.APPLIED,
    },
    {
      label: 'Accepted',
      value: StudentStatus.ACCEPTED,
    },
    {
      label: 'Pending',
      value: StudentStatus.PENDING,
    },
    {
      label: 'Active',
      value: StudentStatus.ACTIVE,
    },
    {
      label: 'Withdrawn',
      value: StudentStatus.WITHDRAWN,
    },
  ])

  const [specialEds, setSpecialEds] = useState<DropDownItem[]>([
    {
      label: 'None',
      value: 0,
    },
    {
      label: 'IEP',
      value: 1,
    },
    {
      label: '504',
      value: 2,
    },
  ])

  const DIPLOMA_SEEKING_OPTIONS: DropDownItem[] = [
    {
      label: 'No',
      value: '0',
    },
    {
      label: 'Yes',
      value: '1',
    },
  ]

  const { diplomaAnswer, diplomaOptions } = useDiplomaSeekingOptionsByStudentIdAndSchoolYearId(
    studentStatusData?.school_year_id || 0,
    studentStatusData?.student_id,
    !studentStatusData?.student_id || !studentStatusData?.school_year_id,
  )

  const handleChangeStudentStatus = (status: StudentStatus) => {
    if (status == StudentStatus.ACTIVE || status == StudentStatus.PENDING) {
      if (originStudentStatus?.status == StudentStatus.WITHDRAWN) {
        setShowActiveModal(true)
      }
      setOriginalStudentStatus(studentStatusData.status)
      setStudentStatuData({ ...studentStatusData, ...{ status: status } })
    } else if (status == StudentStatus.WITHDRAWN) {
      if (originStudentStatus?.status == StudentStatus.ACTIVE || originStudentStatus?.status == StudentStatus.PENDING) {
        setShowWithdrawalModal(true)
      }
      setOriginalStudentStatus(studentStatusData.status)
      setStudentStatuData({ ...studentStatusData, ...{ status: status } })
    } else {
      setOriginalStudentStatus(status)
      setStudentStatuData({ ...studentStatusData, ...{ status: status } })
    }
  }

  const handleChangeBirthDay = (value: string | null) => {
    if (value) {
      setStudentStatuData({ ...studentStatusData, ...{ brith: value } })
    }
  }

  const handleSelectWithdrawOption = (withdrawOption: WithdrawalOption) => {
    setIsChanged(true)
    setStudentStatuData({ ...studentStatusData, ...{ withdrawOption: withdrawOption } })
    setShowWithdrawalModal(false)
  }

  const handleSelectActiveOption = (activeOption: ActivateOption) => {
    setIsChanged(true)
    setStudentStatuData({ ...studentStatusData, ...{ activeOption: activeOption } })
    setShowActiveModal(false)
  }

  const handleWithdrawCancel = () => {
    if (originalStudentStatus) setStudentStatuData({ ...studentStatusData, ...{ status: originalStudentStatus } })
    setShowWithdrawalModal(false)
  }

  const handleActiveCancel = () => {
    if (originalStudentStatus) setStudentStatuData({ ...studentStatusData, ...{ status: originalStudentStatus } })
    setShowActiveModal(false)
  }

  useEffect(() => {
    if (student) {
      setApplications(student.applications || [])
    }
  }, [student])

  useEffect(() => {
    if (specialEdOptions.length != 0) {
      const specialEdDropdowns: DropDownItem[] = []
      specialEdOptions.map((item, index): void => {
        specialEdDropdowns.push({
          label: item,
          value: index,
        })
      })
      setSpecialEds(specialEdDropdowns)
    }
  }, [specialEdOptions])

  useEffect(() => {
    if (studentStatusData?.date) {
      setStatus([
        {
          label: ' ',
          value: 4,
        },
        {
          label:
            studentStatusData?.status == StudentStatus.APPLIED || studentStatusData?.status == StudentStatus.REAPPLIED
              ? `${studentStatusData?.status == StudentStatus.REAPPLIED ? 'Applied (re-apply)' : 'Applied'} ${moment(
                  studentStatusData?.date,
                ).format('MM/DD/YYYY')}`
              : 'Applied',
          value: studentStatusData?.status == StudentStatus.REAPPLIED ? StudentStatus.REAPPLIED : StudentStatus.APPLIED,
        },
        {
          label:
            studentStatusData?.status == StudentStatus.ACCEPTED
              ? `Accepted ${moment(studentStatusData?.date).format('MM/DD/YYYY')}`
              : 'Accepted',
          value: StudentStatus.ACCEPTED,
        },
        {
          label:
            studentStatusData?.status == StudentStatus.PENDING
              ? `Pending ${moment(studentStatusData?.date).format('MM/DD/YYYY')}`
              : 'Pending',
          value: StudentStatus.PENDING,
        },
        {
          label:
            studentStatusData?.status == StudentStatus.ACTIVE
              ? `Active ${moment(studentStatusData?.date).format('MM/DD/YYYY')}`
              : 'Active',
          value: StudentStatus.ACTIVE,
        },
        {
          label:
            studentStatusData?.status == StudentStatus.WITHDRAWN
              ? `Withdrawn ${moment(studentStatusData?.date).format('MM/DD/YYYY')}`
              : 'Withdrawn',
          value: StudentStatus.WITHDRAWN,
        },
      ])
    }

    if (
      studentStatusData.status == StudentStatus.WITHDRAWN &&
      studentStatusData.withdrawOption &&
      studentStatusData.withdrawOption > 0
    ) {
      setStatus([
        {
          label: ' ',
          value: StudentStatus.NONE,
        },
        {
          label: 'Applied',
          value: StudentStatus.APPLIED,
        },
        {
          label: 'Accepted',
          value: StudentStatus.ACCEPTED,
        },
        {
          label: 'Pending',
          value: StudentStatus.PENDING,
        },
        {
          label: 'Active',
          value: StudentStatus.ACTIVE,
        },
        {
          label: `Withdrawn (${moment().format('MM/DD/YYYY')})`,
          value: StudentStatus.WITHDRAWN,
        },
      ])
    }

    if (studentStatusData.status == StudentStatus.ACTIVE && studentStatusData.activeOption) {
      setStatus([
        {
          label: ' ',
          value: StudentStatus.NONE,
        },
        {
          label: 'Applied',
          value: StudentStatus.APPLIED,
        },
        {
          label: 'Accepted',
          value: StudentStatus.ACCEPTED,
        },
        {
          label: 'Pending',
          value: StudentStatus.PENDING,
        },
        {
          label: `Active (${moment().format('MM/DD/YYYY')})`,
          value: StudentStatus.ACTIVE,
        },
        {
          label: 'Withdrawn',
          value: StudentStatus.WITHDRAWN,
        },
      ])
    }
  }, [studentStatusData])

  const onRemoveWithdrawalRequest = async () => {
    setShowConfirmModal(true)
  }

  useEffect(() => {
    if (diplomaOptions) {
      setDiplomaSeeking(diplomaAnswer)
    }
  }, [diplomaOptions, diplomaAnswer])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: '24px',
      }}
    >
      <Grid container>
        <Grid xs={4} display={'flex'} flexDirection={'column'} textAlign='left' sx={{ paddingRight: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Subtitle fontWeight='700' sx={{ marginRight: '16px', marginBottom: '5px' }}>
              {applications?.[0]?.midyear_application
                ? `${moment(applications[0].school_year.date_begin).format('YYYY')} - ${moment(
                    applications[0].school_year.date_end,
                  ).format('YY')} Mid-year Status`
                : applications?.[0]
                ? `${moment(applications[0].school_year.date_begin).format('YYYY')} - ${moment(
                    applications[0].school_year.date_end,
                  ).format('YY')} Status`
                : ''}
            </Subtitle>
            <Box>
              <Select
                className={
                  studentStatusData?.status != StudentStatus.WITHDRAWN
                    ? withdrawalStatus?.status == 'Requested'
                      ? selectClasses.yellowBackgroundSelect
                      : selectClasses.backgroundSelect
                    : selectClasses.withdrawBackgroundSelect
                }
                IconComponent={KeyboardArrowDown}
                inputProps={{
                  classes: {
                    icon: selectClasses.selectIcon,
                  },
                }}
                value={+studentStatusData.status}
                onChange={(e) => {
                  handleChangeStudentStatus(e.target.value as StudentStatus)
                }}
              >
                {status.map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    sx={{ height: '35px' }}
                    style={{
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {withdrawalStatus?.status == 'Requested' && (
                <Box onClick={() => onRemoveWithdrawalRequest()}>
                  <Paragraph sx={{ color: MthColor.MTHBLUE, my: '5px', cursor: 'pointer' }} textAlign='center'>
                    Remove Withdraw Request
                  </Paragraph>
                </Box>
              )}
            </Box>
          </Box>
          <Box onClick={() => setShowDetails(!showDetails)}>
            <Paragraph sx={{ textDecoration: 'underline', color: MthColor.MTHBLUE, cursor: 'pointer' }}>
              {showDetails ? 'Hide' : 'View'} Details
            </Paragraph>
          </Box>
          {showWithdrawalModal && (
            <WithdrawModal
              title='Withdraw'
              description='How would you like to proceed with this withdraw?'
              confirmStr='Withdraw'
              cancelStr='Cancel'
              onWithdraw={handleSelectWithdrawOption}
              onClose={() => handleWithdrawCancel()}
            />
          )}
          {showActiveModal && (
            <ActiveModal
              title='Reinstate'
              description='How would you like to proceed with reinstating this student?'
              confirmStr='Reinstate'
              cancelStr='Cancel'
              onActive={handleSelectActiveOption}
              onClose={() => handleActiveCancel()}
            />
          )}
          {showConfirmModal && (
            <CustomConfirmModal
              header='Remove Request'
              content='Are you sure you want to remove this Withdraw Request?'
              confirmBtnTitle='Delete'
              handleConfirmModalChange={(isOk: boolean) => {
                if (isOk) {
                  setWithdrawalStatus(undefined)
                  setStudentStatuData({ ...studentStatusData, ...{ activeOption: true } })
                }
                setShowConfirmModal(false)
              }}
            />
          )}
        </Grid>
        <Grid xs={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Subtitle textAlign='left' fontWeight='700' sx={{ marginRight: '30px', marginBottom: '5px' }}>
              Special Ed
            </Subtitle>
            <Select
              className={selectClasses.backgroundSelect}
              IconComponent={KeyboardArrowDown}
              inputProps={{
                classes: {
                  icon: selectClasses.selectIcon,
                },
              }}
              value={+studentStatusData.special_ed}
              onChange={(e) => {
                setSpecialEd(e.target.value)
                setStudentStatuData({ ...studentStatusData, ...{ special_ed: e.target.value } })
              }}
            >
              {specialEds.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        <Grid xs={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Subtitle textAlign='left' fontWeight='700' sx={{ marginRight: '30px', marginBottom: '5px' }}>
              Diploma Seeking
            </Subtitle>
            <DropDown
              sx={{
                padding: '0px 20px 4px 10px',
                background: MthColor.BUTTON_LINEAR_GRADIENT,
                height: '29px',
                borderRadius: '8px',
                textAlign: 'center',
                '& .MuiSelect-select': {
                  color: MthColor.WHITE,
                  fontWeight: 500,
                  fontSize: '14px',
                },
                '& .MuiSvgIcon-root': {
                  color: `${MthColor.WHITE} !important`,
                },
              }}
              dropDownItems={DIPLOMA_SEEKING_OPTIONS}
              defaultValue={`${diplomaSeeking}`}
              borderNone={true}
              setParentValue={(val) => {
                setDiplomaSeeking(+val || null)
                setStudentStatuData({ ...studentStatusData, ...{ diploma_seeking: +val } })
              }}
            />
          </Box>
        </Grid>
        {showDetails && (
          <Grid item xs={12}>
            <Box sx={classes.content}>
              <Box sx={classes.formRow}>
                <Subtitle sx={classes.formLabel} fontWeight='500'>
                  Application
                  <Box sx={classes.labelAfter}></Box>
                </Subtitle>
                <Subtitle sx={{ ...classes.formValue }} fontWeight='500'>
                  {applications[0].status}{' '}
                  {applications[0].status == ApplicationStatus.ACCEPTED
                    ? moment(applications[0].date_accepted).format('MM/DD/YYYY')
                    : moment(applications[0].date_submitted).format('MM/DD/YYYY')}
                </Subtitle>
              </Box>
              <Box sx={classes.formRow}>
                <Subtitle sx={classes.formLabel} fontWeight='500'>
                  Date of Birth
                  <Box sx={classes.labelAfter}></Box>
                </Subtitle>
                {!editingDOB ? (
                  <Subtitle
                    sx={{ ...classes.formValue, cursor: 'pointer' }}
                    fontWeight='500'
                    onClick={() => setEditingDOB(true)}
                  >
                    {showDate(studentStatusData?.brith)}
                    {studentStatusData?.brith && ` (${calcAge(studentStatusData?.brith)})`}
                  </Subtitle>
                ) : (
                  <Box sx={{ paddingX: '30px' }}>
                    <MthDatePicker
                      date={
                        studentStatusData?.brith?.includes('T')
                          ? studentStatusData?.brith?.split('T')[0]
                          : studentStatusData?.brith
                      }
                      label={'Date Of Birth'}
                      handleChange={handleChangeBirthDay}
                    />
                  </Box>
                )}
              </Box>
              {applications.map((application, idx) => (
                <Box sx={classes.formRow} key={idx}>
                  <Subtitle sx={classes.formLabel} fontWeight='500'>
                    {application.midyear_application
                      ? `${moment(application.school_year.date_begin).format('YYYY')}-${moment(
                          application.school_year.date_end,
                        ).format('YY')} Mid-year`
                      : `${moment(application.school_year.date_begin).format('YYYY')}-${moment(
                          application.school_year.date_end,
                        ).format('YY')}`}
                    <Box sx={classes.labelAfter}></Box>
                  </Subtitle>
                  <Box sx={classes.formRow}>
                    <Subtitle sx={classes.formValue} fontWeight='500'>
                      {gradeText(student)}
                      <Box sx={classes.labelAfter}></Box>
                    </Subtitle>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
