import React, { useState, useContext, useEffect } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
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

export const createSchoolYearMutation = gql`
  mutation CreateSchoolYear($createSchoolYearInput: CreateSchoolYearInput!) {
    createSchoolYear(createSchoolYearInput: $createSchoolYearInput) {
      school_year_id
    }
  }
`

export const updateSchoolYearMutation = gql`
  mutation UpdateSchoolYear($updateSchoolYearInput: UpdateSchoolYearInput!) {
    updateSchoolYear(updateSchoolYearInput: $updateSchoolYearInput) {
      school_year_id
    }
  }
`

export const getSchoolYearsByRegionId = gql`
  query Region($regionId: ID!) {
    region(id: $regionId) {
      SchoolYears {
        school_year_id
        date_begin
        date_end
        date_reg_close
        date_reg_open
        midyear_application
        midyear_application_open
        midyear_application_close
      }
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
  const [schoolYears, setSchoolYears] = useState<SchoolYears[]>([])
  const [years, setYears] = useState<DropDownItem[]>([])
  const [addSchoolYears, setAddSchoolYears] = useState<DropDownItem[]>([])
  const [submitSave, { data, loading, error }] = useMutation(updateSchoolYearMutation)
  const [submitCreate, {}] = useMutation(createSchoolYearMutation)

  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useBeforeUnload({
    when: isChanged ? true : false,
    message: JSON.stringify({
      header: 'Unsaved Work',
      content: 'Changes you made will not be saved',
    }),
  })

  const handleBackClick = () => {
    history.push('/site-management/')
  }

  const handleClickSave = async () => {
    if (selectedYearId && selectedYearId != 'add') {
      const submitedResponse = await submitSave({
        variables: {
          updateSchoolYearInput: {
            school_year_id: parseInt(selectedYearId),
            date_begin: moment(schoolYearOpen),
            date_end: moment(schoolYearClose),
            date_reg_close: moment(applicationsClose),
            date_reg_open: moment(applicationsOpen),
            midyear_application: midYearStatus ? 1 : 0,
            midyear_application_open: moment(midYearOpen),
            midyear_application_close: moment(midYearClose),
          },
        },
      })
      setSelectedYearId(submitedResponse?.data?.updateSchoolYear.school_year_id)
    } else {
      const submittedCreateResponse = await submitCreate({
        variables: {
          createSchoolYearInput: {
            RegionId: parseInt(me.selectedRegionId),
            date_begin: moment(schoolYearOpen),
            date_end: moment(schoolYearClose),
            date_reg_close: moment(applicationsClose),
            date_reg_open: moment(applicationsOpen),
            midyear_application: midYearStatus ? 1 : 0,
            midyear_application_open: moment(midYearOpen),
            midyear_application_close: moment(midYearClose),
          },
        },
      })
      setSelectedYearId(submittedCreateResponse?.data?.createSchoolYear.school_year_id)
    }
    setMe((prev) => {
      return {
        ...prev,
        selectedRegionId: me.selectedRegionId,
      }
    })
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
      schoolYears.forEach((schoolYear) => {
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

  const setDropYears = (schoolYearsArr: any[]) => {
    const dropYears: DropDownItem[] = []
    const newSchoolYears: DropDownItem[] = [{ value: 'none', label: 'None' }]
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach((schoolYear) => {
        if (
          selectedYearId == '' &&
          parseInt(moment(schoolYear.schoolYearOpen).format('YYYY')) >= parseInt(moment().format('YYYY')) &&
          parseInt(moment(schoolYear.schoolYearClose).format('YYYY')) <= parseInt(moment().format('YYYY')) + 1
        ) {
          setSelectedYearId(schoolYear.schoolYearId)
          setSchoolYearOpen(schoolYear.schoolYearOpen)
          setSchoolYearClose(schoolYear.schoolYearClose)
          setApplicationsOpen(schoolYear.applicationsOpen)
          setApplicationsClose(schoolYear.applicationsClose)
          setMidYearOpen(schoolYear.midYearOpen)
          setMidYearClose(schoolYear.midYearClose)
          setMidYearStatus(schoolYear.midYearStatus)
        }
        dropYears.push({
          value: schoolYear.schoolYearId + '',
          label:
            moment(schoolYear.schoolYearOpen).format('YYYY') + '-' + moment(schoolYear.schoolYearClose).format('YYYY'),
        })
        newSchoolYears.push({
          value: schoolYear.schoolYearId + '',
          label:
            moment(schoolYear.schoolYearOpen).format('YYYY') + '-' + moment(schoolYear.schoolYearClose).format('YYYY'),
        })
      })
      dropYears.push({
        value: 'add',
        label: '+ Add School Year',
      })
    } else {
      dropYears.push({
        value: 'add',
        label: '+ Add School Year',
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
      schoolYears.forEach((schoolYear) => {
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

  const setAllDefault = () => {
    setSelectedYearId('')
    setSchoolYearOpen('')
    setSchoolYearClose('')
    setApplicationsOpen('')
    setApplicationsClose('')
    setMidYearOpen('')
    setMidYearClose('')
    setMidYearStatus(false)
  }

  useEffect(() => {
    setDropYears(schoolYears)
  }, [schoolYears])

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      let schoolYearsArr: SchoolYears[] = []
      let cnt = 0
      schoolYearData?.data?.region?.SchoolYears.forEach((schoolYear) => {
        if (schoolYear.school_year_id == selectedYearId) {
          setSchoolYearOpen(schoolYear.date_begin)
          setSchoolYearClose(schoolYear.date_end)
          setApplicationsOpen(schoolYear.date_reg_open)
          setApplicationsClose(schoolYear.date_reg_close)
          setMidYearOpen(schoolYear.midyear_application_open)
          setMidYearClose(schoolYear.midyear_application_close)
          setMidYearStatus(schoolYear.midyear_application)
          cnt++
        }
        schoolYearsArr.push({
          schoolYearId: schoolYear.school_year_id,
          schoolYearOpen: schoolYear.date_begin,
          schoolYearClose: schoolYear.date_end,
          applicationsOpen: schoolYear.date_reg_open,
          applicationsClose: schoolYear.date_reg_close,
          midYearOpen: schoolYear.midyear_application_open,
          midYearClose: schoolYear.midyear_application_close,
          midYearStatus: schoolYear.midyear_application,
        })
      })
      if (cnt == 0) {
        setAllDefault()
      }

      setSchoolYears(
        schoolYearsArr.sort((a, b) => {
          if (new Date(a.schoolYearOpen) > new Date(b.schoolYearOpen)) return 1
          else if (new Date(a.schoolYearOpen) == new Date(b.schoolYearOpen)) return 0
          else return -1
        }),
      )
    }
  }, [me.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])
  return (
    <Box sx={classes.base}>
      <Prompt
        when={isChanged ? true : false}
        message={JSON.stringify({
          header: 'Unsaved Work',
          content: 'Changes you made will not be saved',
        })}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '16px',
          paddingLeft: 0,
        }}
      >
        <Box sx={{ paddingLeft: 0 }}>
          <IconButton
            onClick={handleBackClick}
            sx={{
              position: 'relative',
              bottom: '2px',
              paddingLeft: 0,
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
          }}
        />
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

export { Years as default }
