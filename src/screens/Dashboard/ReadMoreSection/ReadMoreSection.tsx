import React from 'react'
import { Box } from '@mui/system'
import { Button, Card, Grid } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { ReadMoreSectionProps } from './types'

const ReadMoreSection = ({ inProp, setSectionName }: ReadMoreSectionProps) => {
  return (
    <TransitionGroup>
      <CSSTransition in={inProp} timeout={1000} classNames='my-node'>
        <Box display='flex' flexDirection='row' textAlign='left' marginTop={2}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={11}>
              <Box display='flex' flexDirection='row' textAlign='left' marginTop={2}></Box>
            </Grid>
            <Grid item xs={11}>
              <Card>
                <Box
                  display='flex'
                  flexDirection='row'
                  textAlign='left'
                  marginTop={2}
                  justifyContent='space-between'
                  marginX={4}
                >
                  <Box display='flex' flexDirection='row' alignItems='center' alignContent='center'>
                    <Button onClick={() => setSectionName('root')}>
                      <ChevronLeftIcon sx={{ marginRight: 0.5, marginLeft: -2.5 }} />
                    </Button>
                    <Box sx={{ marginRight: 10 }}>
                      <Subtitle size='large' fontWeight='700'>
                        Read More
                      </Subtitle>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default ReadMoreSection
