import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Button, Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { filter } from 'lodash'
import moment from 'moment'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { useEventsByRegionIdAndFilterItem, useEventTypeListByRegionId } from '@mth/hooks'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../Admin/Dashboard/SchoolYear/SchoolYear'
import { Announcements } from './Announcements'
import { Announcement } from './Announcements/types'
import { AnnouncementSection } from './AnnouncementSection'
import { FullCalendar } from './FullCalendar'
import { HomeroomGrade } from './HomeroomGrade/HomeroomGrade'
import { ParentCalendar } from './ParentCalendar'
import { ReadMoreSection } from './ReadMoreSection'
import { getUserAnnouncements } from './services'
import { ToDoItem } from './ToDoList/components/ToDoListItem/types'
import { ToDo } from './ToDoList/ToDo'
import { DashboardSection } from './types'

export const imageA =
  'https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-facebook-1.jpg?quality=85'
export const imageB =
  'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=0hb44OrI'
export const imageC =
  'https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg'

export const Dashboard: React.FC = () => {
  const { me } = useContext(UserContext)
  const region_id = me?.userRegion?.at(-1)?.region_id
  const [sectionName, setSectionName] = useState<DashboardSection>(DashboardSection.ROOT)
  const [inProp, setInProp] = useState<boolean>(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement>({})
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [searchField, setSearchField] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { calendarEventList, events } = useEventsByRegionIdAndFilterItem({
    regionId: Number(region_id),
    searchField,
    userId: Number(me?.user_id),
    type: 'parent',
  })
  const { data: eventTypeLists } = useEventTypeListByRegionId(Number(region_id))
  const [mainTodoList, setMainTodoList] = useState<ToDoItem[]>()

  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: !region_id,
    fetchPolicy: 'network-only',
  })

  const { data: announcementData } = useQuery(getUserAnnouncements, {
    variables: {
      request: {
        limit: 10,
        search: '',
        user_id: Number(me?.user_id),
      },
    },
    skip: !me?.user_id,
    fetchPolicy: 'network-only',
  })

  const renderPage = () => {
    switch (sectionName) {
      case DashboardSection.ROOT:
        return (
          <Box>
            <Grid
              container
              spacing={2}
              justifyContent='center'
              sx={{ margin: '0 !important', width: 'calc(100% - 16px) !important' }}
            >
              <Grid item xs={12} lg={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <HomeroomGrade schoolYears={schoolYears} mainTodoList={mainTodoList || []} isLoading={isLoading} />
                  </Grid>
                  <Grid item xs={12} order={{ xs: 3, lg: 2 }}>
                    <ParentCalendar
                      events={events}
                      calendarEventList={calendarEventList}
                      eventTypeLists={eventTypeLists}
                      sectionName={sectionName}
                      setSectionName={setSectionName}
                    />
                  </Grid>
                  <Grid item xs={12} order={{ xs: 2, lg: 3 }}>
                    <ToDo
                      schoolYears={schoolYears}
                      setMainTodoList={setMainTodoList}
                      setIsLoading={setIsLoading}
                      isLoading={isLoading}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4} order={{ xs: 1, lg: 3 }}>
                <Card
                  style={{
                    width: '100%',
                    marginRight: 25,
                    borderRadius: 12,
                  }}
                >
                  <Announcements
                    announcements={filter(announcements, (announcement) => announcement.status !== 'Read')}
                    setAnnouncements={setAnnouncements}
                    setSectionName={setSectionName}
                    setSelectedAnnouncement={setSelectedAnnouncement}
                  />
                </Card>
              </Grid>
            </Grid>
          </Box>
        )
      case DashboardSection.VIEW_ALL:
        return (
          <AnnouncementSection
            inProp={inProp}
            setSectionName={setSectionName}
            setSelectedAnnouncement={setSelectedAnnouncement}
          />
        )
      case DashboardSection.READ_MORE:
        return <ReadMoreSection inProp={inProp} setSectionName={setSectionName} announcement={selectedAnnouncement} />
      case DashboardSection.FULL_CALENDAR:
        return (
          <>
            <Box display={{ xs: 'none', sm: 'none', md: 'block' }}>
              <FullCalendar
                searchField={searchField}
                setSearchField={setSearchField}
                events={events}
                calendarEventList={calendarEventList}
                eventTypeLists={eventTypeLists}
                setSectionName={setSectionName}
              />
            </Box>
            <Box sx={{ display: { sm: 'block', xs: 'block', md: 'none' }, paddingX: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%', marginTop: 12, marginBottom: 5 }}>
                <Button
                  sx={{ width: '44px', minWidth: '44px', height: '44px', backgroundColor: 'white' }}
                  onClick={() => setSectionName(DashboardSection.ROOT)}
                >
                  <ChevronLeftIcon />
                </Button>
                <Box sx={{ marginY: 'auto', marginX: 5 }}>
                  <Subtitle size='large' fontWeight='700' sx={{ fontSize: '24px' }}>
                    Events
                  </Subtitle>
                </Box>
              </Box>
              <ParentCalendar
                events={events}
                calendarEventList={calendarEventList}
                eventTypeLists={eventTypeLists}
                sectionName={sectionName}
                setSectionName={setSectionName}
              />
            </Box>
          </>
        )
      default:
        return <></>
    }
  }

  useEffect(() => {
    setInProp(!inProp)
  }, [sectionName])

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears.map((item: SchoolYear) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
          schedule: item.schedule,
        })),
      )
    }
  }, [region_id, schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    if (announcementData?.userAnnouncements) {
      const { userAnnouncements } = announcementData
      setAnnouncements(
        userAnnouncements.map((announcement: Announcement) => ({
          id: announcement.id,
          subject: announcement.subject,
          body: announcement.body,
          sender: announcement.sender,
          announcementId: announcement.announcementId,
          userId: announcement.user_id,
          date: moment(announcement.date).format('MMMM DD'),
          grades: announcement.filter_grades,
          regionId: announcement.RegionId,
          status: announcement.status,
        })),
      )
    }
  }, [me?.user_id, announcementData])

  return renderPage()
}
