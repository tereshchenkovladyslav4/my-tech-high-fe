import React, { useState, useContext, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Button, Stack, Typography, IconButton } from '@mui/material'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { Prompt, useHistory } from 'react-router-dom'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { useStyles } from '../styles'
import moment from 'moment'
import { SchoolYearSelect } from './SchoolYearSelect'
import { ApplicationsSelect } from './ApplicationsSelect'
import { MidYearSelect } from './MidYearSelect'
import { AddSchoolYearModal } from './AddSchoolYearModal'
import { DropDownItem } from '../../../../components/DropDown/types'

const useBeforeUnload = ({ when, message }) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = message
      return message
    }

    if (when) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [when, message])
}

export const updateSchoolYearMutation = gql`
  mutation UpdateSchoolYear($updateSchoolYearInput: UpdateSchoolYearInput!) {
    UpdateSchoolYear(updateSchoolYearInput: $updateSchoolYearInput) {
      school_year_id
      school_year_open
      school_year_close
      application_open
      application_close
      mid_year_open
      mid_year_close
      mid_year_status
    }
  }
`

export const getSchoolYearsByRegionId = gql`
  query SchoolYearsByRegionId($regionId: ID!) {
    schoolYearsByRegionId(regionId: $regionId) {
      school_year_id
      date_begin
      date_end
      application_open
      application_close
    }
  }
`
type SchoolYears = {
  schoolYearId: number
  schoolYearOpen: string
  schoolYearClose: string
  applicationsOpen: string
  applicationsClose: string
  midYearOpen: string
  midYearClose: string
  midYearStatus: boolean
}

