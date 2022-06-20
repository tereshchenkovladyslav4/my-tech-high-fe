import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { GREEN_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT } from '../../../../utils/constants'
import SearchIcon from '@mui/icons-material/Search'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { HeadCell } from '../../../../components/SortableTable/SortableTableHeader/types'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { useQuery, useMutation } from '@apollo/client'
import {
  getEnrollmentPacketsQuery,
  emailPacketMutation,
  deletePacketMutation,
  moveNextYearPacketMutation,
  moveThisYearPacketMutation,
  packetCountQuery,
} from '../services'
import { map } from 'lodash'
import moment from 'moment'
import DeleteForever from '@mui/icons-material/Delete'
import Tooltip from '@mui/material/Tooltip';
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { ApplicationEmailModal as EmailModal } from '../../../../components/EmailModal/ApplicationEmailModal'
import EnrollmentPacketModal from '../EnrollmentPacketModal'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { Packet } from '../../../HomeroomStudentProfile/Student/types'
import { getEmailTemplateQuery } from '../../../../graphql/queries/email-template'
import { EnrollmentPacketFilters } from '../EnrollmentPacketFilters/EnrollmentPacketFilters'
import { ProfileContext } from '../../../../providers/ProfileProvider/ProfileContext'
import { ApplicationEmailModal } from '../../Applications/ApplicationModal/ApplicationEmailModal'

