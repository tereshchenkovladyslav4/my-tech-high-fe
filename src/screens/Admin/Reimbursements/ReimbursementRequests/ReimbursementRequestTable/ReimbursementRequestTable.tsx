import React, { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import { debounce } from 'lodash'
import moment from 'moment/moment'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { ApplicationEmailModal } from '@mth/components/EmailModal/ApplicationEmailModal'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { PageBlock } from '@mth/components/PageBlock'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { MthColor, Order } from '@mth/enums'
import { deleteReimbursementRequestsMutation } from '@mth/graphql/mutation/reimbursement-request'
import { emailResourceRequestsMutation } from '@mth/graphql/mutation/resource-request'
import { getReimbursementRequestsQuery } from '@mth/graphql/queries/reimbursement-request'
import { ReimbursementRequest } from '@mth/models'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import { ReimbursementRequestTableProps } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestTable/type'
import { mthButtonClasses } from '@mth/styles/button.style'
import { gradeShortText } from '@mth/utils/grade-text.util'
import { reimbursementRequestStatus } from '@mth/utils/reimbursement-request-status.util'
import { reimbursementRequestType } from '@mth/utils/reimbursement-request-type.util'
import { renderCommaString } from '@mth/utils/string.util'

export const ReimbursementRequestTable: React.FC<ReimbursementRequestTableProps> = ({
  schoolYearId,
  setSchoolYearId,
  setSchoolYear,
  filter,
  setReimbursementRequestId,
}) => {
  const [searchField, setSearchField] = useState<string>('')
  const [localSearchField, setLocalSearchField] = useState<string>('')
  const [totalCnt, setTotalCnt] = useState<number>(0)
  const [paginationLimit, setPaginationLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [skip, setSkip] = useState<number>(0)
  const [sortField, setSortField] = useState<string>('date_submitted')
  const [sortOrder, setSortOrder] = useState<Order>(Order.ASC)
  const [tableData, setTableData] = useState<MthTableRowItem<ReimbursementRequest>[]>([])
  const [selectedItems, setSelectedItems] = useState<ReimbursementRequest[]>([])
  const [showNoSelectError, setShowNoSelectError] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false)

  const fields: MthTableField<ReimbursementRequest>[] = [
    {
      key: 'date_submitted',
      label: 'Date',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return item.rawData.date_submitted ? moment(item.rawData.date_submitted)?.format('MM/DD/YYYY') : ''
      },
    },
    {
      key: 'total_amount',
      label: 'Amount',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return `$${item.rawData.total_amount}`
      },
    },
    {
      key: 'studentName',
      label: 'Student',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <Typography
            sx={{ fontSize: '12px', color: MthColor.MTHBLUE, cursor: 'pointer' }}
            onClick={() => goToDetails(item.rawData)}
          >
            {`${item.rawData.Student?.person?.last_name}, ${item.rawData.Student?.person?.first_name}`}
          </Typography>
        )
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return gradeShortText(item.rawData.Student?.grade_levels?.[0]?.grade_level)
      },
    },
    {
      key: 'parentName',
      label: 'Parent',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <Typography
            sx={{ fontSize: '12px', color: MthColor.MTHBLUE, cursor: 'pointer' }}
            onClick={() => goToDetails(item.rawData)}
          >
            {`${item.rawData.Student?.parent?.person?.last_name}, ${item.rawData.Student?.parent?.person?.first_name}`}
          </Typography>
        )
      },
    },
    {
      key: 'requestStatus',
      label: 'Status',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return reimbursementRequestStatus(item.rawData.status)
      },
    },
    {
      key: 'date_paid',
      label: 'Paid/Ordered',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return item.rawData.date_paid || item.rawData.date_ordered
          ? moment(item.rawData.date_paid || item.rawData.date_ordered)?.format('MM/DD/YYYY')
          : ''
      },
    },
    {
      key: 'form_type',
      label: 'Type',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return reimbursementRequestType(item.rawData.form_type)
      },
    },
    {
      key: 'periods',
      label: 'Period',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return item.rawData.periods ? `Period ${renderCommaString(item.rawData.periods)}` : ''
      },
    },
    {
      key: 'request',
      label: 'Request',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return item.rawData.is_direct_order ? 'DO' : 'RB'
      },
    },
    {
      key: 'emailed',
      label: 'Emailed',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <Typography
            sx={{ fontSize: '12px', fontWeight: '600', color: MthColor.MTHBLUE, cursor: 'pointer' }}
            onClick={() => {
              // handleOpenEmailHistory(item.rawData)
            }}
          >
            {item.rawData.ReimbursementRequestEmails?.length
              ? moment(item.rawData.ReimbursementRequestEmails.at(0)?.created_at)?.format('MM/DD/YYYY')
              : ''}
          </Typography>
        )
      },
    },
  ]

  const { loading, data, refetch } = useQuery(getReimbursementRequestsQuery, {
    variables: {
      schoolYearId: +schoolYearId,
      filter: filter || {},
      skip: skip,
      take: paginationLimit,
      sort: `${sortField}|${sortOrder}`,
      search: searchField,
    },
    skip: !schoolYearId,
    fetchPolicy: 'network-only',
  })

  const [deleteReimbursementRequests] = useMutation(deleteReimbursementRequestsMutation)
  const [emailReimbursementRequests] = useMutation(emailResourceRequestsMutation)

  const createData = (request: ReimbursementRequest): MthTableRowItem<ReimbursementRequest> => {
    return {
      key: `reimbursement-request-${request.reimbursement_request_id}`,
      columns: {},
      selectable: true,
      isSelected: false,
      rawData: request,
    }
  }

  const handlePageChange = (page: number) => {
    localStorage.setItem('currentPage', page.toString())
    setCurrentPage(page)
    setSkip(() => {
      return paginationLimit ? paginationLimit * (page - 1) : 25
    })
  }

  const handleChangePageLimit = (value: number) => {
    localStorage.setItem('pageLimit', `${value}`)
    handlePageChange(1)
    setPaginationLimit(value)
  }

  const changeHandler = (event = '') => {
    setSearchField(event)
  }
  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

  const handleSelectionChange = (items: MthTableRowItem<ReimbursementRequest>[]) => {
    setSelectedItems(items.filter((item) => item.isSelected).map((item) => item.rawData))
  }

  const handleSort = (property: string, order: Order) => {
    setSortField(property)
    setSortOrder(order)
  }

  const handleEmailSend = async (from: string, subject: string, body: string) => {
    await emailReimbursementRequests({
      variables: {
        emailResourceRequestsInput: {
          resourceRequestIds:
            selectedItems.length > 0 ? selectedItems : selectedItems.map((item) => item.reimbursement_request_id),
          from: from,
          subject: subject,
          body: body,
        },
      },
    })
    setShowEmailModal(false)
    await refetch()
  }

  const handleDelete = async () => {
    await deleteReimbursementRequests({
      variables: {
        reimbursementRequestsActionInput: {
          reimbursementRequestIds: selectedItems.map((item) => item.reimbursement_request_id),
        },
      },
    })
    await refetch()
  }

  const goToDetails = (item: ReimbursementRequest) => {
    setReimbursementRequestId(item.reimbursement_request_id)
  }

  useEffect(() => {
    setLocalSearchField(localSearchField)
    debouncedChangeHandler(localSearchField)
  }, [localSearchField])

  useEffect(() => {
    if (!loading && data?.reimbursementRequests) {
      const { reimbursementRequests } = data
      const { results, total } = reimbursementRequests
      setTotalCnt(total)
      setTableData(
        (results || []).map((item: ReimbursementRequest) => {
          return createData(item)
        }),
      )
      setSelectedItems([])
    }
  }, [loading, data])

  useEffect(() => {
    if (filter) refetch()
  }, [filter])

  return (
    <PageBlock>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Typography data-testid='pageTitle' sx={{ fontSize: '20px', fontWeight: '700' }}>
            Requests
          </Typography>
          <Typography data-testid='totalCnt' sx={{ fontSize: '20px', fontWeight: '700', marginLeft: 2 }}>
            {totalCnt || ''}
          </Typography>
          <Box marginLeft={4}>
            <OutlinedInput
              data-testid='search'
              sx={{ width: '280px' }}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              fullWidth
              value={localSearchField}
              placeholder='Search...'
              onChange={(e) => setLocalSearchField(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
          <Box marginLeft={4}>
            <Button
              data-testid='emailBtn'
              sx={{ ...mthButtonClasses.smallDark, width: '160px' }}
              onClick={() => {
                if (!selectedItems?.length) {
                  setShowNoSelectError(true)
                } else {
                  setShowEmailModal(true)
                }
              }}
            >
              Email
            </Button>
          </Box>
        </Box>
        <Box>
          <SchoolYearDropDown
            testId='schoolYearDropdown'
            selectedYearId={schoolYearId}
            setSelectedYearId={setSchoolYearId}
            setSelectedYear={setSchoolYear}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Button data-testid='payBtn' sx={mthButtonClasses.primary} onClick={() => {}}>
            Pay & Download
          </Button>
          <Button
            data-testid='deleteBtn'
            sx={mthButtonClasses.red}
            onClick={() => {
              if (selectedItems?.length) {
                setShowDeleteModal(true)
              } else {
                setShowNoSelectError(true)
              }
            }}
          >
            Delete
          </Button>
        </Box>
        <Pagination
          testId='pagination'
          setParentLimit={handleChangePageLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginationLimit || 25}
          numPages={Math.ceil(totalCnt / paginationLimit) || 1}
          currentPage={currentPage}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <MthTable
          items={tableData}
          fields={fields}
          size='small'
          labelSize={12}
          selectable={true}
          oddBg={false}
          isTableCellBorder={false}
          defaultOrder={Order.ASC}
          defaultOrderBy={sortField}
          onSelectionChange={handleSelectionChange}
          onSortChange={handleSort}
        />
      </Box>

      {showNoSelectError && (
        <WarningModal
          title='Error'
          subtitle='No request selected'
          btntitle='Ok'
          handleModem={() => setShowNoSelectError(false)}
          handleSubmit={() => setShowNoSelectError(false)}
          textCenter={true}
        />
      )}

      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='Are you sure you want to delete this request?'
          cancelStr='Cancel'
          confirmStr='Delete'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            handleDelete()
            setShowDeleteModal(false)
          }}
        />
      )}

      {showEmailModal && (
        <ApplicationEmailModal
          handleModem={() => setShowEmailModal(!showEmailModal)}
          title={
            selectedItems.length > 0
              ? selectedItems.length + (selectedItems.length > 1 ? ' Recipients' : ' Recipient')
              : selectedItems.length + (selectedItems.length > 1 ? ' Recipients' : ' Recipient')
          }
          handleSubmit={handleEmailSend}
          editFrom={true}
          isNonSelected={false}
          filters={[]}
          inserts={['parent', 'student', 'username', 'password', 'parent_email', 'student_email', 'resource']}
          insertDescriptions={{
            parent: "Parent's First Name",
            student: "Student's First Name",
            username: 'Student Username',
            password: 'User Password',
            parent_email: 'Parent Email',
            student_email: 'Student Email',
            resource: 'Resource Title',
          }}
          handleSchedulesByStatus={() => {}}
        />
      )}
    </PageBlock>
  )
}
