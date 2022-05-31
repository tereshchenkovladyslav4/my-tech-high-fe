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
import { getUserAnnouncements } from '../services'
import moment from 'moment'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { debounce } from 'lodash'
import { Person } from '../../HomeroomStudentProfile/Student/types'

const AnnouncementSection = ({ inProp, setSectionName }: AnnouncementSectionProps) => {
  const { me } = useContext(UserContext)
  const [limit, setLimit] = useState<number>(10)
  const { students } = me
  const [searchField, setSearchField] = useState<string>()
  const [announcementTableData, setAnnouncementTableData] = useState()
  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const avatarGroup = (gradeFilter: string) => {
    const grades = JSON.parse(gradeFilter)
    return (
      <AvatarGroup max={5} spacing={0}>
        {students &&
          students.map((student) => {
            if (student?.grade_levels && grades.includes(student?.grade_levels[0].grade_level)) {
              return <Avatar alt={student.person.preferred_first_name} src={getProfilePhoto(student.person)} />
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

  const extractContent = (s) => {
    let span = document.createElement('span')
    span.innerHTML = s
    return span.textContent || span.innerText
  }

  const changeHandler = (event) => {
    setSearchField(event)
  }

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 100), [])

  useEffect(() => {
    if (announcementData?.userAnnouncements) {
      const { userAnnouncements } = announcementData
      setAnnouncementTableData(
        userAnnouncements.map((announcement) => ({
          date: <ListItemText secondary={moment(announcement.date).format('MMMM DD')} />,
          subject: <Subtitle fontWeight='500'>{announcement.subject}</Subtitle>,
          avatars: avatarGroup(announcement.filter_grades),
          description: (
            <>
              <Box sx={{ display: 'flex', paddingY: '25px' }}>
                <Paragraph size='medium'>{extractContent(announcement.body).slice(0, 50)}...</Paragraph>
                <Button sx={{ marginTop: '-7px' }} onClick={() => setSectionName('readMore')}>
                  <Paragraph size='medium' sx={{ textDecoration: 'underline' }} color='#4145FF'>
                    Read More
                  </Paragraph>
                </Button>
              </Box>
            </>
          ),
        })),
      )
    } else {
      setAnnouncementTableData(null)
    }
  }, [me?.user_id, announcementData])

  return (
    <TransitionGroup>
      <CSSTransition in={inProp} timeout={1000} classNames='my-node'>
        <Box display='flex' flexDirection='row' textAlign='left' paddingX='20px' marginTop={2}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12}>
              <Card>
                <Box
                  display='flex'
                  flexDirection='row'
                  textAlign='left'
                  marginTop={2}
                  justifyContent='space-between'
                  marginX={4}
                >
                  <Box display='flex' flexDirection='row' alignItems='center' alignContent='center'>
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
                <Box paddingY='20px'>{announcementTableData && <Table tableBody={announcementTableData} />}</Box>
                <Box sx={{ alignItems: 'center', textAlign: 'center', marginLeft: '', marginRight: 'auto' }}>
                  <Button
                    onClick={() => {
                      setLimit(limit + 10)
                      refetch()
                    }}
                  >
                    <Paragraph size='large' sx={{ textDecoration: 'underline' }} color='#4145FF'>
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
