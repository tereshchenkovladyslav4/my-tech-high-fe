import { Card } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import { useStyles } from './styles'
import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import { deleteAnnouncementsById, getAnnouncementsQuery, UpdateAnnouncementMutation } from '../services'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { PageHeader } from './PageHeader'
import { PageContent } from './PageContent'
import { Announcement } from '../../../Dashboard/Announcements/types'
import CustomConfirmModal from '../../../../components/CustomConfirmModal/CustomConfirmModal'

type AnnouncementTableProps = {
  setAnnouncement: (value: Announcement) => void
}

const AnnouncementTable = ({ setAnnouncement }: AnnouncementTableProps) => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState<string>('')
  const [tableDatas, setTableDatas] = useState<Announcement[]>([])
  const [totalAnnouncements, setTotalAnnouncements] = useState<number>(0)
  const [showArchivedAnnouncement, setShowArchivedAnnouncement] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<number>(0);

  const { loading, data, refetch } = useQuery(getAnnouncementsQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
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
    refetch()
  }

  const [deleteAnnouncementById, {}] = useMutation(deleteAnnouncementsById)
  const handleDelete = (id: number) => {
    setShowConfirmModal(parseInt(id))
  }

  const confirmDeleteAnnouncement = async (id: number) => {
    const response = await deleteAnnouncementById({
      variables: {
        id: id,
      },
    })
    refetch()
  }

  useEffect(() => {
    if (!loading && data?.announcements) {
      setTableDatas(
        data?.announcements.map((announcement: any) => ({
          id: announcement.announcement_id,
          date: announcement.date ? moment(announcement.date).format('MMMM DD') : '',
          subject: announcement.subject,
          postedBy: announcement.posted_by,
          status: announcement.status,
          filterGrades: announcement.filter_grades,
          filterUsers: announcement.filter_users,
          regionId: announcement.RegionId,
          body: announcement.body,
          scheduleTime: announcement.schedule_time,
          isArchived: announcement.isArchived ? true : false,
        })),
      )
      setTotalAnnouncements(data?.announcements.length)
    }
  }, [data])

  return (
    <Card sx={classes.cardBody}>
      <PageHeader
        totalAnnouncements={totalAnnouncements}
        showArchivedAnnouncement={showArchivedAnnouncement}
        searchField={searchField}
        setSearchField={setSearchField}
        setShowArchivedAnnouncement={setShowArchivedAnnouncement}
      />
      <PageContent
        tableDatas={tableDatas}
        showArchivedAnnouncement={showArchivedAnnouncement}
        setAnnouncement={setAnnouncement}
        handleArchiveChangeStatus={handleArchiveChangeStatus}
        handleDelete={handleDelete}
      />
      {(showConfirmModal !== 0) && (
        <CustomConfirmModal
          header='Delete Announcement'
          content='Are you sure you want to delete this Announcement?'
          confirmBtnTitle='Delete'
          handleConfirmModalChange={(val: boolean, isOk: boolean) => {
            if (isOk) {
              confirmDeleteAnnouncement(showConfirmModal)
            }
            setShowConfirmModal(0)
          }}
        />
      )}
    </Card>
  )
}

export default AnnouncementTable
