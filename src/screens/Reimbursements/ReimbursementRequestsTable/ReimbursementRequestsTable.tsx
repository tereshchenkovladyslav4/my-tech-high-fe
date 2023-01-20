import React, { useContext, useEffect, useState } from 'react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Box, Grid, IconButton, Tooltip } from '@mui/material'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import { MthColor, Order, ReimbursementFormType, ReimbursementRequestStatus } from '@mth/enums'
import { ReimbursementRequest } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { reimbursementRequestsTableClasses } from './styles'

type TableFieldProps = {
  item: ReimbursementRequest
}

type ReimbursementRequestsTableProps = {
  reimbursementSchoolYears: DropDownItem[]
  selectedYearId: number
  setSelectedYearId: (value: number) => void
}

const TableField: React.FC<TableFieldProps> = ({ item, children }) => (
  <Paragraph
    size={'large'}
    sx={{
      color: item.status === ReimbursementRequestStatus.UPDATES_REQUIRED ? MthColor.RED : MthColor.SYSTEM_05,
      fontWeight: '500',
    }}
  >
    {children}
  </Paragraph>
)

const ReimbursementRequestsTable: React.FC<ReimbursementRequestsTableProps> = ({
  reimbursementSchoolYears,
  selectedYearId,
  setSelectedYearId,
}) => {
  const { me } = useContext(UserContext)
  const [tableData, setTableData] = useState<MthTableRowItem<ReimbursementRequest>[]>([])
  const [studentItems, setStudentItems] = useState<DropDownItem[]>([])
  const [selectedItems, setSelectedItems] = useState<ReimbursementRequest[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<number>(-1)
  const [sum, setSum] = useState<number>(0)
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<Order>(Order.ASC)

  const createData = (resourceRequest: ReimbursementRequest): MthTableRowItem<ReimbursementRequest> => {
    return {
      key: `schedule-request-${resourceRequest.id}-${resourceRequest.student_id}`,
      columns: {},
      selectable: true,
      isSelected: false,
      rawData: resourceRequest,
    }
  }

  const handleSort = (property: string, order: Order) => {
    setSortField(property)
    setSortOrder(order)
  }

  const handleSelectionChange = (items: MthTableRowItem<ReimbursementRequest>[]) => {
    setSelectedItems(items.filter((item) => item.isSelected).map((item) => item.rawData))
  }

  const fields: MthTableField<ReimbursementRequest>[] = [
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      width: '110px',
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return <TableField item={item.rawData}>{`$${item.rawData.amount}`}</TableField>
      },
    },
    {
      key: 'student',
      label: 'Student',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        //return item.rawData.Student?.person?.last_name
        return <TableField item={item.rawData}>{item.rawData.student}</TableField>
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return <TableField item={item.rawData}>{item.rawData.status.toString()}</TableField>
      },
    },
    {
      key: 'request',
      label: 'Request',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <TableField item={item.rawData}>{item.rawData.is_direct_order ? 'Direct Order' : 'Reimbursement'}</TableField>
        )
      },
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <TableField item={item.rawData}>
            {REIMBURSEMENT_FORM_TYPE_ITEMS.find((x) => x.value == item.rawData.form_type.toString())?.label}
          </TableField>
        )
      },
    },
    {
      key: 'period',
      label: 'Period',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <Paragraph size={'large'} sx={{ fontWeight: '500', color: MthColor.SYSTEM_05 }}>
            {item.rawData.periods}
          </Paragraph>
        )
      },
    },
    {
      key: 'submitted',
      label: 'Submitted',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <TableField item={item.rawData}>
            {item.rawData.date_submitted && moment(item.rawData.date_submitted).format('MM/DD/YYYY')}
          </TableField>
        )
      },
    },
    {
      key: 'paid',
      label: 'Paid/Ordered',
      sortable: true,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <TableField item={item.rawData}>
            {item.rawData.date_paid && moment(item.rawData.date_paid).format('MM/DD/YYYY')}
          </TableField>
        )
      },
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      formatter: (item: MthTableRowItem<ReimbursementRequest>) => {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {item.rawData.status === ReimbursementRequestStatus.UPDATES_REQUIRED ? (
              <IconButton>
                <Tooltip title='Edit' color='primary' placement='top'>
                  <ModeEditIcon fontSize='medium' />
                </Tooltip>
              </IconButton>
            ) : (
              <IconButton>
                <Tooltip title='View' color='primary' placement='top'>
                  <VisibilityOutlinedIcon fontSize='medium' />
                </Tooltip>
              </IconButton>
            )}
            {item.rawData.status === ReimbursementRequestStatus.DRAFT && (
              <IconButton>
                <Tooltip title='Delete' color='primary' placement='top'>
                  <DeleteForeverOutlined fontSize='medium' />
                </Tooltip>
              </IconButton>
            )}
          </Box>
        )
      },
    },
  ]

  useEffect(() => {
    if (me?.students?.length) {
      setStudentItems([
        {
          label: 'All Students',
          value: -1,
        },
        ...me?.students?.map((student) => {
          return {
            label: `${student?.person?.first_name} ${student?.person?.last_name}`,
            value: +(student?.student_id || 0),
          }
        }),
      ] as DropDownItem[])
    }
  }, [me?.students])

  useEffect(() => {
    const results: ReimbursementRequest[] = [
      {
        id: 1,
        student_id: 1,
        status: ReimbursementRequestStatus.UPDATES_REQUIRED,
        SchoolYearId: 19,
        amount: 100,
        date_submitted: '2022-09-30',
        date_paid: '',
        date_ordered: '',
        is_direct_order: false,
        form_type: ReimbursementFormType.THIRD_PARTY_PROVIDER,
        periods: 'Period 5',
        student: 'Hunter',
      },
      {
        id: 2,
        student_id: 2,
        status: ReimbursementRequestStatus.PAID,
        SchoolYearId: 19,
        amount: 100,
        date_submitted: '2022-10-05',
        date_paid: '2022-10-12',
        date_ordered: '',
        is_direct_order: false,
        form_type: ReimbursementFormType.TECHNOLOGY,
        periods: '',
        student: 'Hailey',
      },
      {
        id: 3,
        student_id: 3,
        status: ReimbursementRequestStatus.DRAFT,
        SchoolYearId: 19,
        amount: 100,
        date_submitted: '2022-09-27',
        date_paid: '',
        date_ordered: '',
        is_direct_order: true,
        form_type: ReimbursementFormType.CUSTOM_BUILT,
        periods: 'Period 2, 3, 4 and 6',
        student: 'Hayden',
      },
      {
        id: 4,
        student_id: 4,
        status: ReimbursementRequestStatus.RESUBMITTED,
        SchoolYearId: 19,
        amount: 100,
        date_submitted: '2022-09-28',
        date_paid: '',
        date_ordered: '',
        is_direct_order: false,
        form_type: ReimbursementFormType.CUSTOM_BUILT,
        periods: 'Period 2, 3, 4 and 6',
        student: 'Hayden',
      },
    ]
    let tempSum = 0
    results?.map((result) => {
      tempSum += result.amount
    })
    setSum(tempSum)
    setTableData(
      (results || []).map((item: ReimbursementRequest) => {
        return createData(item)
      }),
    )
  }, [])

  // This will be deleted
  useEffect(() => {}, [selectedItems, sortOrder])

  return (
    <Grid container>
      <Grid item xs={12} sx={{ paddingX: 2 }}>
        <Box sx={{ width: '200px' }}>
          <DropDown
            dropDownItems={reimbursementSchoolYears}
            placeholder={'Select Year'}
            defaultValue={selectedYearId}
            borderNone={true}
            setParentValue={(val) => {
              setSelectedYearId(Number(val))
            }}
            color={MthColor.SYSTEM_01}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ paddingX: 2 }}>
        <Box sx={{ width: '200px', marginLeft: 'auto' }}>
          <DropDown
            dropDownItems={studentItems}
            placeholder={'Select Student'}
            defaultValue={selectedStudentId}
            borderNone={true}
            setParentValue={(val) => {
              setSelectedStudentId(Number(val))
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ paddingX: 2 }}>
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
            labelSize={12}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ paddingX: 2 }}>
        <Box sx={reimbursementRequestsTableClasses.sumBody}>
          <Paragraph size={'large'} sx={reimbursementRequestsTableClasses.sumLabel}>
            Sum
          </Paragraph>
          <Paragraph size={'large'} sx={{ ...reimbursementRequestsTableClasses.sumLabel, marginLeft: 5 }}>
            {`$${sum.toFixed(2)}`}
          </Paragraph>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ReimbursementRequestsTable
