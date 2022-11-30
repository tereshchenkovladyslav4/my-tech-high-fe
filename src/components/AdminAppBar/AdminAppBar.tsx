import React, { FunctionComponent, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SearchIcon from '@mui/icons-material/Search'
import {
  AppBar as MUIAppBar,
  Avatar,
  Box,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  OutlinedInput,
} from '@mui/material'
import { map } from 'lodash'
import debounce from 'lodash.debounce'
import { useLocation } from 'react-router-dom'
import Slider from 'react-slick'
import { useRecoilState } from 'recoil'
import { MthColor, MthTitle } from '@mth/enums'
import { getWindowDimension } from '@mth/utils'
import { ProfileContext } from '../../providers/ProfileProvider/ProfileContext'
import { RegionType } from '../../providers/UserContext/types'
import { UserContext, userRegionState } from '../../providers/UserContext/UserProvider'
import { MTHBLUE } from '../../utils/constants'
import { CustomConfirmModal } from '../CustomConfirmModal/CustomConfirmModal'
import { Metadata } from '../Metadata/Metadata'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles } from './styles'

export const getAllPersonInfoBySearchItem = gql`
  query AllPersonInfoBySearchItem($getPersonInfoArgs: GetPersonInfoArgs!) {
    allPersonInfoBySearchItem(getPersonInfoArgs: $getPersonInfoArgs) {
      email
      id
      name
      parentId
      phoneNumber
      role
    }
  }
`

export const AdminAppBar: FunctionComponent = () => {
  const classes = useStyles
  const { me, setMe } = useContext(UserContext)
  const location = useLocation()
  const sliderRef = useRef()
  const [searchField, setSearchField] = useState('')
  const [selected, setSelected] = useRecoilState(userRegionState)

  const [searchListView, setSearchListView] = useState(false)
  const [personInfoList, setPersonInfoList] = useState<unknown[]>([])
  const { showModal, setStore } = useContext(ProfileContext)
  const { loading: personInfoLoading, data: personInfos } = useQuery(getAllPersonInfoBySearchItem, {
    variables: {
      getPersonInfoArgs: {
        region_id: me?.selectedRegionId,
        search: searchField,
      },
    },
    skip: me?.selectedRegionId && searchField ? false : true,
    fetchPolicy: 'network-only',
  })

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension())

  const isActive = (id) => location.pathname.includes(`homeroom/${id}`)
  function SampleNextArrow(props) {
    const { style } = props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          right: '-30px',
          top: '31%',
          width: '24px',
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
    const { className, style } = props
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
    className: 'slider variable-width',
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    variableWidth: true,
    rows: 1,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1368,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  useEffect(() => {
    if (me?.selectedRegionId == null) {
      const localStorageRegion = localStorage.getItem('selectedRegion')
      if (localStorageRegion !== null) {
        handleRegionChange(JSON.parse(localStorageRegion))
      } else {
        handleRegionChange(me?.userRegion[0])
      }
    }

    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!personInfoLoading && personInfos?.allPersonInfoBySearchItem) {
      setPersonInfoList(personInfos?.allPersonInfoBySearchItem)
    }
  }, [me?.selectedRegionId, personInfos])

  //	Flag state which indicates to leaving confirmation modal when changing region
  const [unsavedChanges, setUnsavedChanges] = useState(0)

  const handleRegionChange = (region) => {
    //	Check if there is any form and form is changed
    const forms = document.getElementsByTagName('form')
    let bHasChange = false
    for (let i = 0; i < forms.length; i++) {
      const form = forms[i]
      //	Get changed property of the form
      if (form.getAttribute('changed') == 'true') bHasChange = true
    }

    const programSettings = document.getElementsByClassName('program-set')
    if (programSettings.length > 0 && programSettings[0].value == '1') {
      bHasChange = true
    }

    if (bHasChange) {
      setUnsavedChanges(region)
      return
    }

    setRegion(region)
  }

  const setRegion = (region) => {
    setSelected(region)
    localStorage.setItem('selectedRegion', JSON.stringify(region))

    setMe((prev) => {
      return {
        ...prev,
        selectedRegionId: region.region_id,
      }
    })
  }

  const changeHandler = (event) => {
    setSearchField(event)
  }

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

  const handleListItemClick = (val) => {
    if (val && val.role == 'Student') {
      const data = {
        student_id: parseInt(val.id),
        parent: {
          parent_id: parseInt(val.parentId),
        },
      }
      showModal(data)
      setStore(true)
    } else if (val && val.role == 'Parent') {
      const data = {
        parent_id: parseInt(val.id),
      }
      showModal(data)
      setStore(true)
    }
  }

  const renderRegionHeader = () =>
    map(me?.userRegion, (region: RegionType) => {
      return (
        <Box
          sx={{
            textDecoration: 'none',
            cursor: 'pointer',
            position: 'relative',
            margin: '0 8px',
          }}
          key={region?.regionDetail.id}
          onClick={() => handleRegionChange(region)}
        >
          <Divider
            orientation='vertical'
            sx={{
              position: 'absolute',
              height: 35,
              top: '12px',
              left: 0,
            }}
            variant='middle'
          />
          <Box sx={{ px: '22px' }}>
            <Metadata
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
        </Box>
      )
    })

  return (
    <MUIAppBar position='static' sx={classes.appBar} elevation={0}>
      <div style={classes.toolbar}>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item xs={3} sx={{ position: 'relative' }}>
            <OutlinedInput
              size='small'
              style={{ fontSize: 12, background: MthColor.WHITE }}
              fullWidth
              placeholder='Search Person, Email, or Phone Number'
              onBlur={() => {
                setTimeout(() => {
                  setSearchField('')
                  setPersonInfoList([])
                  setSearchListView(false)
                }, 300)
              }}
              onFocus={() => {
                setSearchListView(true)
              }}
              onChange={(e) => debouncedChangeHandler(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
            {searchListView && personInfoList.length > 0 && (
              <Box sx={classes.searchList}>
                <List arial-label='main mailbox folders'>
                  {personInfoList.map((personInfo, index) => (
                    <ListItemButton key={index} onClick={() => handleListItemClick(personInfo)}>
                      <ListItemText primary={personInfo.name + ' ' + '(' + personInfo.role + ')'} />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            )}
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={7}>
            <Box
              width={
                windowDimensions.width > 639
                  ? 'calc(58vw - 200px)'
                  : windowDimensions.width > 565
                  ? 'calc(58vw - 150px)'
                  : windowDimensions.width > 505
                  ? 'calc(58vw - 105px)'
                  : windowDimensions.width > 400
                  ? 'calc(58vw - 60px)'
                  : windowDimensions.width > 350
                  ? 'calc(58vw - 30px)'
                  : windowDimensions.width > 295
                  ? '58vw'
                  : windowDimensions.width > 230
                  ? '75vw'
                  : windowDimensions.width > 175
                  ? '97vw'
                  : '160vw'
              }
            >
              <Slider {...settings} ref={sliderRef}>
                {renderRegionHeader()}
              </Slider>
            </Box>
          </Grid>
        </Grid>
        {unsavedChanges !== 0 && (
          <CustomConfirmModal
            header={MthTitle.UNSAVED_TITLE}
            content={MthTitle.UNSAVED_DESCRIPTION}
            handleConfirmModalChange={(isOk: boolean) => {
              if (isOk) {
                setRegion(unsavedChanges)
              }
              setUnsavedChanges(0)
            }}
          />
        )}
      </div>
    </MUIAppBar>
  )
}
