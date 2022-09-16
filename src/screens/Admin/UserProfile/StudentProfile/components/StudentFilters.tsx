import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Grid, Select, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment'
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { StudentStatus } from '@mth/enums'
import { MTHBLUE, BLACK, BUTTON_LINEAR_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT } from '../../../../../utils/constants'
import { ActiveModal } from './ActiveModal'
import { WithdrawModal } from './WithdrawModal'

type StudentFiltersProps = {
  currentUserData: unknown
  setStudentStatuData: () => void
  originStudentStatus: unknown
  studentStatusData: unknown
  withdrawalStatus: unknown
  setWithdrawalStatus: () => void
  setIsChanged: () => void
}
const selectStyles = makeStyles({
  backgroundSelect: {
    fontSize: '12px',
    borderRadius: '8px',
    minWidth: '135px',
    height: '29px',
    textAlign: 'center',
    background: BUTTON_LINEAR_GRADIENT,
    color: '#F2F2F2 !important',
    '&:before': {
      borderColor: BUTTON_LINEAR_GRADIENT,
    },
    '&:after': {
      borderColor: BUTTON_LINEAR_GRADIENT,
    },
  },
  withdrawBackgroundSelect: {
    fontSize: '12px',
    borderRadius: '8px',
    minWidth: '135px',
    height: '29px',
    textAlign: 'center',
    background: RED_GRADIENT,
    color: '#F2F2F2 !important',
    '&:before': {
      borderColor: RED_GRADIENT,
    },
    '&:after': {
      borderColor: RED_GRADIENT,
    },
  },
  yellowBackgroundSelect: {
    fontSize: '12px',
    borderRadius: '8px',
    minWidth: '135px',
    height: '29px',
    textAlign: 'center',
    background: YELLOW_GRADIENT,
    color: '#F2F2F2 !important',
    '&:before': {
      borderColor: YELLOW_GRADIENT,
    },
    '&:after': {
      borderColor: YELLOW_GRADIENT,
    },
    '& > div': {
      paddingTop: 0,
      paddingBottom: 0,
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
    bgcolor: '#EEF4F8',
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
    color: BLACK,
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
    height: '39px',
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
    bgcolor: 'background.paper',
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
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
export const StudentFilters: React.FC<StudentFiltersProps> = ({
  currentUserData,
  setStudentStatuData,
  originStudentStatus,
  studentStatusData,
  withdrawalStatus,
  setWithdrawalStatus,
  setIsChanged,
}) => {
  const classes = useStyles
  const selectClasses = selectStyles()
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [applications, setApplications] = useState<unknown[]>([])
  const [studentStatus, setStudentStatus] = useState<unknown>()
  const [, setSpecialEd] = useState<unknown>()
  const [showWithdrawalModal, setShowWithdrawalModal] = useState<boolean>(false)
  const [showActiveModal, setShowActiveModal] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [diplomaSeeking, setDiplomaSeeking] = useState<unknown>('')
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
  const specialEds: DropDownItem[] = [
    {
      label: 'No',
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
    {
      label: 'Exit',
      value: 3,
    },
  ]
  const seeking: DropDownItem[] = [
    {
      label: 'No',
      value: 0,
    },
    {
      label: 'Yes',
      value: 1,
    },
  ]

  const handleChangeStudentStatus = (e) => {
    if (e.target.value == StudentStatus.ACTIVE || e.target.value == StudentStatus.PENDING) {
      if (originStudentStatus?.status == StudentStatus.WITHDRAWN) {
        setShowActiveModal(true)
      }
      setStudentStatus(studentStatusData.status)
      setStudentStatuData({ ...studentStatusData, ...{ status: e.target.value } })
    } else if (e.target.value == StudentStatus.WITHDRAWN) {
      if (originStudentStatus?.status == StudentStatus.ACTIVE || originStudentStatus?.status == StudentStatus.PENDING) {
        setShowWithdrawalModal(true)
      }
      setStudentStatus(studentStatusData.status)
      setStudentStatuData({ ...studentStatusData, ...{ status: e.target.value } })
    } else {
      setStudentStatus(e.target.value)
      setStudentStatuData({ ...studentStatusData, ...{ status: e.target.value } })
    }
  }

  const handleSelectWithdrawOption = (withdrawOption) => {
    setIsChanged(true)
    setStudentStatuData({ ...studentStatusData, ...{ withdrawOption: withdrawOption } })
    setShowWithdrawalModal(false)
  }

  const handleSelectActiveOption = (activeOption) => {
    setIsChanged(true)
    setStudentStatuData({ ...studentStatusData, ...{ activeOption: activeOption } })
    setShowActiveModal(false)
  }

  const handleWithdrawCancel = () => {
    setStudentStatuData({ ...studentStatusData, ...{ status: studentStatus } })
    setShowWithdrawalModal(false)
  }

  const handleActiveCancel = () => {
    setStudentStatuData({ ...studentStatusData, ...{ status: studentStatus } })
    setShowActiveModal(false)
  }

  useEffect(() => {
    if (currentUserData && currentUserData.student) {
      setApplications(currentUserData.student.applications)
    }
  }, [currentUserData])
  useEffect(() => {
    if (studentStatusData.diploma_seeking !== null && studentStatusData.diploma_seeking !== undefined) {
      setDiplomaSeeking(studentStatusData.diploma_seeking)
    }

    if (studentStatusData?.date) {
      setStatus([
        {
          label: ' ',
          value: 4,
        },
        {
          label:
            studentStatusData?.status == 5
              ? `Applied (${moment(studentStatusData?.date).format('MM/DD/YYYY')})`
              : 'Applied',
          value: StudentStatus.APPLIED,
        },
        {
          label:
            studentStatusData?.status == 0
              ? `Pending (${moment(studentStatusData?.date).format('MM/DD/YYYY')})`
              : 'Pending',
          value: StudentStatus.PENDING,
        },
        {
          label:
            studentStatusData?.status == 1
              ? `Active (${moment(studentStatusData?.date).format('MM/DD/YYYY')})`
              : 'Active',
          value: StudentStatus.ACTIVE,
        },
        {
          label:
            studentStatusData?.status == 2
              ? `Withdrawn (${moment(studentStatusData?.date).format('MM/DD/YYYY')})`
              : 'Withdrawn',
          value: StudentStatus.WITHDRAWN,
        },
      ])
    }

    if (studentStatusData.status == 2 && studentStatusData.withdrawOption && studentStatusData.withdrawOption > 0) {
      setStatus([
        {
          label: ' ',
          value: 4,
        },
        {
          label: 'Applied',
          value: StudentStatus.APPLIED,
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

    if (studentStatusData.status == 1 && studentStatusData.activeOption && studentStatusData.activeOption > 0) {
      setStatus([
        {
          label: ' ',
          value: 4,
        },
        {
          label: 'Applied',
          value: StudentStatus.APPLIED,
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: '24px',
      }}
    >
      <Grid container>
        <Grid xs={4} display={'flex'} flexDirection={'column'} textAlign='left'>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Subtitle fontWeight='700' sx={{ marginRight: '30px', marginBottom: '5px' }}>
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
                  studentStatusData?.status != 2
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
                  handleChangeStudentStatus(e)
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
                  <Paragraph sx={{ color: MTHBLUE, my: '5px', cursor: 'pointer' }} textAlign='center'>
                    Remove Withdraw Request
                  </Paragraph>
                </Box>
              )}
            </Box>
          </Box>
          <Box onClick={() => setShowDetails(!showDetails)}>
            <Paragraph sx={{ textDecoration: 'underline', color: MTHBLUE }}>
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
                  setWithdrawalStatus({})
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
            <Select
              displayEmpty
              className={selectClasses.backgroundSelect}
              IconComponent={KeyboardArrowDown}
              inputProps={{
                classes: {
                  icon: selectClasses.selectIcon,
                },
              }}
              value={diplomaSeeking}
              onChange={(e) => {
                setDiplomaSeeking(e.target.value)
                setStudentStatuData({ ...studentStatusData, ...{ diploma_seeking: e.target.value } })
              }}
            >
              <MenuItem value='' disabled>
                Select
              </MenuItem>
              {seeking.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        {showDetails && (
          <Grid item xs={12}>
            <Box sx={classes.content}>
              <Box sx={classes.formRow}>
                <Subtitle sx={classes.formLabel as Record<string, unknown>} fontWeight='500'>
                  Application
                  <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                </Subtitle>
                <Subtitle sx={{ ...(classes.formValue as Record<string, unknown>) }} fontWeight='500'>
                  {applications[0].status}{' '}
                  {applications[0].date_submitted
                    ? moment(applications[0].date_submitted).format('l')
                    : moment(applications[0].date_accepted).format('l')}
                </Subtitle>
              </Box>
              <Box sx={classes.formRow}>
                <Subtitle sx={classes.formLabel as Record<string, unknown>} fontWeight='500'>
                  Date of Birth
                  <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                </Subtitle>
                <Subtitle sx={classes.formValue as Record<string, unknown>} fontWeight='500'>
                  {currentUserData.student.person.date_of_birth &&
                    moment(currentUserData.student.person.date_of_birth).format('l')}
                  {currentUserData.student.person.date_of_birth &&
                    `(${moment().diff(currentUserData.student.person.date_of_birth, 'years')})`}
                </Subtitle>
              </Box>
              {applications.map((application, idx) => (
                <Box sx={classes.formRow} key={idx}>
                  <Subtitle sx={classes.formLabel as Record<string, unknown>} fontWeight='500'>
                    {application.midyear_application
                      ? `${moment(application.school_year.date_begin).format('YYYY')}-${moment(
                          application.school_year.date_end,
                        ).format('YY')} Mid-year`
                      : `${moment(application.school_year.date_begin).format('YYYY')}-${moment(
                          application.school_year.date_end,
                        ).format('YY')}`}
                    <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                  </Subtitle>
                  <Box sx={classes.formRow}>
                    <Subtitle sx={classes.formValue as Record<string, unknown>} fontWeight='500'>
                      {currentUserData.student.grade_levels &&
                        ordinal(currentUserData.student.grade_levels[0].grade_level)}{' '}
                      Grade
                      <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                    </Subtitle>
                    {/* <Subtitle sx={classes.formValue as Record<string, unknown>} fontWeight='500'></Subtitle> */}
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
