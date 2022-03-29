import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Container } from './Container'

export default {
  title: 'Components/Container',
  component: Container,
} as ComponentMeta<typeof Container>

export const Default: ComponentStory<typeof Container> = () => <Container>This is a Container</Container>
