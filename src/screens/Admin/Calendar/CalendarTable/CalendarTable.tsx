import { Box, Button, Card, Grid, InputAdornment, OutlinedInput } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import React, { useEffect, useState, useContext } from 'react'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import SearchIcon from '@mui/icons-material/Search'
import { useStyles } from './styles'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { MTHGREEN, SYSTEM_06, SYSTEM_05, SYSTEM_02, CALENDAR } from '../../../../utils/constants'
import { CalendarComponent } from '../CalendarComponent'
import { useHistory } from 'react-router-dom'

const CalendarTable = () => {
  const classes = useStyles
  const history = useHistory()
  const [searchField, setSearchField] = useState<string>()

  return (
    <Card sx={classes.cardBody}>
      <Box sx={classes.pageTop}>
        <Box sx={classes.pageTitle}>
          <Subtitle size='medium' fontWeight='700'>
            Calendar
          </Subtitle>
        </Box>
        <Box sx={classes.pageTopRight}>
          <Button
            disableElevation
            variant='contained'
            sx={classes.editButton}
            startIcon={<ModeEditIcon />}
            onClick={() => history.push(`${CALENDAR}/editType`)}
          >
            <Subtitle sx={{ whiteSpace: 'nowrap' }}>Edit Type</Subtitle>
          </Button>
          <Button disableElevation variant='contained' sx={classes.addButton} startIcon={<AddIcon />}>
            <Subtitle sx={{ whiteSpace: 'nowrap' }}>Add Event</Subtitle>
          </Button>
          <DropDown
            dropDownItems={[]}
            placeholder={'Select Filter'}
            defaultValue={null}
            size='small'
            sx={{ width: '200px' }}
            setParentValue={() => {}}
          />
          <Box marginLeft={4} sx={classes.search}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search Event')}
              size='small'
              fullWidth
              value={searchField}
              placeholder='Search Event'
              onChange={(e) => {}}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim venian, quis nostrud exercitation ullamco
            </Subtitle>
            <Box sx={classes.arrowButtonGroup}>
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
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            <CalendarComponent />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default CalendarTable
