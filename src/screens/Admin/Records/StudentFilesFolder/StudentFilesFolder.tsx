import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Card, Grid, InputAdornment, OutlinedInput, Tooltip } from '@mui/material'
import debounce from 'lodash.debounce'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { DownloadStudentRecordFiles, GetStudentRecordFilesQuery } from '../services'
import { StudentFilesModal } from '../StudentFilesModal'
import { recordClassess } from '../styles'
import { DownloadStudentRecordFilesVM, StudentFilesFolderProps, StudentRecord, StudentRecordFile } from '../types'

const StudentFilesFolder: React.FC<StudentFilesFolderProps> = ({ filter }) => {
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState<string>('')
  const [paginationLimit, setPaginationLimit] = useState<number>(25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [skip, setSkip] = useState<number>(0)
  const [totalStudentRecords, setTotalStudentRecords] = useState<number>(100)
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([])
  const [searchTyping, setSearchTyping] = useState<boolean>(false)
  const [showStudentFilesModal, setShowStudentFilesModal] = useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<StudentRecord>()

  const { loading, data, refetch } = useQuery(GetStudentRecordFilesQuery, {
    variables: {
      filter: {
        region_id: Number(me?.selectedRegionId),
        status: filter?.status,
        special_ed: filter?.specialEd,
        school_of_enrollment: filter?.schoolOfEnrollment,
        program_year: filter?.programYear,
        other: filter?.other,
        grade_level_1: filter?.gradeLevel1,
        grade_level_2: filter?.gradeLevel2,
        enrollment_packet_document: filter?.EnrollmentPacketDocuments,
        date_range_start: filter?.dateRange?.startDate,
        date_range_end: filter?.dateRange?.endDate,
      },
      pagination: {
        skip: skip,
        sort: null,
        take: paginationLimit,
      },
      searchKey: searchField,
    },
    skip: !searchTyping && me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const changeHandler = () => {
    setSearchTyping(false)
  }
  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginationLimit ? paginationLimit * (page - 1) : 25
    })
  }

  const handleChangePageLimit = (value: number) => {
    handlePageChange(1)
    setPaginationLimit(value)
  }

  const handleDownload = (items: StudentRecord[], _isIndividualFile = false) => {
    const downloadItems: DownloadStudentRecordFilesVM[] = items?.map((item: StudentRecord) => {
      return {
        studentName: `${item?.lastName}, ${item?.firstName}`,
        fileIds: item?.files?.map((file: StudentRecordFile) => {
          return file?.fileId
        }),
        isIndividualFile: _isIndividualFile,
      }
    })

    DownloadStudentRecordFiles(downloadItems, _isIndividualFile, items?.[0]?.files?.[0]?.fileName)
  }

  const handleStudentClick = (record: StudentRecord) => {
    if (record) {
      setSelectedRecord(record)
      setShowStudentFilesModal(true)
    }
  }

  const renderStudentRecords = () => {
    return studentRecords.map((studentRecord, index) => (
      <Grid item key={index} xs={12} lg={2} sx={{ padding: 2 }}>
        <Box sx={recordClassess.record}>
          <Paragraph
            size='large'
            sx={{ cursor: 'pointer', color: MthColor.MTHBLUE }}
            fontWeight='700'
            onClick={() => handleStudentClick(studentRecord)}
          >
            {`${studentRecord.lastName}, ${studentRecord.firstName}`}
          </Paragraph>
          <Box
            sx={{ marginLeft: '10px', maxWidth: '40px', cursor: 'pointer' }}
            onClick={() => handleDownload([studentRecord])}
          >
            <Tooltip title='Download' placement='top'>
              <img src={DownloadFileIcon} alt='Download Icon' />
            </Tooltip>
          </Box>
        </Box>
      </Grid>
    ))
  }

  useEffect(() => {
    if (!loading && data?.studentRecords) {
      const { total, results } = data.studentRecords
      const records = results?.map(
        (result: {
          record_id: number
          StudentId: number
          Student: { person: { first_name: string; last_name: string } }
          StudentRecordFiles: { FileId: number; file_kind: string; File: { name: string; item1: string } }[]
        }) => {
          return {
            recordId: result?.record_id,
            studentId: result?.StudentId,
            firstName: result?.Student?.person?.first_name,
            lastName: result?.Student?.person?.last_name,
            files: result?.StudentRecordFiles?.map((file) => {
              return {
                fileId: file?.FileId,
                fileName: file?.File?.name,
                filePath: file?.File?.item1,
                fileKind: file?.file_kind,
              }
            }),
          }
        },
      )
      if (showStudentFilesModal && selectedRecord) {
        setSelectedRecord(records?.find((item: StudentRecord) => item?.studentId === selectedRecord.studentId))
      }
      setTotalStudentRecords(total)
      setStudentRecords(records)
    }
  }, [loading, data])

  return (
    <Card sx={{ paddingTop: '24px', marginBottom: '24px', paddingBottom: '12px' }}>
      <Box sx={recordClassess.header}>
        <Subtitle size='medium' fontWeight='700'>
          Student Files Folder
        </Subtitle>
        <OutlinedInput
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'Search...')}
          style={{ fontSize: 12 }}
          size='small'
          value={searchField}
          placeholder='Search...'
          onChange={(e) => {
            setSearchTyping(true)
            setSearchField(e.target.value)
            debouncedChangeHandler()
          }}
          startAdornment={
            <InputAdornment position='start'>
              <SearchIcon fontSize='small' style={{ color: 'black' }} />
            </InputAdornment>
          }
        />
        <Pagination
          setParentLimit={handleChangePageLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginationLimit || 25}
          numPages={Math.ceil((totalStudentRecords as number) / paginationLimit) || 0}
          currentPage={currentPage}
        />
        <Box sx={recordClassess.btnGroup}>
          <Paragraph size='large' sx={{ cursor: 'pointer' }} fontWeight='700'>
            Download All
          </Paragraph>
          <Box
            sx={{ marginLeft: '10px', marginRight: '40px', cursor: 'pointer' }}
            onClick={() => handleDownload(studentRecords)}
          >
            <Tooltip title='Download All' placement='top'>
              <img src={DownloadFileIcon} alt='Download Icon' />
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Box>
        <Grid container sx={{ textAlign: 'left' }}>
          <Grid item container xs={12} lg={12}>
            {renderStudentRecords()}
          </Grid>
        </Grid>
      </Box>
      {showStudentFilesModal && (
        <StudentFilesModal
          record={selectedRecord}
          handleModem={() => setShowStudentFilesModal(false)}
          handleDownload={handleDownload}
          refetch={refetch}
        />
      )}
    </Card>
  )
}

export default StudentFilesFolder
