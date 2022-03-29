import { Avatar, AvatarGroup, Box, Button, Card, Divider, Grid, IconButton, TextField } from '@mui/material'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { SchoolEnrollment } from './SchoolEnrollment/SchoolEnrollment'
import { Homeroom } from './Homeroom/Homeroom'
import { SchoolYear } from './SchoolYear/SchoolYear'
import { SegmentedControl } from '../../../components/SegmentedControl/SegmentedControl'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { Metadata } from '../../../components/Metadata/Metadata'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { imageA, imageB, imageC } from '../../Dashboard/Dashboard'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SearchIcon from '@mui/icons-material/Search'
import { Table } from '../../../components/Table/Table'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { ToDo } from './ToDoList/ToDo'

export const AdminDashboard: FunctionComponent = () => {
  const { me } = useContext(UserContext);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [isSuper, setIsSuper] = useState(null);

  useEffect(() => {
    if (me) {
      setIsSuper(Number(me?.role?.level) === 1);
      setShowAnnouncements(Number(me?.role?.level) === 1)
    }
  }, [me]);

  const avatarGroup = (
    <AvatarGroup max={4} spacing={1}>
      <Avatar alt='Remy Sharp' src={imageA} />
      <Avatar alt='Travis Howard' src={imageB} />
      <Avatar alt='Cindy Baker' src={imageC} />
      <Avatar alt='Agnes Walker' src={imageA} />
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

  return showAnnouncements ? (
    <Grid container justifyContent='center' >
      <Grid item xs={8} sx={{ paddingX: 2, my: 4 }}>
        <Box marginBottom={5}>
          <SchoolYear />
        </Box>
        <ToDo />
      </Grid>
      <Grid item xs={4}>
        <Card
          style={{
            width: 300,
            marginRight: 25,
            borderRadius: 12,
            marginTop: 30,
            marginBottom: 30,
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          <>
            <SchoolEnrollment />
            <Divider sx={{ marginY: '12px' }} />
            <Homeroom />
          </>
        </Card>
      </Grid>
    </Grid>
  ) : (
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
                <IconButton sx={{ marginRight: 0.5, marginLeft: -2.5 }} onClick={() => setShowAnnouncements(false)}>
                  <ChevronLeftIcon />
                </IconButton>
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
                inputMode="search"
                size='small'
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
  )
}
