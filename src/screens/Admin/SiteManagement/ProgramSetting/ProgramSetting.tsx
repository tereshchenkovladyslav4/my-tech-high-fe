import React, { useState, useEffect, useContext } from 'react'
import { Box } from '@mui/material'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { useStyles } from '../styles'
import { useMutation } from '@apollo/client'
import { Prompt } from 'react-router-dom'
import { StateLogoFileType } from './StateLogo/StateLogoTypes'
import { CountyFileType } from './CountySelect/CountySelectTypes'
import { SchoolDistrictFileType } from './SchoolDistrictSelect/SchoolDistrictSelectTypes'
import { PageHeader } from '../components/PageHeader'
import { PageContent } from './PageContent'
import { SchoolYearSelect } from './SchoolYearSelect'
import { updateSchoolYearMutation, updateStateNameMutation, uploadFile, uploadImage } from '../services'

const ProgramSetting: React.FC = () => {
  const classes = useStyles
  const { me, setMe } = useContext(UserContext)
  const [stateName, setStateName] = useState<string>('')
  const [newStateName, setNewStateName] = useState<string>('')
  const [program, setProgram] = useState<string>('')
  const [specialEd, setSpecialEd] = useState<boolean>(false)
  const [enroll, setEnroll] = useState<boolean>(false)
  const [specialEdOptions, setSpecialEdOptions] = useState([]);
  const [isInvalidStateName, setIsInvalidStateName] = useState<boolean>(false)
  const [birthDate, setBirthDate] = useState<string>('')
  const [stateLogo, setStateLogo] = useState<string>('')
  const [countyArray, setCountyArray] = useState<Array<any>>([])
  const [schoolDistrictArray, setSchoolDistrictArray] = useState<Array<any>>([])
  const [grades, setGrades] = useState<string>('')
  const [county, setCounty] = useState<CountyFileType | null>(null)
  const [schoolDistrict, setSchoolDistrict] = useState<SchoolDistrictFileType | null>(null)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [stateInvalid, setStateInvalid] = useState<boolean>(false)
  const [selectedYearId, setSelectedYearId] = useState<string>('')
  const [stateLogoFile, setStateLogoFile] = useState<StateLogoFileType | null>(null)
  const [submitSave, {}] = useMutation(updateStateNameMutation)
  const [submitSchoolYearSave, {}] = useMutation(updateSchoolYearMutation)

  const handleClickSave = async () => {
    if (isInvalidStateName) {
      setStateInvalid(true)
      return
    }
    let imageLocation: string = ''
    if (stateLogoFile) {
      imageLocation = await uploadImage(stateLogoFile.file, stateName)
    }

    let countyFileLocation: string = ''
    if (county?.file && countyArray.length > 0) {
      countyFileLocation = await uploadFile(county.file, 'county', stateName)
    }

    let schoolDistrictFileLocation: string = ''
    if (schoolDistrict?.file && schoolDistrictArray.length > 0) {
      schoolDistrictFileLocation = await uploadFile(schoolDistrict.file, 'schoolDistrict', stateName)
    }

    const submitedResponse = await submitSave({
      variables: {
        updateRegionInput: {
          id: me?.selectedRegionId,
          name: newStateName ? newStateName : stateName,
          program: program,
          state_logo: imageLocation ? imageLocation : stateLogo,
          county_file_name: county?.name,
          county_file_path: countyFileLocation ? countyFileLocation : county?.path,
          county_array: JSON.stringify(countyArray),
          school_district_file_name: schoolDistrict?.name,
          school_district_file_path: schoolDistrictFileLocation ? schoolDistrictFileLocation : schoolDistrict?.path,
          school_district_array: JSON.stringify(schoolDistrictArray),
        },
      },
    })

    setCounty((prev) => {
      return {
        ...prev,
        path: countyFileLocation ? countyFileLocation : county?.path,
      }
    })

    if (schoolDistrict)
      setSchoolDistrict({
        ...schoolDistrict,
        path: schoolDistrictFileLocation ? schoolDistrictFileLocation : schoolDistrict?.path,
      })

    if (selectedYearId && (grades || birthDate || specialEd)) {
      var special_ed_options = '';
      specialEdOptions.map((option) => {
        if (option.option_value != '')
        special_ed_options += option.option_value + ','
      });
      special_ed_options = special_ed_options.slice(0, -1);
      
      await submitSchoolYearSave({
        variables: {
          updateSchoolYearInput: {
            school_year_id: parseInt(selectedYearId),
            grades: grades,
            birth_date_cut: birthDate,
            special_ed: specialEd,
            special_ed_options: special_ed_options,
            enrollment_packet: enroll,
          },
        },
      })
    }

    const forSaveUpdatedRegion = {
      region_id: me?.selectedRegionId,
      regionDetail: submitedResponse.data.updateRegion,
    }
    setIsChanged(false)

    setMe((prevMe) => {
      const updatedRegions = prevMe?.userRegion
        ?.map((prevRegion) => {
          return prevRegion.region_id == me?.selectedRegionId ? forSaveUpdatedRegion : prevRegion
        })
        .sort(function (a, b) {
          if (a.regionDetail.name < b.regionDetail.name) {
            return -1
          }
          if (a.regionDetail.name > b.regionDetail.name) {
            return 1
          }
          return 0
        })

      return {
        ...prevMe,
        userRegion: updatedRegions,
      }
    })
  }

  useEffect(() => {
    const selectedRegion = me?.userRegion?.find((region) => region.region_id === me?.selectedRegionId)
    setStateName(selectedRegion?.regionDetail?.name || '')
    setProgram(selectedRegion?.regionDetail?.program || '')
    setStateLogo(selectedRegion?.regionDetail?.state_logo || '')
    setStateLogoFile(null)
  }, [me?.selectedRegionId])

  return (
    <Box sx={classes.base}>
      <Prompt
        when={isChanged ? true : false}
        message={JSON.stringify({
          header: 'Unsaved Work',
          content: 'Changes you made will not be saved',
        })}
      />
      <PageHeader title='Program Settings' handleClickSave={handleClickSave} />
      <SchoolYearSelect
        setSelectedYearId={setSelectedYearId}
        setSpecialEd={setSpecialEd}
        setSpecialEdOptions={setSpecialEdOptions}
        setEnroll={setEnroll}
        setBirthDate={setBirthDate}
        setGrades={setGrades}
        selectedYearId={selectedYearId}
        setCounty={setCounty}
        setSchoolDistrict={setSchoolDistrict}
      />
      <PageContent
        stateSelectItem={{
          stateName,
          setIsInvalidStateName,
          stateInvalid,
          setStateInvalid,
          newStateName,
          setNewStateName,
        }}
        stateLogoItem={{ stateLogo, setStateLogo, stateLogoFile, setStateLogoFile }}
        programItem={{ program, setProgram }}
        countyItem={{ county, setCounty, setCountyArray }}
        schoolDistrictItem={{ schoolDistrict, setSchoolDistrict, setSchoolDistrictArray }}
        gradesItem={{ grades, setGrades }}
        birthDayCutItem={{ birthDate, setBirthDate }}
        specialEdItem={{ specialEd, setSpecialEd, specialEdOptions, setSpecialEdOptions }}
        enrollItem={{ enroll, setEnroll }}
        setIsChanged={setIsChanged}
      />
    </Box>
  )
}

export { ProgramSetting as default }
