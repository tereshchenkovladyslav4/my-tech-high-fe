import React, { useState, useEffect, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Box } from '@mui/material'
import moment from 'moment'
import { Prompt } from 'react-router-dom'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { PageHeader } from '../components/PageHeader'
import {
  removeCountyInfoByRegionId,
  removeFileByFileId,
  removeSchoolDistrictInfoByRegionId,
  updateSchoolYearMutation,
  updateStateNameMutation,
  uploadFile,
  uploadImage,
} from '../services'
import { useStyles } from '../styles'
import { CountyFileType } from './CountySelect/CountySelectTypes'
import { PageContent } from './PageContent'
import { SchoolDistrictFileType } from './SchoolDistrictSelect/SchoolDistrictSelectTypes'
import { SchoolYearSelect } from './SchoolYearSelect'
import { StateLogoFileType } from './StateLogo/StateLogoTypes'
import { FileDeleted, ProgramSettingChanged, SchoolYears } from './types'

const ProgramSetting: React.FC = () => {
  const classes = useStyles
  const { me, setMe } = useContext(UserContext)
  const [stateName, setStateName] = useState<string>('')
  const [newStateName, setNewStateName] = useState<string>('')
  const [program, setProgram] = useState<string>('')
  const [specialEd, setSpecialEd] = useState<boolean>(false)
  const [enroll, setEnroll] = useState<boolean>(false)
  const [specialEdOptions, setSpecialEdOptions] = useState<{ option_value: string }[]>([])
  const [isInvalidStateName, setIsInvalidStateName] = useState<boolean>(false)
  const [birthDate, setBirthDate] = useState<string>('')
  const [stateLogo, setStateLogo] = useState<string>('')
  const [countyArray, setCountyArray] = useState<Array<unknown>>([])
  const [schoolDistrictArray, setSchoolDistrictArray] = useState<Array<unknown>>([])
  const [grades, setGrades] = useState<string>('')
  const [county, setCounty] = useState<CountyFileType | null>(null)
  const [schoolDistrict, setSchoolDistrict] = useState<SchoolDistrictFileType | null>(null)
  const [schoolYears, setSchoolYears] = useState<SchoolYears[]>([])
  const [isChanged, setIsChanged] = useState<ProgramSettingChanged>({
    state: false,
    stateLogo: false,
    program: false,
    counties: false,
    schoolDistricts: false,
    grades: false,
    birth: false,
    specialEd: false,
    enrollment: false,
  })

  const [isDelete, setIsDelete] = useState<FileDeleted>({
    county: false,
    schoolDistrict: false,
  })

  const [stateInvalid, setStateInvalid] = useState<boolean>(false)
  const [selectedYearId, setSelectedYearId] = useState<string>('')
  const [stateLogoFile, setStateLogoFile] = useState<StateLogoFileType | null>(null)
  const [submitSave, {}] = useMutation(updateStateNameMutation)
  const [submitSchoolYearSave, {}] = useMutation(updateSchoolYearMutation)

  const changeStatus = () => {
    const selectedRegion = me?.userRegion?.find((region) => region.region_id === me?.selectedRegionId)

    const currentSetting = schoolYears.find((i) => i.schoolYearId == Number(selectedYearId))

    if (selectedRegion?.regionDetail) {
      if (newStateName && selectedRegion?.regionDetail?.name != newStateName) {
        return true
      }

      if (selectedRegion?.regionDetail?.program != program) {
        return true
      }
    }

    if (isChanged.stateLogo || isChanged.counties || isChanged.schoolDistricts) {
      return true
    }

    if (currentSetting) {
      if (currentSetting?.grades != grades) {
        return true
      }
      if (moment(currentSetting?.birthDateCut).format('MM/DD/YYYY') != moment(birthDate).format('MM/DD/YYYY')) {
        return true
      }
      if (currentSetting.specialEd != specialEd) {
        return true
      }
      if (specialEd) {
        let specialEdOptionsStr = ''
        specialEdOptions.map((i) => {
          if (i.option_value && i.option_value != '') {
            specialEdOptionsStr += i.option_value + ','
          }
        })
        if (currentSetting.specialEdOptions != specialEdOptionsStr.slice(0, -1)) {
          return true
        }
      }
      if (currentSetting.enrollmentPacket != enroll) {
        return true
      }
    }

    return false
  }

  const handleClickSave = async () => {
    if (isInvalidStateName) {
      setStateInvalid(true)
      return
    }
    let imageLocation = ''
    if (stateLogoFile) {
      imageLocation = await uploadImage(stateLogoFile?.file, stateName)
    }

    let countyFileLocation = ''
    if (county?.file && countyArray.length > 0) {
      countyFileLocation = await uploadFile(county?.file, 'county', stateName)
    }

    if (isDelete.county) {
      handleCountyInfoDelete()
    }

    if (isDelete.schoolDistrict) {
      handleSchoolDistrictInfoDelete()
    }

    let schoolDistrictFileLocation = ''
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

    if (county)
      setCounty({
        ...county,
        path: countyFileLocation ? countyFileLocation : county?.path,
      })

    if (schoolDistrict)
      setSchoolDistrict({
        ...schoolDistrict,
        path: schoolDistrictFileLocation ? schoolDistrictFileLocation : schoolDistrict?.path,
      })

    if (selectedYearId && (grades || birthDate || specialEd)) {
      let special_ed_options = ''
      specialEdOptions.map((option) => {
        if (option.option_value != '') special_ed_options += option.option_value + ','
      })
      special_ed_options = special_ed_options.slice(0, -1)

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
    setIsChanged({
      state: false,
      stateLogo: false,
      program: false,
      counties: false,
      schoolDistricts: false,
      grades: false,
      birth: false,
      specialEd: false,
      enrollment: false,
    })

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
    setIsChanged({
      state: false,
      stateLogo: false,
      program: false,
      counties: false,
      schoolDistricts: false,
      grades: false,
      birth: false,
      specialEd: false,
      enrollment: false,
    })
  }, [me?.selectedRegionId])

  // county delete
  const [countyInfoDelete, {}] = useMutation(removeCountyInfoByRegionId)
  const [fileDelete, {}] = useMutation(removeFileByFileId)

  const handleCountyInfoDelete = async () => {
    const deleteResponse = await countyInfoDelete({
      variables: {
        regionId: me?.selectedRegionId,
      },
    })

    if (deleteResponse?.data?.removeCountyInfoByRegionId) {
      await fileDelete({
        variables: {
          fileId: deleteResponse?.data?.removeCountyInfoByRegionId,
        },
      })
    }
  }

  const [schoolDistrictInfoDelete, {}] = useMutation(removeSchoolDistrictInfoByRegionId)

  const handleSchoolDistrictInfoDelete = async () => {
    const deleteResponse = await schoolDistrictInfoDelete({
      variables: {
        regionId: me?.selectedRegionId,
      },
    })

    if (deleteResponse?.data?.removeSchoolDistrictInfoByRegionId) {
      await fileDelete({
        variables: {
          fileId: deleteResponse?.data?.removeSchoolDistrictInfoByRegionId,
        },
      })
    }
  }

  return (
    <Box sx={classes.base}>
      <input type='hidden' value={changeStatus() ? '1' : '0'} className='program-set' />
      <Prompt
        when={changeStatus() ? true : false}
        message={JSON.stringify({
          header: 'Unsaved Changes',
          content: 'Are you sure you want to leave without saving changes?',
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
        schoolYears={schoolYears}
        setSchoolYears={setSchoolYears}
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
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        setIsDelete={setIsDelete}
        isDelete={isDelete}
      />
    </Box>
  )
}

export { ProgramSetting as default }