export const EnrollmentPacketTable = () => {
  const { me, setMe } = useContext(UserContext)
  const [filters, setFilters] = useState(['Submitted', 'Resubmitted'])

  const [emailTemplate, setEmailTemplate] = useState()
  const [searchField, setSearchField] = useState('')
  const [tableData, setTableData] = useState<Array<any>>([])

  const [paginatinLimit, setPaginatinLimit] = useState(25)
  const [skip, setSkip] = useState<number>()
  const [sort, setSort] = useState('status|ASC')

  const [totalPackets, setTotalPackets] = useState<number>()
  const [packetIds, setPacketIds] = useState<Array<string>>([])

  const [isShowModal, setIsShowModal] = useState(false)
  const [enrollmentPackets, setEnrollmentPackets] = useState<Array<Packet>>([])
  const [enrollmentPacket, setEnrollmentPacket] = useState<Packet | null>(null)
  const [deletePacket, { data: deleteData }] = useMutation(deletePacketMutation)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [emailHistory, setEmailHistory] = useState([])
  const [openEmailShowModal, setOpenEmailShowModal] = useState<boolean>(false)

  const [openWarningModal, setOpenWarningModal] = useState<boolean>(false)
  const [packetCount, setpacketCount] = useState({})
  const { showModal, hideModal, store, setStore } = useContext(ProfileContext)

  const handleOpenProfile = (rowId: number) => {
    const row = enrollmentPackets?.find((el) => el.packet_id === rowId)
    showModal(row.student.parent)
    setStore(true)
  }

  const createData = (packet: Packet) => {
    const _sort = sort?.split('|')
    let grade_value = 0
    if(sort && _sort[0]?.toLowerCase() === 'grade' && _sort[1]?.toLowerCase() === 'desc') {
        grade_value = packet?.student?.grade_levels?.length - 1 
    }
    const status = ['Pending', 'Active', 'Withdrawn', '']
    return {
      id: packet.packet_id,
      submitted: moment(packet.deadline).format('MM/DD/YY'),
      status: packet.status + (packet.is_age_issue ? ' (Age Issue)' : ''),
      deadline: moment(packet.deadline).format('MM/DD/YY'),
      student: `${packet.student.person?.first_name} ${packet.student.person?.last_name}`,
      grade:
        packet.student.grade_levels?.length && packet.student.grade_levels[grade_value].grade_level
          ? packet.student.grade_levels[grade_value].grade_level == 'K' || packet.student.grade_levels[grade_value].grade_level === 'Kin'
            ? 'K'
            : `${toOrdinalSuffix(Number(packet.student.grade_levels[grade_value].grade_level))} Grade`
          : ' ',
      parent: `${packet.student.parent.person?.first_name} ${packet.student.parent.person?.last_name}`,
      studentStatus: packet.student?.reenrolled > 0 ? 'Update' : ( 'New' ),
      emailed: packet.packet_emails.length > 0 ? (
        <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenEmailHistory(packet)}>
          {moment(packet.packet_emails[0].created_at).format('MM/DD/YY')}
        </Box>
      ) : null,
      delete: (
        <Tooltip title="Delete" arrow>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
            className='delete-row'
            onClick={(event) => handleDelete(packet.packet_id)}
            sx={{
              borderRadius: 1,
              cursor: 'pointer',
              minHeight: '40px'
            }}
          >
            <svg width='14' height='18' viewBox='0 0 14 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z'
                    fill='#323232'
                  />
            </svg>
          </Box>
        </Tooltip>
      ),
    }
  }

  const { loading, error, data, refetch } = useQuery(getEnrollmentPacketsQuery, {
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

  const {
    loading: templateLoading,
    data: emailTemplateData,
    refetch: refetchEmailTemplate,
  } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: 'Enrollment Packet Page',
      regionId: me?.selectedRegionId
    },
    fetchPolicy: 'network-only',
  })

  const { loading: countLoading, data: countGroup } = useQuery(packetCountQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })
  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  const handleOpenEmailHistory = (data) => {
    setEmailHistory(data?.packet_emails)
    setOpenEmailShowModal(true)
  }

  const handlePacketSelect = (rowId: any) => {
    const row = enrollmentPackets?.find((el) => el.packet_id === rowId)
    setEnrollmentPacket(row)
    setIsShowModal(true)
  }

  useEffect(() => {
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])

  useEffect(() => {
    if (data !== undefined) {
      const { packets } = data
      const { results, total } = packets
      setEnrollmentPackets(() => {
        return map(results, (application) => {
          return application
        })
      })
      setTotalPackets(total)
      setTableData(() => {
        return map(results, (application) => {
          return createData(application)
        })
      })
    }
  }, [loading, data])

  useEffect(() => {
    if (countGroup) {
      setpacketCount(countGroup.packetCountByRegionId.results)
    }
  }, [countGroup])
  const headCells: HeadCell[] = [
    // {
    //   id: 'id',
    //   numeric: false,
    //   disablePadding: true,
    //   label: 'ID',
    // },
    {
      id: 'submitted',
      numeric: false,
      disablePadding: true,
      label: 'Submitted',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: 'Status',
    },
    {
      id: 'deadline',
      numeric: false,
      disablePadding: true,
      label: 'Deadline',
    },
    {
      id: 'student',
      numeric: false,
      disablePadding: true,
      label: 'Student',
    },
    {
      id: 'grade',
      numeric: false,
      disablePadding: true,
      label: 'Grade',
    },
    {
      id: 'parent',
      numeric: false,
      disablePadding: true,
      label: 'Parent',
    },
    {
      id: 'studentStatus',
      numeric: false,
      disablePadding: true,
      label: 'Student',
    },
    {
      id: 'emailed',
      numeric: false,
      disablePadding: true,
      label: 'Emailed',
    },
  ]

  const handleOpenEmailModal = () => {
    if (packetIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    setOpenEmailModal(true)
  }

  const [emailPacket, { data: emailStatus }] = useMutation(emailPacketMutation)

  const onSendEmail = async (subject: string, body: string) => {
    if (packetIds.length === 0) {
      return
    }
    try {
      await emailPacket({
        variables: {
          emailApplicationInput: {
            application_ids: packetIds.map((id) => Number(id)),
            subject: subject,
            body: body,
          },
        },
      })
      refetch()
      refetchEmailTemplate()
      setOpenEmailModal(false)
    } catch (error) {}
  }

  const handleEmailSend = (subject: string, body: string) => {
    if (packetIds.length === 0) {
      return
    }
    onSendEmail(subject, body)
  }

  const handleDelete = async (id) => {
    await deletePacket({
      variables: {
        deleteApplicationInput: {
          application_ids: [id],
        },
      },
    })
    refetch()
  }

  const handleDeleteSelected = async () => {
    if (packetIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    await deletePacket({
      variables: {
        deleteApplicationInput: {
          application_ids: packetIds,
        },
      },
    })
    refetch()
  }

  const [moveThisYearPacket, { data: thisYearData }] = useMutation(moveThisYearPacketMutation)

  const handleMoveToThisYear = async () => {
    try {
      if (packetIds.length === 0) {
        setOpenWarningModal(true)
        return
      }
      await moveThisYearPacket({
        variables: {
          deleteApplicationInput: {
            application_ids: packetIds,
          },
        },
      })
      refetch()
    } catch (error) {}
  }
  const [moveNextYearPacket, { data: nextYearData }] = useMutation(moveNextYearPacketMutation)

  const handleMoveToNextYear = async () => {
    if (packetIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    await moveNextYearPacket({
      variables: {
        deleteApplicationInput: {
          application_ids: packetIds,
        },
      },
    })
    refetch()
  }

  const sortChangeAction = (property, order) => {
    setSort(`${property}|${order}`)
    refetch()
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
            Packets
          </Subtitle>
          <Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
            {totalPackets}
          </Subtitle>
          <Box marginLeft={4}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
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
              background: RED_GRADIENT,
              color: 'white',
              width: '157px',
              marginRight: 2,
              height: '33px',
              '&:hover': {
                background: '#D23C33',
                color: '#fff',
              },
            }}
            onClick={handleOpenEmailModal}
          >
            Email
          </Button>
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              height: '33px',
              background: YELLOW_GRADIENT,
              color: 'white',
              width: '195px',
              marginRight: 2,
              '&:hover': {
                background: '#FFD626',
                color: '#fff',
              },
            }}
            onClick={handleMoveToThisYear}
          >
            Move Packets to 21-22 Year
          </Button>
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              height: '33px',
              background: GREEN_GRADIENT,
              color: 'white',
              width: '195px',
              '&:hover': {
                background: '#33FF7C',
                color: 'fff',
              },
            }}
            onClick={handleMoveToNextYear}
          >
            Move Packetss to 22-23 Year
          </Button>
        </Box>
      </Box>
      {/*  Pagination & Actions */}
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginY: 4,
          marginRight: '24px',
        }}
      >
        <Box
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'left',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'left',
              justifyContent: 'flex-end',
              marginLeft: '24px',
            }}
          >
            <Button
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: 29,
                color: 'white',
                width: '92px',
                background: RED_GRADIENT,
                '&:hover': {
                  background: '#D23C33',
                  color: '#fff',
                },
              }}
              onClick={handleDeleteSelected}
            >
              Delete
            </Button>
          </Box>
        </Box>
        <Pagination
          setParentLimit={setPaginatinLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil(totalPackets / paginatinLimit)}
          currentPage={currentPage}
        />
      </Box>
      <Box>
        <EnrollmentPacketFilters filters={filters} setFilters={setFilters} packetCount={packetCount} />
      </Box>
      <SortableTable
        rows={tableData}
        headCells={headCells}
        onCheck={setPacketIds}
        clearAll={false}
        onRowClick={handlePacketSelect}
        onParentClick={handleOpenProfile}
        onSortChange={sortChangeAction}
      />
      {isShowModal && (
        <EnrollmentPacketModal
          handleModem={() => setIsShowModal(!isShowModal)}
          packet={enrollmentPacket}
          refetch={() => refetch()}
        />
      )}
      {openEmailModal && (
        <EmailModal
          handleModem={() => setOpenEmailModal(!openEmailModal)}
          title={packetIds.length + ' Recipients'}
          handleSubmit={handleEmailSend}
          template={emailTemplate}
        />
      )}
      {openWarningModal && (
        <WarningModal
          title='Warning'
          subtitle='Please select Packets'
          btntitle='Close'
          handleModem={() => setOpenWarningModal(!openWarningModal)}
          handleSubmit={() => setOpenWarningModal(!openWarningModal)}
        />
      )}
        {openEmailShowModal && (
        <ApplicationEmailModal
          handleModem={() => setOpenEmailShowModal(!openEmailShowModal)}
          handleSubmit={() => setOpenEmailShowModal(false)}
          data={emailHistory}
        />
      )}
    </Card>
  )
}
