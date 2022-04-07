import React, { useState, useEffect, useRef, useContext } from 'react'
import { Box, Button, Stack, Typography, IconButton, Dialog, DialogTitle, DialogActions } from '@mui/material'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../../utils/constants'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useStyles } from '../styles'
import { UserContext, userRegionState } from '../../../../providers/UserContext/UserProvider'
import { useRecoilState } from 'recoil'
import { StateSelect } from './StateSelect'
import { ProgramSelect } from './ProgramSelect'
import { BirthDateCutOffSelect } from './BirthDateCutOffSelect'
import { SpecialEdSelect } from './SpecialEdSelect'
import { StateLogo } from './StateLogo'
import { gql, useMutation } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { ErrorOutline } from '@mui/icons-material'

import { useHistory } from 'react-router-dom'
import { StateLogoFileType } from './StateLogo/StateLogoTypes'
import axios from 'axios'

export const updateStateNameMutation = gql`
  mutation UpdateRegion($updateRegionInput: UpdateRegionInput!) {
    updateRegion(updateRegionInput: $updateRegionInput) {
      id
      name
      program
      state_logo
      special_ed
      birth_date
    }
  }
`

const ProgramSetting: React.FC = () => {
  const classes = useStyles
  const history = useHistory()
  const { me, setMe } = useContext(UserContext)
  const [selectedRegion, setSelectedRegion] = useRecoilState(userRegionState)
  const [stateName, setStateName] = useState<string>(selectedRegion?.regionDetail?.name)
  const [program, setProgram] = useState<string>(selectedRegion?.regionDetail?.program)
  const [specialEd, setSpecialEd] = useState<boolean>(selectedRegion?.regionDetail?.special_ed)
  const [birthDate, setBirthDate] = useState<string>(selectedRegion?.regionDetail?.birth_date)
  const [birthDateInvalid, setBirthDateInvalid] = useState<boolean>(false)
  const [stateLogo, setStateLogo] = useState<string>(selectedRegion?.regionDetail?.state_logo)
  const [open, setOpen] = React.useState<boolean>(false)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [stateLogoFile, setStateLogoFile] = useState<StateLogoFileType>()

  const [submitSave, { data, loading, error }] = useMutation(updateStateNameMutation)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    setStateName(selectedRegion?.regionDetail?.name)
    setProgram(selectedRegion?.regionDetail?.program)
    setSpecialEd(selectedRegion?.regionDetail?.special_ed)
    setBirthDate(selectedRegion?.regionDetail?.birth_date)
    setStateLogo(selectedRegion?.regionDetail?.state_logo)
    setStateLogoFile(null)
    setIsChanged(false)
  }, [selectedRegion])

  const uploadImage = async (file) => {
    const bodyFormData = new FormData()
    if (file) {
      bodyFormData.append('file', file)
      bodyFormData.append('region', 'UT')
      bodyFormData.append('year', '2022')

      // try {
      //   const response = await axios({
      //     method: 'post',
      //     url: import.meta.env.SNOWPACK_PUBLIC_S3_URL,
      //     data: bodyFormData,
      //     headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('JWT')}` },
      //   })
      // } catch (error) {
      //   console.log(error)
      // }

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

  const handleClickSave = async () => {
    let imageLocation: string
    if (stateLogoFile) {
      imageLocation = await uploadImage(stateLogoFile.file)
    }
    let birthDates = birthDate.split('/')
    console.log(birthDates, parseInt(birthDates[0]), "brithDates")
    if (parseInt(birthDates[0]) < 0 || parseInt(birthDates[0]) > 12 ) {
      setBirthDateInvalid(true)
      return
    }
    const submitedResponse = await submitSave({
      variables: {
        updateRegionInput: {
          id: selectedRegion?.region_id,
          name: stateName,
          program: program,
          state_logo: imageLocation ? imageLocation : stateLogo,
          special_ed: specialEd,
          birth_date: birthDate,
        },
      },
    })
    const forSaveUpdatedRegion = {
      region_id: selectedRegion?.region_id,
      regionDetail: submitedResponse.data.updateRegion,
    }
    localStorage.setItem('selectedRegion', JSON.stringify(forSaveUpdatedRegion))
    setSelectedRegion(forSaveUpdatedRegion)
    setIsChanged(false)

    setMe((prevMe) => {
      const updatedRegions = prevMe?.userRegion.map((prevRegion) => {
        return prevRegion.region_id == selectedRegion?.region_id ? forSaveUpdatedRegion : prevRegion
      })
      console.log('updatedRegions ', updatedRegions)
      return {
        ...prevMe,
        userRegion: updatedRegions,
      }
    })
    // window.location.reload()
  }

  const handleBackClick = () => {
    if (isChanged) {
      setOpen(true)
    } else {
      history.push('/site-management/')
    }
  }

  return (
    <Box sx={classes.base}>
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
        <Subtitle size={12} fontWeight='600' color={MTHBLUE}>
          2020 - 2021
        </Subtitle>
        <ExpandMoreIcon fontSize='small' />
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

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          marginX: 'auto',
          paddingY: '10px',
          borderRadius: 10,
          textAlign: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            marginTop: '10px',
          }}
        >
          {'Unsaved Changes'}
        </DialogTitle>
        <ErrorOutline
          sx={{
            fontSize: 50,
            marginBottom: 5,
            marginX: 'auto',
          }}
        />
        <Typography
          fontWeight='bold'
          sx={{
            marginBottom: 5,
            paddingX: 10,
          }}
        >
          {`Are you sure you want to leave without saving changes?`}
        </Typography>
        <DialogActions
          sx={{
            justifyContent: 'space-evenly',
            marginBottom: 2,
          }}
        >
          <Button
            sx={{
              borderRadius: 5,
              bgcolor: '#E7E7E7',
              paddingX: 5,
              '&:hover': { color: 'black' },
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{
              borderRadius: 5,
              paddingX: 5,
              '&:hover': { color: 'black' },
            }}
            onClick={async () => {
              handleClose()
              history.push('/site-management')
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export { ProgramSetting as default }
