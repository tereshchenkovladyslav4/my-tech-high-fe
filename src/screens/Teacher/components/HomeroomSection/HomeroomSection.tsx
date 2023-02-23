import React, { useEffect, useRef, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Card, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import { map } from 'lodash'
import Slider, { CustomArrowProps } from 'react-slick'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Teacher } from '@mth/models'
import { getWindowDimension } from '../../../../core/utils/window.util'
import { TeacherItem } from '../TeacherItem'

type HomeroomSectionProps = {
  title: string
  teachers?: Teacher[]
}

export const HomeroomSection: React.FC<HomeroomSectionProps> = ({ title, teachers }) => {
  const sliderRef = useRef<Slider | null>(null)
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const SlickNextArrow = (props: CustomArrowProps) => {
    const { style } = props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          right: '-142px',
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
          onClick={() => sliderRef.current?.slickNext()}
          data-testid='slickNextArrow'
        />
      </div>
    )
  }

  const SlickPrevArrow = (props: CustomArrowProps) => {
    const { className, style } = props
    return (
      <ChevronLeftIcon
        className={className}
        style={{ ...style, display: 'block', color: 'black', background: '#FAFAFA' }}
        onClick={() => sliderRef.current?.slickPrev()}
        data-testid='slickPrevArrow'
      />
    )
  }

  const settings = () => ({
    className: 'slider variable-width',
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SlickNextArrow />,
    prevArrow: <SlickPrevArrow />,
    variableWidth: true,
    rows: 1,
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 812,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  })

  const renderTeachers = () =>
    map(teachers, (teacher, index) => {
      return <TeacherItem teacher={teacher} key={index} />
    })

  const sliderWidth = Math.max(teachers?.length ?? 0, 1) * 100 > 600 ? 600 : Math.max(teachers?.length ?? 0, 1) * 100
  return (
    <Card style={{ borderRadius: 12 }}>
      <Box
        flexDirection='row'
        textAlign='left'
        paddingY={1.5}
        paddingX={3}
        justifyContent='space-between'
        sx={{
          display: { xs: 'block', sm: 'flex' },
        }}
      >
        <Box display='flex' justifyContent='space-between' flexDirection='column'>
          <Subtitle size='large' fontWeight='bold' testId='teacherHomeroomTitle'>
            {title}
          </Subtitle>
        </Box>
        {teachers && teachers?.length > 0 && (
          <Stack
            display='flex'
            justifyContent='flex-end'
            alignSelf='center'
            marginY={1}
            direction='row'
            spacing={2}
            width='100%'
          >
            <Box
              className='dynamic-box'
              sx={{
                width:
                  windowDimensions.width > 792 ? sliderWidth + 'px' : Math.min(teachers?.length ?? 0, 4.5) * 100 + 'px',
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: '.slick-track {display: flex;}' }} />
              <Slider {...settings()} ref={sliderRef}>
                {renderTeachers()}
              </Slider>
            </Box>
          </Stack>
        )}
      </Box>
    </Card>
  )
}
