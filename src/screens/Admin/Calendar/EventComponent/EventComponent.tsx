import { Box, Button, Stack } from '@mui/material'
import React from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { CALENDAR, MTHGREEN, SYSTEM_02, SYSTEM_05, SYSTEM_06 } from '../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { useStyles } from '../MainComponent/styles'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

type EventComponentProps = {}

const EventComponent = ({}: EventComponentProps) => {
  const classes = useStyles
  const history = useHistory()
  const handleRSVPClick = () => {
    history.push(`${CALENDAR}/rsvp`)
  }
  return (
    <Stack>
      <Box>
        <Button sx={classes.clubButton}>
          <Subtitle color={MTHGREEN} size={12} fontWeight='500'>
            Club
          </Subtitle>
        </Button>
        <Button sx={{ mt: 1.5, width: 40 }}>
          <ModeEditIcon />
        </Button>
        <Button sx={{ mt: 1.5, width: 40 }}>
          <DeleteForeverOutlinedIcon />
        </Button>
      </Box>
      <Subtitle size='medium' fontWeight='500' sx={{ my: 1.5 }} color={SYSTEM_02}>
        Highlighting our new MTH Game Maker course!
      </Subtitle>
      <Subtitle size={12} fontWeight='bold' color={SYSTEM_06} sx={{ display: 'inline-block' }}>
        2:00 PM, September 12
      </Subtitle>
      <Subtitle size={12} fontWeight='bold' color={SYSTEM_06} sx={{ marginTop: 1 }}>
        K-8
      </Subtitle>
      <Subtitle size={12} fontWeight='500' color={SYSTEM_05} sx={{ mt: 2 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim venian, quis nostrud exercitation ullamco
      </Subtitle>
      <Box sx={classes.arrowButtonGroup}>
        <Button sx={classes.saveBtn} onClick={() => handleRSVPClick()}>
          RSVP
        </Button>
        <Button
          disableElevation
          variant='contained'
          sx={classes.arrowButton}
          startIcon={<ArrowBackIosNewIcon />}
        ></Button>
        <Button
          disableElevation
          variant='contained'
          sx={classes.arrowButton}
          startIcon={<ArrowForwardIosIcon />}
        ></Button>
      </Box>
    </Stack>
  )
}

export default EventComponent
