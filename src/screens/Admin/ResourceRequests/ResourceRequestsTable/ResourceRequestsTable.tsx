import React, { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import { debounce } from 'lodash'
import moment from 'moment'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { PageBlock } from '@mth/components/PageBlock'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { MthColor, ResourceSubtitle } from '@mth/enums'
import { getResourceRequestsQuery } from '@mth/graphql/queries/resource-request'
import { ResourceRequest } from '@mth/models'
import { SchoolYearDropDown } from '@mth/screens/Admin/Components/SchoolYearDropdown'
import { ResourceRequestsTableProps } from '@mth/screens/Admin/ResourceRequests/ResourceRequestsTable/type'
import { mthButtonClasses } from '@mth/styles/button.style'
import { studentStatusText } from '@mth/utils'

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
  const [tableData, setTableData] = useState<MthTableRowItem<ResourceRequest>[]>([])

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
        return item.rawData.Student?.person?.first_name
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
        return item.rawData.status
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
            <Typography sx={{ fontSize: '12px', fontWeight: '600', color: MthColor.MTHBLUE }}>09/01/2021</Typography>
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
      sort: '',
      search: searchField,
    },
    skip: !schoolYearId,
    fetchPolicy: 'network-only',
  })
  const createData = (resourceRequest: ResourceRequest): MthTableRowItem<ResourceRequest> => {
    return {
      key: `schedule-request-${resourceRequest.resource_id}-${resourceRequest.student_id}`,
      columns: {},
      selectable: true,
      isSelected: true,
      rawData: resourceRequest,
      expandNode: (
        <Box
          sx={{
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
            <Typography>
              {moment(resourceRequest.Student?.parent?.person?.date_of_birth).format('MM/DD/YYYY')}
            </Typography>
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
            <Button sx={{ ...mthButtonClasses.smallRed, width: '160px' }}>Email</Button>
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
        <Button sx={mthButtonClasses.green}>Accept</Button>
        <Button sx={mthButtonClasses.orange}>Remove Resource</Button>
        <Button sx={mthButtonClasses.yellow}>Delete Request</Button>
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
        />
      </Box>
    </PageBlock>
  )
}
