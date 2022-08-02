import React, { FunctionComponent } from 'react'
import { Container, CircularProgress, Box } from '@mui/material'

export const LoadingScreen: FunctionComponent = () => (
  <Container sx={{ height: '100vh' }}>
    <Box display='flex' flexDirection='row' justifyContent='center' flex={1} height='100%' alignItems='center'>
      <CircularProgress />
    </Box>
  </Container>
)