const Years: React.FC = () => {
  const classes = useStyles
  const history = useHistory()
  const { me, setMe } = useContext(UserContext)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [addSchoolYearDialogOpen, setAddSchoolYearDialogOpen] = useState<boolean>(false)
  const [selectedYearId, setSelectedYearId] = useState<string>('')
  const [oldSelectedYearId, setOldSelectedYearId] = useState<string>('')
  const [schoolYearOpen, setSchoolYearOpen] = useState<string>('')
  const [schoolYearClose, setSchoolYearClose] = useState<string>('')
  const [applicationsOpen, setApplicationsOpen] = useState<string>('')
  const [applicationsClose, setApplicationsClose] = useState<string>('')
  const [midYearStatus, setMidYearStatus] = useState<boolean>(false)
  const [midYearOpen, setMidYearOpen] = useState<string>('')
  const [midYearClose, setMidYearClose] = useState<string>('')
  const [schoolYears, setSchoolYears] = useState<SchoolYears[]>(localStorage.getItem('schoolYearsByRegionId') ? JSON.parse(localStorage.getItem('schoolYearsByRegionId')) : [])
  const [years, setYears] = useState<DropDownItem[]>([])
  const [addSchoolYears, setAddSchoolYears] = useState<DropDownItem[]>([])
  const [submitSave, { data, loading, error }] = useMutation(updateSchoolYearMutation)

  // const { loading: schoolLoading, data: schoolYearData } = useQuery(getSchoolYearsByRegionId, {
  //   variables: {
  //     regionId: me?.selectedRegionId
  //   },
  //   fetchPolicy: 'network-only',
  // })
  useBeforeUnload({
    when: isChanged ? true : false,
    message: JSON.stringify({
      header: "Unsaved Work",
      content: "Changes you made will not be saved"
    }),
  })

  const handleBackClick = () => {
    history.push('/site-management/')
  }

  const handleClickSave = async () => {
    // const submitedResponse = await submitSave({
    //   variables: {
    //     updateSchoolYearInput: {
    //       school_year_id: selectedYearId,
    //       school_year_open: schoolYearOpen,
    //       school_year_close: schoolYearClose,
    //       application_open: applicationsOpen,
    //       application_close: applicationsClose,
    //       mid_year_open: midYearOpen,
    //       mid_year_close: midYearClose,
    //       mid_year_status: midYearStatus
    //     },
    //   },
    // })
    let schoolYearsArr = schoolYears
    if (selectedYearId && selectedYearId != 'add') {
      schoolYearsArr.forEach(schoolYear => {
        if (schoolYear.schoolYearId == selectedYearId) {
          schoolYear.schoolYearOpen = schoolYearOpen
          schoolYear.schoolYearClose = schoolYearClose
          schoolYear.applicationsOpen = applicationsOpen
          schoolYear.applicationsClose = applicationsClose
          schoolYear.midYearOpen = midYearOpen
          schoolYear.midYearClose = midYearClose
          schoolYear.midYearStatus = midYearStatus
        }
      })
    } else {
      schoolYearsArr.push({
        schoolYearId: selectedYearId && selectedYearId != 'add' ? selectedYearId : (schoolYears.length + 1) + '',
        schoolYearOpen: schoolYearOpen,
        schoolYearClose: schoolYearClose,
        applicationsOpen: applicationsOpen,
        applicationsClose: applicationsClose,
        midYearOpen: midYearOpen,
        midYearClose: midYearClose,
        midYearStatus: midYearStatus
      })
    }
    
    setSchoolYears(schoolYearsArr)
    setDropYears(schoolYearsArr)
    localStorage.setItem('schoolYearsByRegionId', JSON.stringify(schoolYearsArr));
    setIsChanged(false)
  }

  const handleParentClose = () => {
    setAddSchoolYearDialogOpen(false)
    setSelectedYearId(oldSelectedYearId)
  }

  const handleParentSave = (val) => {
    if (val && val == 'none') {
      setSchoolYearOpen('')
      setSchoolYearClose('')
      setApplicationsOpen('')
      setApplicationsClose('')
      setMidYearOpen('')
      setMidYearClose('')
      setMidYearStatus('')
    } else if (val) {
      schoolYears.forEach(schoolYear => {
        if (schoolYear.schoolYearId == parseInt(val)) {
          setSchoolYearOpen('')
          setSchoolYearClose('')
          setApplicationsOpen(schoolYear.applicationsOpen)
          setApplicationsClose(schoolYear.applicationsClose)
          setMidYearOpen(schoolYear.midYearOpen)
          setMidYearClose(schoolYear.midYearClose)
          setMidYearStatus(schoolYear.midYearStatus)
        }
      })
    }
    setAddSchoolYearDialogOpen(false)
  }

  const getRegionById = (id: number) => {
    return me.userRegion.find((region) => region.region_id === id)
  }

  const setDropYears = (schoolYearsArr: any[]) => {
    const dropYears: DropDownItem[] = []
    const newSchoolYears: DropDownItem[] = [{ value: 'none', label: 'None' }]
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach(schoolYear => {
        dropYears.push({
          value: schoolYear.schoolYearId + '',
          label: moment(schoolYear.schoolYearOpen).format('YYYY') + '-' + moment(schoolYear.schoolYearClose).format('YYYY')
        })
        newSchoolYears.push({
          value: schoolYear.schoolYearId + '',
          label: moment(schoolYear.schoolYearOpen).format('YYYY') + '-' + moment(schoolYear.schoolYearClose).format('YYYY')
        })
      })
      dropYears.push({
        value: 'add',
        label: '+ Add School Year'
      })
    } else {
      dropYears.push({
        value: 'add',
        label: '+ Add School Year'
      })
    }
    setYears(dropYears)
    setAddSchoolYears(newSchoolYears)
  }

  const handleSelectYear = (val) => {
    setOldSelectedYearId(selectedYearId)
    setSelectedYearId(val)
    if (val == 'add') {
      setAddSchoolYearDialogOpen(true)
      return
    }
    if (schoolYears && schoolYears.length > 0) {
      schoolYears.forEach(schoolYear => {
        if (schoolYear.schoolYearId == parseInt(val)) {
          setSchoolYearOpen(schoolYear.schoolYearOpen)
          setSchoolYearClose(schoolYear.schoolYearClose)
          setApplicationsOpen(schoolYear.applicationsOpen)
          setApplicationsClose(schoolYear.applicationsClose)
          setMidYearOpen(schoolYear.midYearOpen)
          setMidYearClose(schoolYear.midYearClose)
          setMidYearStatus(schoolYear.midYearStatus)
        }
      })
    }
  }

  useEffect(() => {
    setDropYears(schoolYears)
  }, [schoolYears])

  // useEffect(() => {
  //   if (!schoolLoading && schoolYearData.schoolYearsByRegionId) {
  //     let schoolYearsArr = [];
  //     schoolYearData.schoolYearsByRegionId.forEach(schoolYear => {
  //       schoolYearsArr.push({
  //         value: schoolYear.school_year_id,
  //         label: moment(schoolYear.date_begin).format('YYYY') + '-' + moment(schoolYear.date_end).format('YYYY')
  //       })
  //     })
  //     schoolYearsArr.push({
  //       value: 'add',
  //       label: '+ Add School Year'
  //     })
  //     setSchoolYears(schoolYearsArr)
  //   }
  // }, [schoolYearData])
  return (
    <Box sx={classes.base}>
      <Prompt
        when={isChanged ? true : false}
        message={JSON.stringify({
          header: "Unsaved Work",
          content: "Changes you made will not be saved"
        })}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '16px',
          paddingLeft: 0
        }}
      >
        <Box sx={{ paddingLeft: 0}}>
          <IconButton
            onClick={handleBackClick}
            sx={{
              position: 'relative',
              bottom: '2px',
              paddingLeft: 0
            }}
          >
            <ArrowBackIosRoundedIcon sx={{ fontSize: '15px', stroke: 'black', strokeWidth: 2 }} />
          </IconButton>
          <Typography paddingLeft='7px' fontSize='20px' fontWeight='700' component='span'>
            Years
          </Typography>
        </Box>
        <Box sx={{}}>
          <Button variant='contained' onClick={handleClickSave} disableElevation sx={classes.submitButton}>
            Save
          </Button>
        </Box>
      </Box>
      <Stack direction='row' spacing={1} alignItems='center'>
        <DropDown 
          dropDownItems={years}
          placeholder={'Select Year'}
          defaultValue={selectedYearId}
          sx={{ width: '200px' }}
          setParentValue={(val, index) => {
            handleSelectYear(val)
        }}/>
      </Stack>
      <Box sx={{ mt: 1 }}>
        <SchoolYearSelect
          schoolYearOpen={schoolYearOpen}
          schoolYearClose={schoolYearClose}
          setSchoolYearOpen={setSchoolYearOpen}
          setSchoolYearClose={setSchoolYearClose}
          setIsChanged={setIsChanged}
        />
        <ApplicationsSelect
          applicationsOpen={applicationsOpen}
          applicationsClose={applicationsClose}
          setApplicationsOpen={setApplicationsOpen}
          setApplicationsClose={setApplicationsClose}
          setIsChanged={setIsChanged}
        />
        <MidYearSelect
          midYearStatus={midYearStatus}
          midYearOpen={midYearOpen}
          midYearClose={midYearClose}
          setMidYearOpen={setMidYearOpen}
          setMidYearClose={setMidYearClose}
          setMidYearStatus={setMidYearStatus}
          setIsChanged={setIsChanged}
        />
      </Box>
      <AddSchoolYearModal
        addSchoolYears={addSchoolYears}
        addSchoolYearDialogOpen={addSchoolYearDialogOpen}
        handleParentClose={handleParentClose}
        handleParentSave={handleParentSave}
      />
    </Box>
  )
}

export { Years as default };
