import { Grid, Select, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { Title } from '../../../../../components/Typography/Title/Title'
import { MTHBLUE, BLACK, BUTTON_LINEAR_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT } from '../../../../../utils/constants'
import moment from 'moment'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../../components/DropDown/types'
import { makeStyles } from '@material-ui/styles'
import { KeyboardArrowDown } from '@mui/icons-material'
import { WithdrawModal } from './WithdrawModal'
import { ActiveModal } from './ActiveModal'
import {
  STUDENT_STATUS_ACTIVE,
  STUDENT_STATUS_APPLIED,
  STUDENT_STATUS_PENDING,
  STUDENT_STATUS_WITHDRAWAL,
} from '../../../../../utils/StudentStatusConstants'
import { deleteWithdrawalMutation } from '../../../../../graphql/mutation/withdrawal'
import { useMutation } from '@apollo/client'
import CustomConfirmModal from '../../../../../components/CustomConfirmModal/CustomConfirmModal'

const selectStyles = makeStyles({
  backgroundSelect: {
    fontSize: '12px',
    borderRadius: '8px',
    minWidth: '135px',
    height: '29px',
    textAlign: 'center',
    background: BUTTON_LINEAR_GRADIENT,
    color: '#F2F2F2',
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
    color: '#F2F2F2',
    '&:before': {
      borderColor: RED_GRADIENT,
    },
    '&:after': {
      borderColor: RED_GRADIENT,
    },
  },
  yelloBackgroundSelect: {
    fontSize: '12px',
    borderRadius: '8px',
    minWidth: '135px',
    height: '29px',
    textAlign: 'center',
    background: YELLOW_GRADIENT,
    color: '#F2F2F2',
    '&:before': {
      borderColor: YELLOW_GRADIENT,
    },
    '&:after': {
      borderColor: YELLOW_GRADIENT,
    },
    '& > div': {
      paddingTop: 0,
      paddingBottom: 0,
    }
  },
  selectIcon: {
    fill: '#F2F2F2',
    color: '#F2F2F2'
  },
  selectRoot: {
    color: '#F2F2F2',
  },
})
const useStyles = {
  modalCard: {
    position: 'absolute' as 'absolute',
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
    position: 'absolute' as 'absolute',
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
  var s = ['th', 'st', 'nd', 'rd']
  var v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
export const StudentFilters = ({
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
  const [applications, setApplications] = useState<any[]>([])
  const [studentStatus, setStudentStatus] = useState<any>()
  const [specialEd, setSpecialEd] = useState<any>()
  const [showWithdrawalModal, setShowWithdrawalModal] = useState<boolean>(false)
  const [showActiveModal, setShowActiveModal] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [diplomaSeeking, setDiplomaSeeking] = useState<any>('')
  const [status, setStatus] = useState<DropDownItem[]>([
    {
      label: ' ',
      value: 4,
    },
    {
      label: 'Applied',
      value: STUDENT_STATUS_APPLIED,
    },
    {
      label: 'Pending',
      value: STUDENT_STATUS_PENDING,
    },
    {
      label: 'Active',
      value: STUDENT_STATUS_ACTIVE,
    },
    {
      label: 'Withdrawn',
      value: STUDENT_STATUS_WITHDRAWAL,
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
    if (e.target.value == 1 || e.target.value == 0) {
      if (originStudentStatus?.status == 2) {
        setShowActiveModal(true)
      }
      setStudentStatus(studentStatusData.status)
      setStudentStatuData({ ...studentStatusData, ...{ status: e.target.value } })
    } else if (e.target.value == 2) {
      if (originStudentStatus?.status == 1 || originStudentStatus?.status == 0) {
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
          value: STUDENT_STATUS_APPLIED,
        },
        {
          label:
            studentStatusData?.status == 0
              ? `Pending (${moment(studentStatusData?.date).format('MM/DD/YYYY')})`
              : 'Pending',
          value: STUDENT_STATUS_PENDING,
        },
        {
          label:
            studentStatusData?.status == 1
              ? `Active (${moment(studentStatusData?.date).format('MM/DD/YYYY')})`
              : 'Active',
          value: STUDENT_STATUS_ACTIVE,
        },
        {
          label:
            studentStatusData?.status == 2
              ? `Withdrawn (${moment(studentStatusData?.date).format('MM/DD/YYYY')})`
              : 'Withdrawn',
          value: STUDENT_STATUS_WITHDRAWAL,
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
          value: STUDENT_STATUS_APPLIED,
        },
        {
          label: 'Pending',
          value: STUDENT_STATUS_PENDING,
        },
        {
          label: 'Active',
          value: STUDENT_STATUS_PENDING,
        },
        {
          label: `Withdrawn (${moment().format('MM/DD/YYYY')})`,
          value: STUDENT_STATUS_WITHDRAWAL,
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
          value: STUDENT_STATUS_APPLIED,
        },
        {
          label: 'Pending',
          value: STUDENT_STATUS_PENDING,
        },
        {
          label: `Active (${moment().format('MM/DD/YYYY')})`,
          value: STUDENT_STATUS_ACTIVE,
        },
        {
          label: `Withdrawn`,
          value: STUDENT_STATUS_WITHDRAWAL,
        },
      ])
    }
  }, [studentStatusData])

  const [deleteWithdrawal] = useMutation(deleteWithdrawalMutation)
  const onRemoveWithdrawalRequest = async () => {
    setShowConfirmModal(true);
  }

  const confirmRemoveWithdraw = async () => {
    const { data } = await deleteWithdrawal({
      variables: {
        studentId: parseInt(currentUserData.student.student_id),
      },
    })
    if (data.deleteWithdrawal) setWithdrawalStatus({})
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
                ? `${moment(applications[0].school_year.midyear_application_open).format('YYYY')} - ${moment(
                  applications[0].school_year.midyear_application_close,
                ).format('YY')} Mid-year Status`
                : applications?.[0]
                  ? `${moment(applications[0].school_year.date_begin).format('YYYY')} - ${moment(
                    applications[0].school_year.date_end,
                  ).format('YY')} Status`
                  : ''}
            </Subtitle>
            <Box>
              {console.log('lplp', studentStatusData.status, withdrawalStatus?.status)}
              <Select
                className={
                  studentStatusData?.status != 2
                    ? withdrawalStatus?.status == 'Requested'
                      ? selectClasses.yelloBackgroundSelect
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
                  <MenuItem key={item.value} value={item.value} sx={{ height: '35px' }} style={{
                    paddingTop: 0,
                    paddingBottom: 0
                  }}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {withdrawalStatus?.status == 'Requested' && (
                <Box onClick={() => onRemoveWithdrawalRequest()}>
                  <Paragraph sx={{ color: MTHBLUE, my: '5px' }} textAlign='center'>
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
              handleConfirmModalChange={(val: boolean, isOk: boolean) => {
                if (isOk) {
                  confirmRemoveWithdraw();
                }
                setShowConfirmModal(false);
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
                <Subtitle sx={classes.formLabel as object} fontWeight='500'>
                  Application
                  <Box sx={classes.labelAfter as object}></Box>
                </Subtitle>
                <Subtitle sx={{ ...(classes.formValue as object) }} fontWeight='500'>
                  {applications[0].status}{' '}
                  {applications[0].date_submitted
                    ? moment(applications[0].date_submitted).format('l')
                    : moment(applications[0].date_accepted).format('l')}
                </Subtitle>
              </Box>
              <Box sx={classes.formRow}>
                <Subtitle sx={classes.formLabel as object} fontWeight='500'>
                  Date of Birth
                  <Box sx={classes.labelAfter as object}></Box>
                </Subtitle>
                <Subtitle sx={classes.formValue as object} fontWeight='500'>
                  {currentUserData.student.person.date_of_birth &&
                    moment(currentUserData.student.person.date_of_birth).format('l')}
                  {currentUserData.student.person.date_of_birth &&
                    `(${moment().diff(currentUserData.student.person.date_of_birth, 'years')})`}
                </Subtitle>
              </Box>
              {applications.map((application) => (
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as object} fontWeight='500'>
                    {application.midyear_application
                      ? `${moment(application.school_year.midyear_application_open).format('YYYY')}-${moment(
                        application.school_year.midyear_application_close,
                      ).format('YY')} Mid-year`
                      : `${moment(application.school_year.date_begin).format('YYYY')}-${moment(
                        application.school_year.date_end,
                      ).format('YY')}`}
                    <Box sx={classes.labelAfter as object}></Box>
                  </Subtitle>
                  <Box sx={classes.formRow}>
                    <Subtitle sx={classes.formValue as object} fontWeight='500'>
                      {currentUserData.student.grade_levels &&
                        ordinal(currentUserData.student.grade_levels[0].grade_level)}{' '}
                      Grade
                      <Box sx={classes.labelAfter as object}></Box>
                    </Subtitle>
                    {/* <Subtitle sx={classes.formValue as object} fontWeight='500'></Subtitle> */}
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
