import React, { useEffect, useState, useContext, useMemo, useCallback, ChangeEvent } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { map } from 'lodash'
import moment from 'moment'
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { DropDownItem } from '@mth/components/DropDown/types'
import { ApplicationEmailModal as EmailModal } from '@mth/components/EmailModal/ApplicationEmailModal'
import { EditYearModal } from '@mth/components/EmailModal/EditYearModal'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { SortableTable } from '@mth/components/SortableTable/SortableTable'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { ENROLLMENT_PACKET_HEADCELLS } from '@mth/constants'
import { EmailTemplateEnum, MthColor, MthTitle, PacketStatus } from '@mth/enums'
import { EmailTemplateResponseVM } from '@mth/graphql/models/email-template'
import { useEmailTemplateByNameAndSchoolYearId } from '@mth/hooks'
import { Region } from '@mth/models'
import { ProfileContext } from '@mth/providers/ProfileProvider/ProfileContext'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getTimezoneOffsetStr, toOrdinalSuffix } from '@mth/utils'
import { Packet } from '../../../HomeroomStudentProfile/Student/types'
import { ApplicationEmailModal } from '../../Applications/ApplicationModal/ApplicationEmailModal'
import { SchoolYearDropDown } from '../../Components/SchoolYearDropdown'
import { getSchoolYearsByRegionId } from '../../SiteManagement/services'
import { EnrollmentPacketFilters } from '../EnrollmentPacketFilters/EnrollmentPacketFilters'
import { EnrollmentPacketModal } from '../EnrollmentPacketModal'
import {
  getEnrollmentPacketsQuery,
  emailPacketMutation,
  deletePacketsMutation,
  packetCountQuery,
  updateEnrollmentSchoolYearByIds,
} from '../services'

