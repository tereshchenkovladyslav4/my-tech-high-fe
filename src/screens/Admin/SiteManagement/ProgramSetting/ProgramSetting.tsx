import React, { useState, useEffect, useContext } from 'react'
import { Box, Button, Stack, Typography, IconButton } from '@mui/material'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { useStyles } from '../styles'
import { StateSelect } from './StateSelect'
import { ProgramSelect } from './ProgramSelect'
import { BirthDateCutOffSelect } from './BirthDateCutOffSelect'
import { SpecialEdSelect } from './SpecialEdSelect'
import { StateLogo } from './StateLogo'
import { GradesSelect } from './GradesSelect'
import { gql, useMutation, useQuery } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Prompt, useHistory } from 'react-router-dom'
import { StateLogoFileType } from './StateLogo/StateLogoTypes'
import { DropDown } from '../../../../components/DropDown/DropDown'
import moment from 'moment'

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

export const updateStateNameMutation = gql`
  mutation UpdateRegion($updateRegionInput: UpdateRegionInput!) {
    updateRegion(updateRegionInput: $updateRegionInput) {
      id
      name
      program
      state_logo
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
        grades
        birth_date_cut
        special_ed
      }
    }
  }
`

type SchoolYears = {
  schoolYearId: number
  schoolYearOpen: string
  schoolYearClose: string
  grades: string
  birthDateCut: string
  specialEd: boolean
}

