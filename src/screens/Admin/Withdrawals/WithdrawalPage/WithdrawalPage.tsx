import { Card, Box } from '@mui/material'
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
import { emailWithdrawalMutation } from '../service'
import { WithdrawalEmailModal } from './WithdrawalEmailModal'

const WithdrawalPage = () => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState('')
  const [tableData, setTableData] = useState<Array<any>>([])
  const [skip, setSkip] = useState<number>(0)
  const [sort, setSort] = useState('submitted|asc')
  const [paginationLimit, setPaginationLimit] = useState<number>(25)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    WITHDRAWAL_STATUS_LABEL[0],
    WITHDRAWAL_STATUS_LABEL[1],
  ])
  const [emailTemplate, setEmailTemplate] = useState()
  const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([])
  const [currentWithdrawal, setCurrentWithdrawal] = useState<Withdrawal | null>()
  const [totalWithdrawals, setTotalWithdrawals] = useState<number>(0)
  const [checkedWithdrawalIds, setCheckedWithdrawalIds] = useState<Array<string>>([])
  const [isShowModal, setIsShowModal] = useState(false)
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)

  const [openEmailHistoryModal, setOpenEmailHistoryModal] = useState<boolean>(false)
  const [withdrawId, setWithdrawId] = useState('')

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
      },
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })


  const { loading: emailLoading, data: emailData, refetch: emailRefetch } = useQuery(getEmailByWithdrawalId, {
    variables: {
      withdrawId: withdrawId,
    },
    skip: (withdrawId === ''),
    fetchPolicy: 'network-only',
  })

  const [emailPacket, { data: emailStatus }] = useMutation(emailWithdrawalMutation)

  const { data: emailTemplateData, refetch: refetchEmailTemplate } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Withdraw Page',
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

  const handleOpenEmailHistory = (withdrawal_id: number) => {
    console.log('withdrawal.withdrawal_id', withdrawal_id)
    setWithdrawId(parseInt(withdrawal_id));
    setOpenEmailHistoryModal(true)
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
          effective: withdrawal.date_effective ? moment(withdrawal.date_effective).format('MM/DD/YY') : '',
          student: withdrawal?.student_name,
          grade: withdrawal?.grade_level,
          soe: withdrawal?.soe,
          funding: withdrawal?.funding, //	TODO
          emailed: (withdrawal?.date_emailed) ? (
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailHistory(withdrawal.withdrawal_id)}>
              {moment(withdrawal.date_emailed).format('MM/DD/YY')}
            </Box>
          ) : '',
          id: withdrawal?.withdrawal_id,
        })),
      )
      setTotalWithdrawals(data.withdrawals.total)
      setWithdrawals(data.withdrawals.results.map((v: WithdrawalResponseVM) => v))
    }
  }, [loading])

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
    setCurrentWithdrawal(row)
    setIsShowModal(true)
  }

  const onWithdrawClick = () => { }

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

  const handleEmailSend = (subject: string, body: string) => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    onSendEmail(subject, body)
  }

  const onSendEmail = async (subject: string, body: string) => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    try {
      await emailPacket({
        variables: {
          emailWithdrawalInput: {
            withdrawal_ids: checkedWithdrawalIds.map((id) => Number(id)),
            subject: subject,
            body: body,
            region_id: me?.selectedRegionId,
          },
        },
      })
      refetch()
      refetchEmailTemplate()
      setOpenEmailModal(false)
    } catch (error) { }
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
        />
      )}
      {openEmailHistoryModal && !emailLoading && (
        <WithdrawalEmailModal
          handleClose={() => setOpenEmailHistoryModal(false)}
          data={emailData?.getEmailsByWithdrawId}
        />
      )}
    </Card>
  )
}

export default WithdrawalPage
