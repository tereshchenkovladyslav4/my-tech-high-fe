import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { HomeroomGrade } from './HomeroomGrade/HomeroomGrade'
import { Calendar } from './Calendar/Calendar'
import { ToDo } from './ToDoList/ToDo'
import { Announcements } from './Announcements'
import { Box } from '@mui/system'
import { Card, Grid } from '@mui/material'
import { UserContext, UserInfo } from '../../providers/UserContext/UserProvider'
import { useQuery } from '@apollo/client'
import moment from 'moment'
import { getUserAnnouncements } from './services'
import { Announcement } from './Announcements/types'
import { AnnouncementSection } from './AnnouncementSection'
import { ReadMoreSection } from './ReadMoreSection'
import { getSchoolYearsByRegionId } from '../Admin/Dashboard/SchoolYear/SchoolYear'
import { SchoolYearType } from '../../utils/utils.types'

export const imageA =
  'https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-facebook-1.jpg?quality=85'
export const imageB =
  'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=0hb44OrI'
export const imageC =
  'https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg'

export const Dashboard: FunctionComponent = () => {
  const { me } = useContext(UserContext)
  const region_id = me?.userRegion?.at(-1)?.region_id
  const [sectionName, setSectionName] = useState<string>('root')
  const [inProp, setInProp] = useState<boolean>(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement>({})
  const [schoolYears, setSchoolYears] = useState<SchoolYearType[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears.map((item: SchoolYearType) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
        })),
      )
    }
  }, [region_id, schoolYearData?.data?.region?.SchoolYears])
  const { data: announcementData, refetch } = useQuery(getUserAnnouncements, {
    variables: {
      request: {
        limit: 10,
        search: '',
        user_id: Number(me?.user_id),
      },
    },
    skip: me?.user_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    setInProp(!inProp)
  }, [sectionName])

  useEffect(() => {
    if (announcementData?.userAnnouncements) {
      const { userAnnouncements } = announcementData
      setAnnouncements(
        userAnnouncements.map((announcement: any) => ({
          id: announcement.id,
          subject: announcement.subject,
          body: announcement.body,
          sender: announcement.sender,
          announcementId: announcement.announcement_id,
          userId: announcement.user_id,
          date: moment(announcement.date).format('MMMM DD'),
          grades: announcement.filter_grades,
          regionId: announcement.RegionId,
        })),
      )
    }
  }, [me?.user_id, announcementData])

  return sectionName == 'root' ? (
    <Box>
      <Grid
        container
        spacing={2}
        justifyContent='center'
        sx={{ margin: '0 !important', width: 'calc(100% - 16px) !important' }}
      >
        <Grid item xs={12} lg={8}>
          <Box marginBottom={2}>
            <HomeroomGrade schoolYears={schoolYears} />
          </Box>
          <Box marginBottom={2}>
            <Calendar />
          </Box>
          <Box marginBottom={2}>{schoolYears.length > 0 && <ToDo schoolYears={schoolYears} />}</Box>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card
            style={{
              width: '100%',
              marginRight: 25,
              borderRadius: 12,
            }}
          >
            <Announcements
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              setSectionName={setSectionName}
              setSelectedAnnouncement={setSelectedAnnouncement}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  ) : sectionName == 'viewAll' ? (
    <AnnouncementSection
      inProp={inProp}
      setSectionName={setSectionName}
      setSelectedAnnouncement={setSelectedAnnouncement}
    />
  ) : (
    <ReadMoreSection inProp={inProp} setSectionName={setSectionName} announcement={selectedAnnouncement} />
  )
}
