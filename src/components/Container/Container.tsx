import React, { ReactNode } from 'react'
import { Container as MuiContainer } from '@mui/material'

type ContainerProps = {
  children: ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children }) => <MuiContainer>{children}</MuiContainer>
