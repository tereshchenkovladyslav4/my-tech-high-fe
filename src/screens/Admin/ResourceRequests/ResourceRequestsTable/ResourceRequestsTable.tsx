import React, { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, IconButton, InputAdornment, OutlinedInput, Tooltip, Typography } from '@mui/material'
import { debounce } from 'lodash'
import moment from 'moment'
import { EmailHistoryModal } from '@mth/components/EmailHistoryModal/EmailHistoryModal'
import { ApplicationEmailModal } from '@mth/components/EmailModal/ApplicationEmailModal'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { PageBlock } from '@mth/components/PageBlock'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { MthColor, Order, ResourceSubtitle } from '@mth/enums'
import {
  acceptResourceRequestsMutation,
  deleteResourceRequestsMutation,
  emailResourceRequestsMutation,
  removeResourceRequestsMutation,
} from '@mth/graphql/mutation/resource-request'
import { getResourceRequestsQuery } from '@mth/graphql/queries/resource-request'
import { Email, ResourceRequest } from '@mth/models'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import { ResourceRequestsTableProps } from '@mth/screens/Admin/ResourceRequests/ResourceRequestsTable/type'
import { mthButtonClasses } from '@mth/styles/button.style'
import { gradeShortText, resourceRequestStatus, studentStatusText } from '@mth/utils'
import ResourceRequestEdit from '../ResourceRequestEdit/ResourceRequestEdit'

