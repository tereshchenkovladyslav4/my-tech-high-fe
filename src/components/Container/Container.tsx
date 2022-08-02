import React, { FunctionComponent, ReactNode } from 'react'
import { Container as MuiContainer } from '@mui/material'

export const Container: FunctionComponent = ({ children }: { children: ReactNode }) => (
  <MuiContainer>{children}</MuiContainer>
)
