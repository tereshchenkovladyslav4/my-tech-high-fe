import { FormControlLabel, Checkbox, Avatar, Grid, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useRef } from 'react'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import Slider from 'react-slick'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import moment from 'moment'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { becomeUserMutation } from '../../../../../graphql/mutation/user'
import { useMutation, useQuery } from '@apollo/client'
import { DASHBOARD } from '../../../../../utils/constants'
import { useHistory } from 'react-router-dom'

const ordinal = (n) => {
  var s = ['th', 'st', 'nd', 'rd']
  var v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
export const Students = ({ students, selectedStudent, handleChangeStudent, me }) => {
  const history = useHistory()
  const sliderRef = useRef(null)
  const [showAll, setShowAll] = useState(false)
  const status = ['Pending', 'Active', 'Withdrawn', 'Graduated', ''];

  function SampleNextArrow(props) {
    const { className, style, onClick } = props
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
    const { className, style, onClick } = props
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
  
  const [becomeUserAction, { data, loading: userLoading, error: userError }] =
  useMutation(becomeUserMutation)

  const becomeUser = (id) => {
    becomeUserAction({
      variables: {
        userId:  Number(id)
      }
    })
    .then((resp) => {
      localStorage.setItem('masquerade' ,resp.data.masqueradeUser.jwt)
      localStorage.setItem('previousPage',location.href.replace(import.meta.env.SNOWPACK_PUBLIC_WEB_URL, ''))
    })
    .then(() => {
      history.push(DASHBOARD)
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
          <Grid xs={10}>
            <Slider {...settings} ref={sliderRef} >
              {students
                .filter(
                  (item) =>
                    item.status.length === 0 || (item.status.length && Number(item.status[0].status) < 2)
                )
                .map((item) => (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => handleChangeStudent(item)}>
                    <Metadata
                      title={
                        <Subtitle fontWeight='700' color={selectedStudent === parseInt(item.student_id) ? '#4145FF' : '#cccccc'}>
                          {item.person.first_name}
                        </Subtitle>
                      }
                      subtitle={
                        <Box display={'flex'} flexDirection='row' alignItems={'center'} alignContent='center'>
                          <Paragraph color='#cccccc' size={'large'}>
                            {(item.grade_levels.length && item.grade_levels[0].grade_level && item.grade_levels[0].grade_level.includes('K'))
                              ? 'Kindergarten'
                              : ordinal(item.grade_level || (item.grade_levels.length && item.grade_levels[0].grade_level)) +
                                ' Grade'}
                          </Paragraph>
                          {
                            selectedStudent === parseInt(item.student_id) && Boolean(me.masquerade)
                              && <Tooltip title='Masquerade'>
                              <AccountBoxOutlinedIcon 
                                sx={{color: '#4145FF', height: 15, width: 15}}
                                onClick={() => becomeUser(item.person.user.user_id)}
                              />
                            </Tooltip>
                          }
                        </Box>
                      }
                      image={<Avatar alt={item.person.preferred_first_name ?? item.person.first_name} src="image" variant='rounded' style={{ marginRight: 8 }} />}
                    />
                  </Box>
                ))}
                {students
                .filter(
                  (item) =>
                  item.status.length > 0 && 
                    ((Number(item.status[0].status) === 2) && (!item.person.date_of_birth || item.person.date_of_birth && moment(item.person.date_of_birth) > moment().subtract('years', 19))),
                )
                .map((item) => (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => handleChangeStudent(item)}>
                    <Metadata
                      title={
                        <Subtitle fontWeight='700' color={selectedStudent === parseInt(item.student_id) ? '#4145FF' : '#cccccc'}>
                          {item.person.first_name}
                        </Subtitle>
                      }
                      subtitle={
                        <Paragraph color='#cccccc' size={'large'}>
                          {status[item.status[0].status]}
                        </Paragraph>
                      }
                      image={<Avatar alt={item.person.preferred_first_name ?? item.person.first_name} src="image" variant='rounded' style={{ marginRight: 8 }} />}
                    />
                  </Box>
                ))}

              {students
                .filter(
                  (item) =>
                    showAll && ((item.status.length && Number(item.status[0].status) > 1) &&
                    (item.status.length && Number(item.status[0].status) === 3 ) ||
                    (item.status.length && Number(item.status[0].status) === 2  && (item.person.date_of_birth && moment(item.person.date_of_birth) < moment().subtract('years', 19)))) ,
                )
                .map((item) => (
                  <Box sx={{ cursor: 'pointer' }} onClick={() => handleChangeStudent(item)}>
                    <Metadata
                      title={
                        <Subtitle fontWeight='700' color={selectedStudent === parseInt(item.student_id) ? '#4145FF' : '#cccccc'}>
                          {item.person.first_name}
                        </Subtitle>
                      }
                      subtitle={
                        <Paragraph color='#cccccc' size={'large'}>
                          {status[item.status[0].status]}
                        </Paragraph>
                      }
                      image={<Avatar alt={item.person.preferred_first_name ?? item.person.first_name} src="image" variant='rounded' style={{ marginRight: 8 }} />}
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
