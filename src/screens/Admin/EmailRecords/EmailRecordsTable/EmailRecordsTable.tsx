import React, { FunctionComponent, useEffect, useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import { map } from 'lodash'
import moment from 'moment'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { BLUE_GRDIENT, RED_GRADIENT } from '../../../../utils/constants'
import { EMAIL_RECORDS_HEADCELLS } from '../../../../utils/PageHeadCellsConstant'
import { CustomModal } from '../../SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { EmailRecordsFilter } from '../EmailRecordsFilter/EmailRecordsFilter'
import { EmailResendModal } from '../EmailResendModal/EmailResendModal'
import {
  getEmailRecordsQuery,
  recordsCountQuery,
  deleteRecordsMutation,
  resendRecordsMutation,
  resendEmailMutation,
} from '../service'
import { EmailRecord } from '../type'

export const EmailRecordsTable: FunctionComponent = () => {
  const { me } = useContext(UserContext)
  const [deleteRecords] = useMutation(deleteRecordsMutation)
  const [resendRecords] = useMutation(resendRecordsMutation)
  const [resendEmail] = useMutation(resendEmailMutation)
  const [filters, setFilters] = useState(['Error'])
  const [recordCount, setRecordCount] = useState({ Error: 0, Sent: 0 })
  const [selectedEmailRecord, setEmailRecord] = useState<EmailRecord>()
  const [emailRecordData, setEmailRecordData] = useState<Array<EmailRecord>>([])

  const [totalEmails, setTotalEmails] = useState(0)
  const [searchField, setSearchField] = useState('')
  const [paginatinLimit, setPaginatinLimit] = useState(25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [skip, setSkip] = useState<number>()
  const [sort, setSort] = useState('status|ASC')
  const [tableData, setTableData] = useState<Array<unknown>>([])
  const [recordIds, setRecordIds] = useState<Array<string>>([])

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showWarningAlert, setShowWarningAlert] = useState(false)
  const [showEmailResendModal, setShowEmailResendModal] = useState(false)
  const [showRemoveWarning, setShowRemoveWarning] = useState(false)

  const createData = (emailRecord: EmailRecord) => {
    return {
      id: emailRecord.id,
      date: moment(emailRecord.created_at).format('MM/DD/YY'),
      to: emailRecord.to_email,
      email_tempate: emailRecord.template_name,
      subject: emailRecord.subject,
      from: emailRecord.from_email,
      status: emailRecord.status,
    }
  }

  const { loading, data, refetch } = useQuery(getEmailRecordsQuery, {
    variables: {
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: searchField,
      filters: filters,
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const { data: countGroup, refetch: refetchRecordCount } = useQuery(recordsCountQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data !== undefined) {
      const { emailRecords } = data
      const { results, total } = emailRecords
      setEmailRecordData(() => {
        return map(results, (record) => {
          return record
        })
      })
      setTotalEmails(total)
      setTableData(() => {
        return map(results, (application) => {
          return createData(application)
        })
      })
    }
  }, [loading, data])

  useEffect(() => {
    setCurrentPage(1)
  }, [me?.selectedRegionId])

  useEffect(() => {
    if (countGroup) {
      setRecordCount(countGroup.emailRecordsCountByRegionId.results)
    }
  }, [countGroup])

  useEffect(() => {
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (currentPage - 1) : 25
    })
  }, [currentPage])

  const handleResendButton = async () => {
    if (recordIds.length == 0) {
      setShowWarningAlert(true)
      return
    }
    await resendRecords({
      variables: {
        deleteRecordInput: {
          record_ids: recordIds,
        },
      },
    })
    refetch()
    refetchRecordCount()
  }

  const handleRemove = () => {
    if (recordIds.length == 0) {
      setShowWarningAlert(true)
      return
    }

    let bAbletoRemove = true

    recordIds.map((id) => {
      const record = emailRecordData?.find((el) => el.id === id)
      if (record?.status == 'Sent') {
        bAbletoRemove = false
      }
    })

    if (bAbletoRemove == true) {
      setShowDeleteModal(true)
    } else {
      setShowRemoveWarning(true)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  const sortChangeAction = (property, order) => {
    setSort(`${property}|${order}`)
  }

  const handleRecordSelected = (rowID: string) => {
    setShowEmailResendModal(true)
    const row = emailRecordData?.find((el) => el.id === rowID)
    setEmailRecord(row)
  }

  const handleDeleteEmailRecords = async () => {
    setShowDeleteModal(!showDeleteModal)
    await deleteRecords({
      variables: {
        deleteRecordInput: {
          record_ids: recordIds,
        },
      },
    })
    refetch()
    refetchRecordCount()
  }

  const handleResendEmail = async (template: EmailRecord, body: string) => {
    const param = { ...template, body: body }
    await resendEmail({
      variables: {
        resendEmailInput: {
          to_email: param.to_email,
          from_email: param.from_email,
          bcc: param.bcc,
          subject: param.subject,
          body: param.body,
          template_name: param.template_name,
          status: param.status,
          region_id: param.region_id,
        },
      },
    })
    setShowEmailResendModal(false)
    refetch()
    refetchRecordCount()
  }

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
            onClick={handleResendButton}
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
        <EmailRecordsFilter
          filters={filters}
          setFilters={setFilters}
          recordCount={recordCount}
          setCurrentPage={setCurrentPage}
        />
      </Box>
      <SortableTable
        rows={tableData}
        headCells={EMAIL_RECORDS_HEADCELLS}
        onCheck={setRecordIds}
        clearAll={false}
        onParentClick={undefined}
        onRowClick={handleRecordSelected}
        onSortChange={sortChangeAction}
      />
      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='This message has not been sent to the recipient.'
          subDescription='Do you really want to delete this email?'
          onClose={() => setShowDeleteModal(!showDeleteModal)}
          onConfirm={handleDeleteEmailRecords}
          confirmStr='Delete'
        />
      )}

      {showWarningAlert && (
        <WarningModal
          title='Warning'
          subtitle='Please select Email Records'
          btntitle='Close'
          handleModem={() => setShowWarningAlert(!showWarningAlert)}
          handleSubmit={() => setShowWarningAlert(!showWarningAlert)}
        />
      )}

      {showRemoveWarning && (
        <WarningModal
          title='Warning'
          subtitle='Please select Only Email Errors'
          btntitle='Close'
          handleModem={() => setShowRemoveWarning(!showRemoveWarning)}
          handleSubmit={() => setShowRemoveWarning(!showRemoveWarning)}
        />
      )}

      {showEmailResendModal && (
        <EmailResendModal
          handleModem={() => setShowEmailResendModal(!showEmailResendModal)}
          handleSubmit={handleResendEmail}
          template={selectedEmailRecord}
        />
      )}
    </Card>
  )
}
