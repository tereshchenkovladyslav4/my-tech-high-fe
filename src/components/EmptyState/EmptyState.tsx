import React from 'react'
import { Box, Container } from '@mui/material'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { Title } from '../Typography/Title/Title'
import { EmptyStateProps } from './types'

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle, image }) => (
  <Container>
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '40vh',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {image && <img alt='Empty State Image' src={image} />}
      {typeof title === 'string' ? <Title>{title}</Title> : title}
      {typeof subtitle === 'string' ? <Subtitle>{subtitle}</Subtitle> : subtitle}
    </Box>
  </Container>
)
