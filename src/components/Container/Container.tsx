import { Container as MuiContainer } from '@mui/material'
import React, { FunctionComponent, ReactNode } from 'react'

export const Container: FunctionComponent = ({ children }: { children: ReactNode }) => (
  <MuiContainer>{children}</MuiContainer>
)
