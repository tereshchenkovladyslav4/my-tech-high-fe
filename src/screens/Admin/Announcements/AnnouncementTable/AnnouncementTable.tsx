import React, { useEffect, useState, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import { CustomConfirmModal } from '@mth/components/CustomConfirmModal/CustomConfirmModal'
import { PageBlock } from '@mth/components/PageBlock'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { Announcement } from '../../../Dashboard/Announcements/types'
import { deleteAnnouncementsById, getAnnouncementsQuery, UpdateAnnouncementMutation } from '../services'
import { PageContent } from './PageContent'
import { PageHeader } from './PageHeader'

type AnnouncementTableProps = {
  setAnnouncement: (value: Announcement) => void
}

const AnnouncementTable: React.FC<AnnouncementTableProps> = ({ setAnnouncement }) => {
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState<string>('')
  const [tableData, setTableData] = useState<Announcement[]>([])
  const [totalAnnouncements, setTotalAnnouncements] = useState<number>(0)
  const [showArchivedAnnouncement, setShowArchivedAnnouncement] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<number>(0)
  const { loading, data, refetch } = useQuery(getAnnouncementsQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: !me?.selectedRegionId,
    fetchPolicy: 'network-only',
  })
  const [submitSave, {}] = useMutation(UpdateAnnouncementMutation)
  const handleArchiveChangeStatus = async (announcement: Announcement) => {
    await submitSave({
      variables: {
        updateAnnouncementInput: {
          announcement_id: Number(announcement.id),
          isArchived: !announcement.isArchived,
        },
      },
    })
    await refetch()
  }

  const [deleteAnnouncementById, {}] = useMutation(deleteAnnouncementsById)
  const handleDelete = (id: number) => {
    setShowConfirmModal(Number(id))
  }

  const confirmDeleteAnnouncement = async (id: number) => {
    await deleteAnnouncementById({
      variables: {
        id: id,
      },
    })
    await refetch()
  }

  useEffect(() => {
    if (!loading && data?.announcements) {
      setTableData(
        data?.announcements.map(
          (announcement: Announcement): Announcement => ({
            id: announcement.announcement_id,
            date: announcement.date ? moment(announcement.date).format('MMMM DD') : '',
            subject: announcement.subject,
            postedBy: announcement.posted_by,
            status: announcement.status,
            filterGrades: announcement.filter_grades,
            filterUsers: announcement.filter_users,
            filterOthers: announcement.filter_others,
            filterProviders: announcement.filter_providers,
            regionId: announcement.RegionId,
            body: announcement.body,
            scheduleTime: announcement.schedule_time,
            isArchived: !!announcement.isArchived,
          }),
        ),
      )
      setTotalAnnouncements(data?.announcements.length)
    }
  }, [data])

  return (
    <PageBlock>
      <PageHeader
        totalAnnouncements={totalAnnouncements}
        showArchivedAnnouncement={showArchivedAnnouncement}
        searchField={searchField}
        setSearchField={setSearchField}
        setShowArchivedAnnouncement={setShowArchivedAnnouncement}
      />
      <PageContent
        tableData={tableData}
        showArchivedAnnouncement={showArchivedAnnouncement}
        setAnnouncement={setAnnouncement}
        handleArchiveChangeStatus={handleArchiveChangeStatus}
        handleDelete={handleDelete}
      />
      {showConfirmModal !== 0 && (
        <CustomConfirmModal
          header='Delete Announcement'
          content='Are you sure you want to delete this Announcement?'
          confirmBtnTitle='Delete'
          handleConfirmModalChange={(isOk: boolean) => {
            if (isOk) {
              confirmDeleteAnnouncement(showConfirmModal).then(() => {})
            }
            setShowConfirmModal(0)
          }}
        />
      )}
    </PageBlock>
  )
}

export default AnnouncementTable
