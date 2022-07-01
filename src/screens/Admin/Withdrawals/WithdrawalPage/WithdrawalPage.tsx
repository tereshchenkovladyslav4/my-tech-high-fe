import { Card, Box, Stack, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import React, { useEffect, useState, useContext } from 'react'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { useMutation, useQuery } from '@apollo/client'
import { getEmailByWithdrawalId, getWithdrawalsQuery } from '../../../../graphql/queries/withdrawal'
import moment from 'moment'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { useStyles } from './styles'
import { Withdrawal } from '../../../../graphql/models/withdrawal'
import { PageHeader } from '../PageHeader'
import PageAction from '../PageAction/PageAction'
import { WITHDRAWAL_HEADCELLS } from '../../../../utils/PageHeadCellsConstant'
import { WITHDRAWAL_STATUS_LABEL } from '../../../../utils/constants'
import { WithdrawalResponseVM } from '../type'
import { ApplicationEmailModal as EmailModal } from '../../../../components/EmailModal/ApplicationEmailModal'
import { getEmailTemplateQuery } from '../../../../graphql/queries/email-template'
import { emailWithdrawalMutation, updateWithdrawalMutation } from '../service'
import { WithdrawalEmailModal } from './WithdrawalEmailModal'
import { CalendarPickerView } from '@mui/x-date-pickers/internals/models'

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
  // filtering by year
  const [selectedYear, setSelectedYear] = useState<string | number>('1')
  const [emailTemplate, setEmailTemplate] = useState()
  const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([])
  //const [currentWithdrawal, setCurrentWithdrawal] = useState<Withdrawal | null>()
  const [totalWithdrawals, setTotalWithdrawals] = useState<number>(0)
  const [checkedWithdrawalIds, setCheckedWithdrawalIds] = useState<Array<string>>([])
  //const [isShowModal, setIsShowModal] = useState(false)
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [openEmailHistoryModal, setOpenEmailHistoryModal] = useState<boolean>(false)
  const [withdrawId, setWithdrawId] = useState<number>(0)
  const [openEffectiveCalendar, setOpenEffectiveCalendar] = useState<boolean>(false)
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

  const { loading: emailLoading, data: emailData } = useQuery(getEmailByWithdrawalId, {
    variables: {
      withdrawId: Number(withdrawId),
    },
    skip: withdrawId === 0,
    fetchPolicy: 'network-only',
  })

  const [emailWithdrawal] = useMutation(emailWithdrawalMutation)
  const [updateWithdrawal] = useMutation(updateWithdrawalMutation)

  const { data: emailTemplateData, refetch: refetchEmailTemplate } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Withdraw Page',
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

  const handleOpenEmailHistory = (withdrawal_id: number) => {
    setWithdrawId(parseInt(withdrawal_id));
    setOpenEmailHistoryModal(true)
  }



  const handleOpenEffectiveCalendar = (effectDate: string, withdrawId: number) => {
    setEffective({
      date: effectDate,
      withdrawId: withdrawId
    });
    setOpenEffectiveCalendar(true);
  }

  const openHandleEffectiveChange = (value: Date | null) => {
    setEffective({
      ...effective,
      date: value?.toString() || '',
    })
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
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEffectiveCalendar(withdrawal.date_effective, withdrawal.withdrawal_id)}>
              {moment(withdrawal.date_effective).format('MM/DD/YY')}
            </Box>
          ) : '',
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
  }, [loading, data])

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
    //	TODO
  }

  const onQuickWithdrawalClick = () => {
    //	TODO
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

  const handleAcceptDate = async (e: any) => {
    const acceptDate = moment(e).format('YYYY-MM-DD');
    await updateWithdrawal({
      variables: {
        updateWithdrawalInput: {
          withdrawal_id: parseInt(effective?.withdrawId),
          value: acceptDate?.toString(),
          field: 'date_effective',
        },
      },
    })
    refetch()
  }

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
      {openWarningModal && (
        <WarningModal
          title='Warning'
          subtitle='Please select Withdrawals'
          btntitle='Close'
          handleModem={() => setOpenWarningModal(!openWarningModal)}
          handleSubmit={() => setOpenWarningModal(!openWarningModal)}
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
