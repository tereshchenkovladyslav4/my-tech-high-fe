import React, { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, IconButton, InputAdornment, OutlinedInput, Tooltip, Typography } from '@mui/material'
import { debounce } from 'lodash'
import moment from 'moment'
import * as XLSX from 'xlsx'
import { EmailHistoryModal } from '@mth/components/EmailHistoryModal/EmailHistoryModal'
import { ApplicationEmailModal } from '@mth/components/EmailModal/ApplicationEmailModal'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { PageBlock } from '@mth/components/PageBlock'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { RESOURCE_REQUEST_STATUS_ITEMS } from '@mth/constants'
import { MthColor, Order, ResourceRequestAction } from '@mth/enums'
import {
  acceptResourceRequestsMutation,
  deleteResourceRequestsMutation,
  emailResourceRequestsMutation,
  removeResourceRequestsMutation,
  updateResourceRequestMutation,
} from '@mth/graphql/mutation/resource-request'
import { getResourceRequestsQuery } from '@mth/graphql/queries/resource-request'
import { Email, ResourceRequest } from '@mth/models'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import {
  FailedResourceRequest,
  ResourceRequestsFileType,
  ResourceRequestsTableProps,
  UpdateResourceRequestVM,
} from '@mth/screens/Admin/ResourceRequests/ResourceRequestsTable/type'
import { mthButtonClasses } from '@mth/styles/button.style'
import { showDate } from '@mth/utils/date.util'
import { gradeShortText } from '@mth/utils/grade-text.util'
import { resourceRequestCost } from '@mth/utils/resource-request-cost.util'
import { resourceRequestStatus } from '@mth/utils/resource-request-status.util'
import { schoolYearLabel } from '@mth/utils/school-year.util'
import { studentStatusText } from '@mth/utils/student-status.util'
import { FileUploadModal } from '../../HomeRoom/Components/FileUploadModal'
import ResourceRequestEdit from '../ResourceRequestEdit/ResourceRequestEdit'
import { SuccessModal } from '../SuccessModal'

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
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [fileFormatError, setFileFormatError] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [failedResourceRequests, setFailedResourceRequests] = useState<FailedResourceRequest[]>([])
  const [succeededResourceRequestIds, setSucceededResourceRequestIds] = useState<number[]>([])
  const [importedResourceRequests, setImportedResourceRequests] = useState<ResourceRequestsFileType[]>([])

  const [submitSave, {}] = useMutation(updateResourceRequestMutation)

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
      formatter: (item: MthTableRowItem<ResourceRequest>) => {
        return item.rawData.Resource?.title
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
        return resourceRequestCost(item.rawData)
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
                ? moment(item.rawData.ResourceRequestEmails.at(0)?.created_at)?.format('MM/DD/YYYY')
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
            <Typography>{showDate(resourceRequest.Student?.person?.date_of_birth)}</Typography>
          </Box>
          <Box>
            <Typography>Username</Typography>
            <Typography>{resourceRequest.username}</Typography>
          </Box>
          <Box>
            <Typography>Password</Typography>
            <Typography>{resourceRequest.password}</Typography>
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
            {resourceRequest.Student?.applications?.find(
              (application) => application.school_year_id == schoolYear?.school_year_id,
            )?.midyear_application ? (
              <Typography>{`${schoolYearLabel(schoolYear)} Mid-year Status`}</Typography>
            ) : (
              <Typography>{`${schoolYearLabel(schoolYear)} Status`}</Typography>
            )}
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
          resourceRequestIds:
            succeededResourceRequestIds.length > 0 ? succeededResourceRequestIds : selectedItems.map((item) => item.id),
          from: from,
          subject: subject,
          body: body,
        },
      },
    })
    setSucceededResourceRequestIds([])
    setFailedResourceRequests([])
    setShowEmailModal(false)
    await refetch()
  }

  const handleAccept = async (items: number[]) => {
    if (items?.length) {
      await acceptResourceRequests({
        variables: {
          resourceRequestsActionInput: {
            resourceRequestIds: items,
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

  const handleDownloadResourceRequests = () => {
    if (!tableData?.length) {
      setShowNoSelectError(true)
      return
    }
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(
      tableData.map(({ rawData }) => {
        return {
          Vendor: rawData?.Resource?.title,
          'Resource Level': rawData?.ResourceLevel?.name,
          Submitted: moment(rawData?.created_at)?.format('MM/DD/YYYY'),
          Status: resourceRequestStatus(rawData.status),
          'Student ID': rawData?.Student?.student_id,
          'Student First Name': rawData?.Student?.person?.first_name,
          'Student Last Name': rawData?.Student?.person?.last_name,
          'Student Email': rawData?.Student?.person?.email,
          Grade: gradeShortText(rawData?.Student?.grade_levels?.[0]?.grade_level),
          'Student Birthdate': showDate(rawData?.Student?.person?.date_of_birth),
          'Parent First Name': rawData?.Student?.parent?.person?.first_name,
          'Parent Last Name': rawData?.Student?.parent?.person?.last_name,
          'Parent Email': rawData?.Student?.parent?.person?.email,
          Cost: resourceRequestCost(rawData),
          'Username Generator': rawData?.username,
          'Password Generator': rawData?.password,
          'Returning Status': 'No',
          [`${schoolYearLabel(schoolYear)} Status`]: studentStatusText(rawData?.Student?.status?.[0]),
          'Resource Request ID': rawData?.id,
        }
      }),
    )
    XLSX.utils.book_append_sheet(wb, ws, 'Blank')
    XLSX.writeFile(wb, 'Homeroom Resource Requests 2.0.xlsx')
  }

  const handleSort = (property: string, order: Order) => {
    setSortField(property)
    setSortOrder(order)
  }

  const handleOpenEmailHistory = (data: ResourceRequest) => {
    setEmailHistory(data?.ResourceRequestEmails)
    setShowEmailHistoryModal(true)
  }

  const handleImportTemplate = async (file: File) => {
    setFileFormatError(false)
    const fileBuffer = await file.arrayBuffer()
    const wb = XLSX.read(fileBuffer)
    const ws = wb.Sheets[wb.SheetNames[0]]
    const sheetHeader = XLSX.utils.sheet_to_json(ws, { header: 1 })[0] as string[]
    let isFormat = false
    if (
      sheetHeader.includes('Vendor') &&
      sheetHeader.includes('Resource Level') &&
      sheetHeader.includes('Submitted') &&
      sheetHeader.includes('Status') &&
      sheetHeader.includes('Student ID') &&
      sheetHeader.includes('Student First Name') &&
      sheetHeader.includes('Student Last Name') &&
      sheetHeader.includes('Student Email') &&
      sheetHeader.includes('Grade') &&
      sheetHeader.includes('Student Birthdate') &&
      sheetHeader.includes('Parent First Name') &&
      sheetHeader.includes('Parent Last Name') &&
      sheetHeader.includes('Parent Email') &&
      sheetHeader.includes('Cost') &&
      sheetHeader.includes('Username Generator') &&
      sheetHeader.includes('Password Generator') &&
      sheetHeader.includes('Returning Status') &&
      sheetHeader.includes(`${schoolYearLabel(schoolYear)} Status`) &&
      sheetHeader.includes('Resource Request ID')
    ) {
      isFormat = true
    }
    if (!isFormat) {
      setFileFormatError(true)
      return
    }
    const jsonData: ResourceRequestsFileType[] = XLSX.utils.sheet_to_json(ws, { raw: false })

    if (!jsonData?.length) {
      setFileFormatError(true)
      return
    }

    setImportedResourceRequests(jsonData)
    const dataToSave: UpdateResourceRequestVM[] = jsonData?.map((item: ResourceRequestsFileType) => {
      return {
        id: +item['Resource Request ID'],
        username: `${item['Username Generator'] || ''}`,
        password: `${item['Password Generator'] || ''}`,
        vendor: `${item['Vendor'] || ''}`,
        resource_level_name: `${item['Resource Level'] || ''}`,
        created_at: `${showDate(item['Submitted'] || '')}`,
        status: RESOURCE_REQUEST_STATUS_ITEMS.find((x) => x.label === item['Status'])?.value || '',
        student_id: `${item['Student ID'] || ''}`,
        student_first_name: `${item['Student First Name'] || ''}`,
        student_last_name: `${item['Student Last Name'] || ''}`,
        student_email: `${item['Student Email'] || ''}`,
        grade_level: `${item['Grade'] || ''}`,
        date_of_birth: `${showDate(item['Student Birthdate'] || '')}`,
        parent_first_name: `${item['Parent First Name'] || ''}`,
        parent_last_name: `${item['Parent Last Name'] || ''}`,
        parent_email: `${item['Parent Email'] || ''}`,
        cost: `${item['Cost'] || ''}`,
        returning_status: `${item['Returning Status'] || ''}`,
        // @ts-ignore
        student_status: `${item[`${schoolYearLabel(schoolYear)} Status`] || ''}`,
      }
    })

    const promises: Promise<void>[] = []

    dataToSave?.map((item: UpdateResourceRequestVM) => {
      promises.push(
        new Promise<void>(async (resolve) => {
          await submitSave({
            variables: {
              updateResourceRequestInput: item,
            },
          })
            .then(() => {
              setSucceededResourceRequestIds((pre) => [...pre, +item.id])
              resolve()
            })
            .catch((err) => {
              setFailedResourceRequests((pre) => [...pre, { id: +item.id, message: err.message }])
              resolve()
            })
        }),
      )
    })

    Promise.all(promises).finally(async () => {
      setShowSuccessModal(true)
      setShowUploadModal(false)
      await refetch()
    })
  }

  const handleDownloadErrors = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(
      importedResourceRequests
        ?.filter((item) => failedResourceRequests?.findIndex((x) => x.id == +item['Resource Request ID']) > -1)
        .map((item) => {
          const error = failedResourceRequests?.find((x) => x.id == +item['Resource Request ID'])
          return { Error: error?.message, ...item }
        }),
    )
    XLSX.utils.book_append_sheet(wb, ws, 'Blank')
    XLSX.writeFile(wb, 'resource-requests-errors.xlsx')
  }

  const handleAction = (value: ResourceRequestAction) => {
    if (value === ResourceRequestAction.ACCEPTED_EMAIL) {
      handleAccept(succeededResourceRequestIds)
      setShowEmailModal(true)
    } else if (value === ResourceRequestAction.ACCEPTED) {
      handleAccept(succeededResourceRequestIds)
      setSucceededResourceRequestIds([])
      setFailedResourceRequests([])
    } else {
      setSucceededResourceRequestIds([])
      setFailedResourceRequests([])
    }
    setShowSuccessModal(false)
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
          <Typography data-testid='pageTitle' sx={{ fontSize: '20px', fontWeight: '700' }}>
            Requests
          </Typography>
          <Typography data-testid='totalCnt' sx={{ fontSize: '20px', fontWeight: '700', marginLeft: 2 }}>
            {totalCnt || ''}
          </Typography>
          <Box marginLeft={4}>
            <OutlinedInput
              data-testid='search'
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
              data-testid='emailBtn'
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
            testId='schoolYearDropdown'
            selectedYearId={schoolYearId}
            setSelectedYearId={setSchoolYearId}
            setSelectedYear={setSchoolYear}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: '60px', mt: 4 }}>
        <Button
          data-testid='downloadBtn'
          sx={mthButtonClasses.primary}
          onClick={() => handleDownloadResourceRequests()}
        >
          Download
        </Button>
        <Button
          data-testid='acceptBtn'
          sx={mthButtonClasses.green}
          onClick={() => handleAccept(selectedItems?.map((item) => +item.id))}
        >
          Accept
        </Button>
        <Button data-testid='removeBtn' sx={mthButtonClasses.orange} onClick={() => handleRemove()}>
          Remove Resource
        </Button>
        <Button data-testid='deleteBtn' sx={mthButtonClasses.yellow} onClick={() => handleDelete()}>
          Delete Request
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button data-testid='importBtn' sx={mthButtonClasses.darkGray} onClick={() => setShowUploadModal(true)}>
          Import
        </Button>
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

      <FileUploadModal
        open={showUploadModal}
        onClose={() => {
          setShowUploadModal(false)
        }}
        handleFile={handleImportTemplate}
        isError={fileFormatError}
      />

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
          data={emailHistory.sort((a, b) => {
            return moment(a.created_at).diff(moment(b.created_at), 'seconds')
          })}
          defaultDateDirection={'DESC'}
        />
      )}

      {showEmailModal && (
        <ApplicationEmailModal
          handleModem={() => setShowEmailModal(!showEmailModal)}
          title={
            succeededResourceRequestIds.length > 0
              ? succeededResourceRequestIds.length +
                (succeededResourceRequestIds.length > 1 ? ' Recipients' : ' Recipient')
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

      {showSuccessModal && (
        <SuccessModal
          failedResourceRequests={failedResourceRequests}
          succeededResourceRequestIds={succeededResourceRequestIds}
          handleAction={handleAction}
          handleDownloadErrors={handleDownloadErrors}
        />
      )}

      {showEditModal && !!highlightItem && (
        <ResourceRequestEdit item={highlightItem} refetch={refetch} setShowEditModal={setShowEditModal} />
      )}
    </PageBlock>
  )
}
