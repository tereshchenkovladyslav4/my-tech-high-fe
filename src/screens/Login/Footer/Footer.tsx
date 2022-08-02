import React, { FunctionComponent } from 'react'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import YoutubeIcon from '@mui/icons-material/YouTube'
import { Divider, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'

export const Footer: FunctionComponent = () => (
  <Box paddingY={8} marginX={10}>
    <Grid container>
      <Grid item container textAlign='left' rowSpacing={1} columnSpacing={10} xs={2}>
        <Grid item xs={6}>
          <Paragraph>Why us</Paragraph>
        </Grid>
        <Grid item xs={6}>
          <Paragraph>How it works</Paragraph>
        </Grid>
        <Grid item xs={6}>
          <Paragraph>The MTH Difference</Paragraph>
        </Grid>
        <Grid item xs={6}>
          <Paragraph>Program Overview</Paragraph>
        </Grid>
        <Grid item xs={6}>
          <Paragraph>Our Story</Paragraph>
        </Grid>
        <Grid item xs={6}>
          <Paragraph>Course Catalog</Paragraph>
        </Grid>
        <Grid item xs={6}>
          <Paragraph>FAQs</Paragraph>
        </Grid>
        <Grid item xs={6}>
          <Paragraph>Student Clubs</Paragraph>
        </Grid>
        <Grid item xs={6}>
          <Paragraph>Live Parent Support</Paragraph>
        </Grid>
      </Grid>
    </Grid>
    <Divider sx={{ marginY: 4 }} />
    <Box display='flex' flexDirection='row' justifyContent='space-between'>
      <Box>
        <Paragraph>Have Questions? Contact Us</Paragraph>
      </Box>
      <Box display='flex' flexDirection='row'>
        <Box marginRight={2}>
          <Paragraph>Disclaimer</Paragraph>
        </Box>
        <Box marginRight={2}>
          <Paragraph>Privacy &amp; COPPA Policy</Paragraph>
        </Box>
        <Box marginRight={2}>
          <Paragraph>Other States</Paragraph>
        </Box>
        <Box marginRight={2}>
          <Paragraph>Colorado My Tech High</Paragraph>
        </Box>
        <Box>
          <Paragraph>Location</Paragraph>
        </Box>
      </Box>
      <Box display='flex' flexDirection='row' alignItems='center'>
        <TwitterIcon sx={{ marginRight: 2 }} />
        <FacebookIcon sx={{ marginRight: 2 }} />
        <InstagramIcon sx={{ marginRight: 2 }} />
        <LinkedInIcon sx={{ marginRight: 2 }} />
        <YoutubeIcon sx={{ marginRight: 2 }} />
        <Box alignItems='center'>
          <Paragraph size='medium'>© 2021 My Tech High, Inc.</Paragraph>
        </Box>
      </Box>
    </Box>
  </Box>
)
