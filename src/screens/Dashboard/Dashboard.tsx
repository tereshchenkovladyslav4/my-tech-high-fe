import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { HomeroomGrade } from './HomeroomGrade/HomeroomGrade'
import { Calendar } from './Calendar/Calendar'
import { ToDo } from './ToDoList/ToDo'
import { Announcements } from './Announcements/Announcements'
import { Box } from '@mui/system'
import { Avatar, AvatarGroup, Button, Card, Grid, TextField } from '@mui/material'
import { Table } from '../../components/Table/Table'
import { Metadata } from '../../components/Metadata/Metadata'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SearchIcon from '@mui/icons-material/Search'
import { Subtitle } from '../../components/Typography/Subtitle/Subtitle'
import { Paragraph } from '../../components/Typography/Paragraph/Paragraph'
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { UserContext, UserInfo } from '../../providers/UserContext/UserProvider'
export const imageA =
  'https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-facebook-1.jpg?quality=85'
export const imageB =
  'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=0hb44OrI'
export const imageC =
  'https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg'

export const Dashboard: FunctionComponent = () => {
  const [showAnnouncements, setShowAnnouncements] = useState(false)
  const [inProp, setInProp] = useState(false)

  const avatarGroup = (
    <AvatarGroup max={4} spacing={0}>
      <Avatar alt='Remy Sharp'/>
      <Avatar alt='Travis Howard'/>
      <Avatar alt='Cindy Baker'/>
      <Avatar alt='Agnes Walker'/>
    </AvatarGroup>
  )
  const data = [
    {
      date: <Metadata title='2:11 PM' subtitle='September 12' />,
      age: <Subtitle fontWeight='500'>Highlighting our new MTH Game Maker course!</Subtitle>,
      avatars: avatarGroup,
      description: (
        <Paragraph size='medium'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          Read More
        </Paragraph>
      ),
    },
    {
      date: <Metadata title='2:11 PM' subtitle='September 12' />,
      age: <Subtitle fontWeight='500'>Highlighting our new MTH Game Maker course!</Subtitle>,
      avatars: avatarGroup,
      description: (
        <Paragraph size='medium'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          Read More
        </Paragraph>
      ),
    },
    {
      date: <Metadata title='2:11 PM' subtitle='September 12' />,
      age: <Subtitle fontWeight='500'>Highlighting our new MTH Game Maker course!</Subtitle>,
      avatars: avatarGroup,
      description: (
        <Paragraph size='medium'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          Read More
        </Paragraph>
      ),
    },
  ]

  useEffect(() => {
    setInProp(!inProp)
  }, [showAnnouncements])

  return !showAnnouncements ? (
    <Box display='flex' flexDirection='row' textAlign='left' marginTop={2}>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item xs={11}>
          <HomeroomGrade />
        </Grid>
        <Grid item xs={11}>
          <Calendar />
        </Grid>
        <Grid item xs={11}>
          <ToDo />
        </Grid>
      </Grid>
      <Card
        style={{
          width: 300,
          marginRight: 25,
          borderRadius: 12,
        }}
      >
        <Announcements expandAnnouncments={() => setShowAnnouncements(true)} />
      </Card>
    </Box>
  ) : (
    <TransitionGroup>
      <CSSTransition in={inProp} timeout={1000} classNames='my-node'>
        <Box display='flex' flexDirection='row' textAlign='left' marginTop={2}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={11}>
              <Box display='flex' flexDirection='row' textAlign='left' marginTop={2}></Box>
            </Grid>
            <Grid item xs={11}>
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
                    <Button onClick={() => setShowAnnouncements(false)}>
                      <ChevronLeftIcon sx={{ marginRight: 0.5, marginLeft: -2.5 }} />
                    </Button>
                    <Box sx={{ marginRight: 10 }}>
                      <Subtitle size='large' fontWeight='700'>
                        Parent Announcements
                      </Subtitle>
                    </Box>
                    <Box>
                      <SegmentedControl />
                    </Box>
                  </Box>
                  <TextField
                    InputProps={{
                      startAdornment: <SearchIcon />,
                    }}
                  />
                </Box>
                <Table tableBody={data} />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CSSTransition>
    </TransitionGroup>
  )
}