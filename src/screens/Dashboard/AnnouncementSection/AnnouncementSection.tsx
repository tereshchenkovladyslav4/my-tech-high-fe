import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SearchIcon from '@mui/icons-material/Search'
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Grid,
  InputAdornment,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { debounce } from 'lodash'
import moment from 'moment'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Table } from '@mth/components/Table/Table'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { extractContent, getWindowDimension } from '@mth/utils'
import { Person, StudentType } from '../../HomeroomStudentProfile/Student/types'
import { Announcement } from '../Announcements/types'
import { getUserAnnouncements } from '../services'
import { announcementSectionClassess } from './styles'
import { AnnouncementSectionProps } from './types'

const getProfilePhoto = (person: Person) => {
  if (!person.photo) return 'image'

  const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
  return s3URL + person.photo
}

export const avatarGroup = (gradeFilter: string, students: StudentType[] | undefined): ReactNode => {
  const grades = JSON.parse(gradeFilter)
  return (
    <AvatarGroup max={5} sx={{ maxWidth: '300px', justifyContent: 'start' }} spacing={0}>
      {students &&
        students.map((student): ReactElement | undefined => {
          if (
            student?.grade_levels &&
            grades.includes(
              student?.grade_levels[0].grade_level == 'Kin' ? 'Kindergarten' : student?.grade_levels[0].grade_level,
            )
          ) {
            return (
              <Tooltip
                title={
                  student.person.preferred_first_name ? student.person.preferred_first_name : student.person.first_name
                }
              >
                <Avatar
                  alt={
                    student.person.preferred_first_name
                      ? student.person.preferred_first_name
                      : student.person.first_name
                  }
                  src={getProfilePhoto(student.person)}
                />
              </Tooltip>
            )
          } else return undefined
        })}
    </AvatarGroup>
  )
}

const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({
  inProp,
  setSectionName,
  setSelectedAnnouncement,
}) => {
  const { me } = useContext(UserContext)
  const [limit, setLimit] = useState<number>(10)
  const [searchField, setSearchField] = useState<string>()
  const [announcementTableData, setAnnouncementTableData] = useState([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>(getWindowDimension())
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [showSearchField, setShowSearchField] = useState<boolean>(false)

  const { data: announcementData, refetch } = useQuery(getUserAnnouncements, {
    variables: {
      request: {
        limit: limit,
        search: searchField,
        user_id: Number(me?.user_id),
      },
    },
    skip: me?.user_id ? false : true,
    fetchPolicy: 'cache-first',
  })

  const changeHandler = (event: string) => {
    setSearchField(event)
  }

  const handleAnchorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setShowSearchField(true)
  }

  const handleAnchorClose = () => {
    setAnchorEl(null)
    setShowSearchField(false)
  }

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 100), [])

  const mobileSearchField = () => (
    <Menu
      id='basic-menu'
      open={showSearchField}
      anchorEl={anchorEl}
      onClose={handleAnchorClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem>
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
      </MenuItem>
    </Menu>
  )

  const LoadMore = () => (
    <Box sx={announcementSectionClassess.button}>
      <Button
        onClick={() => {
          setLimit(limit + 10)
          refetch()
        }}
      >
        <Paragraph size='large' sx={{ textDecoration: 'underline', fontWeight: 700, fontSize: '16px' }} color='#4145FF'>
          Load More
        </Paragraph>
      </Button>
    </Box>
  )

  useEffect(() => {
    if (announcementData?.userAnnouncements) {
      const { userAnnouncements } = announcementData
      setAnnouncementTableData(
        userAnnouncements.map((announcement: Announcement) => ({
          date: (
            <Subtitle fontWeight='500' sx={{ fontSize: '12px', color: '#A1A1A1', maxWidth: '300px' }}>
              {moment(announcement.date).format('MMMM DD')}
            </Subtitle>
          ),
          subject: (
            <Subtitle fontWeight='bold' sx={{ maxWidth: '300px' }}>
              {extractContent(announcement.subject || '')?.slice(0, 60)}
            </Subtitle>
          ),
          avatars: avatarGroup(announcement.filter_grades || '', me?.students),
          description: (
            <>
              <Box sx={{ display: 'flex', paddingY: '25px', width: '350px', justifyContent: 'end' }}>
                <Paragraph size='medium'>
                  {extractContent(announcement.body || '')?.slice(0, 100)}
                  <a
                    style={announcementSectionClassess.readMore}
                    onClick={() => {
                      setSelectedAnnouncement({
                        id: announcement.id,
                        subject: announcement.subject,
                        body: announcement.body,
                        sender: announcement.sender,
                        announcementId: announcement.announcementId,
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
      setAnnouncements(userAnnouncements)
    } else {
      setAnnouncementTableData([])
    }
  }, [me?.user_id, announcementData])

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <TransitionGroup>
      <CSSTransition in={inProp} timeout={1000} classNames='my-node'>
        <Box
          sx={{
            ...announcementSectionClassess.cardAll,
            backgroundColor: windowDimensions.width > 600 ? '' : '#FAFAFA',
            marginTop: windowDimensions.width > 600 ? '20px' : '-10px',
          }}
        >
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12}>
              {windowDimensions.width > 600 ? (
                <Card>
                  <Box sx={announcementSectionClassess.cardBox}>
                    <Box sx={announcementSectionClassess.cardItem}>
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
                  {LoadMore()}
                </Card>
              ) : (
                <Box>
                  <Box sx={announcementSectionClassess.mobileCardBox}>
                    <Box sx={announcementSectionClassess.mobileHeader}>
                      <Button
                        sx={{ ...announcementSectionClassess.mobileIconBtn, backgroundColor: 'white' }}
                        onClick={() => setSectionName('root')}
                      >
                        <ChevronLeftIcon />
                      </Button>
                      <Box sx={{ marginY: 'auto' }}>
                        <Subtitle size='large' fontWeight='700' sx={{ fontSize: '24px' }}>
                          Announcements
                        </Subtitle>
                      </Box>
                      <Button sx={announcementSectionClassess.mobileIconBtn} onClick={handleAnchorClick}>
                        <SearchIcon style={{ color: 'black' }} />
                      </Button>
                      {mobileSearchField()}
                    </Box>
                  </Box>
                  {!!announcements?.length &&
                    announcements.map((announcement, index) => {
                      return (
                        <Box key={index} sx={announcementSectionClassess.mobileItem}>
                          <Box sx={{ marginRight: 10, paddingY: '10px' }}>
                            <Subtitle size='large' fontWeight='700'>
                              {announcement?.subject}
                            </Subtitle>
                          </Box>
                          <Box sx={{ paddingY: '10px' }}>
                            <ListItemText secondary={moment(announcement?.date).format('MMMM DD')} />
                          </Box>
                          <Box sx={{ paddingY: '10px' }}>
                            {announcement?.filter_grades &&
                              avatarGroup(announcement?.filter_grades || '', me?.students)}
                          </Box>
                          <Box sx={{ display: 'flex', paddingY: '10px', width: '350px', justifyContent: 'start' }}>
                            <Paragraph size='medium'>
                              {extractContent(announcement.body || '')?.slice(0, 100)}
                              <a
                                style={announcementSectionClassess.readMore}
                                onClick={() => {
                                  setSelectedAnnouncement({
                                    id: announcement.id,
                                    subject: announcement.subject,
                                    body: announcement.body,
                                    sender: announcement.sender,
                                    announcementId: announcement.announcementId,
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
                        </Box>
                      )
                    })}
                  {LoadMore()}
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default AnnouncementSection
