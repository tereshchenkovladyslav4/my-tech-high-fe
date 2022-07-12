import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Avatar, AvatarGroup, Button, Card, Grid, InputAdornment, ListItemText, OutlinedInput } from '@mui/material'
import { Table } from '../../../components/Table/Table'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SearchIcon from '@mui/icons-material/Search'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { AnnouncementSectionProps } from './types'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { useQuery } from '@apollo/client'
import { useStyles } from './styles'
import { getUserAnnouncements } from '../services'
import moment from 'moment'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { debounce } from 'lodash'
import { Person } from '../../HomeroomStudentProfile/Student/types'
import { extractContent } from '../../../utils/utils'

const AnnouncementSection = ({ inProp, setSectionName, setSelectedAnnouncement }: AnnouncementSectionProps) => {
  const { me } = useContext(UserContext)
  const [limit, setLimit] = useState<number>(10)
  const [searchField, setSearchField] = useState<string>()
  const [announcementTableData, setAnnouncementTableData] = useState([])
  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const classes = useStyles
  const avatarGroup = (gradeFilter: string) => {
    const grades = JSON.parse(gradeFilter)
    return (
      <AvatarGroup max={5} sx={{ maxWidth: '300px', justifyContent: 'start' }} spacing={0}>
        {me?.students &&
          me?.students.map((student) => {
            if (
              student?.grade_levels &&
              grades.includes(
                student?.grade_levels[0].grade_level == 'Kin' ? 'Kindergarten' : student?.grade_levels[0].grade_level,
              )
            ) {
              return (
                <Avatar
                  alt={student.person.preferred_first_name ?? student.person.first_name}
                  src={getProfilePhoto(student.person)}
                />
              )
            }
          })}
      </AvatarGroup>
    )
  }
  const { data: announcementData, refetch } = useQuery(getUserAnnouncements, {
    variables: {
      request: {
        limit: limit,
        search: searchField,
        user_id: Number(me?.user_id),
      },
    },
    skip: me?.user_id ? false : true,
    fetchPolicy: 'network-only',
  })

  const changeHandler = (event: string) => {
    setSearchField(event)
  }

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 100), [])

  useEffect(() => {
    if (announcementData?.userAnnouncements) {
      const { userAnnouncements } = announcementData
      setAnnouncementTableData(
        userAnnouncements.map((announcement: any) => ({
          date: (
            <Subtitle fontWeight='500' sx={{ fontSize: '12px', color: '#A1A1A1', maxWidth: '300px' }}>
              {moment(announcement.date).format('MMMM DD')}
            </Subtitle>
          ),
          subject: (
            <Subtitle fontWeight='bold' sx={{ maxWidth: '300px' }}>
              {extractContent(announcement.subject).slice(0, 60)}
            </Subtitle>
          ),
          avatars: avatarGroup(announcement.filter_grades),
          description: (
            <>
              <Box sx={{ display: 'flex', paddingY: '25px', width: '350px' }}>
                <Paragraph size='medium'>
                  {extractContent(announcement.body).slice(0, 100)}
                  <a
                    style={classes.readMore}
                    onClick={() => {
                      setSelectedAnnouncement({
                        id: announcement.id,
                        subject: announcement.subject,
                        body: announcement.body,
                        sender: announcement.sender,
                        announcementId: announcement.announcement_id,
                        userId: announcement.user_id,
                        date: moment(announcement.date).format('MMMM DD'),
                        grades: announcement.filter_grades,
                        regionId: announcement.RegionId,
                      })
                      setSectionName('readMore')
                    }}
                  >
                    Read More
                  </a>
                </Paragraph>
              </Box>
            </>
          ),
        })),
      )
    } else {
      setAnnouncementTableData([])
    }
  }, [me?.user_id, announcementData])

  return (
    <TransitionGroup>
      <CSSTransition in={inProp} timeout={1000} classNames='my-node'>
        <Box sx={classes.cardAll}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12}>
              <Card>
                <Box sx={classes.cardBox}>
                  <Box sx={classes.cardItem}>
                    <Button onClick={() => setSectionName('root')}>
                      <ChevronLeftIcon sx={{ marginRight: 0.5, marginLeft: -2.5 }} />
                    </Button>
                    <Box sx={{ marginRight: 10 }}>
                      <Subtitle size='large' fontWeight='700'>
                        Announcements
                      </Subtitle>
                    </Box>
                  </Box>
                  <Box marginLeft={4} sx={{ width: '300px' }}>
                    <OutlinedInput
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'Search title, message, or student')}
                      size='small'
                      fullWidth
                      value={searchField}
                      placeholder='Search title, message, or student'
                      onChange={(e) => debouncedChangeHandler(e.target.value)}
                      startAdornment={
                        <InputAdornment position='start'>
                          <SearchIcon style={{ color: 'black' }} />
                        </InputAdornment>
                      }
                    />
                  </Box>
                </Box>
                <Box padding='50px'>
                  {announcementTableData && <Table tableBody={announcementTableData} isHover={true} />}
                </Box>
                <Box sx={classes.button}>
                  <Button
                    onClick={() => {
                      setLimit(limit + 10)
                      refetch()
                    }}
                  >
                    <Paragraph
                      size='large'
                      sx={{ textDecoration: 'underline', fontWeight: 700, fontSize: '16px' }}
                      color='#4145FF'
                    >
                      Load More
                    </Paragraph>
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default AnnouncementSection
