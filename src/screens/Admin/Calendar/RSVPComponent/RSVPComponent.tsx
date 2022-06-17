import React from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { DropDown } from '../../SiteManagement/components/DropDown/DropDown'
import { useStyles } from './styles'
import MenuIcon from '@mui/icons-material/Menu'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'

type RSVPComponentProps = {
  setShowRSVPForm: (value: boolean) => void
}

const RSVPComponent = ({ setShowRSVPForm }: RSVPComponentProps) => {
  const classes = useStyles
  return (
    <>
      <Box sx={classes.pageTop}>
        <Box sx={classes.pageTitle}>
          <Subtitle size='medium' fontWeight='700'>
            RSVP Form
          </Subtitle>
        </Box>
        <Box sx={classes.pageTopRight}>
          <Button sx={classes.cancelBtn} onClick={() => setShowRSVPForm(false)}>
            Cancel
          </Button>
          <Button sx={classes.saveBtn} onClick={() => setShowRSVPForm(false)}>
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
                  onChange={(e) => {}}
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
                    onChange={(e) => {}}
                    size='small'
                    sx={{ my: 1, width: '65%', marginRight: 'auto', marginLeft: 'auto' }}
                  />
                  <Box sx={{ position: 'absolute', right: -20, top: 16 }}>
                    <Box sx={classes.action}>
                      <ModeEditIcon sx={classes.iconCursor} fontSize='medium' />
                      <DeleteForeverOutlinedIcon sx={classes.iconCursor} fontSize='medium' />
                      <MenuIcon sx={classes.iconCursor} fontSize='medium' />
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
