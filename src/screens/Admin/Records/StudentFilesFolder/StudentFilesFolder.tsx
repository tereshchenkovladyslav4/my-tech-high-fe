import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Card, Grid, InputAdornment, OutlinedInput, Tooltip } from '@mui/material'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { recordClassess } from '../styles'
import { StudentFilesFolderProps, StudentRecord } from '../types'

const StudentFilesFolder: React.FC<StudentFilesFolderProps> = ({ filter }) => {
  const [searchField, setSearchField] = useState<string>('')
  const [paginationLimit, setPaginationLimit] = useState<number>(25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [skip, setSkip] = useState<number>(0)
  const [totalStudentRecords, setTotalStudentRecords] = useState<number>(100)
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginationLimit ? paginationLimit * (page - 1) : 25
    })
  }

  const handleChangePageLimit = (value: number) => {
    handlePageChange(1)
    setPaginationLimit(value)
    setTotalStudentRecords(100)
  }

  const handleDownload = () => {}

  const generateStudentRecord = (): StudentRecord[] => {
    const records: StudentRecord[] = []
    for (let i = 0; i < paginationLimit; i++) {
      records.push({
        firstName: 'Hunter',
        lastName: 'Smith',
      })
    }
    return records
  }

  const renderStudentRecords = () => {
    return studentRecords.map((studentRecord, index) => (
      <Grid item key={index} xs={12} lg={2} sx={{ padding: 2 }}>
        <Box sx={recordClassess.record}>
          <Paragraph size='large' sx={{ cursor: 'pointer', color: MthColor.MTHBLUE }} fontWeight='700'>
            {`${studentRecord.lastName}, ${studentRecord.firstName}`}
          </Paragraph>
          <Box sx={{ marginLeft: '10px', maxWidth: '40px' }} onClick={handleDownload}>
            <Tooltip title='Download' placement='top'>
              <img src={DownloadFileIcon} alt='Download Icon' />
            </Tooltip>
          </Box>
        </Box>
      </Grid>
    ))
  }

  useEffect(() => {
    setStudentRecords(generateStudentRecord())
  }, [filter, skip, paginationLimit])

  return (
    <Card sx={{ paddingTop: '24px', marginBottom: '24px', paddingBottom: '12px' }}>
      <Box sx={recordClassess.header}>
        <Subtitle size='medium' fontWeight='700'>
          Student Files Folder
        </Subtitle>
        <OutlinedInput
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'Search...')}
          size='small'
          value={searchField}
          placeholder='Search...'
          onChange={(e) => {
            setSearchField(e.target.value)
          }}
          startAdornment={
            <InputAdornment position='start'>
              <SearchIcon style={{ color: 'black' }} />
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
          <Box sx={{ marginLeft: '10px', marginRight: '40px' }} onClick={handleDownload}>
            <Tooltip title='Download' placement='top'>
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
    </Card>
  )
}

export default StudentFilesFolder
