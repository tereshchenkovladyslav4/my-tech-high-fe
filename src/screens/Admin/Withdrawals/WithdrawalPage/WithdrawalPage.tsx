import { Card, Box, Stack, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import React, { useEffect, useState, useContext } from 'react'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { useMutation, useQuery } from '@apollo/client'
import {
  getEmailByWithdrawalId,
  getWithdrawalsCountByStatusQuery,
  getWithdrawalsQuery,
} from '../../../../graphql/queries/withdrawal'
import moment from 'moment'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { useStyles } from './styles'
import { Withdrawal } from '../../../../graphql/models/withdrawal'
import { PageHeader } from '../PageHeader'
import PageAction from '../PageAction/PageAction'
import { WITHDRAWAL_HEADCELLS } from '../../../../utils/PageHeadCellsConstant'
import { WITHDRAWAL_STATUS_LABEL } from '../../../../utils/constants'
import { WithdrawalCount, WithdrawalResponseVM } from '../type'
import { ApplicationEmailModal as EmailModal } from '../../../../components/EmailModal/ApplicationEmailModal'
import { getEmailTemplateQuery } from '../../../../graphql/queries/email-template'
import {
  emailWithdrawalMutation,
  quickWithdrawalMutation,
  reinstateWithdrawalMutation,
  updateWithdrawalMutation,
} from '../service'
import { WithdrawalEmailModal } from './WithdrawalEmailModal'
import { ConfirmModal } from '../components/ConfirmModal'
import { ActiveModal } from '../../UserProfile/StudentProfile/components/ActiveModal'

const WithdrawalPage = () => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState<string>('')
  const [tableData, setTableData] = useState<Array<any>>([])
  const [skip, setSkip] = useState<number>(0)
  const [sort, setSort] = useState<string>('submitted|asc')
  const [paginationLimit, setPaginationLimit] = useState<number>(25)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    WITHDRAWAL_STATUS_LABEL[0],
    WITHDRAWAL_STATUS_LABEL[1],
  ])
  const [selectedYear, setSelectedYear] = useState<string | number>('1')
  const [emailTemplate, setEmailTemplate] = useState()
  const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([])
  const [totalWithdrawals, setTotalWithdrawals] = useState<number>(0)
  const [checkedWithdrawalIds, setCheckedWithdrawalIds] = useState<Array<string>>([])
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [openEmailHistoryModal, setOpenEmailHistoryModal] = useState<boolean>(false)
  const [withdrawId, setWithdrawId] = useState<number>(0)
  const [showWithdrawalConfirmModal, setShowWithdrawalConfirmModal] = useState<boolean>(false)
  const [showReinstateModal, setShowReinstateModal] = useState<boolean>(false)
  const [reinstateModalType, setReinstateModalType] = useState<number>(0)
  const [errorReinstateModal, setErrorReinstateModal] = useState<boolean>(false)
  const [openEffectiveCalendar, setOpenEffectiveCalendar] = useState<boolean>(false)
  const [withdrawalCounts, setWithdrawalCounts] = useState<WithdrawalCount>({
    Notified: 0,
    Requested: 0,
    Withdrawn: 0,
  })
  const [effective, setEffective] = useState({
    date: '',
    withdrawId: 0,
  })

  const [openWarningModal, setOpenWarningModal] = useState<boolean>(false)
  const { loading, data, refetch } = useQuery(getWithdrawalsQuery, {
    variables: {
      skip: skip,
      sort: sort,
      take: paginationLimit,
      filter: {
        region_id: me?.selectedRegionId,
        status: selectedStatuses,
        keyword: searchField,
        selectedYear: selectedYear,
      },
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const {
    loading: withdrawalsCountLoading,
    data: withdrawalsCountData,
    refetch: refetchWithdrawalsCount,
  } = useQuery(getWithdrawalsCountByStatusQuery, {
    variables: {
      filter: {
        region_id: me?.selectedRegionId,
        keyword: searchField,
        selectedYear: selectedYear,
      },
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const { loading: emailLoading, data: emailData } = useQuery(getEmailByWithdrawalId, {
    variables: {
      withdrawId: Number(withdrawId),
    },
    skip: withdrawId === 0,
    fetchPolicy: 'network-only',
  })

  const [emailWithdrawal] = useMutation(emailWithdrawalMutation)
  const [updateWithdrawal] = useMutation(updateWithdrawalMutation)
  const [quickWithdrawal] = useMutation(quickWithdrawalMutation)
  const [reinstateWithdrawal] = useMutation(reinstateWithdrawalMutation)

  const { data: emailTemplateData, refetch: refetchEmailTemplate } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Withdraw Page',
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

  const handleOpenEmailHistory = (withdrawal_id: number) => {
    setWithdrawId(Number(withdrawal_id))
    setOpenEmailHistoryModal(true)
  }

  const handleOpenEffectiveCalendar = (effectDate: string, withdrawId: number) => {
    setEffective({
      date: effectDate,
      withdrawId: withdrawId,
    })
    setOpenEffectiveCalendar(true)
  }

  const openHandleEffectiveChange = (value: Date | null) => {
    setEffective({
      ...effective,
      date: value?.toString() || '',
    })
  }

  const sortChangeAction = (property: keyof any, order: string) => {
    setSort(`${property.toString()}|${order}`)
    refetch()
  }

  const handleOpenProfile = (rowId: number) => {
    // const row = withdrawals?.find((x) => x.withdrawal_id === rowId)
    // showModal(row);
    // setStore(true)
  }

  const handleWithdrawSelect = (rowId: any) => {
    const row = withdrawals?.find((item) => item.withdrawal_id === rowId)
    //setCurrentWithdrawal(row)
    //setIsShowModal(true)
  }

  const onWithdrawClick = () => {}

  const onEmailClick = () => {
    if (checkedWithdrawalIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    setOpenEmailModal(true)
  }

  const onReinstateClick = () => {
    if (checkedWithdrawalIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    const statuses = [
      ...new Set(
        withdrawals
          ?.filter((item) => checkedWithdrawalIds.includes(`${item.withdrawal_id}`))
          ?.map((withdrawal) => withdrawal.status.toString()),
      ),
    ]
    if (statuses?.length > 1) {
      setErrorReinstateModal(true)
      return
    }
    if (statuses?.length == 1 && statuses[0] != 'Withdrawn') {
      setReinstateModalType(0)
      setShowReinstateModal(true)
    } else if (statuses?.length == 1 && statuses[0] == 'Withdrawn') {
      setReinstateModalType(1)
      setShowReinstateModal(true)
    }
  }

  const onQuickWithdrawalClick = () => {
    if (checkedWithdrawalIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    setShowWithdrawalConfirmModal(true)
  }

  const handleEmailSend = (from: string, subject: string, body: string) => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    onSendEmail(from, subject, body)
  }

  const onSendEmail = async (from: string, subject: string, body: string) => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    try {
      await emailWithdrawal({
        variables: {
          emailWithdrawalInput: {
            withdrawal_ids: checkedWithdrawalIds.map((id) => Number(id)),
            from: from,
            subject: subject,
            body: body,
            region_id: me?.selectedRegionId,
          },
        },
      })
      refetch()
      refetchEmailTemplate()
      setOpenEmailModal(false)
    } catch (error) {}
  }

  const onQuickWithdrawal = async () => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    try {
      await quickWithdrawal({
        variables: {
          quickWithdrawalInput: {
            withdrawal_ids: checkedWithdrawalIds.map((id) => Number(id)),
          },
        },
      })
      refetch()
      refetchWithdrawalsCount()
      refetchEmailTemplate()
    } catch (error) {}
  }

  const onReinstateWithdrawal = async (reinstateType: number = 0) => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    setShowReinstateModal(false)
    try {
      await reinstateWithdrawal({
        variables: {
          reinstateWithdrawalInput: {
            withdrawal_ids: checkedWithdrawalIds.map((id) => Number(id)),
            reinstate_type: reinstateType,
          },
        },
      })
      refetch()
      refetchWithdrawalsCount()
      refetchEmailTemplate()
    } catch (error) {}
  }

  const handleAcceptDate = async (e: any) => {
    const acceptDate = moment(e).format('YYYY-MM-DD')
    await updateWithdrawal({
      variables: {
        updateWithdrawalInput: {
          withdrawal_id: Number(effective?.withdrawId),
          value: acceptDate?.toString(),
          field: 'date_effective',
        },
      },
    })
    refetch()
  }

  const handleSelectActiveOption = (activeOption: number) => {
    setShowReinstateModal(false)
  }

  useEffect(() => {
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])

  useEffect(() => {
    if (!loading && data?.withdrawals) {
      setTableData(
        data?.withdrawals.results.map((withdrawal: WithdrawalResponseVM) => ({
          submitted: withdrawal.date ? moment(withdrawal.date).format('MM/DD/YY') : '',
          status: withdrawal.status,
          effective: withdrawal.date_effective ? (
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => handleOpenEffectiveCalendar(withdrawal.date_effective, withdrawal.withdrawal_id)}
            >
              {moment(withdrawal.date_effective).format('MM/DD/YY')}
            </Box>
          ) : (
            ''
          ),
          student: withdrawal?.student_name,
          grade: withdrawal?.grade_level === 'Kin' ? 'K' : withdrawal?.grade_level,
          soe: withdrawal?.soe,
          funding: withdrawal?.funding, //	TODO
          emailed: withdrawal?.date_emailed ? (
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailHistory(withdrawal.withdrawal_id)}>
              {moment(withdrawal.date_emailed).format('MM/DD/YY')}
            </Box>
          ) : (
            ''
          ),
          id: withdrawal?.withdrawal_id,
        })),
      )
      setTotalWithdrawals(data.withdrawals.total)
      setWithdrawals(data.withdrawals.results.map((v: WithdrawalResponseVM) => v))
    }
  }, [data])

  useEffect(() => {
    if (withdrawalsCountData && withdrawalsCountData.withdrawalCountsByStatus.error === false) {
      setWithdrawalCounts(withdrawalsCountData.withdrawalCountsByStatus.results)
    }
  }, [withdrawalsCountData])

  return (
    <Card sx={classes.card}>
      {/*	Headers */}
      <PageHeader
        totalWithdrawals={totalWithdrawals}
        searchField={searchField}
        setSearchField={setSearchField}
        onEmailClick={onEmailClick}
        onWithdrawClick={onWithdrawClick}
        onReinstateClick={onReinstateClick}
      />
      {/*	Pagination & Actions */}
      <PageAction
        totalWithdrawals={totalWithdrawals}
        searchField={searchField}
        paginationLimit={paginationLimit}
        selectedStatuses={selectedStatuses}
        withdrawalCounts={withdrawalCounts}
        setWithdrawalCounts={setWithdrawalCounts}
        setSelectedStatuses={setSelectedStatuses}
        onQuickWithdrawalClick={onQuickWithdrawalClick}
        setSkip={setSkip}
        setPaginationLimit={setPaginationLimit}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <SortableTable
        rows={tableData}
        headCells={WITHDRAWAL_HEADCELLS}
        onCheck={setCheckedWithdrawalIds}
        clearAll={false}
        onRowClick={handleWithdrawSelect}
        onParentClick={handleOpenProfile}
        onSortChange={sortChangeAction}
      />
      {showWithdrawalConfirmModal && (
        <ConfirmModal
          title='Withdraw'
          description='A withdrawal form will be created and comfirmation email will be sent.'
          cancelStr='Cancel'
          confirmStr='Withdraw'
          onClose={() => {
            setShowWithdrawalConfirmModal(false)
          }}
          onConfirm={() => {
            setShowWithdrawalConfirmModal(false)
            onQuickWithdrawal()
          }}
        />
      )}
      {showReinstateModal && reinstateModalType == 0 && (
        <ConfirmModal
          title='Reinstate'
          description='Are you sure you want reinstate the student(s)?'
          cancelStr='Cancel'
          confirmStr='Reinstate'
          onClose={() => {
            setShowReinstateModal(false)
          }}
          onConfirm={() => {
            setShowReinstateModal(false)
            onReinstateWithdrawal(0)
          }}
        />
      )}
      {showReinstateModal && reinstateModalType == 1 && (
        <ActiveModal
          title='Reinstate'
          description='How would you like to proceed with reinstating this student?'
          confirmStr='Reinstate'
          cancelStr='Cancel'
          backgroundColor='#FFFFFF'
          onActive={onReinstateWithdrawal}
          onClose={() => setShowReinstateModal(false)}
        />
      )}
      {openWarningModal && (
        <WarningModal
          title='Warning'
          subtitle='Please select Withdrawals'
          btntitle='Close'
          handleModem={() => setOpenWarningModal(false)}
          handleSubmit={() => setOpenWarningModal(false)}
        />
      )}
      {errorReinstateModal && (
        <WarningModal
          title='Error'
          subtitle='You may only select multiple students with the same status.'
          btntitle='Ok'
          handleModem={() => setErrorReinstateModal(false)}
          handleSubmit={() => setErrorReinstateModal(false)}
        />
      )}
      {openEmailModal && (
        <EmailModal
          handleModem={() => setOpenEmailModal(!openEmailModal)}
          title={checkedWithdrawalIds.length + ' Recipients'}
          handleSubmit={handleEmailSend}
          template={emailTemplate}
          editFrom={true}
        />
      )}
      {openEmailHistoryModal && !emailLoading && (
        <WithdrawalEmailModal
          handleClose={() => setOpenEmailHistoryModal(false)}
          data={emailData?.getEmailsByWithdrawId}
        />
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns} localeText='Save' cancelButtonLabel='Cancel'>
        <Stack spacing={3} marginRight={8}>
          <MobileDatePicker
            label={'Select One Date'}
            inputFormat='MM/dd/yyyy'
            value={effective.date}
            onChange={openHandleEffectiveChange}
            onClose={() => {
              setOpenEffectiveCalendar(false)
            }}
            open={openEffectiveCalendar}
            onAccept={handleAcceptDate}
            // onAccept={onAcceptDate}
            okText='Save'
            renderInput={(params) => <TextField {...params} sx={{ display: 'none' }} />}
          />
        </Stack>
      </LocalizationProvider>
    </Card>
  )
}

export default WithdrawalPage
