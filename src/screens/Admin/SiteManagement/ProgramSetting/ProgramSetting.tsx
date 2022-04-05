import React, { useState, useEffect, useRef } from 'react'
import { Box, Button, Stack, Typography, IconButton, Dialog, DialogTitle, DialogActions } from '@mui/material'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../../utils/constants'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useStyles } from '../styles'
import { userRegionState } from '../../../../providers/UserContext/UserProvider'
import { useRecoilState } from 'recoil'
import { StateSelect } from './StateSelect'
import { ProgramSelect } from './ProgramSelect'
import { gql, useMutation } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { ErrorOutline } from '@mui/icons-material'

import { useHistory } from 'react-router-dom'

export const updateStateNameMutation = gql`
  mutation UpdateRegion($updateRegionInput: UpdateRegionInput!) {
    updateRegion(updateRegionInput: $updateRegionInput) {
      id
      name
      program
    }
  }
`

const ProgramSetting: React.FC = () => {
  const classes = useStyles
  const history = useHistory()
  const [selectedRegion, setSelectedRegion] = useRecoilState(userRegionState)
  const [stateName, setStateName] = useState<string>(selectedRegion?.regionDetail?.name)
  const [program, setProgram] = useState<string>(selectedRegion?.regionDetail?.program)
  const [open, setOpen] = React.useState<boolean>(false)
  const [isChanged, setIsChanged] = useState<boolean>(false)

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
    setIsChanged(false)
  }, [selectedRegion])

  const handleClickSave = async () => {
    await submitSave({
      variables: {
        updateRegionInput: {
          id: selectedRegion?.region_id,
          name: stateName,
          program: program,
        },
      },
    })
    setIsChanged(false)
    window.location.reload()
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
      <ProgramSelect program={program} setProgram={setProgram} isChanged={isChanged} setIsChanged={setIsChanged} />
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
