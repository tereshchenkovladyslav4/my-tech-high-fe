import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SearchIcon from '@mui/icons-material/Search'
import { Avatar, AvatarGroup, Box, Card, Divider, Grid, IconButton, TextField } from '@mui/material'
import { Metadata } from '../../../components/Metadata/Metadata'
import { SegmentedControl } from '../../../components/SegmentedControl/SegmentedControl'
import { Table } from '../../../components/Table/Table'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { imageA, imageB, imageC } from '../../Dashboard/Dashboard'
import { Homeroom } from './Homeroom/Homeroom'
import { SchoolEnrollment } from './SchoolEnrollment/SchoolEnrollment'
import { SchoolYear } from './SchoolYear/SchoolYear'
import { ToDo } from './ToDoList/ToDo'

export const AdminDashboard: FunctionComponent = () => {
  const { me } = useContext(UserContext)
  const [showAnnouncements, setShowAnnouncements] = useState(false)
  const [, setIsSuper] = useState(null)

  useEffect(() => {
    if (me) {
      setIsSuper(Number(me?.role?.level) === 1)
      setShowAnnouncements(Number(me?.role?.level) === 1)
    }
  }, [me])

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
    <Grid
      container
      justifyContent='center'
      spacing={{ xs: 2 }}
      sx={{ margin: '0 !important', width: 'calc(100% - 16px) !important' }}
    >
      <Grid item xs={12} lg={8}>
        <Box marginBottom={5}>
          <SchoolYear />
        </Box>
        <ToDo />
      </Grid>
      <Grid item xs={12} lg={4}>
        <Card
          style={{
            width: '100%',
            borderRadius: 12,
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
                inputMode='search'
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
