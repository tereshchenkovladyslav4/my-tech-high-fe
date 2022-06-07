import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Avatar, AvatarGroup, Button, Card, Grid, ListItemText } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { ReadMoreSectionProps } from './types'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { Person } from '../../HomeroomStudentProfile/Student/types'
import { useStyles } from '../Announcements/styles'

const ReadMoreSection = ({ inProp, announcement, setSectionName }: ReadMoreSectionProps) => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const { students } = me
  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const innerHtml = (value: string) => {
    return { __html: value }
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

  return (
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
                <Button onClick={() => setSectionName('viewAll')}>
                  <ChevronLeftIcon sx={{ marginRight: 0.5, marginLeft: -2.5 }} />
                </Button>
                <Box sx={{ marginRight: 10 }}>
                  <Subtitle size='large' fontWeight='700'>
                    {announcement?.subject}
                  </Subtitle>
                </Box>
              </Box>
            </Box>
            <Box sx={classes.readMoreSection}>
              <ListItemText secondary={announcement.date} />
            </Box>
            <Box sx={classes.readMoreSection}>{announcement?.grades && avatarGroup(announcement?.grades)}</Box>
            <Box sx={classes.readMoreSection}>
              <div dangerouslySetInnerHTML={innerHtml(announcement?.body)}></div>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReadMoreSection
