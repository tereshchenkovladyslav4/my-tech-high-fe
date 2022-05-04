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
import { CountySelect } from './CountySelect'
import { SchoolDistrictSelect } from './SchoolDistrictSelect'
import { gql, useMutation, useQuery } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Prompt, useHistory } from 'react-router-dom'
import { StateLogoFileType } from './StateLogo/StateLogoTypes'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../components/DropDown/types'
import { CountyFileType } from './CountySelect/CountySelectTypes'
import { SchoolDistrictFileType } from './SchoolDistrictSelect/SchoolDistrictSelectTypes'
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
      county_file_name
      county_file_path
      school_district_file_name
      school_district_file_path
    }
  }
`

export const removeCountyInfoByRegionId = gql`
  mutation RemoveCountyInfoByRegionId($regionId: ID!) {
    removeCountyInfoByRegionId(region_id: $regionId)
  }
`

export const removeFileByFileId = gql`
  mutation DeletePacketDocumentFile($fileId: String!) {
    deletePacketDocumentFile(fileId: $fileId) {
      error
      message
      results
    }
  }
`

export const removeSchoolDistrictInfoByRegionId = gql`
  mutation RemoveSchoolDistrictInfoByRegionId($regionId: ID!) {
    removeSchoolDistrictInfoByRegionId(region_id: $regionId)
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
  const [stateLogo, setStateLogo] = useState<string>()
  const [countyArray, setCountyArray] = useState<Array<any>>([])
  const [schoolDistrictArray, setSchoolDistrictArray] = useState<Array<any>>([])
  const [grades, setGrades] = useState<string>()
  const [county, setCounty] = useState<CountyFileType>({
    name: '',
    path: '',
    file: null,
  })
  const [schoolDistrict, setSchoolDistrict] = useState<SchoolDistrictFileType>({
    name: '',
    path: '',
    file: null,
  })
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [schoolYears, setSchoolYears] = useState<SchoolYears[]>([])
  const [years, setYears] = useState<DropDownItem[]>([])
  const [selectedYearId, setSelectedYearId] = useState<string>('')
  const [stateLogoFile, setStateLogoFile] = useState<StateLogoFileType>()
  const [submitSave, { data, loading, error }] = useMutation(updateStateNameMutation)
  const [submitSchoolYearSave, {}] = useMutation(updateSchoolYearMutation)
  const [countyInfoDelete, {}] = useMutation(removeCountyInfoByRegionId)
  const [fileDelete, {}] = useMutation(removeFileByFileId)
  const [schoolDistrictInfoDelete, {}] = useMutation(removeSchoolDistrictInfoByRegionId)
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const getRegionById = (id: number) => {
    return me.userRegion.find((region) => region.region_id === id)
  }

  const handleSelectYear = (val) => {
    setSelectedYearId(val)
    if (schoolYears && schoolYears.length > 0) {
      schoolYears.forEach((schoolYear) => {
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
      bodyFormData.append('region', stateName)
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

  const uploadFile = async (file, type) => {
    const bodyFormData = new FormData()
    if (file) {
      bodyFormData.append('file', file)
      bodyFormData.append('region', stateName)
      bodyFormData.append('directory', type)

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
    let dropYears: DropDownItem[] = []
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach((schoolYear) => {
        if (
          parseInt(moment(schoolYear.schoolYearOpen).format('YYYY')) >= parseInt(moment().format('YYYY')) &&
          parseInt(moment(schoolYear.schoolYearClose).format('YYYY')) <= parseInt(moment().format('YYYY')) + 1 &&
          selectedYearId == ''
        ) {
          setSelectedYearId(schoolYear.schoolYearId)
          setSpecialEd(schoolYear.specialEd)
          setBirthDate(schoolYear.birthDateCut)
          setGrades(schoolYear.grades)
        }
        dropYears.push({
          value: schoolYear.schoolYearId + '',
          label:
            moment(schoolYear.schoolYearOpen).format('YYYY') + '-' + moment(schoolYear.schoolYearClose).format('YYYY'),
        })
      })
    }
    setYears(dropYears)
  }

  const handleCountyInfoDelete = async () => {
    const deleteResponse = await countyInfoDelete({
      variables: {
        regionId: me?.selectedRegionId,
      },
    })
    setCounty({
      name: '',
      path: '',
      file: null,
    })

    if (deleteResponse?.data?.removeCountyInfoByRegionId) {
      await fileDelete({
        variables: {
          fileId: deleteResponse?.data?.removeCountyInfoByRegionId
        }
      })
    }
  }

  const handleSchoolDistrictInfoDelete = async () => {
    const deleteResponse = await schoolDistrictInfoDelete({
      variables: {
        regionId: me?.selectedRegionId,
      },
    })
    setSchoolDistrict({
      name: '',
      path: '',
      file: null,
    })
    
    if (deleteResponse?.data?.removeSchoolDistrictInfoByRegionId) {
      await fileDelete({
        variables: {
          fileId: deleteResponse?.data?.removeSchoolDistrictInfoByRegionId
        }
      })
    }
  }

  const handleClickSave = async () => {
    let imageLocation: string
    if (stateLogoFile) {
      imageLocation = await uploadImage(stateLogoFile.file)
    }

    let countyFileLocation: string
    if (county?.file && countyArray.length > 0) {
      countyFileLocation = await uploadFile(county.file, 'county')
    } else if (county?.file && countyArray.length == 0) {
      console.log('CountyFile Parsing Error')
    }

    let schoolDistrictFileLocation: string
    if (schoolDistrict?.file && schoolDistrictArray.length > 0) {
      schoolDistrictFileLocation = await uploadFile(schoolDistrict.file, 'schoolDistrict')
    } else if (schoolDistrict?.file && schoolDistrictArray.length == 0) {
      console.log('SchoolDistrictFile Parsing Error')
    }

    const submitedResponse = await submitSave({
      variables: {
        updateRegionInput: {
          id: me.selectedRegionId,
          name: stateName,
          program: program,
          state_logo: imageLocation ? imageLocation : stateLogo,
          county_file_name: county.name,
          county_file_path: countyFileLocation ? countyFileLocation : county.path,
          county_array: JSON.stringify(countyArray),
          school_district_file_name: schoolDistrict.name,
          school_district_file_path: schoolDistrictFileLocation ? schoolDistrictFileLocation : schoolDistrict.path,
          school_district_array: JSON.stringify(schoolDistrictArray),
        },
      },
    })

    setCounty((prev) => {
      return {
        ...prev,
        path: countyFileLocation ? countyFileLocation : county.path,
      }
    })

    setSchoolDistrict((prev) => {
      return {
        ...prev,
        path: schoolDistrictFileLocation ? schoolDistrictFileLocation : schoolDistrict.path,
      }
    })

    if (selectedYearId && (grades || birthDate || specialEd)) {
      const submitSchoolYearResponse = await submitSchoolYearSave({
        variables: {
          updateSchoolYearInput: {
            school_year_id: parseInt(selectedYearId),
            grades: grades,
            birth_date_cut: birthDate,
            special_ed: specialEd,
          },
        },
      })
    }

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
      header: 'Unsaved Changes',
      content: 'Are you sure you want to leave without saving changes?',
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
    if (schoolYearData && schoolYearData?.data?.region) {
      let countyInfo: CountyFileType = {
        name: schoolYearData?.data?.region.county_file_name,
        path: schoolYearData?.data?.region.county_file_path,
        file: null,
      }
      let schoolDistrictInfo: SchoolDistrictFileType = {
        name: schoolYearData?.data?.region.school_district_file_name,
        path: schoolYearData?.data?.region.school_district_file_path,
        file: null,
      }
      setCounty(countyInfo)
      setSchoolDistrict(schoolDistrictInfo)
      let schoolYearsArr: SchoolYears[] = []
      let cnt = 0
      schoolYearData?.data?.region?.SchoolYears.forEach((schoolYear) => {
        if (selectedYearId == schoolYear.school_year_id) {
          setSpecialEd(schoolYear.special_ed)
          setBirthDate(schoolYear.birth_date_cut)
          setGrades(schoolYear.grades)
          cnt++
        }
        schoolYearsArr.push({
          schoolYearId: schoolYear.school_year_id,
          schoolYearOpen: schoolYear.date_begin,
          schoolYearClose: schoolYear.date_end,
          grades: schoolYear.grades,
          birthDateCut: schoolYear.birth_date_cut,
          specialEd: schoolYear.special_ed,
        })
      })
      if (cnt == 0) {
        setSelectedYearId('')
        setSpecialEd(false)
        setBirthDate(null)
        setGrades(null)
      }
      setSchoolYears(
        schoolYearsArr.sort((a, b) => {
          if (new Date(a.schoolYearOpen) > new Date(b.schoolYearOpen)) return 1
          else if (new Date(a.schoolYearOpen) == new Date(b.schoolYearOpen)) return 0
          else return -1
        }),
      )
    }
  }, [me.selectedRegionId, schoolYearData?.data?.region])

  useEffect(() => {
    setDropYears(schoolYears)
  }, [schoolYears])

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
          }}
        />
      </Stack>
      <StateSelect stateName={stateName} setStateName={setStateName} setIsChanged={setIsChanged} />
      <StateLogo
        stateLogo={stateLogo}
        setStateLogo={setStateLogo}
        setIsChanged={setIsChanged}
        stateLogoFile={stateLogoFile}
        setStateLogoFile={setStateLogoFile}
      />
      <ProgramSelect program={program} setProgram={setProgram} setIsChanged={setIsChanged} />
      <CountySelect
        county={county}
        setCounty={setCounty}
        setCountyArray={setCountyArray}
        handleCountyInfoDelete={handleCountyInfoDelete}
        setIsChanged={setIsChanged}
      />
      <SchoolDistrictSelect
        schoolDistrict={schoolDistrict}
        setSchoolDistrict={setSchoolDistrict}
        setSchoolDistrictArray={setSchoolDistrictArray}
        handleSchoolDistrictInfoDelete={handleSchoolDistrictInfoDelete}
        setIsChanged={setIsChanged}
      />
      <GradesSelect grades={grades} setGrades={setGrades} setIsChanged={setIsChanged} />
      <BirthDateCutOffSelect birthDate={birthDate} setBirthDate={setBirthDate} setIsChanged={setIsChanged} />
      <SpecialEdSelect specialEd={specialEd} setSpecialEd={setSpecialEd} setIsChanged={setIsChanged} />
    </Box>
  )
}

export { ProgramSetting as default }
