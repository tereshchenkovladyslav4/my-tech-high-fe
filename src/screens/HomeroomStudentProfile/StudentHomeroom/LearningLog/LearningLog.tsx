import React, { useContext, useEffect, useMemo, useState } from 'react'
import EastIcon from '@mui/icons-material/East'
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import moment from 'moment'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { PageBlock } from '@mth/components/PageBlock'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, Order, StudentLearningLogStatus } from '@mth/enums'
import { StudentLearningLog } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { courseCatalogHeaderClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Components/CourseCatalogHeader/styles'

type TableFieldProps = {
  item: StudentLearningLog
}

const getColor = (value: StudentLearningLog): MthColor => {
  switch (value.status) {
    case StudentLearningLogStatus.RESUBMIT:
      return MthColor.RED
    case StudentLearningLogStatus.AVAILABLE:
    case StudentLearningLogStatus.STARTED:
      return MthColor.MTHBLUE
    default:
      return MthColor.BLACK
  }
}

const TableField: React.FC<TableFieldProps> = ({ item, children }) => (
  <Paragraph size={'large'} sx={{ fontSize: '13px', fontWeight: '600', color: getColor(item) }}>
    {children}
  </Paragraph>
)

const LearningLog: React.FC = () => {
  const { me } = useContext(UserContext)
  const currentStudentId = Number(location.pathname.split('/').at(-1))
  const currentStudent = useMemo(() => {
    return me?.students?.find((student) => student?.student_id == currentStudentId)
  }, [currentStudentId])
  const [showAll, setShowAll] = useState<boolean>(true)
  const [tableData, setTableData] = useState<MthTableRowItem<StudentLearningLog>[]>([])
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<Order>(Order.ASC)

  const fields: MthTableField<StudentLearningLog>[] = [
    {
      key: 'due_date',
      label: 'Due',
      sortable: true,
      width: '110px',
      formatter: (item: MthTableRowItem<StudentLearningLog>) => {
        return <TableField item={item.rawData}>{moment(item.rawData.due_date)?.format('MMMM D')}</TableField>
      },
    },
    {
      key: 'name',
      label: 'Learning Log',
      sortable: true,
      formatter: (item: MthTableRowItem<StudentLearningLog>) => {
        return <TableField item={item.rawData}>{item.rawData.name}</TableField>
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: true,
      formatter: (item: MthTableRowItem<StudentLearningLog>) => {
        return !!item.rawData.grade && <TableField item={item.rawData}>{`${item.rawData.grade}%`}</TableField>
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      formatter: (item: MthTableRowItem<StudentLearningLog>) => {
        return item?.rawData?.status === StudentLearningLogStatus.SUBMITTED ||
          item?.rawData?.status === StudentLearningLogStatus.RESUBMITTED ? (
          <>
            <Paragraph size={'large'} sx={{ fontSize: '13px', fontWeight: '600', color: MthColor.BLACK }}>
              {item.rawData.status}
            </Paragraph>
            <Paragraph size={'large'} sx={{ fontSize: '8px', fontWeight: '600', paddingY: 0.5, color: MthColor.BLACK }}>
              {moment(item.rawData?.date_submitted).format('MMM DD [at] hh:mm A')}
            </Paragraph>
          </>
        ) : (
          <TableField item={item.rawData}>{item.rawData.status}</TableField>
        )
      },
    },
    {
      key: '',
      label: '',
      sortable: false,
      formatter: (item: MthTableRowItem<StudentLearningLog>) => {
        return (
          (item?.rawData?.status === StudentLearningLogStatus.RESUBMIT ||
            item?.rawData?.status === StudentLearningLogStatus.AVAILABLE ||
            item?.rawData?.status === StudentLearningLogStatus.STARTED) && <EastIcon />
        )
      },
    },
  ]

  const createData = (learingLog: StudentLearningLog): MthTableRowItem<StudentLearningLog> => {
    return {
      key: `learning-log-${learingLog.id}-${learingLog.name}`,
      columns: {},
      selectable: true,
      isSelected: false,
      rawData: learingLog,
    }
  }

  const handleSort = (property: string, order: Order) => {
    setSortField(property)
    setSortOrder(order)
  }

  useEffect(() => {
    const results: StudentLearningLog[] = [
      {
        due_date: '2022-10-20',
        name: 'Weekly Learning Log #8',
        grade: 100,
        status: StudentLearningLogStatus.GRADED,
      },
      {
        due_date: '2022-10-27',
        name: 'Weekly Learning Log #9',
        grade: 50,
        status: StudentLearningLogStatus.RESUBMIT,
      },
      {
        due_date: '2022-11-04',
        name: 'Weekly Learning #10',
        date_submitted: '2022-11-01 10:00:00',
        grade: 0,
        status: StudentLearningLogStatus.SUBMITTED,
      },
      {
        due_date: '2022-11-11',
        name: 'Weekly Learning Log #11',
        grade: 0,
        status: StudentLearningLogStatus.AVAILABLE,
      },
      {
        due_date: '2022-11-18',
        name: 'Weekly Learning Log #12',
        grade: 0,
        status: StudentLearningLogStatus.EXCUSED,
      },
      {
        due_date: '2022-11-22',
        name: 'Weekly Learning Log #13',
        grade: 0,
        status: StudentLearningLogStatus.NANDA,
      },
      {
        due_date: '2022-11-28',
        name: 'Weekly Learning Log #14',
        grade: 0,
        status: StudentLearningLogStatus.STARTED,
      },
      {
        due_date: '2022-12-04',
        name: 'Weekly Learning #15',
        grade: 0,
        status: StudentLearningLogStatus.RESUBMITTED,
        date_submitted: '2022-11-01 10:00:00',
      },
      {
        due_date: '2022-12-12',
        name: 'Weekly Learning Log #16',
        grade: 0,
        status: null,
      },
    ]
    setTableData(
      (results || []).map((item: StudentLearningLog) => {
        return createData(item)
      }),
    )
  }, [sortOrder])

  return (
    <PageBlock>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex' }}>
          <Subtitle
            sx={{ fontSize: '22px', fontWeight: 700 }}
          >{`${currentStudent?.person?.first_name}'s Learning Logs`}</Subtitle>
          <Box sx={{ paddingX: 3, marginY: 'auto', cursor: 'pointer' }}>
            <Tooltip title='Download' placement='top'>
              <img src={DownloadFileIcon} alt='Download Icon' />
            </Tooltip>
          </Box>
        </Box>
        <ToggleButtonGroup
          color='primary'
          value={showAll}
          exclusive
          onChange={(_event, newValue) => {
            if (newValue !== null) setShowAll(newValue)
          }}
          sx={courseCatalogHeaderClasses.toggleButtonGroup}
        >
          <ToggleButton value={true}>Show All</ToggleButton>
          <ToggleButton value={false}>Hide Graded</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ paddingY: 3 }}>
        <Pagination
          setParentLimit={() => {}}
          handlePageChange={() => {}}
          defaultValue={25}
          numPages={8}
          currentPage={1}
        />
        <Box sx={{ mt: 2 }}>
          <MthTable
            items={tableData}
            fields={fields}
            size='small'
            labelSize={12}
            selectable={false}
            oddBg={false}
            isTableCellBorder={false}
            defaultOrder={Order.ASC}
            defaultOrderBy={sortField}
            onSortChange={handleSort}
          />
        </Box>
      </Box>
    </PageBlock>
  )
}

export default LearningLog
