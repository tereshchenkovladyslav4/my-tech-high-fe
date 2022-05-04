import { FormControlLabel, Checkbox, Avatar, Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useRef } from 'react'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import Slider from 'react-slick'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
const ordinal = (n) => {
  var s = ['th', 'st', 'nd', 'rd']
  var v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
export const Students = ({ students, selectedStudent, handleChangeStudent }) => {
  const sliderRef = useRef(null)
  const [showAll, setShowAll] = useState(false)
  const status = ['Pending', 'Active', 'Withdrawn', '']
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
        <Grid item xs={10}>
          <Slider {...settings} ref={sliderRef}>
            {students
              .filter(
                (item) =>
                  item.status.length === 0 || (item.status.length && Number(item.status[0].status) < 2) || 
                  (item.status.length && Number(item.status[0].status) == 2 && item.grade_levels.length && item.grade_levels[0].grade_level.includes('K') ||  item.grade_levels.length && item.grade_levels[0].grade_level < 12 ),
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
                        {(item.grade_levels.length && item.grade_levels[0].grade_level && item.grade_levels[0].grade_level.includes('K'))
                          ? 'Kindergarten'
                          : ordinal(item.grade_level || (item.grade_levels.length && item.grade_levels[0].grade_level)) +
                            ' Grade'}
                      </Paragraph>
                    }
                    image={<Avatar alt='Remy Sharp' variant='rounded' style={{ marginRight: 8 }} />}
                  />
                </Box>
              ))}
              {students
              .filter(
                (item) =>
                (item.status.length && Number(item.status[0].status) > 1) && 
                  (item.status.length && Number(item.status[0].status) == 2 && item.grade_levels.length && item.grade_levels[0].grade_level.includes('K') ||  item.grade_levels.length && item.grade_levels[0].grade_level <= 12 ),
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
                    image={<Avatar alt='Remy Sharp' variant='rounded' style={{ marginRight: 8 }} />}
                  />
                </Box>
              ))}

            {students
              .filter(
                (item) =>
                  (showAll && (item.status.length && Number(item.status[0].status) > 1) && 
                  !(item.status.length && Number(item.status[0].status) == 2 && item.grade_levels.length && item.grade_levels[0].grade_level.includes('K') ||  item.grade_levels.length && item.grade_levels[0].grade_level <= 12 )) ,
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
                    image={<Avatar alt='Remy Sharp' variant='rounded' style={{ marginRight: 8 }} />}
                  />
                </Box>
              ))}
          </Slider>
        </Grid>
      </Box>
    </Box>
  )
}
