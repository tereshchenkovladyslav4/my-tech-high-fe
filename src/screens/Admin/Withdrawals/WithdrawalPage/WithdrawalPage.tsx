import React, { useEffect, useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Card, Box } from '@mui/material'
import moment from 'moment-timezone'
import { SortableTable } from '@mth/components/SortableTable/SortableTable'
import { WITHDRAWAL_HEADCELLS, WITHDRAWAL_STATUS_LABEL } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { Withdrawal } from '@mth/graphql/models/withdrawal'
import { getWithdrawalsQuery } from '@mth/graphql/queries/withdrawal'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import PageAction from '../PageAction/PageAction'
import { PageHeader } from '../PageHeader'
import { PageModals } from '../PageModals'
import { EffectiveVM, WithdrawalPageProps, WithdrawalResponseVM } from '../type'
import { mainClasses } from './styles'

const WithdrawalPage: React.FC<WithdrawalPageProps> = ({
  searchField,
  selectedYear,
  withdrawalCounts,
  emailTemplate,
  setSearchField,
  setWithdrawalCounts,
  setSelectedYear,
  refetchWithdrawalsCount,
  refetchEmailTemplate,
}) => {
  const { me } = useContext(UserContext)
  const [tableData, setTableData] = useState<Array<unknown>>([])
  const [skip, setSkip] = useState<number>(0)
  const [sort, setSort] = useState<string>('submitted|asc')
  const [paginationLimit, setPaginationLimit] = useState<number>(25)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    WITHDRAWAL_STATUS_LABEL[0],
    WITHDRAWAL_STATUS_LABEL[1],
  ])
  const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([])
  const [totalWithdrawals, setTotalWithdrawals] = useState<number>(0)
  const [checkedWithdrawalIds, setCheckedWithdrawalIds] = useState<Array<string>>([])
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [openEmailHistoryModal, setOpenEmailHistoryModal] = useState<boolean>(false)

  const [showWithdrawalConfirmModal, setShowWithdrawalConfirmModal] = useState<boolean>(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false)
  const [showReinstateModal, setShowReinstateModal] = useState<boolean>(false)
  const [reinstateModalType, setReinstateModalType] = useState<number>(0)
  const [errorReinstateModal, setErrorReinstateModal] = useState<boolean>(false)
  const [openEffectiveCalendar, setOpenEffectiveCalendar] = useState<boolean>(false)
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<number>(0)
  const [isShowWithdrawalModal, setIsShowWithdrawalModal] = useState<boolean>(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalResponseVM>()
  const [effective, setEffective] = useState<EffectiveVM>({
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

  const handleOpenEmailHistory = (withdrawal_id: number) => {
    setSelectedWithdrawalId(withdrawal_id)
    setOpenEmailHistoryModal(true)
  }

  const handleOpenEffectiveCalendar = (effectDate: string, withdrawId: number) => {
    setEffective({
      date: effectDate,
      withdrawId: withdrawId,
    })
    setOpenEffectiveCalendar(true)
  }

  const sortChangeAction = (property: string, order: string) => {
    setSort(`${property.toString()}|${order}`)
    refetch()
  }

  const onWithdrawClick = () => {
    if (checkedWithdrawalIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    setShowWithdrawModal(true)
  }

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

  const handleOpenWithdrawalModal = (withdrawal: WithdrawalResponseVM) => {
    if (withdrawal.status == 'Requested') {
      setSelectedWithdrawal(withdrawal)
      setIsShowWithdrawalModal(true)
    }
  }

  useEffect(() => {
    if (!loading && data?.withdrawals) {
      setTableData(
        data?.withdrawals.results.map((withdrawal: WithdrawalResponseVM) => ({
          submitted: withdrawal.date ? moment(withdrawal.date).format('MM/DD/YY') : '',
          // status: <Box onClick={() => handleOpenWithdrawalModal(withdrawal)}>{withdrawal.status}</Box>,
          status: (
            <Box
              onClick={() => handleOpenWithdrawalModal(withdrawal)}
              sx={{
                cursor: withdrawal.status === 'Requested' ? 'pointer' : 'auto',
                color: withdrawal.status === 'Requested' ? MthColor.MTHBLUE : MthColor.BLACK,
              }}
            >
              {withdrawal.status}
            </Box>
          ),
          effective: withdrawal.date_effective ? (
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => handleOpenEffectiveCalendar(withdrawal.date_effective, withdrawal.withdrawal_id)}
            >
              {moment(withdrawal.date_effective).tz('UTC').format('MM/DD/YY')}
            </Box>
          ) : (
            ''
          ),
          student: withdrawal?.student_name,
          grade: withdrawal?.grade_level === 'Kin' ? 'K' : withdrawal?.grade_level,
          soe: withdrawal?.soe,
          funding: withdrawal?.funding, //	TODO
          emailed: withdrawal?.date_emailed ? (
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailHistory(Number(withdrawal.withdrawal_id))}>
              {moment(withdrawal.date_emailed).format('MM/DD/YY')}
            </Box>
          ) : (
            ''
          ),
          id: `${withdrawal?.withdrawal_id}`,
        })),
      )
      setTotalWithdrawals(data.withdrawals.total)
      setWithdrawals(data.withdrawals.results.map((v: WithdrawalResponseVM) => v))
    }
  }, [data])

  return (
    <Card sx={mainClasses.card}>
      <PageHeader
        totalWithdrawals={totalWithdrawals}
        searchField={searchField}
        setSearchField={setSearchField}
        onEmailClick={onEmailClick}
        onWithdrawClick={onWithdrawClick}
        onReinstateClick={onReinstateClick}
      />
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
        onSortChange={sortChangeAction}
      />
      <PageModals
        showWithdrawalConfirmModal={showWithdrawalConfirmModal}
        showReinstateModal={showReinstateModal}
        reinstateModalType={reinstateModalType}
        openWarningModal={openWarningModal}
        withdrawals={withdrawals}
        errorReinstateModal={errorReinstateModal}
        openEmailModal={openEmailModal}
        checkedWithdrawalIds={checkedWithdrawalIds}
        emailTemplate={emailTemplate}
        openEmailHistoryModal={openEmailHistoryModal}
        withdrawalId={selectedWithdrawalId}
        effective={effective}
        openEffectiveCalendar={openEffectiveCalendar}
        isShowWithdrawalModal={isShowWithdrawalModal}
        selectedWithdrawal={selectedWithdrawal}
        showWithdrawModal={showWithdrawModal}
        setIsShowWithdrawalModal={setIsShowWithdrawalModal}
        setShowWithdrawalConfirmModal={setShowWithdrawalConfirmModal}
        setShowWithdrawModal={setShowWithdrawModal}
        setShowReinstateModal={setShowReinstateModal}
        setOpenWarningModal={setOpenWarningModal}
        setErrorReinstateModal={setErrorReinstateModal}
        setOpenEmailModal={setOpenEmailModal}
        setOpenEmailHistoryModal={setOpenEmailHistoryModal}
        setEffective={setEffective}
        setOpenEffectiveCalendar={setOpenEffectiveCalendar}
        refetch={refetch}
        refetchWithdrawalsCount={refetchWithdrawalsCount}
        refetchEmailTemplate={refetchEmailTemplate}
      />
    </Card>
  )
}

export default WithdrawalPage
