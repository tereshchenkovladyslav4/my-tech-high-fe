import { Card } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import { useStyles } from './styles'
import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import { AnnouncementType } from '../types'
import { getAnnouncementsQuery, UpdateAnnouncementMutation } from '../services'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { PageHeader } from './PageHeader'
import { PageContent } from './PageContent'

type AnnouncementTableProps = {
  setAnnouncement: (value: AnnouncementType) => void
}

const AnnouncementTable = ({ setAnnouncement }: AnnouncementTableProps) => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const [searchField, setSearchField] = useState<string>()
  const [tableDatas, setTableDatas] = useState<AnnouncementType[]>([])
  const [totalAnnouncements, setTotalAnnouncements] = useState<number>(0)
  const [showArchivedAnnouncement, setShowArchivedAnnouncement] = useState<boolean>(false)
  const { loading, data, refetch } = useQuery(getAnnouncementsQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })
  const [submitSave, {}] = useMutation(UpdateAnnouncementMutation)
  const handleArchiveChangeStatus = async (announcement: AnnouncementType) => {
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

  useEffect(() => {
    if (!loading && data?.announcements) {
      setTableDatas(
        data?.announcements.map((announcement) => ({
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
      />
    </Card>
  )
}

export default AnnouncementTable
