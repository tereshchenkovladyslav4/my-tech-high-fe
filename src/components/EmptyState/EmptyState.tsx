import { Box, Container } from '@mui/material'
import React from 'react'
import { EmptyStateTemplateType } from './types'
import { Title } from '../Typography/Title/Title'
import { Subtitle } from '../Typography/Subtitle/Subtitle'

export const EmptyState: EmptyStateTemplateType = ({ title, subtitle, image }) => (
  <Container>
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '50vh',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <img src={image} />
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Box>
  </Container>
)
