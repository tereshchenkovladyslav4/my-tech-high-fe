import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { Box, Button, Grid, IconButton, TextField } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { addEventClassess } from '../AddEvent/styles'
import { rsvpClassess } from './styles'

type RSVPComponentProps = {
  setShowRSVPForm: (value: boolean) => void
}

const RSVPComponent: React.FC<RSVPComponentProps> = ({ setShowRSVPForm }) => {
  return (
    <>
      <Box sx={rsvpClassess.pageTop}>
        <Box sx={rsvpClassess.pageTitle}>
          <IconButton
            onClick={() => setShowRSVPForm(false)}
            sx={{
              position: 'relative',
            }}
          >
            <ArrowBackIosRoundedIcon sx={addEventClassess.arrowButton} />
          </IconButton>
          <Subtitle size='medium' fontWeight='700'>
            RSVP Form
          </Subtitle>
        </Box>
        <Box sx={rsvpClassess.pageTopRight}>
          <Button sx={rsvpClassess.cancelBtn} onClick={() => setShowRSVPForm(false)}>
            Cancel
          </Button>
          <Button sx={rsvpClassess.saveBtn} onClick={() => setShowRSVPForm(false)}>
            Save
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
          <Grid item container xs={12}>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                }}
              >
                <DropDown
                  dropDownItems={[]}
                  placeholder='Use Previous?'
                  labelTop
                  setParentValue={() => {}}
                  size='small'
                  sx={{ my: 1, width: '50%', marginRight: 'auto', marginLeft: 'auto' }}
                />
                <TextField
                  name='title'
                  label='Event Name'
                  placeholder='Entry'
                  fullWidth
                  value={''}
                  onChange={() => {}}
                  size='small'
                  sx={{ my: 1, width: '65%', marginRight: 'auto', marginLeft: 'auto' }}
                />
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    name='title'
                    label='Text Field'
                    placeholder='Entry'
                    fullWidth
                    value={''}
                    onChange={() => {}}
                    size='small'
                    sx={{ my: 1, width: '65%', marginRight: 'auto', marginLeft: 'auto' }}
                  />
                  <Box sx={{ position: 'absolute', right: -20, top: 16 }}>
                    <Box sx={rsvpClassess.action}>
                      <ModeEditIcon sx={rsvpClassess.iconCursor} fontSize='medium' />
                      <DeleteForeverOutlinedIcon sx={rsvpClassess.iconCursor} fontSize='medium' />
                      <MenuIcon sx={rsvpClassess.iconCursor} fontSize='medium' />
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant={'outlined'}
                  sx={{
                    color: '#000',
                    borderRadius: 1,
                    textTransform: 'none',
                    height: 37,
                    whiteSpace: 'nowrap',
                    my: 1,
                    width: '65%',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                  }}
                  onClick={() => {}}
                >
                  Add Response Field
                </Button>
              </Box>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RSVPComponent
