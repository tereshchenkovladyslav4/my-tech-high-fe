import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import { StudentGrade } from './components/StudentGrade/StudentGrade'
import Box from '@mui/material/Box'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { Avatar, Card, Stack } from '@mui/material'
import { UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { map } from 'lodash'
import { SchoolYearType } from '../../../utils/utils.types'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Slider from 'react-slick'

type HomeroomGradeProps = {
  schoolYears: SchoolYearType[]
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export const HomeroomGrade: FunctionComponent<HomeroomGradeProps> = ({ schoolYears }) => {
  const { me } = useContext(UserContext);
  const { students } = me as UserInfo;

  const sliderRef = useRef();

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function SampleNextArrow(props) {
    const { className, style } = props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          right: '-160px',
          top: 'calc(50% - 15px)',
          width: '150px',
          height: '30px',
          marginLeft: 2,
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
		className: "slider variable-width",
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(5, students.filter(x => x.status.at(-1)?.status !== 2).length),
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
		variableWidth: true,
		rows: 1,
    responsive: [
      {
        breakpoint: 770,
        settings: {
          slidesToShow: Math.min(4, students.filter(x => x.status.at(-1)?.status !== 2).length),
        }
      },
      {
        breakpoint: 710,
        settings: {
          slidesToShow: Math.min(3, students.filter(x => x.status.at(-1)?.status !== 2).length),
        }
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: Math.min(2, students.filter(x => x.status.at(-1)?.status !== 2).length),
        }
      },
    ]
  };

  const renderStudents = () =>
    map(students, (student) => {
      return student.status.at(-1)?.status !== 2 && <StudentGrade schoolYears={schoolYears} student={student} />
    })

  return (
    <Card style={{ borderRadius: 12 }}>
      <Box
        flexDirection='row'
        textAlign='left'
        paddingY={1.5}
        paddingX={3}
        display='flex'
        justifyContent='space-between'
      >
        <Box display='flex' justifyContent='space-between' flexDirection='column'>
          <Subtitle size='large' fontWeight='bold'>
            Students
          </Subtitle>
          {/*<Stack direction='column' spacing={1}>
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Avatar sx={classes.legendBelow} variant='rounded'>
                {' '}
              </Avatar>
              <Paragraph size='medium'>Below 80%</Paragraph>
            </Box>
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Avatar sx={classes.legendAbove} variant='rounded'>
                {' '}
              </Avatar>
              <Paragraph size='medium'>Above 80%</Paragraph>
            </Box>
          </Stack>*/}
        </Box>

        <Stack display='flex' justifyContent='flex-end' alignSelf='center' marginY={1} direction='row' spacing={2}>
          {students && students.length > 2 && (
          <Box sx={{
            width: windowDimensions.width > 770 ? (Math.min(students.filter(x => x.status.at(-1)?.status !== 2).length, 5) * 60) + 'px'
              : (windowDimensions.width > 710 ? (Math.min(students.filter(x => x.status.at(-1)?.status !== 2).length, 4) * 60) + 'px'
                : (windowDimensions.width > 650 ? (Math.min(students.filter(x => x.status.at(-1)?.status !== 2).length, 3) * 60) + 'px'
                  : (Math.min(students.filter(x => x.status.at(-1)?.status !== 2).length, 2) * 60) + 'px'
                ))
            , mr: '20px'
            }}>
            <Slider {...settings} ref={sliderRef}>
              {renderStudents()}
            </Slider>
          </Box>
          )}
          {students && students.length <= 2 && renderStudents()}
        </Stack>
      </Box>
    </Card>
  )
}
