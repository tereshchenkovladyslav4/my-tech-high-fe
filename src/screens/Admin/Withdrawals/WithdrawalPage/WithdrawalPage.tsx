import React, { useEffect, useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Card, Box } from '@mui/material'
import moment from 'moment-timezone'
import { SortableTable } from '@mth/components/SortableTable/SortableTable'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { WITHDRAWAL_HEADCELLS, WITHDRAWAL_STATUS_LABEL } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { getWithdrawalsQuery } from '@mth/graphql/queries/withdrawal'
import { Withdrawal } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { showDate } from '@mth/utils'
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
  setEmailMidTemplate,
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

  const [withdrawList, setWithdrawList] = useState([])
  const [selectError, setSelectError] = useState<boolean>(false)

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
    skip: !me?.selectedRegionId,
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

  useEffect(() => {
    if (checkedWithdrawalIds.length > 0) {
      const firstWithdrawal = withdrawList.find(
        (withdrawal) => withdrawal.withdrawal_id === parseInt(checkedWithdrawalIds[0]),
      )
      setEmailMidTemplate(firstWithdrawal.Student.applications[0].midyear_application)
    }
  }, [checkedWithdrawalIds])

  const onEmailClick = () => {
    if (checkedWithdrawalIds.length === 0) {
      setOpenWarningModal(true)
      return
    }

    let midStatus = true
    let schoolYearMid = ''
    checkedWithdrawalIds.map((checkedId) => {
      const withdrawal = withdrawList.find((item) => item?.withdrawal_id === parseInt(checkedId))
      if (!schoolYearMid) {
        schoolYearMid = withdrawal?.Student.applications[0].midyear_application ? 'mid' : 'non-mid'
      } else {
        const updatedMid = withdrawal?.Student.applications[0].midyear_application ? 'mid' : 'non-mid'
        if (schoolYearMid !== updatedMid) {
          midStatus = false
        }
      }
    })
    if (!midStatus) {
      setSelectError(true)
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
      setWithdrawList(data?.withdrawals.results)
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
              {showDate(withdrawal.date_effective, 'MM/DD/YY')}
            </Box>
          ) : (
            ''
          ),
          student: withdrawal?.student_name,
          grade: parseInt(withdrawal?.grade_level)
            ? withdrawal?.grade_level
            : withdrawal?.grade_level?.toLowerCase()?.startsWith('k')
            ? 'K'
            : '',
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
      {selectError && (
        <WarningModal
          handleModem={() => setSelectError(false)}
          title='Error'
          subtitle="You may only select multiple withdrawal's with the same program year."
          btntitle='OK'
          handleSubmit={() => setSelectError(false)}
        />
      )}
    </Card>
  )
}

export default WithdrawalPage