export const EnrollmentPacketTable: React.FC = () => {
  const { me } = useContext(UserContext)
  const [filters, setFilters] = useState(['Submitted', 'Resubmitted'])

  const [emailTemplate, setEmailTemplate] = useState<EmailTemplateResponseVM>()
  const [searchText, setSearchText] = useState('')
  const [searchField, setSearchField] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setSearchField(searchText), 600)
    return () => clearTimeout(timer)
  }, [searchText])
  const [tableData, setTableData] = useState<Array<unknown>>([])

  const [paginatinLimit, setPaginatinLimit] = useState(25)
  const [skip, setSkip] = useState<number>()
  const [sort, setSort] = useState('status|ASC')

  const [totalPackets, setTotalPackets] = useState<number>()
  const [packetIds, setPacketIds] = useState<Array<string>>([])
  const [delPacketId, setDelPacketId] = useState<number>()
  const [isShowModal, setIsShowModal] = useState(false)
  const [enrollmentPackets, setEnrollmentPackets] = useState<Array<Packet>>([])
  const [enrollmentPacket, setEnrollmentPacket] = useState<Packet | null>(null)
  const [deletePackets] = useMutation(deletePacketsMutation)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [openEmailModal, setOpenEmailModal] = useState<boolean>(false)
  const [emailHistory, setEmailHistory] = useState([])
  const [openEmailShowModal, setOpenEmailShowModal] = useState<boolean>(false)

  const [noStudnetAlert, setNoStudentAlert] = useState<boolean>(false)
  const [editYearModal, setEditYearModal] = useState<boolean>(false)
  const [showConfirmModalOpen, setShowConfirmModalOpen] = useState<boolean>(false)
  const [clearAll, setClearAll] = useState<boolean>(false)
  const [schoolYears, setSchoolYears] = useState<DropDownItem[]>([])
  const [selectedYearId, setSelectedYearId] = useState<number>(0)

  const [openWarningModal, setOpenWarningModal] = useState<boolean>(false)
  const [packetCount, setpacketCount] = useState({})
  const { showModal, setStore } = useContext(ProfileContext)

  const handleOpenProfile = (rowId: number) => {
    const row = enrollmentPackets?.find((el) => el.packet_id === rowId)
    showModal(row?.student.parent, refetch)
    setStore(true)
  }
  const handleSearchText = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSkip(0)
    setSearchText(e.target.value)
  }, [])
  useEffect(() => {
    setPacketIds([])
    setClearAll(!clearAll)
    setCurrentPage(1)
    setSkip(0)
  }, [me?.selectedRegionId])

  const createData = useCallback(
    (packet: Packet) => {
      const _sort = sort?.split('|')
      let grade_value = 0
      if (sort && _sort[0]?.toLowerCase() === 'grade' && _sort[1]?.toLowerCase() === 'desc') {
        grade_value = packet?.student?.grade_levels?.length ? packet.student.grade_levels.length - 1 : 0
      }
      let grade_level: string | number | undefined = ''
      const grade_levels = packet?.student?.grade_levels
      if (grade_levels && grade_levels.length) {
        grade_level = grade_levels[grade_value].grade_level
      }
      if (grade_level) {
        grade_level =
          grade_level === 'K' || String(grade_level).includes('Kin')
            ? 'K'
            : `${toOrdinalSuffix(Number(grade_level))} Grade`
      } else {
        grade_level = ' '
      }
      return {
        id: packet.packet_id,
        submitted:
          packet.status === PacketStatus.SUBMITTED ||
          packet.status == PacketStatus.RESUBMITTED ||
          packet.status == PacketStatus.MISSING_INFO ||
          packet.status == PacketStatus.CONDITIONAL
            ? moment(packet.date_submitted || packet.deadline)
                .local()
                .format('MM/DD/YY') // will update again
            : '',
        status: packet.status + (packet.is_age_issue && packet.status != 'Age Issue' ? ' (Age Issue)' : ''),
        deadline: (
          <Paragraph
            size={'large'}
            sx={{
              color:
                moment(new Date()).format('YYYY-MM-DD') > moment(packet.deadline).format('YYYY-MM-DD')
                  ? MthColor.RED
                  : MthColor.BLACK,
              fontWeight: '700',
            }}
          >
            {moment(packet.deadline).local().format('MM/DD/YY')}
          </Paragraph>
        ),
        student: (
          <Box sx={{ cursor: 'pointer', color: MthColor.MTHBLUE }}>
            {`${packet.student.person?.last_name || ''}${
              packet.student.person?.last_name && packet.student.person?.first_name ? ', ' : ''
            }${packet.student.person?.first_name || ''}`}
          </Box>
        ),
        grade: grade_level,
        parent: (
          <Box sx={{ cursor: 'pointer', color: MthColor.MTHBLUE }}>
            {`${packet?.student?.parent?.person?.last_name || ''}${
              packet?.student?.parent?.person?.last_name && packet?.student?.parent?.person?.first_name ? ', ' : ''
            }${packet?.student?.parent?.person?.first_name || ''}`}
          </Box>
        ),
        studentStatus:
          packet.student?.reenrolled > 0 ? (
            <Box sx={{ color: MthColor.MTHBLUE }}>Update</Box>
          ) : (
            <Box sx={{ color: MthColor.GREEN }}>New</Box>
          ),
        emailed:
          packet.packet_emails.length > 0 ? (
            <Box sx={{ cursor: 'pointer', width: '70px' }} onClick={() => handleOpenEmailHistory(packet)}>
              {moment(packet?.packet_emails?.at(-1)?.created_at).local().format('MM/DD/YY')}
            </Box>
          ) : (
            <Box sx={{ width: '70px' }}> </Box>
          ),
        delete: (
          <Tooltip title='Delete' arrow>
            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              className='delete-row'
              onClick={() => handleDeleteRow(packet.packet_id)}
              sx={{
                borderRadius: 1,
                cursor: 'pointer',
                minHeight: '40px',
                marginRight: '40px',
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
    },
    [sort],
  )
  // get local timezone offset string (ex: -5:0, +3:0)
  const timezoneOffsetStr = useMemo(() => {
    const offsetMin = new Date().getTimezoneOffset()
    return getTimezoneOffsetStr(offsetMin)
  }, [])
  const { data: enrollmentPacketsData, refetch: refetchPackets } = useQuery(getEnrollmentPacketsQuery, {
    variables: {
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: searchField,
      timezoneOffsetStr,
      filters: filters,
      selectedYearId,
      regionId: me?.selectedRegionId,
    },
    skip: !me?.selectedRegionId || !selectedYearId,
    fetchPolicy: 'network-only',
  })

  const { emailTemplate: emailTemplateData, refetch: refetchEmailTemplate } = useEmailTemplateByNameAndSchoolYearId(
    EmailTemplateEnum.ENROLLMENT_PACKET_PAGE,
    selectedYearId,
    false,
  )

  const { data: countGroup, refetch: refetchPacketCount } = useQuery(packetCountQuery, {
    variables: {
      regionId: me?.selectedRegionId,
      schoolYearId: selectedYearId,
      filters: filters,
    },
    skip: !me?.selectedRegionId,
    fetchPolicy: 'network-only',
  })

  const refetch = useCallback(() => {
    refetchPackets()
    refetchPacketCount()
  }, [refetchPacketCount, refetchPackets])
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  const handleOpenEmailHistory = (data) => {
    setEmailHistory(data?.packet_emails)
    setOpenEmailShowModal(true)
  }

  const handlePacketSelect = (rowId: unknown) => {
    const row = enrollmentPackets?.find((el) => el.packet_id === rowId)
    setEnrollmentPacket(row)
    setIsShowModal(true)
  }

  const { data: schoolYearData } = useQuery<{ region: Region }>(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.region
      const yearList: { label: string; value: string }[] = []
      SchoolYears.sort((a, b) => (a.date_begin > b.date_begin ? 1 : -1))
        .filter((item) => new Date(item.date_end) >= new Date())
        .forEach((item): void => {
          yearList.push({
            label: `${moment(item.date_begin).local().format('YYYY')}-${moment(item.date_end).local().format('YY')}`,
            value: String(item.school_year_id),
          })
          if (item && item.midyear_application) {
            yearList.push({
              label: `${moment(item.date_begin).local().format('YYYY')}-${moment(item.date_end)
                .local()
                .format('YY')} Mid-year Program`,
              value: `${item.school_year_id}-mid`,
            })
          }
        })
      setSchoolYears(yearList.sort((a, b) => (a.label > b.label ? 1 : -1)))
    }
  }, [schoolYearData?.region, schoolYearData?.region?.SchoolYears])

  useEffect(() => {
    if (emailTemplateData) {
      setEmailTemplate(emailTemplateData)
    }
  }, [emailTemplateData])

  useEffect(() => {
    if (enrollmentPacketsData !== undefined) {
      const { packets } = enrollmentPacketsData
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
      refetchPacketCount()
    }
  }, [enrollmentPacketsData])

  useEffect(() => {
    if (filters.length === 1 && filters[0] === 'Age Issue') {
      setFilters(['Submitted', 'Resubmitted', 'Age Issue'])
    } else if (
      !filters.some((filter) => filter === 'Submitted') &&
      !filters.some((filter) => filter === 'Resubmitted') &&
      !filters.some((filter) => filter === 'Conditional') &&
      filters.some((filter) => filter === 'Age Issue')
    ) {
      const newFilters = filters.filter((filter) => filter !== 'Age Issue')
      setFilters(newFilters)
    }
  }, [filters])

  useEffect(() => {
    if (countGroup) {
      setpacketCount(countGroup.packetCountByRegionId.results)
    }
  }, [countGroup])

  const handleOpenEmailModal = () => {
    if (packetIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    setOpenEmailModal(true)
  }

  const [emailPacket] = useMutation(emailPacketMutation)

  const onSendEmail = async (from: string, subject: string, body: string) => {
    if (packetIds.length === 0) {
      return
    }
    try {
      await emailPacket({
        variables: {
          emailApplicationInput: {
            application_ids: packetIds.map((id) => Number(id)),
            from: from,
            subject: subject,
            body: body,
          },
        },
      })
      refetch()
      refetchEmailTemplate()
    } catch (error) {}
  }

  const handleEmailSend = (from: string, subject: string, body: string) => {
    setOpenEmailModal(false)
    if (packetIds.length === 0) {
      return
    }
    onSendEmail(from, subject, body)
  }

  const handleDeleteRow = async (packetId: number) => {
    setDelPacketId(packetId)
    setShowConfirmModalOpen(true)
  }
  const handleConfirmDeleteModalChange = useCallback(
    async (isOk: boolean) => {
      if (isOk) {
        await deletePackets({
          variables: {
            packetsActionInput: {
              packetIds: delPacketId ? [delPacketId] : packetIds,
            },
          },
        })
        refetch()
      }
      setShowConfirmModalOpen(false)
      setDelPacketId(undefined)
    },
    [delPacketId, deletePackets, packetIds, refetch],
  )

  const handleDeleteSelectedRows = async () => {
    if (packetIds.length === 0) {
      setOpenWarningModal(true)
      return
    }
    setShowConfirmModalOpen(true)
    // await deletePackets({
    //   variables: {
    //     packetsActionInput: {
    //       packetIds: packetIds,
    //     },
    //   },
    // })
    // refetch()
  }

  const [updateBulkSchoolYear] = useMutation(updateEnrollmentSchoolYearByIds)

  const handleChangeProgramYear = async () => {
    if (packetIds.length === 0) {
      setNoStudentAlert(true)
      return
    }
    setEditYearModal(true)
  }
  const submitEditYear = useCallback(
    async (values: { schoolYear: string }) => {
      const { schoolYear } = values
      const array = schoolYear.split('-')
      let schoolYearId = 0
      let midyearApplication = 0
      if (array.length) {
        schoolYearId = parseInt(array[0])
        if (array.length > 1 && array[1] === 'mid') {
          midyearApplication = 1
        }
      }
      await updateBulkSchoolYear({
        variables: {
          updateEnrollmentSchoolYearByIdsInput: {
            application_ids: packetIds.map((v) => String(v)),
            school_year_id: schoolYearId,
            midyear_application: midyearApplication,
          },
        },
      })
      setPacketIds([])
      setClearAll(!clearAll)
      setEditYearModal(false)
      refetch()
    },
    [clearAll, packetIds, refetch, updateBulkSchoolYear],
  )

  const sortChangeAction = (property: string, order: string) => {
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
            width: '100%',
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
              value={searchText}
              placeholder='Search...'
              onChange={handleSearchText}
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
            justifyContent: 'flex-start',
            marginLeft: '24px',
          }}
        >
          <Button
            sx={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              background: MthColor.RED_GRADIENT,
              color: 'white',
              width: '157px',
              marginRight: 2,
              height: '33px',
              '&:hover': {
                background: '#D23C33',
                color: '#fff',
              },
              minWidth: '195px',
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
              background: MthColor.GREEN_GRADIENT,
              color: 'white',
              width: '195px',
              '&:hover': {
                background: '#33FF7C',
                color: 'fff',
              },
              minWidth: '195px',
            }}
            onClick={handleChangeProgramYear}
          >
            Change Program Year
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'flex-end',
            px: '48px',
          }}
        >
          <SchoolYearDropDown selectedYearId={selectedYearId} setSelectedYearId={setSelectedYearId} />
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
                background: MthColor.RED_GRADIENT,
                '&:hover': {
                  background: '#D23C33',
                  color: '#fff',
                },
              }}
              onClick={handleDeleteSelectedRows}
            >
              Delete
            </Button>
          </Box>
        </Box>
        <Pagination
          setParentLimit={setPaginatinLimit}
          handlePageChange={handlePageChange}
          defaultValue={paginatinLimit || 25}
          numPages={Math.ceil((totalPackets || 0) / paginatinLimit)}
          currentPage={currentPage}
        />
      </Box>
      <Box>
        <EnrollmentPacketFilters filters={filters} setFilters={setFilters} packetCount={packetCount} />
      </Box>
      <SortableTable
        rows={tableData}
        headCells={ENROLLMENT_PACKET_HEADCELLS}
        onCheck={setPacketIds}
        clearAll={clearAll}
        onRowClick={handlePacketSelect}
        onParentClick={handleOpenProfile}
        onSortChange={sortChangeAction}
      />
      {isShowModal && (
        <EnrollmentPacketModal
          handleModem={() => setIsShowModal(!isShowModal)}
          packet_data={enrollmentPacket}
          refetch={() => refetch()}
        />
      )}
      {openEmailModal && (
        <EmailModal
          handleModem={() => setOpenEmailModal(false)}
          title={packetIds.length + ' Recipient' + (packetIds.length > 1 ? 's' : '')}
          handleSubmit={handleEmailSend}
          template={emailTemplate}
          isNonSelected={false}
          filters={[]}
          handleSchedulesByStatus={() => {}}
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

      {noStudnetAlert && (
        <WarningModal
          handleModem={() => setNoStudentAlert(!noStudnetAlert)}
          title='Error'
          subtitle='No student(s) selected'
          btntitle='OK'
          handleSubmit={() => setNoStudentAlert(!noStudnetAlert)}
        />
      )}

      {editYearModal && (
        <EditYearModal
          title='Change Program Year'
          schoolYears={schoolYears}
          handleSubmit={submitEditYear}
          handleClose={() => setEditYearModal(false)}
        />
      )}
      {showConfirmModalOpen && (
        <CustomConfirmModal
          header={MthTitle.DELETE_PACKET_TITLE}
          content={MthTitle.DELETE_PACKET_DESCRIPTION}
          confirmBtnTitle={MthTitle.BTN_DELETE}
          maxWidth={587}
          height={316}
          padding={'52px'}
          handleConfirmModalChange={handleConfirmDeleteModalChange}
        />
      )}
    </Card>
  )
}
