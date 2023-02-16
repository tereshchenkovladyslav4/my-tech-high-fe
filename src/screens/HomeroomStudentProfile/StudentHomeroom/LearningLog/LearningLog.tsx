import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import EastIcon from '@mui/icons-material/East'
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import moment from 'moment'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { PageBlock } from '@mth/components/PageBlock'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, Order, StudentLearningLogStatus } from '@mth/enums'
import { getStudentLearningLogsQuery } from '@mth/graphql/queries/student-learning-log'
import { Assignment, SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { courseCatalogHeaderClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Components/CourseCatalogHeader/styles'

type TableFieldProps = {
  item: Assignment
}

type LearningLogProps = {
  studentId: number
  schoolYearId: number
  selectedYear: SchoolYear | undefined
}

const getColor = (value: StudentLearningLogStatus | null | undefined): MthColor => {
  switch (value) {
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
  <Paragraph
    size={'large'}
    sx={{ fontSize: '13px', fontWeight: '600', color: getColor(item?.StudentLearningLogs?.at(0)?.status) }}
  >
    {children}
  </Paragraph>
)

const LearningLog: React.FC<LearningLogProps> = ({ studentId, schoolYearId, selectedYear }) => {
  const { me } = useContext(UserContext)
  const currentStudentId = Number(location.pathname.split('/').at(-1))
  const currentStudent = useMemo(() => {
    return me?.students?.find((student) => student?.student_id == currentStudentId)
  }, [currentStudentId])
  const [showAll, setShowAll] = useState<boolean>(true)
  const [tableData, setTableData] = useState<MthTableRowItem<Assignment>[]>([])
  const [paginatinLimit, setPaginatinLimit] = useState<number>(Number(localStorage.getItem('pageLimit')) || 25)
  const [sort, setSort] = useState<string>('due_date|ASC')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalLogs, setTotalLogs] = useState<number>(0)
  const [skip, setSkip] = useState<number>(0)
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false)

  const filter = useMemo(() => {
    return {
      showAll,
      student_id: studentId,
      school_year_id: schoolYearId,
    }
  }, [showAll, studentId, schoolYearId])

  const { loading, data, refetch } = useQuery(getStudentLearningLogsQuery, {
    variables: {
      filter: filter,
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: '',
    },
    skip: !filter?.student_id || !filter?.school_year_id || !paginatinLimit,
    fetchPolicy: 'network-only',
  })

  const getStatus = (assignment: Assignment) => {
    const days_to_submit_early = selectedYear?.HomeroomSettings?.at(0)?.days_to_submit_early
    if (days_to_submit_early) {
      if (moment(assignment?.due_date).diff(moment(new Date()), 'days') < days_to_submit_early)
        return StudentLearningLogStatus.AVAILABLE
    }
    return null
  }

  const fields: MthTableField<Assignment>[] = [
    {
      key: 'due_date',
      label: 'Due',
      sortable: true,
      width: '110px',
      formatter: (item: MthTableRowItem<Assignment>) => {
        return <TableField item={item.rawData}>{moment(item.rawData.due_date)?.format('MMMM D')}</TableField>
      },
    },
    {
      key: 'title',
      label: 'Learning Log',
      sortable: true,
      formatter: (item: MthTableRowItem<Assignment>) => {
        return <TableField item={item.rawData}>{item.rawData.title}</TableField>
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: true,
      formatter: (item: MthTableRowItem<Assignment>) => {
        return (
          !!item.rawData.StudentLearningLogs?.at(0)?.grade && (
            <TableField item={item.rawData}>{`${item.rawData.StudentLearningLogs?.at(0)?.grade}%`}</TableField>
          )
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      formatter: (item: MthTableRowItem<Assignment>) => {
        return item.rawData.StudentLearningLogs?.at(0)?.status ? (
          item.rawData.StudentLearningLogs?.at(0)?.status === StudentLearningLogStatus.SUBMITTED ||
          item.rawData.StudentLearningLogs?.at(0)?.status === StudentLearningLogStatus.RESUBMITTED ? (
            <Box onClick={() => setShowWarningModal(true)} sx={{ cursor: 'pointer' }}>
              <Paragraph size={'large'} sx={{ fontSize: '13px', fontWeight: '600', color: MthColor.BLACK }}>
                {item.rawData.StudentLearningLogs?.at(0)?.status}
              </Paragraph>
              <Paragraph
                size={'large'}
                sx={{ fontSize: '8px', fontWeight: '600', paddingY: 0.5, color: MthColor.BLACK }}
              >
                {moment(item.rawData.StudentLearningLogs?.at(0)?.updated_at).format('MMM DD [at] hh:mm A')}
              </Paragraph>
            </Box>
          ) : (
            <TableField item={item.rawData}>{item.rawData.StudentLearningLogs?.at(0)?.status}</TableField>
          )
        ) : getStatus(item.rawData) === StudentLearningLogStatus.AVAILABLE ? (
          <Paragraph size={'large'} sx={{ fontSize: '13px', fontWeight: '600', color: MthColor.MTHBLUE }}>
            {StudentLearningLogStatus.AVAILABLE}
          </Paragraph>
        ) : (
          <></>
        )
      },
    },
    {
      key: '',
      label: '',
      sortable: false,
      formatter: (item: MthTableRowItem<Assignment>) => {
        return (
          (item.rawData.StudentLearningLogs?.at(0)?.status === StudentLearningLogStatus.RESUBMIT ||
            (!item.rawData.StudentLearningLogs?.length &&
              getStatus(item.rawData) === StudentLearningLogStatus.AVAILABLE) ||
            item.rawData.StudentLearningLogs?.at(0)?.status === StudentLearningLogStatus.STARTED) && <EastIcon />
        )
      },
    },
  ]

  const createData = (learingLog: Assignment): MthTableRowItem<Assignment> => {
    return {
      key: `learning-log-${learingLog.id}-${learingLog.id}`,
      columns: {},
      selectable: true,
      isSelected: false,
      rawData: learingLog,
    }
  }

  const handlePageChange = (page: number) => {
    localStorage.setItem('currentPage', page.toString())
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  const handleChangePageLimit = (value: number) => {
    localStorage.setItem('pageLimit', `${value}`)
    handlePageChange(1)
    setPaginatinLimit(value)
  }

  const handleSort = (property: string, order: Order) => {
    if (property === 'date') {
      setSort(`${property}|${order.toLocaleLowerCase() === 'asc' ? 'desc' : 'asc'}`)
    } else {
      setSort(`${property}|${order}`)
    }

    refetch()
  }

  useEffect(() => {
    if (!loading && data?.learningLogsForStudent) {
      const { total, results } = data?.learningLogsForStudent
      setTotalLogs(total)
      setTableData(
        (results || []).map((item: Assignment) => {
          return createData(item)
        }),
      )
    }
  }, [loading, data])

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
          setParentLimit={handleChangePageLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil((totalLogs as number) / paginatinLimit) || 0}
          currentPage={currentPage}
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
            onSortChange={handleSort}
          />
        </Box>
      </Box>
      {showWarningModal && (
        <CustomModal
          title='Warning'
          description='This Weekly Learning Log has already been submitted.'
          subDescription='Do you want to view it or edit and resubmit it?'
          cancelStr='View'
          confirmStr='Edit & Resubmit'
          backgroundColor='#FFF'
          onClose={() => {
            setShowWarningModal(false)
          }}
          onConfirm={() => {
            setShowWarningModal(false)
          }}
        />
      )}
    </PageBlock>
  )
}

export default LearningLog
