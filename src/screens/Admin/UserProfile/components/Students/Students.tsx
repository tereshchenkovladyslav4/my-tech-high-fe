import React, { useState, useRef } from 'react'
import { useMutation } from '@apollo/client'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { FormControlLabel, Checkbox, Avatar, Grid, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import Slider from 'react-slick'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthRoute, StudentStatus } from '@mth/enums'
import { becomeUserMutation } from '@mth/graphql/mutation/user'
import { Student } from '@mth/models'
import { UserInfo } from '@mth/providers/UserContext/UserProvider'

type StudentsProps = {
  students: Student[]
  selectedStudent: Student
  handleChangeStudent: () => void
  me: UserInfo
}

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export const Students: React.FC<StudentsProps> = ({ students, selectedStudent, handleChangeStudent, me }) => {
  const history = useHistory()
  const sliderRef = useRef(null)
  const [showAll, setShowAll] = useState(false)
  const status = ['Pending', 'Active', 'Withdrawn', 'Graduated', '']

  function SampleNextArrow(props) {
    const { style } = props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          right: '-160px',
          top: '31%',
          width: '150px',
          height: '30px',
          position: 'absolute',
          alignItems: 'center',
        }}
      >
        <ChevronRightIcon
          style={{ ...style, display: 'block', color: 'black', background: '#FAFAFA', cursor: 'pointer' }}
          onClick={() => sliderRef.current.slickNext()}
        />
      </div>
    )
  }

  function SamplePrevArrow(props) {
    const { className, style } = props
    return (
      <ChevronLeftIcon
        className={className}
        style={{ ...style, display: 'block', color: 'black', background: '#FAFAFA' }}
        onClick={() => sliderRef.current.slickPrev()}
      />
    )
  }

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  const [becomeUserAction] = useMutation(becomeUserMutation)

  const becomeUser = (id) => {
    becomeUserAction({
      variables: {
        userId: Number(id),
      },
    })
      .then((resp) => {
        localStorage.setItem('masquerade', resp.data.masqueradeUser.jwt)
        localStorage.setItem('previousPage', location.href.replace(import.meta.env.SNOWPACK_PUBLIC_WEB_URL, ''))
      })
      .then(() => {
        history.push(MthRoute.DASHBOARD)
        location.reload()
      })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: '24px',
        }}
      >
        <Subtitle size='large' fontWeight='700' sx={{ marginRight: '36px' }}>
          Students
        </Subtitle>
        <FormControlLabel
          control={<Checkbox value={showAll} onChange={(e, checked) => setShowAll(checked)} />}
          label={
            <Paragraph fontWeight='700' size='medium'>
              Show Graduated/Transitioned
            </Paragraph>
          }
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: '24px',
        }}
      >
        <Grid container>
          <Grid item xs={10}>
            <Slider {...settings} ref={sliderRef}>
              {students
                .filter((item) => {
                  const status: StudentStatus | undefined = Number(item.status?.[0]?.status) || undefined
                  return (
                    status === undefined ||
                    status === StudentStatus.PENDING ||
                    status === StudentStatus.ACTIVE ||
                    status === StudentStatus.APPLIED ||
                    status === StudentStatus.REAPPLIED ||
                    status === StudentStatus.ACCEPTED ||
                    status === StudentStatus.WITHDRAWN
                  )
                })
                .map((item, idx) => (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => handleChangeStudent(item)} key={idx}>
                    <Metadata
                      title={
                        <Subtitle
                          fontWeight='700'
                          color={selectedStudent === parseInt(item.student_id) ? '#4145FF' : '#cccccc'}
                        >
                          {item.person.first_name}
                        </Subtitle>
                      }
                      subtitle={
                        <Box display={'flex'} flexDirection='row' alignItems={'center'} alignContent='center'>
                          <Paragraph color='#cccccc' size={'large'}>
                            {item.grade_levels.length &&
                            item.grade_levels[0].grade_level &&
                            item.grade_levels[0].grade_level.includes('K')
                              ? 'Kindergarten'
                              : ordinal(
                                  item.grade_level || (item.grade_levels.length && item.grade_levels[0].grade_level),
                                ) + ' Grade'}
                          </Paragraph>
                          {selectedStudent === parseInt(item.student_id) && Boolean(me.masquerade) && (
                            <Tooltip title='Masquerade'>
                              <AccountBoxOutlinedIcon
                                sx={{ color: '#4145FF', height: 15, width: 15 }}
                                onClick={() => becomeUser(item.person.user.user_id)}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      }
                      image={
                        <Avatar
                          alt={item.person.preferred_first_name ?? item.person.first_name}
                          src='image'
                          variant='rounded'
                          style={{ marginRight: 8 }}
                        />
                      }
                    />
                  </Box>
                ))}
              {students
                .filter(
                  (item) =>
                    item.status.length > 0 &&
                    Number(item.status[0].status) === 2 &&
                    (!item.person.date_of_birth ||
                      (item.person.date_of_birth &&
                        moment(item.person.date_of_birth) > moment().subtract('years', 19))),
                )
                .map((item, idx) => (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => handleChangeStudent(item)} key={idx}>
                    <Metadata
                      title={
                        <Subtitle
                          fontWeight='700'
                          color={selectedStudent === parseInt(item.student_id) ? '#4145FF' : '#cccccc'}
                        >
                          {item.person.first_name}
                        </Subtitle>
                      }
                      subtitle={
                        <Paragraph color='#cccccc' size={'large'}>
                          {status[item.status[0].status]}
                        </Paragraph>
                      }
                      image={
                        <Avatar
                          alt={item.person.preferred_first_name ?? item.person.first_name}
                          src='image'
                          variant='rounded'
                          style={{ marginRight: 8 }}
                        />
                      }
                    />
                  </Box>
                ))}

              {students
                .filter(
                  (item) =>
                    showAll &&
                    ((item.status.length &&
                      Number(item.status[0].status) > 1 &&
                      item.status.length &&
                      Number(item.status[0].status) === 3) ||
                      (item.status.length &&
                        Number(item.status[0].status) === 2 &&
                        item.person.date_of_birth &&
                        moment(item.person.date_of_birth) < moment().subtract('years', 19))),
                )
                .map((item, idx) => (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => handleChangeStudent(item)} key={idx}>
                    <Metadata
                      title={
                        <Subtitle
                          fontWeight='700'
                          color={selectedStudent === parseInt(item.student_id) ? '#4145FF' : '#cccccc'}
                        >
                          {item.person.first_name}
                        </Subtitle>
                      }
                      subtitle={
                        <Paragraph color='#cccccc' size={'large'}>
                          {status[item.status[0].status]}
                        </Paragraph>
                      }
                      image={
                        <Avatar
                          alt={item.person.preferred_first_name ?? item.person.first_name}
                          src='image'
                          variant='rounded'
                          style={{ marginRight: 8 }}
                        />
                      }
                    />
                  </Box>
                ))}
            </Slider>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