const ProgramSetting: React.FC = () => {
  const classes = useStyles
  const history = useHistory()
  const { me, setMe } = useContext(UserContext)
  const [stateName, setStateName] = useState<string>()
  const [program, setProgram] = useState<string>()
  const [specialEd, setSpecialEd] = useState<boolean>()
  const [birthDate, setBirthDate] = useState<string>('')
  const [birthDateInvalid, setBirthDateInvalid] = useState<boolean>(false)
  const [stateLogo, setStateLogo] = useState<string>()
  const [grades, setGrades] = useState<string>()
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [schoolYears, setSchoolYears] = useState<SchoolYears[]>([])
  const [years, setYears] = useState()
  const [selectedYearId, setSelectedYearId] = useState<string>('')
  const [stateLogoFile, setStateLogoFile] = useState<StateLogoFileType>()
  const [submitSave, { data, loading, error }] = useMutation(updateStateNameMutation)
  const [submitSchoolYearSave, {}] = useMutation(updateSchoolYearMutation)
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId
    },
    fetchPolicy: 'network-only',
  })

  const getRegionById = (id: number) => {
    return me.userRegion.find((region) => region.region_id === id)
  }

  const handleSelectYear = (val) => {
    setSelectedYearId(val)
    if (schoolYears && schoolYears.length > 0) {
      schoolYears.forEach(schoolYear => {
        if (val == schoolYear.schoolYearId) {
          setSpecialEd(schoolYear.specialEd)
          setBirthDate(schoolYear.birthDateCut)
          setGrades(schoolYear.grades)
        }
      })
    }
  }

  const uploadImage = async (file) => {
    const bodyFormData = new FormData()
    if (file) {
      bodyFormData.append('file', file)
      bodyFormData.append('region', 'UT')
      bodyFormData.append('year', '2022')

      const response = await fetch(import.meta.env.SNOWPACK_PUBLIC_S3_URL, {
        method: 'POST',
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`,
        },
      })
      const {
        data: { s3 },
      } = await response.json()
      return s3.Location
    }
  }

  const setDropYears = (schoolYearsArr) => {
    let dropYears = []
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach(schoolYear => {
        dropYears.push({
          value: schoolYear.schoolYearId + '',
          label: moment(schoolYear.schoolYearOpen).format('YYYY') + '-' + moment(schoolYear.schoolYearClose).format('YYYY')
        })
      })
    } 
    setYears(dropYears)
  }

  const handleClickSave = async () => {
    let imageLocation: string
    if (stateLogoFile) {
      imageLocation = await uploadImage(stateLogoFile.file)
    }
    let tempArr = birthDate?.split('/')
    if (tempArr && (tempArr[0].indexOf('m') >= 0 || tempArr[1].indexOf('d') >= 0 || tempArr[2].indexOf('y') >= 0)) {
      setBirthDateInvalid(true)
      return
    }
    const submitedResponse = await submitSave({
      variables: {
        updateRegionInput: {
          id: me.selectedRegionId,
          name: stateName,
          program: program,
          state_logo: imageLocation ? imageLocation : stateLogo,
        },
      },
    })

    const submitSchoolYearResponse = await submitSchoolYearSave({
      variables: {
        updateSchoolYearInput: {
          school_year_id: parseInt(selectedYearId),
          grades: grades,
          birth_date_cut: birthDate,
          special_ed: specialEd
        }
      },
    })
    const forSaveUpdatedRegion = {
      region_id: me.selectedRegionId,
      regionDetail: submitedResponse.data.updateRegion,
    }
    setIsChanged(false)

    setMe((prevMe) => {
      const updatedRegions = prevMe?.userRegion.map((prevRegion) => {
        return prevRegion.region_id == me.selectedRegionId ? forSaveUpdatedRegion : prevRegion
      })
      
      return {
        ...prevMe,
        userRegion: updatedRegions,
      }
    })
  }

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

  useEffect(() => {
    const selectedRegion = getRegionById(me.selectedRegionId)
    setStateName(selectedRegion?.regionDetail?.name)
    setProgram(selectedRegion?.regionDetail?.program)
    setStateLogo(selectedRegion?.regionDetail?.state_logo)
    setStateLogoFile(null)

    if (schoolYearData && schoolYearData?.data?.region?.SchoolYears) {
      let schoolYearsArr: SchoolYears[] = [];
      schoolYearData?.data?.region?.SchoolYears.forEach(schoolYear => {
        schoolYearsArr.push({
          schoolYearId: schoolYear.school_year_id,
          schoolYearOpen: schoolYear.date_begin,
          schoolYearClose: schoolYear.date_end,
          grades: schoolYear.grades,
          birthDateCut: schoolYear.birth_date_cut,
          specialEd: schoolYear.special_ed
        })
      })

      setSchoolYears(schoolYearsArr.sort((a, b) => {
        if (new Date(a.schoolYearOpen) > new Date(b.schoolYearOpen))
          return 1
        else if (new Date(a.schoolYearOpen) == new Date(b.schoolYearOpen))
          return 0
        else
          return -1
      }))
    }

  }, [me.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    setDropYears(schoolYears)
  }, [schoolYears])

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
        }}
      >
        <Box>
          <IconButton
            onClick={handleBackClick}
            sx={{
              position: 'relative',
              bottom: '2px',
            }}
          >
            <ArrowBackIosRoundedIcon
              sx={{
                fontSize: '15px',
                stroke: 'black',
                strokeWidth: 2,
              }}
            />
          </IconButton>
          <Typography paddingLeft='7px' fontSize='20px' fontWeight='700' component='span'>
            Program Settings
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
      <StateSelect
        stateName={stateName}
        setStateName={setStateName}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
      />
      <StateLogo
        stateLogo={stateLogo}
        setStateLogo={setStateLogo}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        stateLogoFile={stateLogoFile}
        setStateLogoFile={setStateLogoFile}
      />
      <ProgramSelect program={program} setProgram={setProgram} isChanged={isChanged} setIsChanged={setIsChanged} />
      <GradesSelect grades={grades} setGrades={setGrades} isChanged={isChanged} setIsChanged={setIsChanged} />
      <BirthDateCutOffSelect
        birthDate={birthDate}
        invalid={birthDateInvalid}
        setBirthDate={setBirthDate}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
      />
      <SpecialEdSelect 
        specialEd={specialEd} 
        setSpecialEd={setSpecialEd} 
        isChanged={isChanged} 
        setIsChanged={setIsChanged} 
      />
    </Box>
  )
}

export { ProgramSetting as default }
