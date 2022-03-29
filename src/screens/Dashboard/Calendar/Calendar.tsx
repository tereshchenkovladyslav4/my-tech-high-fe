import { Box, Button, Card, Divider, Grid, Stack } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { CalendarComponent } from './components/CalendarComponent'
import { Metadata } from '../../../components/Metadata/Metadata'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { MTHGREEN, SYSTEM_01, SYSTEM_05, SYSTEM_02 } from '../../../utils/constants'

export const Calendar: FunctionComponent = () => {
  const classes = useStyles
  return (
    <Card style={{ borderRadius: 12 }}>
      <Box flexDirection='column' textAlign='left' paddingY={3} paddingX={3} display='flex'>
        <Grid container justifyContent="space-between" >
          <Grid item xs={4}>
            <Subtitle size='large' fontWeight='bold'>
              Calendar
            </Subtitle>
            <Button sx={{ mt: 1.5, background: "#2b9db72b", width: 72 }}>
              <Subtitle color={MTHGREEN} size={12} fontWeight="500">
                Event
              </Subtitle>
            </Button>
            <Subtitle size="medium" fontWeight="500" sx={{ my: 1.5 }} color={SYSTEM_02}>
              Highlighting our new MTH Game Maker course!
            </Subtitle>
            <Subtitle size={12} fontWeight="bold" color={SYSTEM_01} sx={{ display: "inline-block" }}>
              September 12, 2:11 PM
            </Subtitle>
            <Subtitle size={12} fontWeight="500" color={SYSTEM_05} sx={{ mt: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            </Subtitle>
          </Grid>
          <Grid item xs={2}>
            <Divider orientation='vertical' style={classes.divider} />
          </Grid>
          <Grid item xs={6}>
            <CalendarComponent />
          </Grid>
        </Grid>

      </Box>
    </Card>
  )
}
