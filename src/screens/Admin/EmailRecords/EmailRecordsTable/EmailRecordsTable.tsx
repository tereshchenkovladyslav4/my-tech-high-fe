import React, { FunctionComponent, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import { map } from 'lodash'
import moment from 'moment'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { BLUE_GRDIENT, RED_GRADIENT } from '../../../../utils/constants'
import { EMAIL_RECORDS_HEADCELLS } from '../../../../utils/PageHeadCellsConstant'
import { EmailRecordsFilter } from '../EmailRecordsFilter/EmailRecordsFilter'
import { EmailRecord } from '../type'

const emailRecordData = [
  {
    record_id: '1',
    date: '2022-03-10T00:00:00.000Z',
    to: 'sample@gamil.com',
    email_template: 'Application Received',
    subject: 'Thanks for Applying!',
    from: 'admin@mytechhigh.com',
    status: 'Error',
  },
  {
    record_id: '2',
    date: '2022-03-10T00:00:00.000Z',
    to: 'sally@gamil.com',
    email_template: 'Packet Accepted',
    subject: 'You are Enrolled',
    from: 'enrollment@mytechhigh.com',
    status: 'Error',
  },
  {
    record_id: '3',
    date: '2022-03-10T00:00:00.000Z',
    to: 'polly@gamil.com',
    email_template: 'Missing Info',
    subject: 'Please Update Your Enrollment Packet',
    from: 'enrollment@mytechhigh.com',
    status: 'Error',
  },
  {
    record_id: '4',
    date: '2022-03-10T00:00:00.000Z',
    to: 'sam@gamil.com',
    email_template: 'Nofity of Withdraw',
    subject: 'Confirm Your Withdraw by 3/12/22',
    from: 'enrollment@mytechhigh.com',
    status: 'Error',
  },
]

export const EmailRecordsTable: FunctionComponent = () => {
  const [filters, setFilters] = useState(['Error'])
  const [recordCount] = useState({ Error: 4, Sent: 1 })

  const [totalEmails, setTotalEmails] = useState(100)
  const [searchField, setSearchField] = useState('')
  const [paginatinLimit, setPaginatinLimit] = useState(25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [, setSkip] = useState<number>()
  const [, setSort] = useState('status|ASC')
  const [tableData, setTableData] = useState<Array<unknown>>([])
  const [recordIds, setRecordIds] = useState<Array<string>>([])

  const createData = (emailRecord: EmailRecord) => {
    return {
      id: emailRecord.record_id,
      date: moment(emailRecord.date).format('MM/DD/YY'),
      to: emailRecord.to,
      email_tempate: emailRecord.email_template,
      subject: emailRecord.subject,
      from: emailRecord.from,
      status: emailRecord.status,
    }
  }

  useEffect(() => {
    setTableData(() => {
      return map(emailRecordData, (record) => {
        return createData(record)
      })
    })
  }, [])

  useEffect(() => {
    console.log(recordIds)
  }, [recordIds])

  const handleResend = () => {
    setTotalEmails(10)
  }

  const handleRemove = () => {}

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  const sortChangeAction = (property, order) => {
    setSort(`${property}|${order}`)
  }

  const handleOpenProfile = () => {}

  const handlePacketSelect = () => {}

  return (
    <Card sx={{ paddingTop: '24px', marginBottom: '24px', paddingBottom: '12px' }}>
      {/*  Headers */}
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            marginLeft: '24px',
            alignItems: 'center',
          }}
        >
          <Subtitle size='medium' fontWeight='700'>
            Emails
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 10 }}>
            {totalEmails}
          </Subtitle>
          <Box marginLeft={7}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              sx={{ width: '200px' }}
              fullWidth
              value={searchField}
              placeholder='Search...'
              onChange={(e) => setSearchField(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'flex-end',
            marginRight: '24px',
          }}
        >
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              background: BLUE_GRDIENT,
              color: 'white',
              width: '157px',
              marginRight: 2,
              height: '33px',
              '&:hover': {
                background: '#D23C33',
                color: '#fff',
              },
            }}
            onClick={handleResend}
          >
            Resend
          </Button>
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              height: '33px',
              background: RED_GRADIENT,
              color: 'white',
              width: '157px',
              marginRight: 2,
              '&:hover': {
                background: '#FFD626',
                color: '#fff',
              },
            }}
            onClick={handleRemove}
          >
            Remove
          </Button>
        </Box>
      </Box>
      {/* Pagination */}
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginY: 4,
          marginRight: '24px',
        }}
      >
        <Pagination
          setParentLimit={setPaginatinLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil(totalEmails / paginatinLimit)}
          currentPage={currentPage}
        />
      </Box>
      <Box>
        <EmailRecordsFilter filters={filters} setFilters={setFilters} recordCount={recordCount} />
      </Box>
      <SortableTable
        rows={tableData}
        headCells={EMAIL_RECORDS_HEADCELLS}
        onCheck={setRecordIds}
        clearAll={false}
        onRowClick={handlePacketSelect}
        onParentClick={handleOpenProfile}
        onSortChange={sortChangeAction}
      />
    </Card>
  )
}
