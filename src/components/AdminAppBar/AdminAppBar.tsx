import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SearchIcon from '@mui/icons-material/Search'
import { AppBar as MUIAppBar, Avatar, Box, Grid, InputAdornment, OutlinedInput } from '@mui/material'
import { map } from 'lodash'
import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Slider from 'react-slick'
import { useRecoilState } from 'recoil'
import { UserContext, userRegionState } from '../../providers/UserContext/UserProvider'
import { MTHBLUE } from '../../utils/constants'
import { Metadata } from '../Metadata/Metadata'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { RegionType } from '../../providers/UserContext/types'

export const AdminAppBar: FunctionComponent = () => {
  const classes = useStyles
  const { me, setMe } = useContext(UserContext)
  const location = useLocation()
  const sliderRef = useRef()
  const [seachField, setSearchField] = useState('')
  const [selected, setSelected] = useRecoilState(userRegionState)

  const isActive = (id) => location.pathname.includes(`homeroom/${id}`)
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
          // @ts-ignore
          onClick={() => sliderRef.current?.slickNext()}
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
        // @ts-ignore
        onClick={() => sliderRef.current.slickPrev()}
      />
    )
  }

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  useEffect(() => {
    if (!selected) {
      handleRegionChange(me?.userRegion[0])
    }
  }, [])

  const handleRegionChange = (region) => {
    setSelected(region)
    localStorage.setItem('selectedRegion', JSON.stringify(region))
  }

  const renderRegionHeader = () =>
    map(me?.userRegion, (region: RegionType) => {
      return (
        <Box
          sx={{ textDecoration: 'none', cursor: 'pointer' }}
          key={region?.regionDetail.id}
          onClick={() => handleRegionChange(region)}
        >
          <Metadata
            divider={true}
            title={
              <Subtitle color={isActive(region?.regionDetail.id) ? MTHBLUE : '#A1A1A1'}>
                {region?.regionDetail.name}
              </Subtitle>
            }
            subtitle={
              <Paragraph color='#cccccc' size={'large'}>
                {region?.regionDetail.program}
              </Paragraph>
            }
            image={
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  alt={region?.regionDetail.name}
                  src={region?.regionDetail?.state_logo}
                  variant='rounded'
                  style={{ marginRight: 24 }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -16,
                    left: 0,
                    width: '65%',
                    height: 2,
                    borderBottom: region.region_id === selected?.region_id ? '2px solid #4145FF' : 0,
                  }}
                />
              </Box>
            }
          />
        </Box>
      )
    })

  return (
    <MUIAppBar position='static' sx={classes.appBar} elevation={0}>
      <div style={classes.toolbar}>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item xs={3}>
            <OutlinedInput
              size='small'
              style={{ fontSize: 12 }}
              fullWidth
              value={seachField}
              placeholder='Search Person, Email, or Phone Number'
              onChange={(e) => setSearchField(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={7}>
            <Slider {...settings} ref={sliderRef}>
              {renderRegionHeader()}
            </Slider>
          </Grid>
        </Grid>
      </div>
    </MUIAppBar>
  )
}