export const ResourceRequestsTable: React.FC<ResourceRequestsTableProps> = ({
  schoolYearId,
  setSchoolYearId,
  schoolYear,
  setSchoolYear,
  filter,
}) => {
  const [searchField, setSearchField] = useState<string>('')
  const [localSearchField, setLocalSearchField] = useState<string>('')
  const [totalCnt, setTotalCnt] = useState<number>(0)
  const [paginationLimit, setPaginationLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [skip, setSkip] = useState<number>(0)
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<Order>(Order.ASC)
  const [tableData, setTableData] = useState<MthTableRowItem<ResourceRequest>[]>([])
  const [selectedItems, setSelectedItems] = useState<ResourceRequest[]>([])
  const [showNoSelectError, setShowNoSelectError] = useState<boolean>(false)
  const [emailHistory, setEmailHistory] = useState<Email[]>([])
  const [showEmailHistoryModal, setShowEmailHistoryModal] = useState<boolean>(false)
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false)
  const [highlightItem, setHighlightItem] = useState<ResourceRequest | undefined>()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  const fields: MthTableField<ResourceRequest>[] = [
    {
      key: 'created_at',
      label: 'Submitted',
      sortable: true,
      width: '110px',
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        return moment(item.rawData.created_at)?.format('MM/DD/YYYY')
      },
    },
    {
      key: 'lastname',
      label: 'Student Last',
      sortable: true,
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        return item.rawData.Student?.person?.last_name
      },
    },
    {
      key: 'firstname',
      label: 'Student First',
      sortable: true,
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        return item.rawData.Student?.person?.first_name
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: true,
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        return gradeShortText(item.rawData.Student?.grade_levels?.[0]?.grade_level)
      },
    },
    {
      key: 'email',
      label: 'Student Email',
      sortable: true,
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        return item.rawData.Student?.person?.email
      },
    },
    {
      key: 'vendor',
      label: 'Vendor',
      sortable: true,
      formatter: () => {
        return 'Adobe'
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        return resourceRequestStatus(item.rawData.status)
      },
    },
    {
      key: 'cost',
      label: 'Cost',
      sortable: true,
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        const subtitle = item.rawData.Resource?.subtitle
        const price = item.rawData.Resource?.price
        return subtitle == ResourceSubtitle.PRICE
          ? `$${price}`
          : subtitle == ResourceSubtitle.INCLUDED
          ? 'Included'
          : 'Free'
      },
    },
    {
      key: 'emailed',
      label: 'Emailed',
      sortable: true,
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              sx={{ fontSize: '12px', fontWeight: '600', color: MthColor.MTHBLUE, cursor: 'pointer' }}
              onClick={() => handleOpenEmailHistory(item.rawData)}
            >
              {item.rawData.ResourceRequestEmails?.length
                ? moment(item.rawData.ResourceRequestEmails[0].created_at)?.format('MM/DD/YYYY')
                : ''}
            </Typography>
            <IconButton
              onClick={() => {
                if (item.toggleExpand) item.toggleExpand()
              }}
              className='actionButton expandButton'
              color='primary'
            >
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const { loading, data, refetch } = useQuery(getResourceRequestsQuery, {
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

  const [acceptResourceRequests] = useMutation(acceptResourceRequestsMutation)
  const [removeResourceRequests] = useMutation(removeResourceRequestsMutation)
  const [deleteResourceRequests] = useMutation(deleteResourceRequestsMutation)
  const [emailResourceRequests] = useMutation(emailResourceRequestsMutation)

  const createData = (resourceRequest: ResourceRequest): MthTableRowItem<ResourceRequest> => {
    return {
      key: `schedule-request-${resourceRequest.resource_id}-${resourceRequest.student_id}`,
      columns: {},
      selectable: true,
      isSelected: false,
      rawData: resourceRequest,
      expandNode: (
        <Box
          sx={{
            position: 'relative',
            p: '8px 64px',
            '& .MuiBox-root': {
              display: 'flex',
              paddingY: '3px',
              '& .MuiTypography-root:first-of-type': {
                fontSize: '12px',
                fontWeight: 700,
                width: '106px',
                color: MthColor.BLACK,
              },
              '& .MuiTypography-root:last-of-type': { fontSize: '12px', fontWeight: 600 },
            },
          }}
        >
          <Box>
            <Typography>Parent First</Typography>
            <Typography>{resourceRequest.Student?.parent?.person?.first_name}</Typography>
          </Box>
          <Box>
            <Typography>Parent Last</Typography>
            <Typography>{resourceRequest.Student?.parent?.person?.last_name}</Typography>
          </Box>
          <Box>
            <Typography>Parent Email</Typography>
            <Typography>{resourceRequest.Student?.parent?.person?.email}</Typography>
          </Box>
          <Box>
            <Typography>Birthdate</Typography>
            <Typography>{moment(resourceRequest.Student?.person?.date_of_birth).format('MM/DD/YYYY')}</Typography>
          </Box>
          <Box>
            <Typography>Username</Typography>
            <Typography>{resourceRequest.Resource?.std_user_name}</Typography>
          </Box>
          <Box>
            <Typography>Password</Typography>
            <Typography>{resourceRequest.Resource?.std_password}</Typography>
          </Box>
          <Box>
            <Typography>Returning Status</Typography>
            <Typography>No</Typography>
          </Box>
          <Box>
            <Typography>Student ID</Typography>
            <Typography>{resourceRequest.Student?.student_id}</Typography>
          </Box>
          <Box>
            <Typography>{`${moment(schoolYear?.date_begin).format('YYYY')}-${moment(schoolYear?.date_end).format(
              'YY',
            )} Status`}</Typography>
            <Typography>{studentStatusText(resourceRequest.Student?.status?.[0])}</Typography>
          </Box>
          <Box>
            <Typography>Resource Level</Typography>
            <Typography>{resourceRequest.ResourceLevel?.name}</Typography>
          </Box>

          <Box sx={{ position: 'absolute', bottom: 2, right: 2 }}>
            <Tooltip title='Edit' placement='top'>
              <IconButton
                sx={{
                  position: 'relative',
                  bottom: '2px',
                  width: '32px',
                  height: '32px',
                  marginY: 'auto',
                }}
                onClick={() => {
                  setHighlightItem(resourceRequest)
                  setShowEditModal(true)
                }}
              >
                <ModeEditIcon sx={{ fontSize: '22px', fontWeight: 700, color: MthColor.SYSTEM_01 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ),
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

  const handleSelectionChange = (items: MthTableRowItem<ResourceRequest>[]) => {
    setSelectedItems(items.filter((item) => item.isSelected).map((item) => item.rawData))
  }

  const handleEmailSend = async (from: string, subject: string, body: string) => {
    await emailResourceRequests({
      variables: {
        emailResourceRequestsInput: {
          resourceRequestIds: selectedItems.map((item) => item.id),
          from: from,
          subject: subject,
          body: body,
        },
      },
    })
    setShowEmailModal(false)
    refetch()
  }

  const handleAccept = async () => {
    if (selectedItems?.length) {
      await acceptResourceRequests({
        variables: {
          resourceRequestsActionInput: {
            resourceRequestIds: selectedItems.map((item) => item.id),
          },
        },
      })
      await refetch()
    } else {
      setShowNoSelectError(true)
    }
  }

  const handleRemove = async () => {
    if (selectedItems?.length) {
      await removeResourceRequests({
        variables: {
          resourceRequestsActionInput: {
            resourceRequestIds: selectedItems.map((item) => item.id),
          },
        },
      })
      await refetch()
    } else {
      setShowNoSelectError(true)
    }
  }

  const handleDelete = async () => {
    if (selectedItems?.length) {
      await deleteResourceRequests({
        variables: {
          resourceRequestsActionInput: {
            resourceRequestIds: selectedItems.map((item) => item.id),
          },
        },
      })
      await refetch()
    } else {
      setShowNoSelectError(true)
    }
  }

  const handleSort = (property: string, order: Order) => {
    setSortField(property)
    setSortOrder(order)
  }

  const handleOpenEmailHistory = (data: ResourceRequest) => {
    setEmailHistory(data?.ResourceRequestEmails)
    setShowEmailHistoryModal(true)
  }

  useEffect(() => {
    setLocalSearchField(localSearchField)
    debouncedChangeHandler(localSearchField)
  }, [localSearchField])

  useEffect(() => {
    if (!loading && data?.resourceRequests) {
      const { resourceRequests } = data
      const { results, total } = resourceRequests
      setTotalCnt(total)
      setTableData(
        (results || []).map((item: ResourceRequest) => {
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
          <Typography sx={{ fontSize: '20px', fontWeight: '700' }}>Requests</Typography>
          <Typography sx={{ fontSize: '20px', fontWeight: '700', marginLeft: 2 }}>{totalCnt || ''}</Typography>
          <Box marginLeft={4}>
            <OutlinedInput
              sx={{
                width: '280px',
              }}
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
              sx={{ ...mthButtonClasses.smallRed, width: '160px' }}
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
            selectedYearId={schoolYearId}
            setSelectedYearId={setSchoolYearId}
            setSelectedYear={setSchoolYear}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: '60px', mt: 4 }}>
        <Button sx={mthButtonClasses.primary}>Download</Button>
        <Button sx={mthButtonClasses.green} onClick={() => handleAccept()}>
          Accept
        </Button>
        <Button sx={mthButtonClasses.orange} onClick={() => handleRemove()}>
          Remove Resource
        </Button>
        <Button sx={mthButtonClasses.yellow} onClick={() => handleDelete()}>
          Delete Request
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button sx={mthButtonClasses.darkGray}>Import</Button>
        <Pagination
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
          subtitle='No student(s) selected'
          btntitle='Ok'
          handleModem={() => setShowNoSelectError(false)}
          handleSubmit={() => setShowNoSelectError(false)}
          textCenter={true}
        />
      )}

      {showEmailHistoryModal && !!emailHistory?.length && (
        <EmailHistoryModal
          handleModem={() => {}}
          handleSubmit={() => setShowEmailHistoryModal(false)}
          data={emailHistory}
        />
      )}

      {showEmailModal && (
        <ApplicationEmailModal
          handleModem={() => setShowEmailModal(!showEmailModal)}
          title={selectedItems.length + ' Recipients'}
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

      {showEditModal && !!highlightItem && (
        <ResourceRequestEdit item={highlightItem} refetch={refetch} setShowEditModal={setShowEditModal} />
      )}
    </PageBlock>
  )
}
